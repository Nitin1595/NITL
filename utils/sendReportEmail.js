const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

require('dotenv').config({
    path: path.resolve(process.cwd(), '.env'),
    quiet: true
});

function getRequiredEnvironmentValue(variableName) {
    const value = process.env[variableName];

    if (!value || value.trim().length === 0) {
        throw new Error(
            `Missing required variable in .env: ${variableName}`
        );
    }

    return value.trim();
}

function getOptionalEmailAddresses(variableName) {
    const value = process.env[variableName];

    if (!value || value.trim().length === 0) {
        return undefined;
    }

    const addresses = value
        .split(',')
        .map(address => address.trim())
        .filter(Boolean);

    return addresses.length > 0
        ? addresses
        : undefined;
}

function getLatestExcelReport() {
    const reportDirectory = path.resolve(
        process.cwd(),
        'excel-report'
    );

    if (!fs.existsSync(reportDirectory)) {
        throw new Error(
            `Excel report folder was not found: ${reportDirectory}`
        );
    }

    const excelReports = fs
        .readdirSync(reportDirectory)
        .filter(fileName =>
            fileName.toLowerCase().endsWith('.xlsx')
        )
        .map(fileName => {
            const completePath = path.join(
                reportDirectory,
                fileName
            );

            return {
                fileName,
                completePath,
                modifiedTime:
                    fs.statSync(completePath).mtimeMs
            };
        })
        .sort(
            (firstReport, secondReport) =>
                secondReport.modifiedTime -
                firstReport.modifiedTime
        );

    if (excelReports.length === 0) {
        throw new Error(
            'No Excel report was found in the excel-report folder.'
        );
    }

    return excelReports[0];
}

function createEmailTransporter(
    emailFrom,
    outlookPassword
) {
    return nodemailer.createTransport({
        host: 'smtp.office365.com',

        port: 587,

        secure: false,

        requireTLS: true,

        auth: {
            user: emailFrom,

            /*
             * Important:
             * Nodemailer requires the property name "pass".
             * Do not change this to "password".
             */
            pass: outlookPassword
        },

        tls: {
            minVersion: 'TLSv1.2'
        },

        connectionTimeout: 30000,

        greetingTimeout: 30000,

        socketTimeout: 60000
    });
}

async function sendReportEmail() {
    const emailFrom =
        getRequiredEnvironmentValue(
            'EMAIL_FROM'
        );

    const outlookPassword =
        getRequiredEnvironmentValue(
            'OUTLOOK_PASSWORD'
        );

    const emailToValue =
        getRequiredEnvironmentValue(
            'EMAIL_TO'
        );

    const emailTo = emailToValue
        .split(',')
        .map(address => address.trim())
        .filter(Boolean);

    const emailCc =
        getOptionalEmailAddresses(
            'EMAIL_CC'
        );

    const emailBcc =
        getOptionalEmailAddresses(
            'EMAIL_BCC'
        );

    const latestReport =
        getLatestExcelReport();

    const transporter =
        createEmailTransporter(
            emailFrom,
            outlookPassword
        );

    console.log(
        'Email settings loaded successfully.'
    );

    console.log(
        `Sender configured: ${Boolean(emailFrom)}`
    );

    console.log(
        `Password configured: ${Boolean(outlookPassword)}`
    );

    console.log(
        `Recipient count: ${emailTo.length}`
    );

    console.log(
        `Password length: ${outlookPassword.length}`
    );

    console.log(
        'Checking Microsoft 365 SMTP connection...'
    );

    await transporter.verify();

    console.log(
        'Microsoft 365 SMTP connection successful.'
    );

    const emailSubject =
        process.env.EMAIL_SUBJECT ||
        'Playwright Automation Report - Project NITLN';

    const emailMessage =
        process.env.EMAIL_MESSAGE ||
        'Please find the attached automation execution report.';

    const executionDate =
        new Date().toLocaleString(
            'en-IN',
            {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'medium',
                timeStyle: 'medium'
            }
        );

    const mailOptions = {
        from: emailFrom,

        to: emailTo,

        subject: emailSubject,

        text: [
            emailMessage,
            '',
            `Execution Date: ${executionDate}`,
            '',
            'Regards,',
            'Playwright Automation'
        ].join('\n'),

        html: [
            `<p>${emailMessage}</p>`,
            '<p>',
            '<strong>Execution Date:</strong> ',
            executionDate,
            '</p>',
            '<p>',
            'Regards,<br>',
            'Playwright Automation',
            '</p>'
        ].join(''),

        attachments: [
            {
                filename:
                    'NITLN_Automation_TestReport.xlsx',

                path:
                    latestReport.completePath,

                contentType:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        ]
    };

    if (emailCc) {
        mailOptions.cc = emailCc;
    }

    if (emailBcc) {
        mailOptions.bcc = emailBcc;
    }

    const emailResult =
        await transporter.sendMail(
            mailOptions
        );

    console.log('');
    console.log(
        'Automation report email sent successfully.'
    );

    console.log(
        `Message ID: ${emailResult.messageId}`
    );

    console.log(
        `Attachment: ${latestReport.fileName}`
    );

    console.log(
        `Recipients: ${emailTo.join(', ')}`
    );

    if (emailCc) {
        console.log(
            `CC: ${emailCc.join(', ')}`
        );
    }

    if (emailBcc) {
        console.log(
            `BCC: ${emailBcc.join(', ')}`
        );
    }
}

module.exports = {
    sendReportEmail
};

if (require.main === module) {
    sendReportEmail().catch(error => {
        console.error('');
        console.error(
            'Failed to send the automation report email.'
        );

        console.error(
            `Error code: ${error.code || 'Not available'}`
        );

        console.error(
            `Response code: ${error.responseCode || 'Not available'}`
        );

        console.error(
            `Reason: ${error.message}`
        );

        if (
            error.code === 'EAUTH' ||
            error.responseCode === 535
        ) {
            console.error('');
            console.error(
                'Microsoft 365 received the credentials but rejected the SMTP login.'
            );

            console.error(
                'Confirm that SMTP AUTH is enabled for the sender mailbox.'
            );
        }

        process.exitCode = 1;
    });
}