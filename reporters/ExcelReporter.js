const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

class ExcelReporter {
    constructor() {
        this.results = [];
        this.executionStartTime = Date.now();
    }

    onTestEnd(test, result) {
        const status =
            result.status === 'passed' ? 'Pass' : 'Fail';

        let remarks;

        if (status === 'Pass') {
            remarks = 'Validation successful';
        } else {
            remarks =
                result.error?.message ||
                'Validation failed';
        }

        remarks = remarks
            .replace(/\u001b\[[0-9;]*m/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 250);

        this.results.push({
            page: this.getPageName(test.title),
            component: test.title,
            status,
            remarks
        });
    }

    getPageName(testTitle) {
        const normalizedTitle = testTitle.toLowerCase();

        if (
            normalizedTitle.includes('logo') ||
            normalizedTitle.includes('products tab') ||
            normalizedTitle.includes('who we are') ||
            normalizedTitle.includes('b2b log') ||
            normalizedTitle.includes('contact us tab') ||
            normalizedTitle.includes('search icon')
        ) {
            return 'Header';
        }

        if (normalizedTitle.includes('footer')) {
            return 'Footer';
        }

        return 'Home';
    }

    async onEnd() {
        const workbook = new ExcelJS.Workbook();

        workbook.creator = 'Playwright Automation';
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet(
            'Website Validation Report'
        );

        worksheet.views = [
            {
                showGridLines: true
            }
        ];

        const executionEndTime = Date.now();

        const executionTimeSeconds = (
            (executionEndTime -
                this.executionStartTime) /
            1000
        ).toFixed(2);

        const totalTests = this.results.length;

        const passedTests = this.results.filter(
            testResult =>
                testResult.status === 'Pass'
        ).length;

        const failedTests = this.results.filter(
            testResult =>
                testResult.status === 'Fail'
        ).length;

        const websiteUrl =
            process.env.BASE_URL ||
            'Not configured';

        const executionDate =
            new Date().toLocaleDateString('en-GB');

        worksheet.columns = [
            {
                key: 'serialNumber',
                width: 10
            },
            {
                key: 'page',
                width: 25
            },
            {
                key: 'component',
                width: 45
            },
            {
                key: 'status',
                width: 15
            },
            {
                key: 'remarks',
                width: 55
            }
        ];

        worksheet.mergeCells('A1:E1');

        const titleCell = worksheet.getCell('A1');

        titleCell.value =
            'Website Link Validation Report';

        titleCell.font = {
            bold: true,
            size: 16
        };

        titleCell.alignment = {
            horizontal: 'left',
            vertical: 'middle'
        };

        worksheet.getRow(1).height = 28;

        worksheet.mergeCells('A3:E3');

        const executionHeading =
            worksheet.getCell('A3');

        executionHeading.value =
            'Execution Details';

        executionHeading.font = {
            bold: true,
            size: 12
        };

        executionHeading.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FFD9EAF7'
            }
        };

        const executionDetails = [
            ['Website', websiteUrl],
            ['Execution Date', executionDate],
            ['Browser', 'chromium'],
            [
                'Execution Time',
                `${executionTimeSeconds} sec`
            ]
        ];

        executionDetails.forEach(
            (detail, index) => {
                const rowNumber = index + 4;

                worksheet.getCell(
                    `A${rowNumber}`
                ).value = detail[0];

                worksheet.mergeCells(
                    `B${rowNumber}:E${rowNumber}`
                );

                worksheet.getCell(
                    `B${rowNumber}`
                ).value = detail[1];

                worksheet.getCell(
                    `A${rowNumber}`
                ).font = {
                    bold: true
                };
            }
        );

        worksheet.mergeCells('A9:E9');

        const summaryHeading =
            worksheet.getCell('A9');

        summaryHeading.value = 'Summary';

        summaryHeading.font = {
            bold: true,
            size: 12
        };

