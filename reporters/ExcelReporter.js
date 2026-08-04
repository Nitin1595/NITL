// const ExcelJS = require('exceljs');
// const fs = require('fs');
// const path = require('path');

// class ExcelReporter {
//     constructor() {
//         this.results = [];
//         this.executionStartTime = Date.now();
//     }

//     onTestEnd(test, result) {
//         const status =
//             result.status === 'passed' ? 'Pass' : 'Fail';

//         let remarks;

//         if (status === 'Pass') {
//             remarks = 'Validation successful';
//         } else {
//             remarks =
//                 result.error?.message ||
//                 'Validation failed';
//         }

//         remarks = remarks
//             .replace(/\u001b\[[0-9;]*m/g, '')
//             .replace(/\s+/g, ' ')
//             .trim()
//             .substring(0, 250);

//         this.results.push({
//             page: this.getPageName(test.title),
//             component: test.title,
//             status,
//             remarks
//         });
//     }

//     getPageName(testTitle) {
//         const normalizedTitle = testTitle.toLowerCase();

//         if (
//             normalizedTitle.includes('logo') ||
//             normalizedTitle.includes('products tab') ||
//             normalizedTitle.includes('who we are') ||
//             normalizedTitle.includes('b2b log') ||
//             normalizedTitle.includes('contact us tab') ||
//             normalizedTitle.includes('search icon')
//         ) {
//             return 'Header';
//         }

//         if (normalizedTitle.includes('footer')) {
//             return 'Footer';
//         }

//         return 'Home';
//     }

//     async onEnd() {
//         const workbook = new ExcelJS.Workbook();

//         workbook.creator = 'Playwright Automation';
//         workbook.created = new Date();

//         const worksheet = workbook.addWorksheet(
//             'Website Validation Report'
//         );

//         worksheet.views = [
//             {
//                 showGridLines: true
//             }
//         ];

//         const executionEndTime = Date.now();

//         const executionTimeSeconds = (
//             (executionEndTime -
//                 this.executionStartTime) /
//             1000
//         ).toFixed(2);

//         const totalTests = this.results.length;

//         const passedTests = this.results.filter(
//             testResult =>
//                 testResult.status === 'Pass'
//         ).length;

//         const failedTests = this.results.filter(
//             testResult =>
//                 testResult.status === 'Fail'
//         ).length;

//         const websiteUrl =
//             process.env.BASE_URL ||
//             'Not configured';

//         const executionDate =
//             new Date().toLocaleDateString('en-GB');

//         worksheet.columns = [
//             {
//                 key: 'serialNumber',
//                 width: 10
//             },
//             {
//                 key: 'page',
//                 width: 25
//             },
//             {
//                 key: 'component',
//                 width: 45
//             },
//             {
//                 key: 'status',
//                 width: 15
//             },
//             {
//                 key: 'remarks',
//                 width: 55
//             }
//         ];

//         worksheet.mergeCells('A1:E1');

//         const titleCell = worksheet.getCell('A1');

//         titleCell.value =
//             'Website Link Validation Report';

//         titleCell.font = {
//             bold: true,
//             size: 16
//         };

//         titleCell.alignment = {
//             horizontal: 'left',
//             vertical: 'middle'
//         };

//         worksheet.getRow(1).height = 28;

//         worksheet.mergeCells('A3:E3');

//         const executionHeading =
//             worksheet.getCell('A3');

//         executionHeading.value =
//             'Execution Details';

//         executionHeading.font = {
//             bold: true,
//             size: 12
//         };

//         executionHeading.fill = {
//             type: 'pattern',
//             pattern: 'solid',
//             fgColor: {
//                 argb: 'FFD9EAF7'
//             }
//         };

//         const executionDetails = [
//             ['Website', websiteUrl],
//             ['Execution Date', executionDate],
//             ['Browser', 'chromium'],
//             [
//                 'Execution Time',
//                 `${executionTimeSeconds} sec`
//             ]
//         ];

//         executionDetails.forEach(
//             (detail, index) => {
//                 const rowNumber = index + 4;

