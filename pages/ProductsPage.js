const { expect } = require('@playwright/test');

const {
    HeaderComponent
} = require('./components/HeaderComponent');

const {
    FooterComponent
} = require('./components/FooterComponent');

const {
    CookieConsentComponent
} = require('./components/CookieConsentComponent');

class ProductsPage {
    constructor(page) {
        this.page = page;

        // Reusable website components
        this.header = new HeaderComponent(page);
        this.footer = new FooterComponent(page);
        this.cookieConsent =
            new CookieConsentComponent(page);

        // Main Products page container
        this.productsView = page.locator(
            '.view-products-search'
        );

        // Breadcrumb
        this.breadcrumb = page.locator(
            'nav[aria-label="breadcrumb"]'
        );

        this.homeBreadcrumbLink =
            this.breadcrumb.getByRole(
                'link',
                {
                    name: 'Home',
                    exact: true
                }
            );

        this.currentBreadcrumb =
            this.breadcrumb.locator(
                '.breadcrumb-item.active'
            );

        // Main heading
        this.mainHeading =
            this.productsView.getByRole(
                'heading',
                {
                    name: 'Our Products',
                    exact: true
                }
            );

        /*
         * Desktop brand filters.
         * The website has duplicate filters for mobile.
         * Scoping to the desktop section avoids strict-mode errors.
         */
        this.desktopBrandFilters =
            this.productsView.locator(
                '.d-none.d-sm-block'
            );

        this.brandFilterLinks =
            this.desktopBrandFilters.locator(
                '#edit-brand a'
            );

        this.allBrandsFilter =
            this.desktopBrandFilters.getByRole(
                'link',
                {
                    name: 'All brands',
                    exact: true
                }
            );

        // Mobile brand-filter button
        this.mobileFilterButton =
            this.productsView.getByRole(
                'button',
                {
                    name: /filter by brands/i
                }
            );

        /*
         * Products search form.
         * This is scoped to the Products page form so that
         * Playwright does not select the Header search field.
         */
        this.productsSearchForm =
            this.productsView.locator(
                'form#views-exposed-form-products-search-solr-search'
            );

        this.productsSearchInput =
            this.productsSearchForm.locator(
                'input.search-products__input'
            );

        this.productsSearchButton =
            this.productsSearchForm.locator(
                'button.search-products__icon'
            );

        // Product-results section
        this.productsContainer =
            this.productsView.locator(
                '.view-content'
            );

        this.productCards =
            this.productsContainer.locator(
                'article.dsu-product'
            );

        this.productImages =
            this.productCards.locator(
                'img'
            );

        this.productNames =
            this.productCards.locator(
                '.field--name-title'
            );

        this.productNameLinks =
            this.productCards.locator(
                'a.link-text'
            );

        this.viewProductButtons =
            this.productCards.locator(
                'a.card__btn'
            );

        // Pagination
        this.pagination =
            this.productsView.locator(
                'nav.pager-nav'
            );

        this.currentPage =
            this.pagination.locator(
                '.page-item.active a.page-link'
            );

        this.nextPageLink =
            this.pagination.locator(
                'a[title="Go to next page"]'
            );

        this.lastPageLink =
            this.pagination.locator(
                'a[title="Go to last page"]'
            );
    }

    async navigate(pagePath) {
        await this.page.goto(pagePath, {
            waitUntil: 'domcontentloaded'
        });

        await this.cookieConsent.acceptAllCookies();

        await expect(
            this.productsView
        ).toBeVisible();
    }

    async verifyProductsPageNavigation(
        expectedTitle,
        productsPath
    ) {
        /*
         * Validate only the pathname because the website can add
         * dynamic search, brand, and pagination query parameters.
         */
        await expect(this.page).toHaveURL(
            new RegExp(
                `${productsPath}/?(?:\\?.*)?$`
            )
        );

        await expect(this.page).toHaveTitle(
            expectedTitle
        );
    }

    async verifyBreadcrumb(expectedBreadcrumb) {
        await expect(
            this.breadcrumb
        ).toBeVisible();

        await expect(
            this.homeBreadcrumbLink
        ).toBeVisible();

        await expect(
            this.homeBreadcrumbLink
        ).toHaveAttribute(
            'href',
            '/'
        );

        await expect(
            this.currentBreadcrumb
        ).toHaveText(
            expectedBreadcrumb.currentPage
        );
    }

