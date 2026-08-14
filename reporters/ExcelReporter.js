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
    }

    onTestEnd(test, result) {
        const businessSteps = this.collectBusinessSteps(
            result.steps || []
        );

        if (businessSteps.length === 0) {
            this.results.push({
                module: this.getModuleName(test.title),
                page: this.getPageName(
                    test.title,
                    test.title
                ),
                button: test.title,
                status:
                    result.status === 'passed'
                        ? 'Pass'
                        : 'Fail',
                remarks:
                    result.status === 'passed'
                        ? 'Validation successful'
                        : this.cleanErrorMessage(
                            result.error?.message
                        )
            });

            return;
        }

        for (const step of businessSteps) {
            this.results.push({
                module: this.getModuleName(test.title),

                page: this.getPageName(
                    test.title,
                    step.title
                ),

                button: step.title,

                status:
                    step.error
                        ? 'Fail'
                        : 'Pass',

                remarks:
                    step.error
                        ? this.cleanErrorMessage(
                            step.error.message
                        )
                        : this.getSuccessRemark(
                            step.title
                        )
            });
        }
    }

    collectBusinessSteps(steps) {
        const collectedSteps = [];

        for (const step of steps) {
            if (step.category === 'test.step') {
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

    getModuleName(testTitle) {
        const normalizedTitle =
            testTitle.toLowerCase();

        if (
            normalizedTitle.includes(
                'products page'
            )
        ) {
            return 'Products';
        }

        if (
            normalizedTitle.includes(
                'who we are'
            ) ||
            normalizedTitle.includes(
                'about us'
            ) ||
            normalizedTitle.includes(
                'food category'
            ) ||
            normalizedTitle.includes(
                'location'
            )
        ) {
            return 'Who We Are';
        }

        if (
            normalizedTitle.includes(
                'b2b'
            )
        ) {
            return 'B2B Login';
        }

        if (
            normalizedTitle.includes(
                'contact'
            )
        ) {
            return 'Contact Us';
        }

        return 'Home';
    }

    getPageName(testTitle, stepTitle) {
        const testText =
            testTitle.toLowerCase();

        const stepText =
            stepTitle.toLowerCase();

        if (
            stepText.includes('header') ||
            stepText.includes('logo') ||
            stepText.includes('products tab') ||
            stepText.includes('who we are menu') ||
            stepText.includes('b2b log in tab') ||
            stepText.includes('contact us tab') ||
            stepText.includes('search icon')
        ) {
            return 'Header';
        }

        if (stepText.includes('footer')) {
            return 'Footer';
        }

        if (
            stepText.includes('about us') ||
            stepText.includes(
                'travel retail experience'
            ) ||
            stepText.includes(
                'award logo'
            ) ||
            stepText.includes(
                'expand your horizons'
            ) ||
            stepText.includes(
                'more from nestlé'
            )
        ) {
            return 'About Us';
        }

        if (
            stepText.includes('food category') ||
            stepText.includes('food as the') ||
            stepText.includes('verse') ||
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
            return 'Food Category';
        }

        if (
            stepText.includes('location') ||
            stepText.includes(
                'company information'
            ) ||
            stepText.includes(
                'company address'
            )
        ) {
            return 'Location';
        }

        if (
            stepText.includes('contact us form') ||
            stepText.includes(
                'contact form'
            ) ||
            stepText.includes('captcha') ||
            stepText.includes(
                'send message'
            )
        ) {
            return 'Contact Form';
        }

        if (
            testText.includes(
                'products page'
            ) ||
            stepText.includes('product') ||
            stepText.includes('brand filter') ||
            stepText.includes('pagination')
        ) {
            return 'Products';
        }

        if (
            stepText.includes('banner') ||
            stepText.includes('hero')
        ) {
            return 'Hero Banner';
        }

        if (
            stepText.includes(
                'business lounge'
            )
        ) {
            return 'Business Lounge';
        }

        return 'Home';
    }

    getSuccessRemark(stepTitle) {
        const normalizedTitle =
            stepTitle.toLowerCase();

        if (
            normalizedTitle.includes(
                'navigate'
            )
        ) {
            return 'Navigation successful';
        }

        if (
            normalizedTitle.includes(
                'heading'
            ) ||
            normalizedTitle.includes(
                'title'
            ) ||
            normalizedTitle.includes(
                'breadcrumb'
            )
        ) {
            return 'Text verified and element is visible';
        }

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

        if (
            normalizedTitle.includes(
                'search'
            )
        ) {
            return 'Search functionality verified';
        }

        if (
            normalizedTitle.includes(
                'filter'
            )
        ) {
            return 'Filter functionality verified';
        }

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

        if (
            normalizedTitle.includes(
                'captcha'
            )
        ) {
            return 'CAPTCHA section is displayed';
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
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 1000);
    }

    groupResultsByPage() {
        const groups = [];
        const groupMap = new Map();

        for (const result of this.results) {
            const groupKey =
                `${result.module}::${result.page}`;

            if (!groupMap.has(groupKey)) {
                const newGroup = {
                    module: result.module,
                    page: result.page,
                    results: []
                };

                groupMap.set(
                    groupKey,
                    newGroup
                );

                groups.push(newGroup);
            }

            groupMap
                .get(groupKey)
                .results
                .push(result);
        }

        return groups;
    }

    async onEnd() {
        const workbook =
            new ExcelJS.Workbook();

        workbook.creator =
            'NITLN Playwright Automation';

        workbook.created =
            new Date();

        const worksheet =
            workbook.addWorksheet(
                'Detailed Validation Report',
                {
                    views: [
                        {
                            showGridLines: true
                        }
                    ]
                }
            );

        worksheet.columns = [
            {
                key: 'serialNumber',
                width: 10
            },
            {
                key: 'page',
                width: 30
            },
            {
                key: 'button',
                width: 48
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

        const executionTimeSeconds = (
            (
                Date.now() -
                this.executionStartTime
            ) / 1000
        ).toFixed(2);

        this.createTitle(worksheet);

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

        this.createDetailedResults(
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
                `NITLN-Detailed-Validation-Report-${timestamp}.xlsx`
            );

        await workbook.xlsx.writeFile(
            reportPath
        );

        console.log('');
        console.log(
            'Detailed Excel report generated successfully:'
        );

        console.log(reportPath);
    }

    createTitle(worksheet) {
        worksheet.mergeCells('A1:E1');

        const titleCell =
            worksheet.getCell('A1');

        titleCell.value =
            'NITLN Website Detailed Validation Report';

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

        worksheet.getRow(1).height = 30;
    }

    createExecutionDetails(
        worksheet,
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
                argb: 'FFB4CCE3'
            }
        };

        const executionDate =
            new Date().toLocaleString(
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
                    bold: true
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
                argb: 'FFB4CCE3'
            }
        };

        const summaryHeaderRow =
            worksheet.getRow(11);

        summaryHeaderRow.values = [
            'Total Components',
            'Passed',
            'Failed'
        ];

        summaryHeaderRow.font = {
            bold: true
        };

        summaryHeaderRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FFD9D9D9'
            }
        };

        const summaryValueRow =
            worksheet.getRow(12);

        summaryValueRow.values = [
            totalComponents,
            passedComponents,
            failedComponents
        ];

        summaryValueRow.font = {
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

        for (
            let rowNumber = 11;
            rowNumber <= 12;
            rowNumber += 1
        ) {
            for (
                let columnNumber = 1;
                columnNumber <= 3;
                columnNumber += 1
            ) {
                const cell =
                    worksheet
                        .getRow(rowNumber)
                        .getCell(columnNumber);

                cell.border =
                    this.getThinBorder();

                cell.alignment = {
                    horizontal: 'center',
                    vertical: 'middle'
                };
            }
        }
    }

    createDetailedResults(worksheet) {
        worksheet.mergeCells('A15:E15');

        const heading =
            worksheet.getCell('A15');

        heading.value =
            'Detailed Results';

        heading.font = {
            bold: true,
            size: 13
        };

        heading.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FFB4CCE3'
            }
        };

        const headerRow =
            worksheet.getRow(17);

        headerRow.values = [
            'Sl.No',
            'Page',
            'Button / Validation',
            'Status',
            'Remarks'
        ];

        headerRow.font = {
            bold: true
        };

        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FFD9D9D9'
            }
        };

        headerRow.alignment = {
            horizontal: 'left',
            vertical: 'middle'
        };

        headerRow.height = 24;

        const groups =
            this.groupResultsByPage();

        let currentRowNumber = 18;
        let serialNumber = 1;

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

                row.getCell(3).value =
                    result.button;

                row.getCell(4).value =
                    result.status;

                row.getCell(5).value =
                    result.remarks;

                row.alignment = {
                    vertical: 'top',
                    wrapText: true
                };

                this.formatStatusCell(
                    row.getCell(4),
                    result.status
                );

                if (
                    result.status === 'Fail'
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

            worksheet.getCell(
                `A${groupStartRow}`
            ).value = serialNumber;

            worksheet.getCell(
                `B${groupStartRow}`
            ).value = group.page;

            worksheet.getCell(
                `A${groupStartRow}`
            ).alignment = {
                horizontal: 'center',
                vertical: 'middle'
            };

            worksheet.getCell(
                `B${groupStartRow}`
            ).alignment = {
                horizontal: 'left',
                vertical: 'middle',
                wrapText: true
            };

            serialNumber += 1;
        }
    }

    formatStatusCell(cell, status) {
        cell.font = {
            bold: true,
            color: {
                argb:
                    status === 'Pass'
                        ? 'FF008000'
                        : 'FFFF0000'
            }
        };

        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb:
                    status === 'Pass'
                        ? 'FFE2F0D9'
                        : 'FFF4CCCC'
            }
        };

        cell.alignment = {
            horizontal: 'left',
            vertical: 'middle'
        };
    }

    applyFinalFormatting(worksheet) {
        const lastRow =
            worksheet.rowCount;

        for (
            let rowNumber = 17;
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

                cell.border =
                    this.getThinBorder();

                cell.alignment = {
                    ...cell.alignment,
                    vertical: 'top',
                    wrapText: true
                };
            }
        }

        worksheet.autoFilter = {
            from: 'A17',
            to: 'E17'
        };

        worksheet.views = [
            {
                state: 'frozen',
                ySplit: 17,
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

    getThinBorder() {
        const borderStyle = {
            style: 'thin',
            color: {
                argb: 'FF808080'
            }
        };

        return {
            top: borderStyle,
            left: borderStyle,
            bottom: borderStyle,
            right: borderStyle
        };
    }
}

module.exports = ExcelReporter;