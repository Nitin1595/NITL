const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

require('dotenv').config({
    quiet: true
});

class ExcelReporter {
    constructor() {
        this.results = [];
        this.executionStartTime = Date.now();

        this.websiteName =
            process.env.WEBSITE_NAME?.trim() ||
            'NITR';

        this.executedBy =
            process.env.EXECUTED_BY?.trim() ||
            'NITIN';

        this.browserName =
            process.env.REPORT_BROWSER_NAME?.trim() ||
            'Chrome';
    }

    onTestEnd(test, result) {
        const businessSteps =
            this.collectBusinessSteps(
                result.steps || []
            );

        const defaultModule =
            this.getModuleName(test);

        /*
         * If there are no business steps,
         * create one result for the complete test.
         */
        if (businessSteps.length === 0) {
            const status =
                this.mapStatus(result.status);

            this.results.push({
                fileName: this.getTestFileName(test),
                module: defaultModule,
                validation: test.title,
                status: status,
                remarks:
                    status === 'Pass'
                        ? 'Validation successful'
                        : status === 'Skipped'
                            ? 'Validation skipped'
                            : this.cleanErrorMessage(
                                result.error?.message
                            )
            });

            return;
        }

        /*
         * Create one result for every business step.
         */
        for (const step of businessSteps) {
            const status =
                step.error
                    ? 'Fail'
                    : result.status === 'skipped'
                        ? 'Skipped'
                        : 'Pass';

            this.results.push({
                fileName: this.getTestFileName(test),
                module:
                    this.getStepModuleName(
                        defaultModule,
                        step.title
                    ),

                validation:
                    step.title,

                status: status,

                remarks:
                    step.error
                        ? this.cleanErrorMessage(
                            step.error.message
                        )
                        : status === 'Skipped'
                            ? 'Validation skipped'
                            : this.getSuccessRemark(
                                step.title
                            )
            });
        }
    }

    collectBusinessSteps(steps) {
        const collectedSteps = [];

        for (const step of steps) {
            if (
                step.category ===
                'test.step'
            ) {
                collectedSteps.push(step);
            }

            if (
                Array.isArray(step.steps) &&
                step.steps.length > 0
            ) {
                collectedSteps.push(
                    ...this.collectBusinessSteps(
                        step.steps
                    )
                );
            }
        }

        return collectedSteps;
    }

    mapStatus(status) {
        if (status === 'passed') {
            return 'Pass';
        }

        if (status === 'skipped') {
            return 'Skipped';
        }

        return 'Fail';
    }

    getTestFileName(test) {
        return path
            .basename(
                test.location?.file || ''
            )
            .toLowerCase();
    }

    getCompleteTestTitle(test) {
        if (
            typeof test.titlePath ===
            'function'
        ) {
            return test
                .titlePath()
                .join(' ')
                .toLowerCase();
        }

        return String(
            test.title || ''
        ).toLowerCase();
    }

    getModuleName(test) {
        const fileName =
            this.getTestFileName(test);

        const completeTitle =
            this.getCompleteTestTitle(test);

        /*
         * B2B Forgot Password
         */
        if (
            fileName.includes(
                'b2bforgotpassword'
            ) ||
            completeTitle.includes(
                'forgot password'
            ) ||
            completeTitle.includes(
                'reset password'
            )
        ) {
            return 'B2B Forgot Password';
        }

        /*
         * Claim Management
         */
        if (
            fileName.includes(
                'b2bclaimmanagement'
            ) ||
            completeTitle.includes(
                'claim management'
            )
        ) {
            return 'Claim Management';
        }

        /*
         * General Sales & Delivery Terms
         */
        if (
            fileName.includes(
                'b2bgeneralsalesterms'
            ) ||
            completeTitle.includes(
                'general sales'
            ) ||
            completeTitle.includes(
                'delivery terms'
            )
        ) {
            return 'General Sales & Delivery Terms';
        }

        /*
         * B2B Catalog
         */
        if (
            fileName.includes(
                'b2bcatalog'
            ) ||
            completeTitle.includes(
                'b2b catalog'
            ) ||
            completeTitle.includes(
                'product catalog'
            )
        ) {
            return 'B2B Catalog';
        }

        /*
         * B2B Login & Dashboard
         */
        if (
            fileName.includes(
                'b2blogin'
            ) ||
            completeTitle.includes(
                'b2b authentication'
            ) ||
            completeTitle.includes(
                'login dashboard logout'
            )
        ) {
            return 'B2B Login & Dashboard';
        }

        /*
         * Contact Us
         */
        if (
            fileName.includes(
                'contactus'
            ) ||
            completeTitle.includes(
                'contact us page'
            )
        ) {
            return 'Contact Us';
        }

        /*
         * Products Page
         */
        if (
            fileName.includes(
                'productspage'
            ) ||
            completeTitle.includes(
                'products page'
            )
        ) {
            return 'Products Page';
        }

        /*
         * Who We Are
         */
        if (
            fileName.includes(
                'whoweare'
            ) ||
            completeTitle.includes(
                'who we are'
            )
        ) {
            return 'Who We Are';
        }

        /*
         * About Us
         */
        if (
            fileName.includes(
                'aboutus'
            ) ||
            completeTitle.includes(
                'about us'
            )
        ) {
            return 'About Us';
        }

        /*
         * Food as the #1 Category
         */
        if (
            fileName.includes(
                'food'
            ) ||
            completeTitle.includes(
                'food as the'
            ) ||
            completeTitle.includes(
                'food category'
            )
        ) {
            return 'Food as the #1 Category';
        }

        /*
         * Location
         */
        if (
            fileName.includes(
                'location'
            ) ||
            completeTitle.includes(
                'location page'
            )
        ) {
            return 'Location';
        }

        /*
         * Home Page
         */
        if (
            fileName.includes(
                'homepage'
            ) ||
            completeTitle.includes(
                'home page'
            )
        ) {
            return 'Home Page';
        }

        return 'General';
    }