    async verifyMainHeading(expectedHeading) {
        await expect(
            this.mainHeading
        ).toBeVisible();

        await expect(
            this.mainHeading
        ).toHaveText(expectedHeading);
    }

    getBrandFilter(brandName) {
        return this.desktopBrandFilters.getByRole(
            'link',
            {
                name: brandName,
                exact: true
            }
        );
    }

    async verifyBrandFilters(expectedBrands) {
        await expect(
            this.desktopBrandFilters
        ).toBeVisible();

        for (const brandName of expectedBrands) {
            const brandFilter =
                this.getBrandFilter(brandName);

            await expect(
                brandFilter,
                `Brand filter should be visible: ${brandName}`
            ).toBeVisible();
        }
    }

    async selectBrand(brandName) {
        await this.cookieConsent.acceptAllCookies();

        const brandFilter =
            this.getBrandFilter(brandName);

        await expect(
            brandFilter
        ).toBeVisible();

        await brandFilter.click();

        await this.page.waitForLoadState(
            'domcontentloaded'
        );

        await expect(
            this.productsContainer
        ).toBeVisible();
    }

    async verifySelectedBrand(brandName) {
        const selectedBrand =
            this.getBrandFilter(brandName);

        await expect(
            selectedBrand
        ).toHaveClass(/bef-link-active/);
    }

    async verifySearchControls(
        expectedPlaceholder
    ) {
        await expect(
            this.productsSearchInput
        ).toBeVisible();

        await expect(
            this.productsSearchInput
        ).toBeEnabled();

        await expect(
            this.productsSearchInput
        ).toHaveAttribute(
            'placeholder',
            expectedPlaceholder
        );

        await expect(
            this.productsSearchButton
        ).toBeVisible();

        await expect(
            this.productsSearchButton
        ).toBeEnabled();
    }

    async searchForProduct(searchTerm) {
        await this.cookieConsent.acceptAllCookies();

        await this.productsSearchInput.fill(
            searchTerm
        );

        await this.productsSearchButton.click();

        await this.page.waitForLoadState(
            'domcontentloaded'
        );

        await expect(
            this.productsContainer
        ).toBeVisible();
    }

    async clearProductSearch() {
        await this.cookieConsent.acceptAllCookies();

        await this.productsSearchInput.fill('');

        await this.productsSearchButton.click();

        await this.page.waitForLoadState(
            'domcontentloaded'
        );

        await expect(
            this.productsContainer
        ).toBeVisible();
    }

    async verifyProductCards(
        minimumProductCount
    ) {
        await this.productsContainer
            .scrollIntoViewIfNeeded();

        await expect(
            this.productsContainer
        ).toBeVisible();

        const productCount =
            await this.productCards.count();

        expect(
            productCount,
            `Expected at least ${minimumProductCount} product card`
        ).toBeGreaterThanOrEqual(
            minimumProductCount
        );

        await expect(
            this.productCards.first()
        ).toBeVisible();
    }

    async verifyProductImages() {
        const productCount =
            await this.productCards.count();

        expect(
            productCount,
            'At least one product should be displayed'
        ).toBeGreaterThan(0);

        for (
            let index = 0;
            index < productCount;
            index += 1
        ) {
            const productImage =
                this.productCards
                    .nth(index)
                    .locator('img');

            await expect(
                productImage,
                `Product image ${index + 1} should be visible`
            ).toBeVisible();

            await expect(
                productImage
            ).toHaveAttribute(
                'src',
                /.+/
            );
        }
    }

    async verifyProductNames() {
        const productCount =
            await this.productCards.count();

        expect(
            productCount,
            'At least one product should be displayed'
        ).toBeGreaterThan(0);

        for (
            let index = 0;
            index < productCount;
            index += 1
        ) {
            const productName =
                this.productCards
                    .nth(index)
                    .locator(
                        '.field--name-title'
                    );

            await expect(
                productName,
                `Product name ${index + 1} should be visible`
            ).toBeVisible();

            const productNameText =
                await productName.textContent();

            expect(
                productNameText?.trim().length,
                `Product name ${index + 1} should not be empty`
            ).toBeGreaterThan(0);
        }
    }