//                 worksheet.getCell(
//                     `A${rowNumber}`
//                 ).value = detail[0];

//                 worksheet.mergeCells(
//                     `B${rowNumber}:E${rowNumber}`
//                 );

//                 worksheet.getCell(
//                     `B${rowNumber}`
//                 ).value = detail[1];

//                 worksheet.getCell(
//                     `A${rowNumber}`
//                 ).font = {
//                     bold: true
//                 };
//             }
//         );

//         worksheet.mergeCells('A9:E9');

//         const summaryHeading =
//             worksheet.getCell('A9');

//         summaryHeading.value = 'Summary';

//         summaryHeading.font = {
//             bold: true,
//             size: 12
//         };

//         summaryHeading.fill = {
//             type: 'pattern',
//             pattern: 'solid',
//             fgColor: {
//                 argb: 'FFD9EAF7'
//             }
//         };

//         worksheet.getCell('A11').value =
//             'Total Components';

//         worksheet.getCell('B11').value =
//             'Passed';

//         worksheet.getCell('C11').value =
//             'Failed';

//         worksheet.getCell('A12').value =
//             totalTests;

//         worksheet.getCell('B12').value =
//             passedTests;

//         worksheet.getCell('C12').value =
//             failedTests;

//         worksheet.getCell('B12').font = {
//             bold: true,
//             color: {
//                 argb: 'FF008000'
//             }
//         };

//         worksheet.getCell('C12').font = {
//             bold: true,
//             color: {
//                 argb: 'FFFF0000'
//             }
//         };

//         worksheet.mergeCells('A14:E14');

//         const detailsHeading =
//             worksheet.getCell('A14');

//         detailsHeading.value =
//             'Detailed Results';

//         detailsHeading.font = {
//             bold: true,
//             size: 12
//         };

//         detailsHeading.fill = {
//             type: 'pattern',
//             pattern: 'solid',
//             fgColor: {
//                 argb: 'FFD9EAF7'
//             }
//         };

//         const headingRow =
//             worksheet.getRow(16);

//         headingRow.values = [
//             'Sl.No',
//             'Page',
//             'Button / Component',
//             'Status',
//             'Remarks'
//         ];

//         headingRow.font = {
//             bold: true,
//             color: {
//                 argb: 'FFFFFFFF'
//             }
//         };

//         headingRow.fill = {
//             type: 'pattern',
//             pattern: 'solid',
//             fgColor: {
//                 argb: 'FF1F4E78'
//             }
//         };

//         headingRow.alignment = {
//             horizontal: 'center',
//             vertical: 'middle'
//         };

//         headingRow.height = 24;

//         this.results.forEach(
//             (testResult, index) => {
//                 const row = worksheet.addRow({
//                     serialNumber: index + 1,
//                     page: testResult.page,
//                     component:
//                         testResult.component,
//                     status: testResult.status,
//                     remarks: testResult.remarks
//                 });

//                 row.alignment = {
//                     vertical: 'top',
//                     wrapText: true
//                 };

//                 const statusCell =
//                     row.getCell(4);

//                 if (
//                     testResult.status === 'Pass'
//                 ) {
//                     statusCell.font = {
//                         bold: true,
//                         color: {
//                             argb: 'FF008000'
//                         }
//                     };

//                     statusCell.fill = {
//                         type: 'pattern',
//                         pattern: 'solid',
//                         fgColor: {
//                             argb: 'FFE2F0D9'
//                         }
//                     };
//                 } else {
//                     statusCell.font = {
//                         bold: true,
//                         color: {
//                             argb: 'FFFF0000'
//                         }
//                     };

//                     statusCell.fill = {
//                         type: 'pattern',
//                         pattern: 'solid',
//                         fgColor: {
//                             argb: 'FFF4CCCC'
//                         }
//                     };
//                 }
//             }
//         );

//         const lastRowNumber =
//             worksheet.rowCount;

//         for (
//             let rowNumber = 16;
//             rowNumber <= lastRowNumber;
//             rowNumber += 1
//         ) {
//             const row =
//                 worksheet.getRow(rowNumber);