    getStepModuleName(
        defaultModule,
        stepTitle
    ) {
        const stepText =
            String(stepTitle || '')
                .toLowerCase();

        /*
         * B2B Login / Dashboard
         */
        if (
            defaultModule ===
            'B2B Login & Dashboard'
        ) {
            if (
                stepText.includes(
                    'dashboard'
                ) ||
                stepText.includes(
                    'latest updates'
                ) ||
                stepText.includes(
                    'product update'
                ) ||
                stepText.includes(
                    'authenticated header'
                ) ||
                stepText.includes(
                    'authenticated footer'
                ) ||
                stepText.includes(
                    'information message'
                ) ||
                stepText.includes(
                    'log out'
                ) ||
                stepText.includes(
                    'logout'
                ) ||
                stepText.includes(
                    'session is closed'
                )
            ) {
                return 'B2B Dashboard';
            }

            return 'B2B Login';
        }

        /*
         * Authentication setup remains
         * under the current module.
         */
        if (
            stepText.includes(
                'open home page for b2b authentication'
            ) ||
            stepText.includes(
                'open home page as b2b modal background'
            ) ||
            stepText.includes(
                'open home page for forgot password'
            ) ||
            stepText.includes(
                'open b2b login modal'
            ) ||
            stepText.includes(
                'enter b2b credentials'
            ) ||
            stepText.includes(
                'submit b2b login form'
            )
        ) {
            return defaultModule;
        }

        /*
         * Forgot Password
         */
        if (
            stepText.includes(
                'reset password'
            ) ||
            stepText.includes(
                'forgot your password'
            ) ||
            stepText.includes(
                'forgot password'
            )
        ) {
            return 'B2B Forgot Password';
        }

        /*
         * Claim Management
         */
        if (
            stepText.includes(
                'claim management'
            ) ||
            stepText.includes(
                'file a claim'
            ) ||
            stepText.includes(
                'proof of delivery'
            ) ||
            stepText.includes(
                'synthetic product photos'
            ) ||
            stepText.includes(
                'claim remains unsubmitted'
            ) ||
            stepText.includes(
                'submit claim'
            )
        ) {
            return 'Claim Management';
        }

        /*
         * General Sales & Delivery Terms
         */
        if (
            stepText.includes(
                'general sales'
            ) ||
            stepText.includes(
                'delivery terms'
            ) ||
            stepText.includes(
                'storage and transportation'
            ) ||
            stepText.includes(
                'pdf document'
            ) ||
            stepText.includes(
                'document links'
            )
        ) {
            return 'General Sales & Delivery Terms';
        }

        /*
         * B2B Catalog
         */
        if (
            defaultModule ===
                'B2B Catalog' ||
            stepText.includes(
                'catalog'
            ) ||
            stepText.includes(
                'select all'
            ) ||
            stepText.includes(
                'deselect all'
            )
        ) {
            return 'B2B Catalog';
        }

        /*
         * Contact Us
         */
        if (
            stepText.includes(
                'contact us'
            ) ||
            stepText.includes(
                'contact form'
            ) ||
            stepText.includes(
                'send message'
            ) ||
            stepText.includes(
                'country dropdown'
            ) ||
            stepText.includes(
                'international phone'
            )
        ) {
            return 'Contact Us';
        }

        /*
         * CAPTCHA remains under
         * the current module.
         */
        if (
            stepText.includes(
                'captcha'
            )
        ) {
            return defaultModule;
        }

        /*
         * About Us
         */
        if (
            stepText.includes(
                'about us'
            ) ||
            stepText.includes(
                'travel retail experience'
            ) ||
            stepText.includes(
                'expand your horizons'
            ) ||
            stepText.includes(
                'more from nestle'
            ) ||
            stepText.includes(
                'more from nestlé'
            ) ||
            stepText.includes(
                'onwards to no.1'
            ) ||
            stepText.includes(
                'award logo'
            )
        ) {
            return 'About Us';
        }

        /*
         * Food as the #1 Category
         */
        if (
            stepText.includes(
                'food as the'
            ) ||
            stepText.includes(
                'food category'
            ) ||
            stepText.includes(
                'beyond confectionery'
            ) ||
            stepText.includes(
                'powerful companion'
            ) ||
            stepText.includes(
                'new shores'
            )
        ) {
            return 'Food as the #1 Category';
        }

        /*
         * Location
         */
        if (
            stepText.includes(
                'location'
            ) ||
            stepText.includes(
                'company information'
            ) ||
            stepText.includes(
                'company address'
            )
        ) {
            return 'Location';
        }

        /*
         * Keep Products Page
         * under Products Page.
         */
        if (
            defaultModule ===
            'Products Page'
        ) {
            return 'Products Page';
        }

        /*
         * Keep Home Page
         * under Home Page.
         */
        if (
            defaultModule ===
            'Home Page'
        ) {
            return 'Home Page';
        }

        return defaultModule;
    }

