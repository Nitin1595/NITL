const {
    defineConfig,
    devices
} = require('@playwright/test');

require('dotenv').config();

const requiredEnvironmentVariables = [
    'BASE_URL',
    'AUTH_USERNAME',
    'AUTH_PASSWORD'
];

for (
    const variableName
    of requiredEnvironmentVariables
) {
    if (!process.env[variableName]) {
        throw new Error(
            `Missing environment variable: ${variableName}`
        );
    }
}

module.exports = defineConfig({
    testDir: './tests',

    testMatch: '**/*.spec.js',

    fullyParallel: false,

    timeout: 60 * 1000,

    expect: {
        timeout: 10 * 1000
    },

    retries: 0,

    workers: 1,

    reporter: [
        ['list'],
        [
            'html',
            {
                outputFolder:
                    'playwright-report',
                open: 'never'
            }
        ],
        [
            './reporters/ExcelReporter.js'
        ]
    ],

    use: {
        baseURL:
            process.env.BASE_URL,

        httpCredentials: {
            username:
                process.env.AUTH_USERNAME,

            password:
                process.env.AUTH_PASSWORD
        },

        ignoreHTTPSErrors: true,

        headless: false,

        screenshot:
            'only-on-failure',

        video:
            'retain-on-failure',

        trace:
            'retain-on-failure',

        actionTimeout:
            15 * 1000,

        navigationTimeout:
            60 * 1000
    },

    projects: [
        {
            name: 'chromium',

            use: {
                ...devices[
                    'Desktop Chrome'
                ]
            }
        }
    ]
});
