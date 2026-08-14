

const { expect } = require('@playwright/test');

class B2BDashboardPage {
    constructor(page) {
        this.page = page;

        // Main Dashboard content
        this.dashboardContainer = page.locator(
            '#dashboard'
        );

        this.dashboardTitleSection = page.locator(
            '#block-retailx-dashboardtitle'
        );

        this.dashboardHeading =
            this.dashboardTitleSection.getByRole(
                'heading',
                {
                    name: /Welcome to NITR.*business hub!/i
                }
            );

        this.dashboardDescription =
            this.dashboardTitleSection.locator(
                'p.text-align-center'
            ).first();

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

        // Dashboard navigation menu
        this.dashboardNavigation = page.locator(
            '#block-retailx-dashboardmenu'
        );

        this.dashboardNavigationHeading =
            this.dashboardNavigation.locator(
                '#block-retailx-dashboardmenu-menu'
            );

        this.dashboardTab =
            this.dashboardNavigation.getByRole(
                'link',
                {
                    name: 'Dashboard',
                    exact: true
                }
            );

        // Dashboard information message
        this.messageContainer =
            this.dashboardContainer.locator(
                '.nitr-message-wrapper.type-message'
            );

        this.messageType =
            this.messageContainer.locator(
                '.message-type-label'
            );

        this.messageText =
            this.messageContainer.locator(
                '.nitr-message-text'
            );

        this.messageCloseLink =
            this.messageContainer.locator(
                'a.nitr-message-close'
            );

        // Latest product updates
        this.productUpdatesSection =
            this.dashboardContainer.locator(
                '.dashboard-product-updates-wrapper'
            );

        this.latestUpdatesLabel =
            this.productUpdatesSection.locator(
                'label[for="edit-changed"]'
            );

        this.latestUpdatesSelect =
            this.productUpdatesSection.locator(
                'select#edit-changed'
            );

        this.productUpdateRows =
            this.productUpdatesSection.locator(
                '.view-content .views-row'
            );

        this.productUpdateLinks =
            this.productUpdatesSection.locator(
                'a.product-link'
            );

        this.productUpdateDates =
            this.productUpdatesSection.locator(
                'time.datetime'
            );

        // Authenticated Header
        this.siteHeader = page.locator(
            '#header'
        );

        this.headerLogo =
            this.siteHeader.locator(
                'a.navbar-brand[rel="home"]'
            );

        this.headerProductsLink =
            this.siteHeader.locator(
                'a.nav-link--products'
            );

        this.headerWhoWeAreMenu =
            this.siteHeader.locator(
                'a[data-bs-toggle="dropdown"]'
            );

        this.headerCatalogLink =
            this.siteHeader.locator(
                'a.nav-link--catalog'
            );

        this.headerContactUsLink =
            this.siteHeader.locator(
                'a.nav-link--contact-us'
            );

        this.headerSearchButton =
            this.siteHeader.locator(
                'button.search__toggler'
            );

        // Authenticated Footer
        this.siteFooter = page.locator(
            'footer.site-footer'
        );

        this.footerNavigation =
            this.siteFooter.locator(
                'nav.menu--footer'
            );

        /*
         * The logout URL contains a temporary session token.
         * The link is located using its visible text.
         */
        this.logoutLink =
            this.footerNavigation.getByRole(
                'link',
                {
                    name: 'Log out',
                    exact: true
                }
            );

        this.footerCopyright =
            this.siteFooter.locator(
                '#block-copyright'
            );
    }

    async verifyDashboardNavigation(
        expectedTitle,
        expectedPath
    ) {
        await expect(this.page).toHaveURL(
            url => url.pathname === expectedPath
        );

        await expect(this.page).toHaveTitle(
            expectedTitle
        );

        await expect(
            this.dashboardContainer
        ).toBeVisible();
    }

    async verifyAuthenticatedState() {
        await expect(
            this.dashboardHeading
        ).toBeVisible();

        await expect(
            this.dashboardNavigation
        ).toBeVisible();

        await expect(
            this.logoutLink
        ).toBeVisible();
    }