    getSuccessRemark(stepTitle) {
        const normalizedTitle =
            String(stepTitle || '')
                .toLowerCase();

        /*
         * CAPTCHA
         */
        if (
            normalizedTitle.includes(
                'captcha'
            )
        ) {
            return 'CAPTCHA section is displayed';
        }

        /*
         * Navigation
         */
        if (
            normalizedTitle.includes(
                'navigate'
            ) ||
            normalizedTitle.startsWith(
                'open '
            ) ||
            normalizedTitle.includes(
                'return to'
            )
        ) {
            return 'Navigation successful';
        }

        /*
         * Text validation
         */
        if (
            normalizedTitle.includes(
                'heading'
            ) ||
            normalizedTitle.includes(
                'title'
            ) ||
            normalizedTitle.includes(
                'breadcrumb'
            ) ||
            normalizedTitle.includes(
                'instruction'
            )
        ) {
            return 'Text verified and element is visible';
        }

        /*
         * Images / Logos
         */
        if (
            normalizedTitle.includes(
                'image'
            ) ||
            normalizedTitle.includes(
                'logo'
            )
        ) {
            return 'Image is visible';
        }

        /*
         * Search
         */
        if (
            normalizedTitle.includes(
                'search'
            )
        ) {
            return 'Search functionality verified';
        }

        /*
         * Filter
         */
        if (
            normalizedTitle.includes(
                'filter'
            )
        ) {
            return 'Filter functionality verified';
        }

        /*
         * Forms / Fields
         */
        if (
            normalizedTitle.includes(
                'form'
            ) ||
            normalizedTitle.includes(
                'field'
            )
        ) {
            return 'Form field validation successful';
        }

        /*
         * Buttons / Links / Menus / Tabs / Icons
         */
        if (
            normalizedTitle.includes(
                'button'
            ) ||
            normalizedTitle.includes(
                'link'
            ) ||
            normalizedTitle.includes(
                'menu'
            ) ||
            normalizedTitle.includes(
                'tab'
            ) ||
            normalizedTitle.includes(
                'icon'
            )
        ) {
            return 'Element visible and enabled';
        }

        return 'Validation successful';
    }

