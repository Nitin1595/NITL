const { expect } = require('@playwright/test');

class B2BGeneralSalesTermsPage {
    constructor(page) {
        this.page = page;

        // Main page content
        this.mainContent = page.locator(
            'main#content'
        );

        this.pageTitleBlock = page.locator(
            '#block-retailx-page-title'
        );

        this.pageHeading = this.pageTitleBlock.getByRole(
            'heading',
            {
                name: 'General Sales & Delivery Terms',
                level: 1,
                exact: true
            }
        );

        this.termsArticle = this.mainContent.locator(
            'article.node--type-dsu-component-page'
        );

        // Header
        this.header = page.locator(
            'header#header'
        );

        this.logoLink = this.header.locator(
            'a.navbar-brand[rel="home"]'
        );

        this.logoImage = this.logoLink.locator(
            'img'
        );

        this.mainNavigation = this.header.locator(
            '#block-main-navigation'
        );

        this.productsLink = this.mainNavigation.getByRole(
            'link',
            {
                name: 'Products',
                exact: true
            }
        );

        this.whoWeAreMenu = this.mainNavigation.getByRole(
            'link',
            {
                name: /Who we are/i
            }
        );

        this.aboutUsLink = this.mainNavigation.getByRole(
            'link',
            {
                name: 'About US',
                exact: true
            }
        );

        this.foodCategoryLink = this.mainNavigation.getByRole(
            'link',
            {
                name: 'Food as the #1 category',
                exact: true
            }
        );

        this.locationLink = this.mainNavigation.getByRole(
            'link',
            {
                name: 'Location',
                exact: true
            }
        );

        this.catalogLink = this.mainNavigation.getByRole(
            'link',
            {
                name: 'Our Catalog',
                exact: true
            }
        );

        this.contactUsLink = this.mainNavigation.getByRole(
            'link',
            {
                name: 'Contact us',
                exact: true
            }
        );

        this.searchToggleButton = this.header.locator(
            'button.search__toggler'
        );

        this.searchInput = this.header.locator(
            'input.region-header-search'
        );

        // Breadcrumb
        this.breadcrumb = page.locator(
            'nav[aria-label="breadcrumb"]'
        );

        this.breadcrumbItems = this.breadcrumb.locator(
            '.breadcrumb-item'
        );

        this.homeBreadcrumbLink = this.breadcrumb.getByRole(
            'link',
            {
                name: 'Home',
                exact: true
            }
        );

        this.activeBreadcrumb = this.breadcrumb.locator(
            '.breadcrumb-item.active'
        );

        // Document links
        this.documentLinks = this.termsArticle.locator(
            'a.file-download.file-download-pdf'
        );

        // Footer
        this.footer = page.locator(
            'footer.site-footer'
        );

        this.footerNavigation = this.footer.locator(
            'nav.menu--footer'
        );

        this.logoutLink = this.footerNavigation.getByRole(
            'link',
            {
                name: 'Log out',
                exact: true
            }
        );

        this.footerCopyright = this.footer.locator(
            '#block-copyright'
        );
    }