//             for (
//                 let columnNumber = 1;
//                 columnNumber <= 5;
//                 columnNumber += 1
//             ) {
//                 const cell =
//                     row.getCell(columnNumber);

//                 cell.border = {
//                     top: {
//                         style: 'thin',
//                         color: {
//                             argb: 'FF808080'
//                         }
//                     },
//                     left: {
//                         style: 'thin',
//                         color: {
//                             argb: 'FF808080'
//                         }
//                     },
//                     bottom: {
//                         style: 'thin',
//                         color: {
//                             argb: 'FF808080'
//                         }
//                     },
//                     right: {
//                         style: 'thin',
//                         color: {
//                             argb: 'FF808080'
//                         }
//                     }
//                 };
//             }
//         }

//         worksheet.autoFilter = {
//             from: 'A16',
//             to: 'E16'
//         };

//         worksheet.views = [
//             {
//                 state: 'frozen',
//                 ySplit: 16,
//                 showGridLines: true
//             }
//         ];

//         worksheet.pageSetup = {
//             orientation: 'landscape',
//             fitToPage: true,
//             fitToWidth: 1,
//             fitToHeight: 0
//         };

//         const reportDirectory = path.join(
//             process.cwd(),
//             'excel-report'
//         );

//         fs.mkdirSync(reportDirectory, {
//             recursive: true
//         });

//         const timestamp = new Date()
//             .toISOString()
//             .replace(/[:.]/g, '-');

//         const reportPath = path.join(
//             reportDirectory,
//             `Website-Validation-Report-${timestamp}.xlsx`
//         );

//         await workbook.xlsx.writeFile(
//             reportPath
//         );

//         console.log('');
//         console.log(
//             'Excel report generated successfully:'
//         );

//         console.log(reportPath);
//     }
// }

// module.exports = ExcelReporter;


const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

class ExcelReporter {
    constructor() {
        this.results = [];
        this.executionStartTime = Date.now();
    }

    onTestEnd(test, result) {
        const testSteps = this.getAllTestSteps(
            result.steps || []
        );

        /*
         * When test.step() entries exist, create one Excel row
         * for every executed test step.
         */
        if (testSteps.length > 0) {
            testSteps.forEach(step => {
                this.results.push({
                    page: this.getPageName(
                        test.title,
                        step.title
                    ),

                    component: step.title,

                    status: step.error
                        ? 'Fail'
                        : 'Pass',

                    remarks: step.error
                        ? this.cleanErrorMessage(
                            step.error.message
                        )
                        : 'Validation successful'
                });
            });

            return;
        }

        /*
         * Fallback for tests without test.step().
         */
        const testPassed =
            result.status === 'passed';

        this.results.push({
            page: this.getPageName(
                test.title,
                test.title
            ),

            component: test.title,

            status: testPassed
                ? 'Pass'
                : 'Fail',

            remarks: testPassed
                ? 'Validation successful'
                : this.cleanErrorMessage(
                    result.error?.message ||
                    'Validation failed'
                )
        });
    }

    getAllTestSteps(steps) {
        const collectedSteps = [];

        for (const step of steps) {
            /*
             * Only collect steps created using test.step().
             * Internal Playwright actions such as page.goto(),
             * locator.click(), and expect() are excluded.
             */
            if (step.category === 'test.step') {
                collectedSteps.push(step);
            }

            if (
                Array.isArray(step.steps) &&
                step.steps.length > 0
            ) {
                collectedSteps.push(
                    ...this.getAllTestSteps(
                        step.steps
                    )
                );
            }
        }

        return collectedSteps;
    }