    cleanErrorMessage(errorMessage) {
        if (!errorMessage) {
            return 'Validation failed';
        }

        return String(errorMessage)
            .replace(
                /\u001b\[[0-9;]*m/g,
                ''
            )
            .replace(
                /\s+/g,
                ' '
            )
            .trim()
            .substring(0, 1000);
    }

    groupResultsByModule() {
        const groups = [];
        const groupMap = new Map();

        /*
         * Skipped results are excluded
         * from the Excel report.
         */
        const reportableResults =
            this.results.filter(
                result =>
                    result.status !==
                    'Skipped'
            );

        for (
            const result
            of reportableResults
        ) {
            if (
                !groupMap.has(
                    result.module
                )
            ) {
                const newGroup = {
                    module:
                        result.module,
                    results: []
                };

                groupMap.set(
                    result.module,
                    newGroup
                );

                groups.push(newGroup);
            }

            groupMap
                .get(result.module)
                .results
                .push(result);
        }

        return groups;
    }

    async onEnd() {
        const workbook =
            new ExcelJS.Workbook();

        workbook.creator =
            `${this.websiteName} Playwright Automation`;

        workbook.created =
            new Date();

        workbook.modified =
            new Date();

        const worksheet =
            workbook.addWorksheet(
                'Automation Test Report',
                {
                    views: [
                        {
                            state: 'normal',
                            showGridLines: true,
                            zoomScale: 100
                        }
                    ]
                }
            );

        /*
         * Report columns.
         */
        worksheet.columns = [
            {
                key: 'serialNumber',
                width: 10
            },
            {
                key: 'module',
                width: 34
            },
            {
                key: 'validation',
                width: 52
            },
            {
                key: 'status',
                width: 18
            },
            {
                key: 'remarks',
                width: 70
            }
        ];

        /*
         * Exclude skipped results from
         * Summary and Detailed Results.
         */
        const reportableResults =
            this.results.filter(
                result =>
                    result.status !==
                    'Skipped'
            );

        const totalComponents =
            reportableResults.length;

        const passedComponents =
            reportableResults.filter(
                result =>
                    result.status ===
                    'Pass'
            ).length;

        const failedComponents =
            reportableResults.filter(
                result =>
                    result.status ===
                    'Fail'
            ).length;

        const executionTimeSeconds =
            (
                (
                    Date.now() -
                    this.executionStartTime
                ) / 1000
            ).toFixed(2);

        /*
         * Build report.
         */
        this.createTitle(
            worksheet
        );

        this.createExecutionDetails(
            worksheet,
            executionTimeSeconds
        );

        this.createSummary(
            worksheet,
            totalComponents,
            passedComponents,
            failedComponents
        );

        // Create detailed results as separate sheets per page/module
        this.createDetailedSheets(workbook);

        this.applyFinalFormatting(
            worksheet
        );

        if (
            String(process.env.REPORT_HIDE_EXTRA_COLUMNS || '') ===
            'true'
        ) {
            this.hideUnusedColumns(
                worksheet
            );
        }

        this.configurePrintSettings(
            worksheet
        );

        /*
         * Create report directory.
         */
        const reportDirectory =
            path.join(
                process.cwd(),
                'excel-report'
            );

        fs.mkdirSync(
            reportDirectory,
            {
                recursive: true
            }
        );

        /*
         * Create safe file name.
         */
        const safeWebsiteName =
            this.websiteName
                .replace(
                    /[<>:"/\\|?*]/g,
                    '_'
                )
                .replace(
                    /\s+/g,
                    '_'
                )
                .replace(
                    /_+/g,
                    '_'
                );

        const reportFileName =
            `${safeWebsiteName}_Automation_Test_Report.xlsx`;

        let reportPath =
            path.join(
                reportDirectory,
                reportFileName
            );

        const temporaryReportPath =
            path.join(
                reportDirectory,
                `${safeWebsiteName}_Automation_Test_Report_Temporary.xlsx`
            );

        /*
         * Remove previous temporary file.
         */
        if (
            fs.existsSync(
                temporaryReportPath
            )
        ) {
            fs.unlinkSync(
                temporaryReportPath
            );
        }

        /*
         * Generate workbook in memory.
         */
        const workbookBuffer =
            await workbook.xlsx
                .writeBuffer();

        if (
            !workbookBuffer ||
            workbookBuffer.length === 0
        ) {
            throw new Error(
                'ExcelJS returned an empty workbook buffer.'
            );
        }

        /*
         * Write temporary workbook.
         */
        fs.writeFileSync(
            temporaryReportPath,
            Buffer.from(
                workbookBuffer
            )
        );

        /*
         * Validate temporary workbook.
         */
        this.validateGeneratedWorkbook(
            temporaryReportPath
        );

        /*
         * Remove old final report.
         */
        if (fs.existsSync(reportPath)) {
            try {
                fs.unlinkSync(reportPath);
            } catch (error) {
                // File is likely open/locked. Fall back to timestamped filename
                const timestamp = new Date()
                    .toISOString()
                    .replace(/[:.]/g, '-');

                const altReportPath = path.join(
                    reportDirectory,
                    `${safeWebsiteName}_Automation_Test_Report_${timestamp}.xlsx`
                );

                console.warn(
                    `Could not overwrite existing report (locked). Saving as ${altReportPath}`
                );

                reportPath = altReportPath;
            }
        }

        /*
         * Move temporary report to
         * final report.
         */
        fs.renameSync(
            temporaryReportPath,
            reportPath
        );

        /*
         * Final validation.
         */
        this.validateGeneratedWorkbook(
            reportPath
        );

        console.log('');

        console.log(
            'Detailed Excel report generated successfully:'
        );

        console.log(
            reportPath
        );
    }

    createTitle(worksheet) {
        worksheet.mergeCells(
            'A1:E1'
        );

        const titleCell =
            worksheet.getCell('A1');

        titleCell.value =
            `${this.websiteName} - Automation Test Report`;

        titleCell.font = {
            bold: true,
            size: 17,
            color: {
                argb: 'FF000000'
            }
        };

        titleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FFD9E7F5'
            }
        };

        titleCell.alignment = {
            horizontal: 'center',
            vertical: 'middle'
        };

        titleCell.border =
            this.getThinBorder();

        worksheet.getRow(1).height =
            30;
    }

