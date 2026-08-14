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
    B2BCatalogPage
} = require(
    '../pages/b2b/B2BCatalogPage'
);

const b2bLoginData = require(
    '../testData/b2bLoginData.json'
);

const b2bCatalogData = require(
    '../testData/b2bCatalogData.json'
);

test.describe(
    'Nestle International Travel Retail B2B Catalog',
    () => {
        test(
            'Validate authenticated B2B Product Catalog',
            async ({ page }) => {
                const b2bLoginPage =
                    new B2BLoginPage(page);

                const b2bCatalogPage =
                    new B2BCatalogPage(page);

                const username =
                    process.env.B2B_USERNAME?.trim();

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
                    'Enter B2B credentials from environment file',
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
                    'Open authenticated B2B Catalog',
                    async () => {
                        await b2bCatalogPage
                            .openCatalog(
                                b2bCatalogData
                                    .pagePath
                            );
                    }
                );

                await test.step(
                    'Verify Catalog URL title and heading',
                    async () => {
                        await b2bCatalogPage
                            .verifyPage(
                                b2bCatalogData
                                    .expectedTitle,

                                b2bCatalogData
                                    .paths
                                    .catalog
                            );
                    }
                );

                await test.step(
                    'Verify Catalog breadcrumb',
                    async () => {
                        await b2bCatalogPage
                            .verifyBreadcrumb(
                                b2bCatalogData
                                    .breadcrumb
                            );
                    }
                );

                await test.step(
                    'Verify Dashboard navigation menu',
                    async () => {
                        await b2bCatalogPage
                            .verifyDashboardNavigation(
                                b2bCatalogData
                                    .dashboardNavigation
                            );
                    }
                );

                await test.step(
                    'Verify active Products tab',
                    async () => {
                        await b2bCatalogPage
                            .verifyActiveProductsTab();
                    }
                );

                await test.step(
                    'Verify Brand Search and Sort filters',
                    async () => {
                        await b2bCatalogPage
                            .verifyFilters(
                                b2bCatalogData
                                    .filters,

                                b2bCatalogData
                                    .brands
                            );
                    }
                );

                await test.step(
                    'Verify Catalog product summary and totals',
                    async () => {
                        await b2bCatalogPage
                            .verifyProductSummary(
                                b2bCatalogData
                                    .productSummary
                            );
                    }
                );

                await test.step(
                    'Verify Catalog brand sections',
                    async () => {
                        await b2bCatalogPage
                            .verifyBrandSections(
                                b2bCatalogData
                                    .brands
                            );
                    }
                );

                await test.step(
                    'Verify every Catalog product card',
                    async () => {
                        await b2bCatalogPage
                            .verifyEveryProductCard(
                                b2bCatalogData
                                    .productSummary
                                    .expectedTotal
                            );
                    }
                );

                await test.step(
                    'Verify initial bulk selection state',
                    async () => {
                        await b2bCatalogPage
                            .verifyInitialBulkState(
                                b2bCatalogData
                                    .bulkActions
                            );
                    }
                );

                await test.step(
                    'Select and deselect first Catalog product',
                    async () => {
                        await b2bCatalogPage
                            .selectAndDeselectFirstProduct(
                                b2bCatalogData
                                    .bulkActions
                            );
                    }
                );

                await test.step(
                    'Verify Select All and Deselect All functionality',
                    async () => {
                        await b2bCatalogPage
                            .verifySelectAll(
                                b2bCatalogData
                                    .productSummary
                                    .expectedTotal
                            );
                    }
                );

                await test.step(
                    'Verify Catalog download controls',
                    async () => {
                        await b2bCatalogPage
                            .verifyDownloadControls(
                                b2bCatalogData
                                    .bulkActions
                            );
                    }
                );

                await test.step(
                    'Verify authenticated Footer and Logout link',
                    async () => {
                        await b2bCatalogPage
                            .verifyFooterAndLogout(
                                b2bCatalogData
                                    .paths
                                    .logoutPrefix
                            );
                    }
                );

                await test.step(
                    'Log out from B2B Catalog',
                    async () => {
                        await b2bCatalogPage
                            .logout();
                    }
                );

                await test.step(
                    'Verify B2B Catalog session is closed',
                    async () => {
                        await b2bCatalogPage
                            .verifyLoggedOut();
                    }
                );
            }
        );
    }
);