    async verifyExpectedProducts(
        expectedProducts
    ) {
        for (
            const expectedProduct
            of expectedProducts
        ) {
            const productName =
                this.productsContainer.getByText(
                    expectedProduct,
                    {
                        exact: true
                    }
                );

            await expect(
                productName,
                `Expected product should be displayed: ${expectedProduct}`
            ).toBeVisible();
        }
    }

    async verifyViewProductButtons() {
        const productCount =
            await this.productCards.count();

        expect(
            productCount,
            'At least one product should be displayed'
        ).toBeGreaterThan(0);

        const buttonCount =
            await this.viewProductButtons.count();

        expect(
            buttonCount,
            'Every product card should have a View product link'
        ).toBe(productCount);

        /*
         * The website keeps View product links hidden using CSS.
         * Validate every link in the DOM without hovering.
         */
        for (
            let index = 0;
            index < buttonCount;
            index += 1
        ) {
            const viewProductButton =
                this.viewProductButtons.nth(index);

            await expect(
                viewProductButton,
                `View product link ${index + 1} should exist`
            ).toBeAttached();

            await expect(
                viewProductButton,
                `View product link ${index + 1} should have correct text`
            ).toHaveText(/view product/i);

            await expect(
                viewProductButton,
                `View product link ${index + 1} should have a valid URL`
            ).toHaveAttribute(
                'href',
                /^\/products\/.+/
            );
        }

        /*
         * Product-name links are visible to the user and navigate
         * to the same product-detail pages.
         */
        const firstProductNameLink =
            this.productNameLinks.first();

        await firstProductNameLink
            .scrollIntoViewIfNeeded();

        await expect(
            firstProductNameLink,
            'First product name link should be visible'
        ).toBeVisible();

        await expect(
            firstProductNameLink,
            'First product name link should have a valid URL'
        ).toHaveAttribute(
            'href',
            /^\/products\/.+/
        );
    }

    async verifySearchResults(searchTerm) {
        const productCount =
            await this.productCards.count();

        expect(
            productCount,
            `Expected results for search term: ${searchTerm}`
        ).toBeGreaterThan(0);

        const displayedProductNames =
            await this.productNames
                .allTextContents();

        const matchingProducts =
            displayedProductNames.filter(
                productName =>
                    productName
                        .toLowerCase()
                        .includes(
                            searchTerm.toLowerCase()
                        )
            );

        expect(
            matchingProducts.length,
            `Expected a product containing: ${searchTerm}`
        ).toBeGreaterThan(0);
    }

    async verifyPaginationDisplayed() {
        await this.pagination
            .scrollIntoViewIfNeeded();

        await expect(
            this.pagination
        ).toBeVisible();

        await expect(
            this.currentPage
        ).toBeVisible();

        await expect(
            this.nextPageLink
        ).toBeVisible();

        await expect(
            this.lastPageLink
        ).toBeVisible();
    }

    async navigateToNextPage() {
        await this.nextPageLink.click();

        await this.page.waitForLoadState(
            'domcontentloaded'
        );

        await expect(this.page).toHaveURL(
            url =>
                url.pathname === '/products' &&
                url.searchParams.get('page') === '1'
        );

        await expect(
            this.productsContainer
        ).toBeVisible();
    }

    async openFirstProduct() {
        const firstProductNameLink =
            this.productNameLinks.first();

        await firstProductNameLink
            .scrollIntoViewIfNeeded();

        await expect(
            firstProductNameLink,
            'First product name link should be visible'
        ).toBeVisible();

        const productPath =
            await firstProductNameLink.getAttribute(
                'href'
            );

        expect(
            productPath,
            'First product should have a valid navigation path'
        ).toMatch(/^\/products\/.+/);

        await firstProductNameLink.click();

        await this.page.waitForLoadState(
            'domcontentloaded'
        );

        await expect(this.page).toHaveURL(
            url => url.pathname === productPath
        );
    }
}

module.exports = { ProductsPage };
