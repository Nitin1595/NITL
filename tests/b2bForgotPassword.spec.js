const {
    test,
    expect
} = require('@playwright/test');

const {
    B2BLoginPage
} = require('../pages/B2BLoginPage');

const {
    B2BForgotPasswordPage
} = require(
    '../pages/b2b/B2BForgotPasswordPage'
);

const b2bLoginData = require(
    '../testData/b2bLoginData.json'
);

const b2bForgotPasswordData = require(
    '../testData/b2bForgotPasswordData.json'
);

test.describe(
    'Nestle International Travel Retail B2B Forgot Password',
    () => {
        test(
            'Validate Reset Password page without submitting a reset request',
            async ({ page }) => {
                const b2bLoginPage =
                    new B2BLoginPage(page);

                const forgotPasswordPage =
                    new B2BForgotPasswordPage(page);

                let detectedEnvironmentIssue = {
                    visible: false,
                    matchedKeywords: []
                };

                await test.step(
                    'Open Home page for Forgot Password validation',
                    async () => {
                        await b2bLoginPage.navigate(
                            b2bLoginData
                                .backgroundPagePath
                        );
                    }
                );

                await test.step(
                    'Verify public Header before opening B2B Login',
                    async () => {
                        await b2bLoginPage.header
                            .verifyHeaderDisplayed();

                        await b2bLoginPage.header
                            .verifyLogoDisplayed();

                        await b2bLoginPage.header
                            .verifyNavigationDisplayed();

                        await b2bLoginPage.header
                            .verifySearchButtonDisplayed();

                        await b2bLoginPage.header
                            .verifyPublicB2BLoginDisplayed();
                    }
                );

                await test.step(
                    'Open B2B Login modal',
                    async () => {
                        await b2bLoginPage
                            .openLoginModal();
                    }
                );

                await test.step(
                    'Verify Forgot your password link',
                    async () => {
                        await b2bLoginPage
                            .verifyForgotPasswordLink(
                                b2bLoginData
                                    .links
                                    .forgotPassword,

                                b2bLoginData
                                    .links
                                    .forgotPasswordPath
                            );
                    }
                );

                await test.step(
                    'Open Reset Password page',
                    async () => {
                        await b2bLoginPage
                            .openForgotPasswordPage(
                                b2bForgotPasswordData
                                    .page
                                    .path
                            );
                    }
                );

                await test.step(
                    'Verify Reset Password URL title heading and instruction',
                    async () => {
                        await forgotPasswordPage
                            .verifyPage(
                                b2bForgotPasswordData
                                    .page
                            );
                    }
                );

                await test.step(
                    'Verify Reset Password breadcrumb',
                    async () => {
                        await forgotPasswordPage
                            .verifyBreadcrumb(
                                b2bForgotPasswordData
                                    .breadcrumb
                            );
                    }
                );

                await test.step(
                    'Verify Reset Password public Header',
                    async () => {
                        await forgotPasswordPage
                            .verifyPublicHeader(
                                b2bForgotPasswordData
                                    .header
                            );
                    }
                );

                await test.step(
                    'Verify Reset Password form structure',
                    async () => {
                        await forgotPasswordPage
                            .verifyForm(
                                b2bForgotPasswordData
                                    .form
                            );
                    }
                );

                await test.step(
                    'Verify User name or email address field',
                    async () => {
                        await forgotPasswordPage
                            .verifyUsernameOrEmailField(
                                b2bForgotPasswordData
                                    .field
                            );
                    }
                );

                await test.step(
                    'Verify Reset Password Submit button without clicking',
                    async () => {
                        await forgotPasswordPage
                            .verifySubmitButton(
                                b2bForgotPasswordData
                                    .button
                            );
                    }
                );

                await test.step(
                    'Inspect the Reset Password page for a Drupal environment warning',
                    async () => {
                        detectedEnvironmentIssue =
                            await forgotPasswordPage
                                .inspectUnexpectedError(
                                    b2bForgotPasswordData
                                        .errorMonitoring
                                );

                        if (
                            detectedEnvironmentIssue
                                .visible
                        ) {
                            console.warn(
                                [
                                    'Known Reset Password environment warning detected.',
                                    'Matched warning categories:',
                                    detectedEnvironmentIssue
                                        .matchedKeywords
                                        .join(', ') ||
                                        'No configured keyword matched.'
                                ].join(' ')
                            );

                            expect(
                                detectedEnvironmentIssue
                                    .matchedKeywords
                                    .length,
                                'Visible Drupal warning should match at least one configured environment-warning keyword'
                            ).toBeGreaterThan(0);
                        }
                    }
                );

                await test.step(
                    'Confirm no password reset request was submitted',
                    async () => {
                        await forgotPasswordPage
                            .verifyNoResetRequestSubmitted(
                                b2bForgotPasswordData
                                    .page
                                    .path,

                                b2bForgotPasswordData
                                    .safety
                            );
                    }
                );

                await test.step(
                    'Verify Reset Password Footer',
                    async () => {
                        await forgotPasswordPage
                            .verifyFooter(
                                b2bForgotPasswordData
                                    .footer
                            );
                    }
                );

                await test.step(
                    'Confirm the test remains on the Reset Password page',
                    async () => {
                        await expect(page).toHaveURL(
                            url =>
                                url.pathname ===
                                b2bForgotPasswordData
                                    .page
                                    .path
                        );

                        await expect(
                            forgotPasswordPage
                                .resetForm
                        ).toBeVisible();

                        await expect(
                            forgotPasswordPage
                                .usernameOrEmailInput
                        ).toHaveValue('');

                        await expect(
                            forgotPasswordPage
                                .submitButton
                        ).toBeVisible();
                    }
                );

                await test.step(
                    'Record Reset Password validation outcome',
                    async () => {
                        if (
                            detectedEnvironmentIssue
                                .visible
                        ) {
                            console.warn(
                                'Reset Password controls passed validation, but the website displayed a known Drupal environment warning.'
                            );
                        } else {
                            console.log(
                                'Reset Password controls passed validation and no Drupal environment warning was displayed.'
                            );
                        }
                    }
                );
            }
        );
    }
);