const { expect } = require('@playwright/test');

class B2BCatalogPage {
    constructor(page) {
        this.page = page;

        this.catalogView = page.locator(
            '.view-catalog-pdh-solr'
        );

        this.heading = this.catalogView.getByRole(
            'heading',
            {
                name: 'Products',
                level: 1,
                exact: true
            }
        );

        this.breadcrumbItems = page.locator(
            'nav[aria-label="breadcrumb"] .breadcrumb-item'
        );

        this.dashboardMenu = page.locator(
            '#block-retailx-dashboardmenu'
        );

        this.productsTab = this.dashboardMenu.getByRole(
            'link',
            {
                name: 'Products',
                exact: true
            }
        );

        this.filterForm = page.locator(
            '#views-exposed-form-catalog-pdh-solr-page-1'
        );

        this.brandSelect = this.filterForm.locator(
            '#edit-field-pdh-categories'
        );

        this.searchInput = this.filterForm.locator(
            '#edit-search-api-fulltext'
        );

        this.sortSelect = this.filterForm.locator(
            '#edit-sort-bef-combine'
        );

        this.productSummary = this.catalogView.locator(
            '.view-header'
        );

        this.brandHeadings = this.catalogView.locator(
            'h3.section-title'
        );

        this.productCards = this.catalogView.locator(
            'article.catalog-pdh-product-teaser'
        );

        this.productCheckboxes = page.locator(
            'input.js-vbo-checkbox'
        );

        this.selectAllCheckbox = page.locator(
            '#edit-select-all'
        );

        this.selectAllLabel = page.locator(
            'label[for="edit-select-all"]'
        );

        this.selectedCount = this.selectAllLabel.locator(
            'strong'
        );

        this.downloadSelectedButton = page.locator(
            'button[data-action-id=' +
            '"vbo_nitr_pdh_bulk_assets_download"]'
        );

        this.downloadAllLink = page.locator(
            'a[href="/catalog/download-xlsx"]'
        );

        this.footer = page.locator(
            'footer.site-footer'
        );

        this.logoutLink = this.footer.getByRole(
            'link',
            {
                name: 'Log out',
                exact: true
            }
        );
    }

