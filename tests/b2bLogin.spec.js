const { test } = require('@playwright/test');

require('dotenv').config({
    quiet: true
});

const {
    B2BLoginPage
} = require('../pages/B2BLoginPage');

const {
    B2BDashboardPage
} = require(
    '../pages/b2b/B2BDashboardPage'
);

const b2bLoginData = require(
    '../testData/b2bLoginData.json'
);

const b2bDashboardData = require(
    '../testData/b2bDashboardData.json'
);

test.describe(
    'Nestlé International Travel Retail B2B Authentication',
    () => {
        test(
            'Validate B2B Login, Dashboard and Logout flow',
            async ({ page }) => {
                const b2bLoginPage =
                    new B2BLoginPage(page);

                const b2bDashboardPage =
                    new B2BDashboardPage(page);

                const b2bUsername =
                    process.env.B2B_USERNAME;

                const b2bPassword =
                    process.env.B2B_PASSWORD;

                test.skip(
                    !b2bUsername ||
                        !b2bPassword,
                    'B2B credentials are not configured in .env'
                );

                await test.step(
                    'Open Home page as B2B modal background',
                    async () => {
                        await b2bLoginPage.navigate(
                            b2bLoginData
                                .backgroundPagePath
                        );
                    }
                );

                await test.step(
                    'Verify public Header before B2B Login',
                    async () => {
                        await b2bLoginPage.header
                            .verifyHeaderDisplayed();

                        await b2bLoginPage.header
                            .verifyLogoDisplayed();

                        await b2bLoginPage.header
                            .verifyNavigationDisplayed();

                        await b2bLoginPage.header
                            .verifySearchButtonDisplayed();
                    }
                );

                await test.step(
                    'Open B2B Login modal from Header',
                    async () => {
                        await b2bLoginPage
                            .openLoginModal();
                    }
                );

                await test.step(
                    'Verify B2B Login modal heading and instruction',
                    async () => {
                        await b2bLoginPage
                            .verifyModalDisplayed(
                                b2bLoginData.modal
                            );
                    }
                );

                await test.step(
                    'Verify B2B username field',
                    async () => {
                        await b2bLoginPage
                            .verifyUsernameField(
                                b2bLoginData.fields,
                                b2bLoginData.validation
                            );
                    }
                );

                await test.step(
                    'Verify B2B password field is masked',
                    async () => {
                        await b2bLoginPage
                            .verifyPasswordField(
                                b2bLoginData.fields,
                                b2bLoginData.validation
                            );
                    }
                );

                await test.step(
                    'Verify B2B fields are initially empty',
                    async () => {
                        await b2bLoginPage
                            .verifyFieldsInitiallyEmpty();
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
                    'Verify B2B Login button',
                    async () => {
                        await b2bLoginPage
                            .verifyLoginButton(
                                b2bLoginData
                                    .buttons
                                    .login
                            );
                    }
                );

                await test.step(
                    'Verify B2B modal Close button',
                    async () => {
                        await b2bLoginPage
                            .verifyCloseButton();
                    }
                );

                await test.step(
                    'Enter B2B credentials securely',
                    async () => {
                        await b2bLoginPage
                            .fillCredentials(
                                b2bUsername,
                                b2bPassword
                            );

                        await b2bLoginPage
                            .verifyCredentialsEntered();
                    }
                );

                await test.step(
                    'Submit valid B2B credentials',
                    async () => {
                        await b2bLoginPage
                            .submitLogin(
                                b2bLoginData
                                    .paths
                                    .dashboard
                            );
                    }
                );

                await test.step(
                    'Verify successful B2B authentication',
                    async () => {
                        await b2bDashboardPage
                            .verifyDashboardNavigation(
                                b2bDashboardData
                                    .expectedTitle,

                                b2bDashboardData
                                    .paths
                                    .dashboard
                            );

                        await b2bDashboardPage
                            .verifyAuthenticatedState();
                    }
                );

                await test.step(
                    'Verify B2B Dashboard breadcrumb',
                    async () => {
                        await b2bDashboardPage
                            .verifyBreadcrumb(
                                b2bDashboardData
                                    .breadcrumb
                            );
                    }
                );

                await test.step(
                    'Verify B2B Dashboard heading and description',
                    async () => {
                        await b2bDashboardPage
                            .verifyDashboardHeading(
                                b2bDashboardData
                                    .headings
                                    .main,

                                b2bDashboardData
                                    .descriptionKeyword
                            );
                    }
                );

                await test.step(
                    'Verify B2B Dashboard navigation menu',
                    async () => {
                        await b2bDashboardPage
                            .verifyDashboardMenu(
                                b2bDashboardData
                                    .navigation
                            );
                    }
                );

                await test.step(
                    'Verify active Dashboard tab',
                    async () => {
                        await b2bDashboardPage
                            .verifyActiveDashboardTab();
                    }
                );

                await test.step(
                    'Verify authenticated Header navigation',
                    async () => {
                        await b2bDashboardPage
                            .verifyAuthenticatedHeader();
                    }
                );

                await test.step(
                    'Verify B2B Dashboard information message',
                    async () => {
                        await b2bDashboardPage
                            .verifyInformationMessage(
                                b2bDashboardData
                                    .message
                            );
                    }
                );

                await test.step(
                    'Verify Latest Updates filter',
                    async () => {
                        await b2bDashboardPage
                            .verifyLatestUpdatesFilter(
                                b2bDashboardData
                                    .updates
                            );
                    }
                );

                await test.step(
                    'Verify latest product updates',
                    async () => {
                        await b2bDashboardPage
                            .verifyProductUpdates(
                                b2bDashboardData
                                    .updates
                                    .minimumUpdateCount
                            );
                    }
                );

                await test.step(
                    'Verify product update dates',
                    async () => {
                        await b2bDashboardPage
                            .verifyProductUpdateDates();
                    }
                );

                await test.step(
                    'Verify authenticated Footer',
                    async () => {
                        await b2bDashboardPage
                            .verifyAuthenticatedFooter();
                    }
                );

                await test.step(
                    'Verify B2B Log out link',
                    async () => {
                        await b2bDashboardPage
                            .verifyLogoutLink(
                                b2bDashboardData
                                    .footer
                                    .logoutText,

                                b2bDashboardData
                                    .paths
                                    .logoutPrefix
                            );
                    }
                );

                await test.step(
                    'Log out from B2B Dashboard',
                    async () => {
                        await b2bDashboardPage
                            .logout();
                    }
                );

                await test.step(
                    'Verify B2B session is closed',
                    async () => {
                        await b2bDashboardPage
                            .verifyLoggedOut();
                    }
                );
            }
        );
    }
);