    async verifyBreadcrumb(
        expectedBreadcrumb
    ) {
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

    async verifyDashboardHeading(
        expectedHeading,
        descriptionKeyword
    ) {
        await expect(
            this.dashboardTitleSection
        ).toBeVisible();

        await expect(
            this.dashboardHeading
        ).toHaveText(
            expectedHeading
        );

        await expect(
            this.dashboardDescription
        ).toBeVisible();

        await expect(
            this.dashboardDescription
        ).toContainText(
            descriptionKeyword
        );
    }

    async verifyDashboardMenu(
        expectedNavigation
    ) {
        await expect(
            this.dashboardNavigation
        ).toBeVisible();

        await expect(
            this.dashboardNavigationHeading
        ).toBeAttached();

        for (
            const navigationItem
            of expectedNavigation
        ) {
            const navigationLink =
                this.dashboardNavigation.getByRole(
                    'link',
                    {
                        name:
                            navigationItem.name,
                        exact: true
                    }
                );

            await expect(
                navigationLink,
                `Dashboard link should be visible: ${navigationItem.name}`
            ).toBeVisible();

            await expect(
                navigationLink
            ).toHaveAttribute(
                'href',
                navigationItem.path
            );
        }
    }

    async verifyActiveDashboardTab() {
        await expect(
            this.dashboardTab
        ).toHaveClass(/is-active/);

        await expect(
            this.dashboardTab
        ).toHaveAttribute(
            'aria-current',
            'page'
        );
    }

    async verifyAuthenticatedHeader() {
        await expect(
            this.siteHeader
        ).toBeVisible();

        await expect(
            this.headerLogo
        ).toBeVisible();

        await expect(
            this.headerProductsLink
        ).toBeVisible();

        await expect(
            this.headerWhoWeAreMenu
        ).toBeVisible();

        await expect(
            this.headerCatalogLink
        ).toBeVisible();

        await expect(
            this.headerCatalogLink
        ).toHaveAttribute(
            'href',
            '/catalog'
        );

        await expect(
            this.headerContactUsLink
        ).toBeVisible();

        await expect(
            this.headerSearchButton
        ).toBeVisible();
    }

    async verifyAuthenticatedFooter() {
        await expect(
            this.siteFooter
        ).toBeVisible();

        await expect(
            this.footerNavigation
        ).toBeVisible();

        await expect(
            this.footerCopyright
        ).toBeVisible();
    }

    async verifyInformationMessage(
        expectedMessage
    ) {
        await expect(
            this.messageContainer
        ).toBeVisible();

        await expect(
            this.messageType
        ).toHaveText(
            expectedMessage.type
        );

        await expect(
            this.messageText
        ).toContainText(
            expectedMessage.keyword
        );

        await expect(
            this.messageCloseLink
        ).toBeVisible();

        await expect(
            this.messageCloseLink
        ).toHaveAttribute(
            'title',
            'Close'
        );
    }

    async verifyLatestUpdatesFilter(
        expectedUpdates
    ) {
        await expect(
            this.productUpdatesSection
        ).toBeVisible();

        await expect(
            this.latestUpdatesLabel
        ).toBeVisible();

        await expect(
            this.latestUpdatesLabel
        ).toHaveText(
            expectedUpdates.label
        );

        await expect(
            this.latestUpdatesSelect
        ).toBeVisible();

        await expect(
            this.latestUpdatesSelect
        ).toBeEnabled();

        await expect(
            this.latestUpdatesSelect
        ).toHaveValue(
            expectedUpdates.defaultValue
        );

        for (
            const expectedOption
            of expectedUpdates.options
        ) {
            const option =
                this.latestUpdatesSelect.locator(
                    `option[value="${expectedOption.value}"]`
                );

            await expect(
                option,
                `Update option should exist: ${expectedOption.label}`
            ).toHaveText(
                expectedOption.label
            );
        }
    }

    async verifyProductUpdates(
        minimumUpdateCount
    ) {
        const updateCount =
            await this.productUpdateRows.count();

        expect(
            updateCount,
            `Expected at least ${minimumUpdateCount} product update`
        ).toBeGreaterThanOrEqual(
            minimumUpdateCount
        );

        const linkCount =
            await this.productUpdateLinks.count();

        expect(
            linkCount,
            'At least one product-update link should exist'
        ).toBeGreaterThanOrEqual(
            minimumUpdateCount
        );

        const firstUpdateLink =
            this.productUpdateLinks.first();

        await expect(
            firstUpdateLink
        ).toBeVisible();

        await expect(
            firstUpdateLink
        ).toHaveAttribute(
            'href',
            /^\/catalog\/\d+$/
        );

        await expect(
            firstUpdateLink
        ).toHaveAttribute(
            'target',
            '_blank'
        );

        const firstUpdateText =
            await firstUpdateLink.textContent();

        expect(
            firstUpdateText?.trim().length,
            'Product-update text should not be empty'
        ).toBeGreaterThan(0);
    }

    async verifyProductUpdateDates() {
        const dateCount =
            await this.productUpdateDates.count();

        expect(
            dateCount,
            'At least one product-update date should exist'
        ).toBeGreaterThan(0);

        const firstDate =
            this.productUpdateDates.first();

        await expect(
            firstDate
        ).toBeVisible();

        await expect(
            firstDate
        ).toHaveAttribute(
            'datetime',
            /\d{4}-\d{2}-\d{2}/
        );

        const datetime =
            await firstDate.getAttribute(
                'datetime'
            );

        expect(
            datetime,
            'Product-update date should contain a datetime value'
        ).toBeTruthy();

        expect(
            Number.isNaN(
                Date.parse(datetime)
            ),
            `Product-update datetime should be valid: ${datetime}`
        ).toBe(false);
    }

    async verifyFooter() {
        await expect(
            this.siteFooter
        ).toBeVisible();

        await expect(
            this.footerNavigation
        ).toBeVisible();

        await expect(
            this.logoutLink
        ).toBeVisible();

        await expect(
            this.footerCopyright
        ).toBeVisible();
    }

    async logout() {
        await expect(
            this.logoutLink
        ).toBeVisible();

        await this.logoutLink.click();

        await this.page.waitForLoadState(
            'domcontentloaded'
        );
    }

    async verifyLogoutLink(
        expectedText,
        expectedPathPrefix
    ) {
        await expect(
            this.logoutLink
        ).toBeVisible();

        await expect(
            this.logoutLink
        ).toHaveText(
            expectedText
        );

        const href =
            await this.logoutLink
                .getAttribute('href');

        expect(
            href,
            'Logout URL should contain the expected prefix'
        ).toContain(
            expectedPathPrefix
        );
    }

    async verifyLoggedOut() {
        await expect(this.page).toHaveURL(
            url =>
                url.pathname === '/' ||
                url.pathname.startsWith(
                    '/user/logout'
                ),
            {
                timeout: 30000
            }
        );
    }
}

module.exports = {B2BDashboardPage};
