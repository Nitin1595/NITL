const { expect } = require('@playwright/test');

const {
    HeaderComponent
} = require('../components/HeaderComponent');

const {
    FooterComponent
} = require('../components/FooterComponent');

class B2BGeneralSalesTermsPage {
    constructor(page) {
        this.page = page;

        this.header = new HeaderComponent(page);
        this.footerComponent =
            new FooterComponent(page);

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
                name:
                    'General Sales & Delivery Terms',
                level: 1,
                exact: true
            }
        );

        this.termsArticle = this.mainContent.locator(
            'article.node--type-dsu-component-page'
        );

        // Breadcrumb
        this.breadcrumb = page.locator(
            'nav[aria-label="breadcrumb"]'
        );

        this.breadcrumbItems =
            this.breadcrumb.locator(
                '.breadcrumb-item'
            );

        this.homeBreadcrumbLink =
            this.breadcrumb.locator(
                'a[href="/"]'
            ).first();

        this.activeBreadcrumb =
            this.breadcrumb.locator(
                '.breadcrumb-item.active'
            );

        // Stable Header locators
        this.siteHeader = page.locator(
            'header#header'
        );

        this.logoLink = this.siteHeader.locator(
            'a.navbar-brand[rel="home"]'
        );

        this.logoImage = this.logoLink.locator(
            'img'
        );

        this.mainNavigation =
            this.siteHeader.locator(
                '#block-main-navigation'
            );

        this.productsLink =
            this.mainNavigation.locator(
                'a[href="/products"]'
            );

        this.whoWeAreDropdown =
            this.mainNavigation.locator(
                'li.menu-item--expanded.dropdown'
            );

        this.whoWeAreMenu =
            this.whoWeAreDropdown.locator(
                'a[data-bs-toggle="dropdown"]'
            ).first();

        /*
         * Stable href locators are used instead of visible text.
         * This prevents About US versus About Us failures.
         */
        this.aboutUsLink =
            this.whoWeAreDropdown.locator(
                'a[href="/about-us"]'
            );

        this.foodCategoryLink =
            this.whoWeAreDropdown.locator(
                'a[href="/food-1-category"]'
            );

        this.locationLink =
            this.whoWeAreDropdown.locator(
                'a[href="/location"]'
            );

        this.catalogLink =
            this.mainNavigation.locator(
                'a[href="/catalog"]'
            );

        this.b2bLoginLink =
            this.mainNavigation.locator(
                'a[href="/login-modal"]'
            ).first();

        this.contactUsLink =
            this.mainNavigation.locator(
                'a[href="/contact-us"]'
            );

        this.searchButton =
            this.siteHeader.locator(
                'button.search__toggler'
            ).first();

        this.searchInput =
            this.siteHeader.locator(
                'form.simple-search-form ' +
                'input[name="search"]'
            );

        // PDF document links
        this.documentLinks =
            this.termsArticle.locator(
                'a.file-download.file-download-pdf'
            );

        // Footer
        this.footer = page.locator(
            'footer.site-footer'
        );

        this.footerNavigation =
            this.footer.locator(
                'nav.menu--footer'
            );

        this.logoutLink =
            this.footerNavigation.locator(
                'a[data-drupal-link-system-path=' +
                '"user/logout"]'
            ).first();

        this.footerCopyright =
            this.footer.locator(
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
                url.pathname ===
                expectedPage.path
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
            this.siteHeader,
            'Terms page Header should be displayed'
        ).toBeVisible();

        await expect(
            this.logoLink,
            'Terms page logo should be displayed'
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

        await expect(
            this.productsLink,
            'Products Header link should exist'
        ).toBeVisible();

        await expect(
            this.productsLink
        ).toHaveAttribute(
            'href',
            '/products'
        );

        await expect(
            this.whoWeAreMenu,
            'Who We Are menu should exist'
        ).toBeVisible();

        await expect(
            this.whoWeAreMenu
        ).toHaveAttribute(
            'data-bs-toggle',
            'dropdown'
        );

        await expect(
            this.aboutUsLink,
            'Who We Are link should exist: About Us'
        ).toBeAttached();

        await expect(
            this.aboutUsLink
        ).toHaveAttribute(
            'href',
            '/about-us'
        );

        await expect(
            this.foodCategoryLink,
            'Who We Are link should exist: Food category'
        ).toBeAttached();

        await expect(
            this.foodCategoryLink
        ).toHaveAttribute(
            'href',
            '/food-1-category'
        );

        await expect(
            this.locationLink,
            'Who We Are link should exist: Location'
        ).toBeAttached();

        await expect(
            this.locationLink
        ).toHaveAttribute(
            'href',
            '/location'
        );

        /*
         * The public Header can show either Our Catalog
         * or B2B Login depending on session state.
         */
        const catalogCount =
            await this.catalogLink.count();

        const b2bLoginCount =
            await this.b2bLoginLink.count();

        expect(
            catalogCount + b2bLoginCount,
            'Header should contain either Our Catalog or B2B Login'
        ).toBeGreaterThan(0);

        if (catalogCount > 0) {
            await expect(
                this.catalogLink
            ).toHaveAttribute(
                'href',
                '/catalog'
            );
        }

        if (b2bLoginCount > 0) {
            await expect(
                this.b2bLoginLink
            ).toHaveAttribute(
                'href',
                '/login-modal'
            );
        }

        await expect(
            this.contactUsLink,
            'Contact Us Header link should exist'
        ).toBeVisible();

        await expect(
            this.contactUsLink
        ).toHaveAttribute(
            'href',
            '/contact-us'
        );

        await expect(
            this.searchButton
        ).toBeVisible();

        await expect(
            this.searchButton
        ).toBeEnabled();

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
                this.termsArticle.locator(
                    `a[href="${expectedDocument.path}"]`
                );

            await expect(
                documentLink,
                `Document link should exist: ${expectedDocument.name}`
            ).toBeAttached();

            await expect(
                documentLink
            ).toHaveText(
                expectedDocument.name
            );

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
                await documentLink
                    .getAttribute('rel');

            expect(
                relValue,
                `Document link should contain rel attribute: ${expectedDocument.name}`
            ).toBeTruthy();

            expect(
                relValue
                    .split(/\s+/)
                    .includes(
                        expectedDocument.relKeyword
                    ),
                `Document link should contain rel="${expectedDocument.relKeyword}"`
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
            expectedSafety.validateLinksOnly
        ).toBe(true);

        expect(
            expectedSafety.downloadDocuments
        ).toBe(false);

        expect(
            expectedSafety.openDocuments
        ).toBe(false);

        await expect(
            this.pageHeading
        ).toBeVisible();

        await expect(
            this.documentLinks
        ).toHaveCount(2);
    }

    async verifyFooter(expectedFooter) {
        await this.footer
            .scrollIntoViewIfNeeded();

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
                this.footerNavigation.locator(
                    `a[href="${expectedLink.path}"]`
                ).filter({
                    hasText:
                        expectedLink.name
                }).first();

            await expect(
                footerLink,
                `Footer link should exist: ${expectedLink.name}`
            ).toBeAttached();

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
                externalLink
            ).toBeVisible();

            const hrefValue =
                await externalLink
                    .getAttribute('href');

            expect(hrefValue).toBeTruthy();

            expect(
                hrefValue.includes(
                    expectedExternalLink
                        .hrefKeyword
                )
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
        await this.footer
            .scrollIntoViewIfNeeded();

        await expect(
            this.logoutLink
        ).toBeVisible();

        await expect(
            this.logoutLink
        ).toHaveText(
            expectedText
        );

        const logoutHref =
            await this.logoutLink
                .getAttribute('href');

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
        await this.footer
            .scrollIntoViewIfNeeded();

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