    async openPage(expectedPath) {
        await this.page.goto(expectedPath, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        await expect(
            this.mainContent,
            'General Sales and Delivery Terms page should load'
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            this.pageHeading,
            'General Sales and Delivery Terms heading should be visible'
        ).toBeVisible({
            timeout: 30000
        });
    }

    async verifyPage(expectedPage) {
        await expect(this.page).toHaveURL(
            url =>
                url.pathname === expectedPage.path
        );

        await expect(this.page).toHaveTitle(
            expectedPage.expectedTitle
        );

        await expect(
            this.mainContent
        ).toBeVisible();

        await expect(
            this.pageTitleBlock
        ).toBeVisible();

        await expect(
            this.pageHeading
        ).toBeVisible();

        await expect(
            this.pageHeading
        ).toHaveText(
            expectedPage.heading
        );

        await expect(
            this.termsArticle
        ).toBeVisible();
    }

    async verifyHeader(expectedHeader) {
        await expect(
            this.header
        ).toBeVisible();

        await expect(
            this.logoLink
        ).toBeVisible();

        await expect(
            this.logoLink
        ).toHaveAttribute(
            'href',
            expectedHeader.logoPath
        );

        await expect(
            this.logoImage
        ).toBeVisible();

        await expect(
            this.logoImage
        ).toHaveAttribute(
            'src',
            /logo\.svg/
        );

        await expect(
            this.logoImage
        ).toHaveAttribute(
            'alt',
            'Home'
        );

        await expect(
            this.mainNavigation
        ).toBeVisible();

        for (
            const navigationItem
            of expectedHeader.navigation
        ) {
            const navigationLink =
                this.mainNavigation.getByRole(
                    'link',
                    {
                        name: navigationItem.name,
                        exact: true
                    }
                );

            await expect(
                navigationLink,
                `Header link should be visible: ${navigationItem.name}`
            ).toBeVisible();

            await expect(
                navigationLink
            ).toHaveAttribute(
                'href',
                navigationItem.path
            );
        }

        await expect(
            this.whoWeAreMenu
        ).toBeVisible();

        await expect(
            this.whoWeAreMenu
        ).toHaveAttribute(
            'data-bs-toggle',
            'dropdown'
        );

        await expect(
            this.whoWeAreMenu
        ).toHaveAttribute(
            'aria-haspopup',
            'true'
        );

        for (
            const dropdownItem
            of expectedHeader.whoWeAreLinks
        ) {
            const dropdownLink =
                this.mainNavigation.getByRole(
                    'link',
                    {
                        name: dropdownItem.name,
                        exact: true
                    }
                );

            await expect(
                dropdownLink,
                `Who We Are link should exist: ${dropdownItem.name}`
            ).toBeAttached();

            await expect(
                dropdownLink
            ).toHaveAttribute(
                'href',
                dropdownItem.path
            );
        }

        await expect(
            this.searchToggleButton
        ).toBeVisible();

        await expect(
            this.searchToggleButton
        ).toHaveAttribute(
            'type',
            'button'
        );

        await expect(
            this.searchInput
        ).toBeAttached();

        await expect(
            this.searchInput
        ).toHaveAttribute(
            'placeholder',
            expectedHeader.searchPlaceholder
        );

        await expect(
            this.searchInput
        ).toHaveAttribute(
            'maxlength',
            expectedHeader.searchMaximumLength
        );
    }

    async verifyBreadcrumb(
        expectedBreadcrumb
    ) {
        await expect(
            this.breadcrumb
        ).toBeVisible();

        await expect(
            this.breadcrumbItems
        ).toHaveText(
            expectedBreadcrumb
        );

        await expect(
            this.homeBreadcrumbLink
        ).toHaveAttribute(
            'href',
            '/'
        );

        await expect(
            this.activeBreadcrumb
        ).toHaveText(
            expectedBreadcrumb[
                expectedBreadcrumb.length - 1
            ]
        );
    }

    async verifyDocumentCount(
        expectedDocumentCount
    ) {
        await expect(
            this.documentLinks
        ).toHaveCount(
            expectedDocumentCount
        );
    }

    async verifyDocuments(
        expectedDocuments
    ) {
        for (
            const expectedDocument
            of expectedDocuments
        ) {
            const documentLink =
                this.termsArticle.getByRole(
                    'link',
                    {
                        name: expectedDocument.name,
                        exact: true
                    }
                );

            await expect(
                documentLink,
                `Document link should be visible: ${expectedDocument.name}`
            ).toBeVisible();

            await expect(
                documentLink
            ).toHaveAttribute(
                'href',
                expectedDocument.path
            );

            await expect(
                documentLink
            ).toHaveAttribute(
                'target',
                expectedDocument.target
            );

            const relValue =
                await documentLink.getAttribute(
                    'rel'
                );

            expect(
                relValue,
                `Document link should have a rel attribute: ${expectedDocument.name}`
            ).toBeTruthy();

            expect(
                relValue
                    .split(/\s+/)
                    .includes(
                        expectedDocument.relKeyword
                    ),
                `Document link should contain rel="${expectedDocument.relKeyword}": ${expectedDocument.name}`
            ).toBeTruthy();

            await expect(
                documentLink
            ).toHaveClass(
                /file-download-pdf/
            );
        }
    }

    async verifyDocumentLinksOnly(
        expectedSafety
    ) {
        expect(
            expectedSafety.validateLinksOnly,
            'Terms test should validate document links'
        ).toBe(true);

        expect(
            expectedSafety.downloadDocuments,
            'Terms test should not download documents'
        ).toBe(false);

        expect(
            expectedSafety.openDocuments,
            'Terms test should not open documents'
        ).toBe(false);

        await expect(
            this.pageHeading
        ).toBeVisible();

        await expect(
            this.documentLinks
        ).toHaveCount(2);
    }

    async verifyFooter(expectedFooter) {
        await this.footer.scrollIntoViewIfNeeded();

        await expect(
            this.footer
        ).toBeVisible();

        await expect(
            this.footerNavigation
        ).toBeVisible();

        for (
            const expectedLink
            of expectedFooter.internalLinks
        ) {
            const footerLink =
                this.footerNavigation.getByRole(
                    'link',
                    {
                        name: expectedLink.name,
                        exact: true
                    }
                );

            await expect(
                footerLink,
                `Footer link should be visible: ${expectedLink.name}`
            ).toBeVisible();

            await expect(
                footerLink
            ).toHaveAttribute(
                'href',
                expectedLink.path
            );
        }

        for (
            const expectedExternalLink
            of expectedFooter.externalLinks
        ) {
            const externalLink =
                this.footerNavigation.getByRole(
                    'link',
                    {
                        name:
                            expectedExternalLink.name,
                        exact: true
                    }
                );

            await expect(
                externalLink,
                `External Footer link should be visible: ${expectedExternalLink.name}`
            ).toBeVisible();

            const hrefValue =
                await externalLink.getAttribute(
                    'href'
                );

            expect(
                hrefValue,
                `External Footer link should contain an href: ${expectedExternalLink.name}`
            ).toBeTruthy();

            expect(
                hrefValue.includes(
                    expectedExternalLink
                        .hrefKeyword
                ),
                `External Footer link should contain the expected domain and path: ${expectedExternalLink.name}`
            ).toBeTruthy();
        }

        await expect(
            this.footerCopyright
        ).toBeVisible();

        await expect(
            this.footerCopyright
        ).toContainText(
            expectedFooter.copyrightKeyword
        );

        await expect(
            this.footerCopyright
        ).toContainText(
            expectedFooter.copyrightText
        );
    }

    async verifyLogoutLink(
        expectedText,
        expectedPathPrefix
    ) {
        await this.footer.scrollIntoViewIfNeeded();

        await expect(
            this.logoutLink
        ).toBeVisible();

        await expect(
            this.logoutLink
        ).toHaveText(
            expectedText
        );

        const logoutHref =
            await this.logoutLink.getAttribute(
                'href'
            );

        expect(
            logoutHref,
            'Logout link should contain an href'
        ).toBeTruthy();

        expect(
            logoutHref.startsWith(
                expectedPathPrefix
            ),
            'Logout link should use the stable logout path'
        ).toBeTruthy();

        await expect(
            this.logoutLink
        ).toHaveAttribute(
            'data-drupal-link-system-path',
            'user/logout'
        );
    }

    async logout() {
        await this.footer.scrollIntoViewIfNeeded();

        await expect(
            this.logoutLink
        ).toBeVisible();

        await this.logoutLink.click();

        await this.page.waitForLoadState(
            'domcontentloaded'
        );
    }

    async verifyLoggedOut(
        authenticatedPagePath
    ) {
        await expect(
            this.logoutLink
        ).toBeHidden({
            timeout: 15000
        });

        await expect(this.page).not.toHaveURL(
            url =>
                url.pathname ===
                authenticatedPagePath
        );
    }
}

module.exports = {
    B2BGeneralSalesTermsPage
};