    getPageName(testTitle, componentTitle) {
        const fullText = `${testTitle} ${componentTitle}`
            .toLowerCase();

        const componentText =
            componentTitle.toLowerCase();

        const headerKeywords = [
            'header',
            'logo',
            'products tab',
            'who we are',
            'b2b log',
            'contact us tab',
            'search icon'
        ];

        const isHeaderComponent =
            headerKeywords.some(keyword =>
                componentText.includes(keyword)
            );

        if (isHeaderComponent) {
            return 'Header';
        }

        if (componentText.includes('footer')) {
            return 'Footer';
        }

        if (
            fullText.includes('products page') ||
            componentText.includes('product')
        ) {
            return 'Products';
        }

        if (
            fullText.includes('who we are') ||
            fullText.includes('about us') ||
            fullText.includes('food category') ||
            fullText.includes('location')
        ) {
            return 'Who We Are';
        }

        if (
            fullText.includes('b2b login') ||
            fullText.includes('b2b log in')
        ) {
            return 'B2B Login';
        }

        if (fullText.includes('contact us')) {
            return 'Contact Us';
        }

        return 'Home';
    }

    cleanErrorMessage(errorMessage) {
        return String(
            errorMessage ||
            'Validation failed'
        )
            .replace(
                /\u001b\[[0-9;]*m/g,
                ''
            )
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 500);
    }

    async onEnd() {
        const workbook =
            new ExcelJS.Workbook();

        workbook.creator =
            'Playwright JavaScript Automation';

        workbook.created =
            new Date();

        const worksheet =
            workbook.addWorksheet(
                'Website Validation Report',
                {
                    views: [
                        {
                            showGridLines: true
                        }
                    ]
                }
            );

        const executionEndTime =
            Date.now();

        const executionTimeSeconds = (
            (
                executionEndTime -
                this.executionStartTime
            ) / 1000
        ).toFixed(2);

        const totalComponents =
            this.results.length;

        const passedComponents =
            this.results.filter(
                result =>
                    result.status === 'Pass'
            ).length;

        const failedComponents =
            this.results.filter(
                result =>
                    result.status === 'Fail'
            ).length;

        const websiteUrl =
            process.env.BASE_URL ||
            'Not configured';

        const executionDate =
            new Date().toLocaleString(
                'en-GB',
                {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }
            );

        worksheet.columns = [
            {
                key: 'serialNumber',
                width: 10
            },
            {
                key: 'page',
                width: 24
            },
            {
                key: 'component',
                width: 48
            },
            {
                key: 'status',
                width: 15
            },
            {
                key: 'remarks',
                width: 62
            }
        ];

        this.createReportTitle(
            worksheet
        );

        this.createExecutionDetails(
            worksheet,
            websiteUrl,
            executionDate,
            executionTimeSeconds
        );

        this.createSummary(
            worksheet,
            totalComponents,
            passedComponents,
            failedComponents
        );

        this.createDetailedResultsHeader(
            worksheet
        );

        this.addDetailedResults(
            worksheet
        );

        this.applyFinalFormatting(
            worksheet
        );

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

        const timestamp =
            new Date()
                .toISOString()
                .replace(/[:.]/g, '-');

        const reportPath =
            path.join(
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

    createReportTitle(worksheet) {
        worksheet.mergeCells('A1:E1');

        const titleCell =
            worksheet.getCell('A1');

        titleCell.value =
            'Website Link Validation Report';

        titleCell.font = {
            bold: true,
            size: 16,
            color: {
                argb: 'FF000000'
            }
        };

        titleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FFE7E6E6'
            }
        };

        titleCell.alignment = {
            horizontal: 'left',
            vertical: 'middle'
        };

        worksheet.getRow(1).height = 28;
    }