    createExecutionDetails(
        worksheet,
        executionTimeSeconds
    ) {
        worksheet.mergeCells(
            'A3:E3'
        );

        const heading =
            worksheet.getCell('A3');

        heading.value =
            'Execution Details';

        heading.font = {
            bold: true,
            size: 12,
            color: {
                argb: 'FFFFFFFF'
            }
        };

        heading.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FF0B4A86'
            }
        };

        heading.alignment = {
            horizontal: 'center',
            vertical: 'middle'
        };

        heading.border =
            this.getThinBorder();

        const executionDate =
            new Date()
                .toLocaleString(
                    'en-IN',
                    {
                        timeZone:
                            'Asia/Kolkata'
                    }
                );

        const executionDetails = [
            [
                'Website',
                process.env.BASE_URL ||
                    'Not configured'
            ],
            [
                'Execution Date',
                executionDate
            ],
            [
                'Browser',
                this.browserName
            ],
            [
                'Execution Time',
                `${executionTimeSeconds} sec`
            ],
            [
                'Executed By',
                this.executedBy
            ]
        ];

        executionDetails.forEach(
            (detail, index) => {
                const rowNumber =
                    index + 4;

                const labelCell =
                    worksheet.getCell(
                        `A${rowNumber}`
                    );

                labelCell.value =
                    detail[0];

                labelCell.font = {
                    bold: true
                };

                labelCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: 'FFD9E7F5'
                    }
                };

                labelCell.alignment = {
                    horizontal: 'left',
                    vertical: 'middle'
                };

                worksheet.mergeCells(
                    `B${rowNumber}:E${rowNumber}`
                );

                const valueCell =
                    worksheet.getCell(
                        `B${rowNumber}`
                    );

                valueCell.value =
                    detail[1];

                valueCell.alignment = {
                    horizontal: 'left',
                    vertical: 'middle'
                };

                for (
                    let columnNumber = 1;
                    columnNumber <= 5;
                    columnNumber += 1
                ) {
                    worksheet
                        .getRow(rowNumber)
                        .getCell(columnNumber)
                        .border =
                        this.getThinBorder();
                }
            }
        );
    }

    createSummary(
        worksheet,
        totalComponents,
        passedComponents,
        failedComponents
    ) {
        /*
         * Summary title.
         */
        worksheet.mergeCells(
            'A10:C10'
        );

        const heading =
            worksheet.getCell('A10');

        heading.value =
            'Summary';

        heading.font = {
            bold: true,
            size: 12,
            color: {
                argb: 'FFFFFFFF'
            }
        };

        heading.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FF0B4A86'
            }
        };

        heading.alignment = {
            horizontal: 'center',
            vertical: 'middle'
        };

        heading.border =
            this.getThinBorder();

        /*
         * Header row.
         *
         * IMPORTANT:
         * All headers are light blue.
         * Passed/Failed headers are NOT green/red.
         */
        const summaryHeaderRow =
            worksheet.getRow(12);

        summaryHeaderRow.getCell(1).value =
            'Total Components';

        summaryHeaderRow.getCell(2).value =
            'Passed';

        summaryHeaderRow.getCell(3).value =
            'Failed';

        for (
            let columnNumber = 1;
            columnNumber <= 3;
            columnNumber += 1
        ) {
            const cell =
                summaryHeaderRow.getCell(
                    columnNumber
                );

            cell.font = {
                bold: true,
                color: {
                    argb: 'FF000000'
                }
            };

            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'FFD9E7F5'
                }
            };

            cell.alignment = {
                horizontal: 'center',
                vertical: 'middle'
            };

            cell.border =
                this.getThinBorder();
        }

        /*
         * Value row.
         */

        const summaryValueRow =
            worksheet.getRow(13);

        summaryValueRow.getCell(1).value =
            totalComponents;

        summaryValueRow.getCell(2).value =
            passedComponents;

        summaryValueRow.getCell(3).value =
            failedComponents;

        // Keep columns D and E empty (do not apply header fill to D/E).
        this.clearCellFormatting(summaryHeaderRow.getCell(4));
        this.clearCellFormatting(summaryValueRow.getCell(4));
        this.clearCellFormatting(summaryHeaderRow.getCell(5));
        this.clearCellFormatting(summaryValueRow.getCell(5));

        /*
         * Total Components:
         * white background + black number.
         */
        this.formatSummaryValueCell(
            summaryValueRow.getCell(1),
            'FF000000',
            'FFFFFFFF'
        );

        /*
         * Passed:
         * light green background + green number.
         */
        this.formatSummaryValueCell(
            summaryValueRow.getCell(2),
            'FF008000',
            'FFE2F0D9'
        );

        /*
         * Failed:
         * light red background + red number.
         */
        this.formatSummaryValueCell(
            summaryValueRow.getCell(3),
            'FFFF0000',
            'FFF4CCCC'
        );

        /*
         * Make the Summary rows the same
         * height as the screenshot style.
         */
        summaryHeaderRow.height = 24;
        summaryValueRow.height = 24;

        /*
         * Keep columns D and E empty (do not apply header fill to D).
         */
        this.clearCellFormatting(
            summaryHeaderRow.getCell(4)
        );

        this.clearCellFormatting(
            summaryValueRow.getCell(4)
        );

        // Also ensure column E is clear
        this.clearCellFormatting(
            summaryHeaderRow.getCell(5)
        );

        this.clearCellFormatting(
            summaryValueRow.getCell(5)
        );
    }

    formatSummaryValueCell(
        cell,
        fontColor,
        backgroundColor
    ) {
        cell.font = {
            bold: true,
            color: {
                argb: fontColor
            }
        };

        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: backgroundColor
            }
        };

        cell.alignment = {
            horizontal: 'center',
            vertical: 'middle'
        };

        cell.border =
            this.getThinBorder();
    }

    createDetailedResults(
        worksheet
    ) {
        worksheet.mergeCells(
            'A16:E16'
        );

        const heading =
            worksheet.getCell('A16');

        heading.value =
            'Detailed Results';

        heading.font = {
            bold: true,
            size: 13,
            color: {
                argb: 'FFFFFFFF'
            }
        };

        heading.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FF0B4A86'
            }
        };

        heading.alignment = {
            horizontal: 'center',
            vertical: 'middle'
        };

        heading.border =
            this.getThinBorder();

        /*
         * Detailed result headers.
         */
        const headerRow =
            worksheet.getRow(18);

        headerRow.values = [
            'Sl.No',
            'Module',
            'Button / Validation',
            'Status',
            'Remarks'
        ];

        for (
            let columnNumber = 1;
            columnNumber <= 5;
            columnNumber += 1
        ) {
            const cell =
                headerRow.getCell(
                    columnNumber
                );

            cell.font = {
                bold: true,
                color: {
                    argb: 'FFFFFFFF'
                }
            };

            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'FF0B4A86'
                }
            };

            cell.alignment = {
                horizontal: 'center',
                vertical: 'middle'
            };

            cell.border =
                this.getThinBorder();
        }

        headerRow.height = 24;

        let currentRowNumber = 19;
        let serialNumber = 1;

        const groups =
            this.groupResultsByModule();

        for (const group of groups) {
            const groupStartRow =
                currentRowNumber;

            for (
                const result
                of group.results
            ) {
                const row =
                    worksheet.getRow(
                        currentRowNumber
                    );

                /*
                 * Validation.
                 */
                row.getCell(3).value =
                    result.validation;

                /*
                 * Status.
                 */
                row.getCell(4).value =
                    result.status;

                /*
                 * Remarks.
                 */
                row.getCell(5).value =
                    result.remarks;

                row.alignment = {
                    vertical: 'top',
                    wrapText: true
                };

                /*
                 * Borders.
                 */
                for (
                    let columnNumber = 1;
                    columnNumber <= 5;
                    columnNumber += 1
                ) {
                    row.getCell(
                        columnNumber
                    ).border =
                        this.getThinBorder();
                }

                /*
                 * Status formatting.
                 */
                this.formatStatusCell(
                    row.getCell(4),
                    result.status
                );

                /*
                 * Failed remarks background.
                 */
                if (
                    result.status ===
                    'Fail'
                ) {
                    row.getCell(5).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {
                            argb: 'FFFFE5E5'
                        }
                    };
                }

                currentRowNumber += 1;
            }

            const groupEndRow =
                currentRowNumber - 1;

            /*
             * Merge Sl.No and Module cells
             * for multiple results belonging
             * to the same module.
             */
            if (
                groupEndRow >
                groupStartRow
            ) {
                worksheet.mergeCells(
                    `A${groupStartRow}:A${groupEndRow}`
                );

                worksheet.mergeCells(
                    `B${groupStartRow}:B${groupEndRow}`
                );
            }

            const serialCell =
                worksheet.getCell(
                    `A${groupStartRow}`
                );

            serialCell.value =
                serialNumber;

            serialCell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true
            };

            serialCell.border =
                this.getThinBorder();

            const moduleCell =
                worksheet.getCell(
                    `B${groupStartRow}`
                );

            moduleCell.value =
                group.module;

            moduleCell.alignment = {
                horizontal: 'left',
                vertical: 'middle',
                wrapText: true
            };

            moduleCell.border =
                this.getThinBorder();

            serialNumber += 1;
        }
    }

    createDetailedSheets(workbook) {
        // Allow sheet grouping by module (default) or by file name when
        // REPORT_SHEET_NAME=file is set.
        const sheetMode = String(process.env.REPORT_SHEET_NAME || 'module').toLowerCase();

        let groups = [];

        if (sheetMode === 'file') {
            const map = new Map();
            for (const res of this.results.filter(r => r.status !== 'Skipped')) {
                const key = res.fileName || res.module || 'Sheet';
                if (!map.has(key)) {
                    map.set(key, { module: key, results: [] });
                }
                map.get(key).results.push(res);
            }
            groups = Array.from(map.values());
        } else {
            groups = this.groupResultsByModule();
        }

        for (const group of groups) {
            // Sanitize sheet name (max 31 chars, remove invalid chars)
            let sheetName = String(group.module || 'Sheet')
                .replace(/[\\\/*?:\[\]]/g, '_')
                .substring(0, 31);

            // Ensure unique sheet name
            let uniqueName = sheetName;
            let idx = 1;
            while (workbook.getWorksheet(uniqueName)) {
                uniqueName = `${sheetName.substring(0, 28)}_${idx}`;
                idx += 1;
            }

            const worksheet = workbook.addWorksheet(uniqueName, {
                views: [{ state: 'normal', showGridLines: true, zoomScale: 100 }]
            });

            // Set columns similar to main report
            worksheet.columns = [
                { key: 'serial', width: 8 },
                { key: 'module', width: 34 },
                { key: 'validation', width: 52 },
                { key: 'status', width: 18 },
                { key: 'remarks', width: 70 }
            ];

            // Title
            worksheet.mergeCells('A1:E1');
            const titleCell = worksheet.getCell('A1');
            titleCell.value = `${this.websiteName} - ${group.module}`;
            titleCell.font = { bold: true, size: 14 };
            titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

            // Header row
            const headerRow = worksheet.getRow(3);
            headerRow.values = ['Sl.No', 'Module', 'Button / Validation', 'Status', 'Remarks'];
            headerRow.height = 20;
            for (let col = 1; col <= 5; col += 1) {
                const cell = headerRow.getCell(col);
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0B4A86' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = this.getThinBorder();
            }

            // Data rows
            let rowNumber = 4;
            let serial = 1;
            for (const result of group.results) {
                const row = worksheet.getRow(rowNumber);
                row.getCell(1).value = serial;
                row.getCell(2).value = result.module;
                row.getCell(3).value = result.validation;
                row.getCell(4).value = result.status;
                row.getCell(5).value = result.remarks;

                // Apply borders and alignment
                for (let c = 1; c <= 5; c += 1) {
                    const cell = row.getCell(c);
                    cell.border = this.getThinBorder();
                    cell.alignment = { vertical: 'top', wrapText: true };
                }

                // Status formatting
                this.formatStatusCell(row.getCell(4), result.status);

                if (result.status === 'Fail') {
                    row.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE5E5' } };
                }

                rowNumber += 1;
                serial += 1;
            }

            // Final formatting per sheet
            this.applyFinalFormatting(worksheet);
            // Set print area for the sheet
            try {
                const lastRow = Math.max(worksheet.rowCount || 1, 1);
                worksheet.pageSetup = worksheet.pageSetup || {};
                worksheet.pageSetup.printArea = `A1:E${lastRow}`;
            } catch (e) {}
        }
    }

    formatStatusCell(
        cell,
        status
    ) {
        if (status === 'Pass') {
            cell.font = {
                bold: true,
                color: {
                    argb: 'FF008000'
                }
            };

            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'FFE2F0D9'
                }
            };
        } else {
            cell.font = {
                bold: true,
                color: {
                    argb: 'FFFF0000'
                }
            };

            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'FFF4CCCC'
                }
            };
        }

        cell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true
        };

        cell.border =
            this.getThinBorder();
    }

    applyFinalFormatting(
        worksheet
    ) {
        const lastRow =
            worksheet.rowCount;

        /*
         * Format detailed result area.
         */
        for (
            let rowNumber = 18;
            rowNumber <= lastRow;
            rowNumber += 1
        ) {
            const row =
                worksheet.getRow(
                    rowNumber
                );

            row.hidden = false;

            for (
                let columnNumber = 1;
                columnNumber <= 5;
                columnNumber += 1
            ) {
                const cell =
                    row.getCell(
                        columnNumber
                    );

                cell.border =
                    this.getThinBorder();

                cell.alignment = {
                    ...cell.alignment,
                    vertical:
                        cell.alignment?.vertical ||
                        'top',
                    wrapText: true
                };
            }
        }

        /*
         * Give detailed rows a reasonable height.
         */
        for (
            let rowNumber = 19;
            rowNumber <= lastRow;
            rowNumber += 1
        ) {
            worksheet.getRow(
                rowNumber
            ).height = 32;
        }

        /*
         * Detailed header.
         */
        worksheet.getRow(18).height =
            24;

        /*
         * Normal scrolling.
         * No frozen rows or columns.
         */
        worksheet.views = [
            {
                state: 'normal',
                showGridLines: true,
                zoomScale: 100
            }
        ];

        /*
         * No filter arrows.
         */
        worksheet.autoFilter = null;
    }

    hideUnusedColumns(
        worksheet
    ) {
        /*
         * Keep A:E visible.
         */
        for (
            let columnNumber = 1;
            columnNumber <= 5;
            columnNumber += 1
        ) {
            worksheet.getColumn(
                columnNumber
            ).hidden = false;
        }

        /*
         * Hide F onward.
         */
        const hideUntil = 300;

        for (
            let columnNumber = 6;
            columnNumber <= hideUntil;
            columnNumber += 1
        ) {
            try {
                worksheet.getColumn(
                    columnNumber
                ).hidden = true;
            } catch (error) {
                // Ignore unused column errors.
            }
        }
    }

    configurePrintSettings(
        worksheet
    ) {
        const lastRow =
            Math.max(
                worksheet.rowCount || 1,
                1
            );

        worksheet.pageSetup = {
            orientation: 'landscape',
            paperSize: 9,
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0,
            horizontalCentered: true,
            verticalCentered: false,
            printArea:
                `A1:E${lastRow}`,
            margins: {
                left: 0.25,
                right: 0.25,
                top: 0.5,
                bottom: 0.5,
                header: 0.2,
                footer: 0.2
            }
        };

        worksheet.pageSetup.printArea =
            `A1:E${lastRow}`;

        /*
         * Repeat detailed-result header
         * on additional printed pages.
         */
        worksheet.pageSetup.printTitlesRow =
            '18:18';
    }

    clearCellFormatting(
        cell
    ) {
        cell.value = null;
        cell.font = undefined;
        cell.fill = undefined;
        cell.border = undefined;
        cell.numFmt = undefined;
        cell.alignment = undefined;
        cell.protection = undefined;
    }

    validateGeneratedWorkbook(
        reportPath
    ) {
        if (
            !fs.existsSync(
                reportPath
            )
        ) {
            throw new Error(
                `Excel report was not created: ${reportPath}`
            );
        }

        const reportStats =
            fs.statSync(
                reportPath
            );

        if (
            reportStats.size <= 0
        ) {
            throw new Error(
                'Generated Excel report is empty.'
            );
        }

        const fileDescriptor =
            fs.openSync(
                reportPath,
                'r'
            );

        const signatureBuffer =
            Buffer.alloc(4);

        try {
            fs.readSync(
                fileDescriptor,
                signatureBuffer,
                0,
                4,
                0
            );
        } finally {
            fs.closeSync(
                fileDescriptor
            );
        }

        /*
         * XLSX files are ZIP packages.
         */
        const validZipSignature =
            signatureBuffer[0] === 0x50 &&
            signatureBuffer[1] === 0x4B &&
            signatureBuffer[2] === 0x03 &&
            signatureBuffer[3] === 0x04;

        if (
            !validZipSignature
        ) {
            throw new Error(
                'Generated file is not a valid XLSX ZIP package.'
            );
        }
    }
    

    getThinBorder() {
        const createBorderSide = () => ({
            style: 'thin',
            color: {
                argb: 'FF808080'
            }
        });

        return {
            top: createBorderSide(),
            left: createBorderSide(),
            bottom: createBorderSide(),
            right: createBorderSide()
        };
    }
}

module.exports = ExcelReporter;