        summaryHeading.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FFD9EAF7'
            }
        };

        worksheet.getCell('A11').value =
            'Total Components';

        worksheet.getCell('B11').value =
            'Passed';

        worksheet.getCell('C11').value =
            'Failed';

        worksheet.getCell('A12').value =
            totalTests;

        worksheet.getCell('B12').value =
            passedTests;

        worksheet.getCell('C12').value =
            failedTests;

        worksheet.getCell('B12').font = {
            bold: true,
            color: {
                argb: 'FF008000'
            }
        };

        worksheet.getCell('C12').font = {
            bold: true,
            color: {
                argb: 'FFFF0000'
            }
        };

        worksheet.mergeCells('A14:E14');

        const detailsHeading =
            worksheet.getCell('A14');

        detailsHeading.value =
            'Detailed Results';

        detailsHeading.font = {
            bold: true,
            size: 12
        };

        detailsHeading.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FFD9EAF7'
            }
        };

        const headingRow =
            worksheet.getRow(16);

        headingRow.values = [
            'Sl.No',
            'Page',
            'Button / Component',
            'Status',
            'Remarks'
        ];

        headingRow.font = {
            bold: true,
            color: {
                argb: 'FFFFFFFF'
            }
        };

        headingRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FF1F4E78'
            }
        };

        headingRow.alignment = {
            horizontal: 'center',
            vertical: 'middle'
        };

        headingRow.height = 24;

        this.results.forEach(
            (testResult, index) => {
                const row = worksheet.addRow({
                    serialNumber: index + 1,
                    page: testResult.page,
                    component:
                        testResult.component,
                    status: testResult.status,
                    remarks: testResult.remarks
                });

                row.alignment = {
                    vertical: 'top',
                    wrapText: true
                };

                const statusCell =
                    row.getCell(4);

                if (
                    testResult.status === 'Pass'
                ) {
                    statusCell.font = {
                        bold: true,
                        color: {
                            argb: 'FF008000'
                        }
                    };

                    statusCell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {
                            argb: 'FFE2F0D9'
                        }
                    };
                } else {
                    statusCell.font = {
                        bold: true,
                        color: {
                            argb: 'FFFF0000'
                        }
                    };

                    statusCell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {
                            argb: 'FFF4CCCC'
                        }
                    };
                }
            }
        );

        const lastRowNumber =
            worksheet.rowCount;

        for (
            let rowNumber = 16;
            rowNumber <= lastRowNumber;
            rowNumber += 1
        ) {
            const row =
                worksheet.getRow(rowNumber);

            for (
                let columnNumber = 1;
                columnNumber <= 5;
                columnNumber += 1
            ) {
                const cell =
                    row.getCell(columnNumber);

                cell.border = {
                    top: {
                        style: 'thin',
                        color: {
                            argb: 'FF808080'
                        }
                    },
                    left: {
                        style: 'thin',
                        color: {
                            argb: 'FF808080'
                        }
                    },
                    bottom: {
                        style: 'thin',
                        color: {
                            argb: 'FF808080'
                        }
                    },
                    right: {
                        style: 'thin',
                        color: {
                            argb: 'FF808080'
                        }
                    }
                };
            }
        }

        worksheet.autoFilter = {
            from: 'A16',
            to: 'E16'
        };

        worksheet.views = [
            {
                state: 'frozen',
                ySplit: 16,
                showGridLines: true
            }
        ];

        worksheet.pageSetup = {
            orientation: 'landscape',
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0
        };

        const reportDirectory = path.join(
            process.cwd(),
            'excel-report'
        );

        fs.mkdirSync(reportDirectory, {
            recursive: true
        });

        const timestamp = new Date()
            .toISOString()
            .replace(/[:.]/g, '-');

        const reportPath = path.join(
            reportDirectory,
            `Website-Validation-Report-${timestamp}.xlsx`
        );

        await workbook.xlsx.writeFile(
            reportPath
        );

        console.log('');
        console.log(
            'Excel report generated successfully:'
        );

        console.log(reportPath);
    }
}

module.exports = ExcelReporter;