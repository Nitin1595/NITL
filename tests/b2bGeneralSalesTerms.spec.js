const path = require('path');

const {
    test,
    expect
} = require('@playwright/test');

require('dotenv').config({
    path: path.resolve(
        process.cwd(),
        '.env'
    ),
    quiet: true,
    override: true
});

const {
    B2BLoginPage
} = require('../pages/B2BLoginPage');

const {
    B2BGeneralSalesTermsPage
} = require(
    '../pages/b2b/B2BGeneralSalesTermsPage'
);

const b2bLoginData = require(
    '../testData/b2bLoginData.json'
);

const b2bGeneralSalesTermsData = require(
    '../testData/b2bGeneralSalesTermsData.json'
);

test.describe(
    'Nestle International Travel Retail B2B General Sales and Delivery Terms',
    () => {
        test(
            'Validate General Sales and Delivery Terms page and document links',
            async ({ page }) => {
                const b2bLoginPage =
                    new B2BLoginPage(page);

                const generalSalesTermsPage =
                    new B2BGeneralSalesTermsPage(
                        page
                    );

                const username =
                    process.env.B2B_USERNAME
                        ?.trim();

                const password =
                    process.env.B2B_PASSWORD;

                expect(
                    username,
                    'B2B_USERNAME is missing from the project .env file'
                ).toBeTruthy();

                expect(
                    password,
                    'B2B_PASSWORD is missing from the project .env file'
                ).toBeTruthy();

                await test.step(
                    'Open Home page for B2B authentication',
                    async () => {
                        await b2bLoginPage.navigate(
                            b2bLoginData
                                .backgroundPagePath
                        );
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
                    'Enter B2B credentials securely from environment file',
                    async () => {
                        await b2bLoginPage
                            .fillCredentials(
                                username,
                                password
                            );

                        await b2bLoginPage
                            .verifyCredentialsEntered();
                    }
                );

                await test.step(
                    'Submit B2B Login form',
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
                    'Open General Sales and Delivery Terms page',
                    async () => {
                        await generalSalesTermsPage
                            .openPage(
                                b2bGeneralSalesTermsData
                                    .page
                                    .path
                            );
                    }
                );

                await test.step(
                    'Verify Terms page URL title heading and content',
                    async () => {
                        await generalSalesTermsPage
                            .verifyPage(
                                b2bGeneralSalesTermsData
                                    .page
                            );
                    }
                );

                await test.step(
                    'Verify Terms page Header',
                    async () => {
                        await generalSalesTermsPage
                            .verifyHeader(
                                b2bGeneralSalesTermsData
                                    .header
                            );
                    }
                );

                await test.step(
                    'Verify Terms page breadcrumb',
                    async () => {
                        await generalSalesTermsPage
                            .verifyBreadcrumb(
                                b2bGeneralSalesTermsData
                                    .breadcrumb
                            );
                    }
                );

                await test.step(
                    'Verify expected PDF document count',
                    async () => {
                        await generalSalesTermsPage
                            .verifyDocumentCount(
                                b2bGeneralSalesTermsData
                                    .expectedDocumentCount
                            );
                    }
                );

                await test.step(
                    'Verify General Sales and Delivery Terms PDF link',
                    async () => {
                        await generalSalesTermsPage
                            .verifyDocuments([
                                b2bGeneralSalesTermsData
                                    .documents[0]
                            ]);
                    }
                );

                await test.step(
                    'Verify Storage and Transportation Conditions PDF link',
                    async () => {
                        await generalSalesTermsPage
                            .verifyDocuments([
                                b2bGeneralSalesTermsData
                                    .documents[1]
                            ]);
                    }
                );

                await test.step(
                    'Verify documents remain link-validation only',
                    async () => {
                        await generalSalesTermsPage
                            .verifyDocumentLinksOnly(
                                b2bGeneralSalesTermsData
                                    .safety
                            );

                        await expect(page).toHaveURL(
                            url =>
                                url.pathname ===
                                b2bGeneralSalesTermsData
                                    .page
                                    .path
                        );
                    }
                );

                await test.step(
                    'Verify authenticated Terms page Footer',
                    async () => {
                        await generalSalesTermsPage
                            .verifyFooter(
                                b2bGeneralSalesTermsData
                                    .footer
                            );
                    }
                );

                await test.step(
                    'Verify Terms page Log out link',
                    async () => {
                        await generalSalesTermsPage
                            .verifyLogoutLink(
                                b2bGeneralSalesTermsData
                                    .footer
                                    .logoutText,

                                b2bGeneralSalesTermsData
                                    .footer
                                    .logoutPathPrefix
                            );
                    }
                );

                await test.step(
                    'Log out after Terms page validation',
                    async () => {
                        await generalSalesTermsPage
                            .logout();
                    }
                );

                await test.step(
                    'Verify B2B session is closed successfully',
                    async () => {
                        await generalSalesTermsPage
                            .verifyLoggedOut(
                                b2bGeneralSalesTermsData
                                    .page
                                    .path
                            );
                    }
                );
            }
        );
    }
);