    async openCatalog(expectedPath) {
        await this.page.goto(expectedPath, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        await expect(
            this.catalogView
        ).toBeVisible({
            timeout: 30000
        });
    }

    async verifyPage(expectedTitle, expectedPath) {
        await expect(this.page).toHaveURL(
            url => url.pathname === expectedPath
        );

        await expect(this.page).toHaveTitle(
            expectedTitle
        );

        await expect(this.heading).toBeVisible();

        await expect(
            this.heading
        ).toHaveText('Products');
    }

    async verifyBreadcrumb(expectedItems) {
        await expect(
            this.breadcrumbItems
        ).toHaveText(expectedItems);
    }

    async verifyDashboardNavigation(
        expectedNavigation
    ) {
        await expect(
            this.dashboardMenu
        ).toBeVisible();

        for (const item of expectedNavigation) {
            const link =
                this.dashboardMenu.getByRole(
                    'link',
                    {
                        name: item.name,
                        exact: true
                    }
                );

            await expect(link).toBeVisible();

            await expect(
                link
            ).toHaveAttribute(
                'href',
                item.path
            );
        }
    }

    async verifyActiveProductsTab() {
        await expect(
            this.productsTab
        ).toHaveClass(/is-active/);

        await expect(
            this.productsTab
        ).toHaveAttribute(
            'aria-current',
            'page'
        );
    }

    async verifyFilters(
        expectedFilters,
        expectedBrands
    ) {
        await expect(
            this.brandSelect
        ).toBeVisible();

        await expect(
            this.brandSelect
        ).toHaveValue(
            expectedFilters.brandDefaultValue
        );

        const brandOptions =
            await this.brandSelect
                .locator('option')
                .allTextContents();

        expect(brandOptions).toEqual(
            expect.arrayContaining([
                expectedFilters.brandDefaultText,
                ...expectedBrands
            ])
        );

        await expect(
            this.searchInput
        ).toBeVisible();

        await expect(
            this.searchInput
        ).toHaveAttribute(
            'placeholder',
            expectedFilters.searchPlaceholder
        );

        await expect(
            this.searchInput
        ).toHaveAttribute(
            'maxlength',
            expectedFilters.searchMaximumLength
        );

        await expect(
            this.sortSelect
        ).toBeVisible();

        await expect(
            this.sortSelect
        ).toHaveValue(
            expectedFilters.sortDefaultValue
        );

        await expect(
            this.sortSelect.locator('option')
        ).toHaveText(
            expectedFilters.sortOptions
        );
    }

    async verifyProductSummary(expectedSummary) {
        await expect(
            this.productSummary
        ).toContainText(expectedSummary.text);

        await expect(
            this.productCards
        ).toHaveCount(
            expectedSummary.expectedTotal
        );

        await expect(
            this.productCheckboxes
        ).toHaveCount(
            expectedSummary.expectedTotal
        );
    }

    async verifyBrandSections(expectedBrands) {
        await expect(
            this.brandHeadings
        ).toHaveText(expectedBrands);
    }

    async verifyEveryProductCard(expectedTotal) {
        const count =
            await this.productCards.count();

        expect(count).toBe(expectedTotal);

        for (
            let index = 0;
            index < count;
            index += 1
        ) {
            const card =
                this.productCards.nth(index);

            const title = card.locator(
                '.field--name-title'
            );

            const gtin = card.locator(
                '.field--name-field-dsu-sku ' +
                '.field__item'
            );

            const image = card.locator('img');

            const detailsLink =
                card.getByRole(
                    'link',
                    {
                        name: 'Details',
                        exact: true
                    }
                );

            const downloadLink = card.locator(
                'a.download-link'
            );

            await expect(title).not.toBeEmpty();

            await expect(
                gtin
            ).toHaveText(/^\d+$/);

            await expect(
                image
            ).toHaveAttribute('src', /.+/);

            await expect(
                detailsLink
            ).toHaveAttribute(
                'href',
                /^\/catalog\/\d+$/
            );

            await expect(
                downloadLink
            ).toHaveAttribute(
                'href',
                /^\/catalog-product-download\/\d+$/
            );
        }
    }

    async setCheckboxState(checkbox, desiredState) {
        await expect(checkbox).toBeAttached();

        const currentState =
            await checkbox.isChecked();

        if (currentState === desiredState) {
            return;
        }

        /*
         * The website visually hides the native checkbox.
         * Native DOM click keeps the website change handlers active
         * without requiring the checkbox to be visually displayed.
         */
        await checkbox.evaluate(
            checkboxElement =>
                checkboxElement.click()
        );

        await expect(checkbox).toBeChecked({
            checked: desiredState,
            timeout: 15000
        });
    }

    async verifyInitialBulkState(
        expectedBulkActions
    ) {
        await this.selectAllLabel
            .scrollIntoViewIfNeeded();

        await expect(
            this.selectAllLabel
        ).toBeVisible();

        await expect(
            this.selectAllCheckbox
        ).not.toBeChecked();

        await expect(
            this.selectAllLabel
        ).toContainText(
            expectedBulkActions.selectAllText
        );

        await expect(
            this.selectedCount
        ).toHaveText(
            expectedBulkActions.initialSelectedText
        );

        await expect(
            this.downloadSelectedButton
        ).toBeDisabled();

        await expect(
            this.downloadAllLink
        ).toHaveAttribute(
            'href',
            expectedBulkActions.downloadAllPath
        );
    }

    async selectAndDeselectFirstProduct(
        expectedBulkActions
    ) {
        const firstCheckbox =
            this.productCheckboxes.first();

        await this.setCheckboxState(
            firstCheckbox,
            true
        );

        await expect(
            this.selectedCount
        ).toHaveText(
            expectedBulkActions.oneSelectedText
        );

        await expect(
            this.downloadSelectedButton
        ).toBeEnabled();

        await this.setCheckboxState(
            firstCheckbox,
            false
        );

        await expect(
            this.selectedCount
        ).toHaveText(
            expectedBulkActions.initialSelectedText
        );

        await expect(
            this.downloadSelectedButton
        ).toBeDisabled();
    }

    async verifySelectAll(expectedTotal) {
        await this.selectAllLabel
            .scrollIntoViewIfNeeded();

        await expect(
            this.selectAllLabel
        ).toBeVisible();

        await this.setCheckboxState(
            this.selectAllCheckbox,
            true
        );

        await expect(
            this.selectAllCheckbox
        ).toBeChecked();

        await expect.poll(
            async () =>
                this.productCheckboxes
                    .evaluateAll(
                        checkboxes =>
                            checkboxes.filter(
                                checkbox =>
                                    checkbox.checked
                            ).length
                    ),
            {
                timeout: 15000
            }
        ).toBe(expectedTotal);

        await expect(
            this.downloadSelectedButton
        ).toBeEnabled();

        await this.setCheckboxState(
            this.selectAllCheckbox,
            false
        );

        await expect(
            this.selectAllCheckbox
        ).not.toBeChecked();

        await expect.poll(
            async () =>
                this.productCheckboxes
                    .evaluateAll(
                        checkboxes =>
                            checkboxes.filter(
                                checkbox =>
                                    checkbox.checked
                            ).length
                    ),
            {
                timeout: 15000
            }
        ).toBe(0);

        await expect(
            this.selectedCount
        ).toHaveText(
            '0 products selected.'
        );

        await expect(
            this.downloadSelectedButton
        ).toBeDisabled();
    }

    async verifyDownloadControls(
        expectedBulkActions
    ) {
        await expect(
            this.downloadSelectedButton
        ).toHaveText(
            expectedBulkActions.downloadSelectedText
        );

        await expect(
            this.downloadAllLink
        ).toBeVisible();

        await expect(
            this.downloadAllLink
        ).toHaveAttribute(
            'href',
            expectedBulkActions.downloadAllPath
        );
    }

    async verifyFooterAndLogout(
        expectedLogoutPrefix
    ) {
        await this.footer.scrollIntoViewIfNeeded();

        await expect(
            this.footer
        ).toBeVisible();

        await expect(
            this.logoutLink
        ).toBeVisible();

        const logoutHref =
            await this.logoutLink.getAttribute(
                'href'
            );

        expect(logoutHref).toBeTruthy();

        expect(
            logoutHref.startsWith(
                expectedLogoutPrefix
            )
        ).toBeTruthy();
    }

    async logout() {
        await this.footer.scrollIntoViewIfNeeded();

        await this.logoutLink.click();

        await this.page.waitForLoadState(
            'domcontentloaded'
        );
    }

    async verifyLoggedOut() {
        await expect(
            this.catalogView
        ).toBeHidden({
            timeout: 15000
        });

        await expect(
            this.logoutLink
        ).toBeHidden({
            timeout: 15000
        });

        await expect(this.page).not.toHaveURL(
            url => url.pathname === '/catalog'
        );
    }
}

module.exports = {
    B2BCatalogPage
};