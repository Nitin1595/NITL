const {
    test,
    expect
} = require('@playwright/test');

const {
    ProductsPage
} = require('../pages/ProductsPage');

const productsPageData = require(
    '../testData/productsPageData.json'
);

test.describe(
    'Nestlé International Travel Retail Products Page',
    () => {
        test(
            'Validate all Products page components and functionality',
            async ({ page }) => {
                const productsPage =
                    new ProductsPage(page);

                await test.step(
                    'Navigate to Products page',
                    async () => {
                        await productsPage.navigate(
                            productsPageData.pagePath
                        );

                        await productsPage
                            .verifyProductsPageNavigation(
                                productsPageData.expectedTitle,
                                productsPageData.paths.products
                            );
                    }
                );

                await test.step(
                    'Verify Products page breadcrumb',
                    async () => {
                        await productsPage.verifyBreadcrumb(
                            productsPageData.breadcrumb
                        );
                    }
                );

                await test.step(
                    'Verify Our Products heading',
                    async () => {
                        await productsPage.verifyMainHeading(
                            productsPageData.headings.main
                        );
                    }
                );

                await test.step(
                    'Verify Header components',
                    async () => {
                        await productsPage.header
                            .verifyHeaderDisplayed();

                        await productsPage.header
                            .verifyLogoDisplayed();

                        await productsPage.header
                            .verifyNavigationDisplayed();

                        await productsPage.header
                            .verifySearchButtonDisplayed();
                    }
                );

                await test.step(
                    'Verify all brand filters',
                    async () => {
                        await productsPage.verifyBrandFilters(
                            productsPageData.brands
                        );
                    }
                );

                await test.step(
                    'Verify Products search controls',
                    async () => {
                        await productsPage
                            .verifySearchControls(
                                productsPageData
                                    .search
                                    .placeholder
                            );
                    }
                );

                await test.step(
                    'Verify product cards',
                    async () => {
                        await productsPage.verifyProductCards(
                            productsPageData
                                .minimumProductCount
                        );
                    }
                );

                await test.step(
                    'Verify product images',
                    async () => {
                        await productsPage
                            .verifyProductImages();
                    }
                );

                await test.step(
                    'Verify product names',
                    async () => {
                        await productsPage
                            .verifyProductNames();
                    }
                );

                await test.step(
                    'Verify expected Products',
                    async () => {
                        await productsPage
                            .verifyExpectedProducts(
                                productsPageData
                                    .expectedProducts
                            );
                    }
                );

                await test.step(
                    'Verify View product links',
                    async () => {
                        await productsPage
                            .verifyViewProductButtons();
                    }
                );

                await test.step(
                    'Verify Products pagination',
                    async () => {
                        await productsPage
                            .verifyPaginationDisplayed();
                    }
                );

                await test.step(
                    'Verify Footer components',
                    async () => {
                        await productsPage.footer
                            .verifyFooterNavigationDisplayed();
                    }
                );

                await test.step(
                    'Search for a product',
                    async () => {
                        const searchTerm =
                            productsPageData
                                .search
                                .validSearchTerm;

                        await productsPage.searchForProduct(
                            searchTerm
                        );

                        await productsPage
                            .verifySearchResults(
                                searchTerm
                            );
                    }
                );

                await test.step(
                    'Clear the Products search',
                    async () => {
                        await productsPage
                            .clearProductSearch();

                        await productsPage
                            .verifyProductCards(
                                productsPageData
                                    .minimumProductCount
                            );
                    }
                );

                await test.step(
                    'Filter products by brand',
                    async () => {
                        const selectedBrand =
                            productsPageData
                                .search
                                .validSearchTerm;

                        await productsPage.selectBrand(
                            selectedBrand
                        );

                        await productsPage
                            .verifySelectedBrand(
                                selectedBrand
                            );

                        /*
                         * Validate only the Products pathname.
                         * The brand query parameter is generated
                         * dynamically by the website.
                         */
                        await expect(page).toHaveURL(
                            url =>
                                url.pathname ===
                                productsPageData
                                    .paths
                                    .products
                        );

                        await productsPage
                            .verifyProductCards(
                                productsPageData
                                    .minimumProductCount
                            );
                    }
                );

                await test.step(
                    'Return to All brands',
                    async () => {
                        const allBrands =
                            productsPageData.brands[0];

                        await productsPage.selectBrand(
                            allBrands
                        );

                        /*
                         * The website returns a dynamic URL such as:
                         * /products?search=&brand=All
                         *
                         * Therefore, validate only the pathname
                         * and allow dynamic query parameters.
                         */
                        await expect(page).toHaveURL(
                            url =>
                                url.pathname ===
                                productsPageData
                                    .paths
                                    .products
                        );

                        await productsPage
                            .verifyProductCards(
                                productsPageData
                                    .minimumProductCount
                            );
                    }
                );

                await test.step(
                    'Verify next-page navigation',
                    async () => {
                        await productsPage
                            .verifyPaginationDisplayed();

                        await productsPage
                            .navigateToNextPage();

                        /*
                         * Confirm that page 2 is selected using
                         * the dynamically generated page parameter.
                         */
                        await expect(page).toHaveURL(
                            url =>
                                url.pathname ===
                                    productsPageData
                                        .paths
                                        .products &&
                                url.searchParams.get(
                                    'page'
                                ) === '1'
                        );

                        await productsPage
                            .verifyProductCards(
                                productsPageData
                                    .minimumProductCount
                            );
                    }
                );
            }
        );
    }
);