    createExecutionDetails(
        worksheet,
        websiteUrl,
        executionDate,
        executionTimeSeconds
    ) {
        worksheet.mergeCells('A3:E3');

        const heading =
            worksheet.getCell('A3');

        heading.value =
            'Execution Details';

        heading.font = {
            bold: true,
            size: 12
        };

        heading.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FFD9EAF7'
            }
        };

        const executionDetails = [
            [
                'Website',
                websiteUrl
            ],
            [
                'Execution Date',
                executionDate
            ],
            [
                'Browser',
                'Chromium'
            ],
            [
                'Execution Time',
                `${executionTimeSeconds} sec`
            ]
        ];

        executionDetails.forEach(
            (detail, index) => {
                const rowNumber =
                    index + 4;

                worksheet.getCell(
                    `A${rowNumber}`
                ).value = detail[0];

                worksheet.getCell(
                    `A${rowNumber}`
                ).font = {
                    bold: true,
                    color: {
                        argb: 'FF666666'
                    }
                };

                worksheet.mergeCells(
                    `B${rowNumber}:E${rowNumber}`
                );

                worksheet.getCell(
                    `B${rowNumber}`
                ).value = detail[1];

                worksheet.getCell(
                    `B${rowNumber}`
                ).font = {
                    color: {
                        argb: 'FF008000'
                    }
                };
            }
        );
    }

    createSummary(
        worksheet,
        totalComponents,
        passedComponents,
        failedComponents
    ) {
        worksheet.mergeCells('A9:E9');

        const heading =
            worksheet.getCell('A9');

        heading.value = 'Summary';

        heading.font = {
            bold: true,
            size: 12
        };

        heading.fill = {
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
            totalComponents;

        worksheet.getCell('B12').value =
            passedComponents;

        worksheet.getCell('C12').value =
            failedComponents;

        for (
            const cellAddress
            of ['A11', 'B11', 'C11']
        ) {
            const cell =
                worksheet.getCell(
                    cellAddress
                );

            cell.font = {
                bold: true
            };

            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'FFE7E6E6'
                }
            };

            cell.alignment = {
                horizontal: 'center'
            };
        }

        worksheet.getCell('A12').font = {
            bold: true
        };

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
    }

    createDetailedResultsHeader(
        worksheet
    ) {
        worksheet.mergeCells('A14:E14');

        const heading =
            worksheet.getCell('A14');

        heading.value =
            'Detailed Results';

        heading.font = {
            bold: true,
            size: 12
        };

        heading.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FFD9EAF7'
            }
        };

        const headerRow =
            worksheet.getRow(16);

        headerRow.values = [
            'Sl.No',
            'Page',
            'Button / Component',
            'Status',
            'Remarks'
        ];

        headerRow.font = {
            bold: true,
            color: {
                argb: 'FFFFFFFF'
            }
        };

        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FF1F4E78'
            }
        };

        headerRow.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true
        };

        headerRow.height = 26;
    }

    addDetailedResults(worksheet) {
        this.results.forEach(
            (result, index) => {
                const row =
                    worksheet.addRow({
                        serialNumber:
                            index + 1,

                        page:
                            result.page,

                        component:
                            result.component,

                        status:
                            result.status,

                        remarks:
                            result.remarks
                    });

                row.alignment = {
                    vertical: 'top',
                    wrapText: true
                };

                row.height = 24;

                const statusCell =
                    row.getCell(4);

                statusCell.font = {
                    bold: true
                };

                statusCell.alignment = {
                    horizontal: 'left',
                    vertical: 'middle'
                };

                if (
                    result.status === 'Pass'
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

                    row.getCell(5).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {
                            argb: 'FFFFE6E6'
                        }
                    };
                }
            }
        );
    }

    applyFinalFormatting(worksheet) {
        const lastRow =
            worksheet.rowCount;

        for (
            let rowNumber = 16;
            rowNumber <= lastRow;
            rowNumber += 1
        ) {
            const row =
                worksheet.getRow(
                    rowNumber
                );

            for (
                let columnNumber = 1;
                columnNumber <= 5;
                columnNumber += 1
            ) {
                const cell =
                    row.getCell(
                        columnNumber
                    );

                cell.border = {
                    top: {
                        style: 'thin',
                        color: {
                            argb: 'FF9E9E9E'
                        }
                    },
                    left: {
                        style: 'thin',
                        color: {
                            argb: 'FF9E9E9E'
                        }
                    },
                    bottom: {
                        style: 'thin',
                        color: {
                            argb: 'FF9E9E9E'
                        }
                    },
                    right: {
                        style: 'thin',
                        color: {
                            argb: 'FF9E9E9E'
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
    }
}

module.exports = ExcelReporter;