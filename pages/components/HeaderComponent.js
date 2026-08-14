const { expect } = require('@playwright/test');

class HeaderComponent {
    constructor(page) {
        this.page = page;

        this.header = page.locator('header#header');

        this.mainNavigation = this.header.locator(
            '#block-main-navigation'
        );

        this.homeLogo = this.header.locator(
            'a.navbar-brand[rel="home"]'
        );

        this.homeLogoImage = this.homeLogo.locator('img');

        this.productsLink = this.mainNavigation.locator(
            'a[href="/products"]'
        );

        this.whoWeAreDropdown = this.mainNavigation.locator(
            'li.menu-item--expanded.dropdown'
        );

        this.whoWeAreMenu = this.whoWeAreDropdown.locator(
            'a[data-bs-toggle="dropdown"]'
        ).first();

        this.whoWeAreDropdownMenu =
            this.whoWeAreDropdown.locator(
                'ul.dropdown-menu'
            );

        this.aboutUsLink = this.whoWeAreDropdown.locator(
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

        this.catalogLink = this.mainNavigation.locator(
            'a[href="/catalog"]'
        );

        this.contactUsLink = this.mainNavigation.locator(
            'a[href="/contact-us"]'
        );

        this.b2bLoginLink = this.header.locator(
            'a[href="/login-modal"], a.nav-link--login-modal'
        ).first();

        this.searchButton = this.header.locator(
            'button.search__toggler, button.js-toggle-search'
        ).first();

        this.searchInput = this.header.locator(
            'form.simple-search-form input[name="search"]'
        );

        this.mobileMenuButton = this.header.locator(
            'button.navbar-toggler'
        );

        this.oneTrustBanner = page.locator(
            '#onetrust-banner-sdk'
        );

        this.oneTrustPreferenceCenter = page.locator(
            '#onetrust-pc-sdk'
        );

        this.oneTrustDarkOverlay = page.locator(
            '.onetrust-pc-dark-filter'
        );

        this.acceptAllCookiesButton = page.locator(
            '#onetrust-accept-btn-handler'
        );

        this.rejectAllCookiesButton = page.locator(
            '#onetrust-reject-all-handler'
        );

        this.acceptRecommendedButton = page.locator(
            '#accept-recommended-btn-handler'
        );

        this.savePreferencesButton = page.locator(
            '.save-preference-btn-handler'
        );

        this.closePreferencesButton = page.locator(
            '#close-pc-btn-handler'
        );
    }

    async isVisible(locator, timeout = 1500) {
        return locator.isVisible({
            timeout
        }).catch(() => false);
    }

    async clickIfVisible(locator) {
        const visible = await this.isVisible(locator);

        if (!visible) {
            return false;
        }

        await locator.click({
            force: true,
            timeout: 5000
        }).catch(() => {});

        return true;
    }

    async ensureOneTrustIsClosed() {
        const preferenceVisible =
            await this.isVisible(
                this.oneTrustPreferenceCenter
            );

        const overlayVisible =
            await this.isVisible(
                this.oneTrustDarkOverlay
            );

        if (preferenceVisible || overlayVisible) {
            const accepted =
                await this.clickIfVisible(
                    this.acceptRecommendedButton
                );

            if (!accepted) {
                const saved =
                    await this.clickIfVisible(
                        this.savePreferencesButton
                    );

                if (!saved) {
                    await this.clickIfVisible(
                        this.closePreferencesButton
                    );
                }
            }
        }

        const bannerVisible =
            await this.isVisible(
                this.oneTrustBanner
            );

        if (bannerVisible) {
            const accepted =
                await this.clickIfVisible(
                    this.acceptAllCookiesButton
                );

            if (!accepted) {
                await this.clickIfVisible(
                    this.rejectAllCookiesButton
                );
            }
        }

        await this.oneTrustPreferenceCenter.waitFor({
            state: 'hidden',
            timeout: 5000
        }).catch(() => {});

        await this.oneTrustDarkOverlay.waitFor({
            state: 'hidden',
            timeout: 5000
        }).catch(() => {});

        const overlayStillVisible =
            await this.isVisible(
                this.oneTrustDarkOverlay
            );

        if (overlayStillVisible) {
            await this.page.evaluate(() => {
                document
                    .querySelectorAll(
                        '.onetrust-pc-dark-filter'
                    )
                    .forEach(overlay => {
                        overlay.style.display = 'none';
                        overlay.style.visibility = 'hidden';
                        overlay.style.pointerEvents = 'none';
                    });
            });
        }
    }

    async verifyHeaderDisplayed() {
        await expect(
            this.header,
            'Site Header should be displayed'
        ).toBeVisible();
    }

    async verifyLogoDisplayed() {
        await expect(
            this.homeLogo,
            'Home logo should be displayed'
        ).toBeVisible();

        await expect(
            this.homeLogoImage,
            'Home logo image should be displayed'
        ).toBeVisible();

        await expect(
            this.homeLogo
        ).toHaveAttribute('href', '/');

        await expect(
            this.homeLogoImage
        ).toHaveAttribute('src', /logo\.svg/);
    }

    async verifyNavigationDisplayed() {
        await expect(
            this.mainNavigation,
            'Main navigation should be displayed'
        ).toBeVisible();

        await expect(
            this.productsLink,
            'Products link should be displayed'
        ).toBeVisible();

        await expect(
            this.whoWeAreMenu,
            'Who We Are menu should be displayed'
        ).toBeVisible();

        await expect(
            this.contactUsLink,
            'Contact Us link should be displayed'
        ).toBeVisible();

        await expect(
            this.productsLink
        ).toHaveAttribute('href', '/products');

        await expect(
            this.contactUsLink
        ).toHaveAttribute('href', '/contact-us');

        /*
         * The Catalog link is not rendered in every public Header
         * variation. Validate it only when the website provides it.
         */
        const catalogLinkCount =
            await this.catalogLink.count();

        if (catalogLinkCount > 0) {
            await expect(
                this.catalogLink
            ).toBeVisible();

            await expect(
                this.catalogLink
            ).toHaveAttribute('href', '/catalog');
        }
    }

    async verifyPublicB2BLoginDisplayed() {
        await expect(
            this.b2bLoginLink,
            'B2B Log in link should be displayed'
        ).toBeVisible();

        await expect(
            this.b2bLoginLink
        ).toHaveAttribute('href', '/login-modal');
    }

    async verifySearchButtonDisplayed() {
        await expect(
            this.searchButton,
            'Search button should be displayed'
        ).toBeVisible();

        await expect(
            this.searchButton
        ).toBeEnabled();
    }

    async verifyWhoWeAreLinksExist() {
        await expect(
            this.aboutUsLink,
            'Who We Are link should exist: About Us'
        ).toBeAttached();

        await expect(
            this.foodCategoryLink,
            'Who We Are link should exist: Food category'
        ).toBeAttached();

        await expect(
            this.locationLink,
            'Who We Are link should exist: Location'
        ).toBeAttached();

        await expect(
            this.aboutUsLink
        ).toHaveAttribute('href', '/about-us');

        await expect(
            this.foodCategoryLink
        ).toHaveAttribute(
            'href',
            '/food-1-category'
        );

        await expect(
            this.locationLink
        ).toHaveAttribute('href', '/location');
    }

    async openWhoWeAreMenu() {
        await this.ensureOneTrustIsClosed();

        await expect(
            this.whoWeAreMenu
        ).toBeVisible();

        const expanded =
            await this.whoWeAreMenu.getAttribute(
                'aria-expanded'
            );

        if (expanded !== 'true') {
            await this.whoWeAreMenu.click({
                force: true
            });
        }

        await expect(
            this.whoWeAreDropdownMenu
        ).toBeVisible();

        await expect(
            this.aboutUsLink
        ).toBeVisible();

        await expect(
            this.foodCategoryLink
        ).toBeVisible();

        await expect(
            this.locationLink
        ).toBeVisible();
    }

    async verifyWhoWeAreNavigationDisplayed() {
        await this.verifyWhoWeAreLinksExist();
        await this.openWhoWeAreMenu();
    }

    async navigateToHome() {
        await this.homeLogo.click();

        await this.page.waitForLoadState(
            'domcontentloaded'
        );
    }

    async navigateToProducts() {
        await this.productsLink.click();

        await this.page.waitForURL(
            url => url.pathname === '/products',
            {
                timeout: 30000
            }
        );
    }

    async navigateToAboutUs() {
        await this.openWhoWeAreMenu();

        await this.aboutUsLink.click();

        await this.page.waitForURL(
            url => url.pathname === '/about-us',
            {
                timeout: 30000
            }
        );
    }

    async navigateToFoodCategory() {
        await this.openWhoWeAreMenu();

        await this.foodCategoryLink.click();

        await this.page.waitForURL(
            url =>
                url.pathname ===
                '/food-1-category',
            {
                timeout: 30000
            }
        );
    }

    async navigateToLocation() {
        await this.openWhoWeAreMenu();

        await this.locationLink.click();

        await this.page.waitForURL(
            url => url.pathname === '/location',
            {
                timeout: 30000
            }
        );
    }

    async navigateToCatalog() {
        await expect(
            this.catalogLink
        ).toBeVisible();

        await this.catalogLink.click();

        await this.page.waitForURL(
            url => url.pathname === '/catalog',
            {
                timeout: 30000
            }
        );
    }

    async openB2BLogin() {
        await this.ensureOneTrustIsClosed();

        await expect(
            this.b2bLoginLink
        ).toBeVisible({
            timeout: 15000
        });

        await this.b2bLoginLink.click({
            force: true,
            timeout: 15000
        });
    }

    async navigateToContactUs() {
        await this.contactUsLink.click();

        await this.page.waitForURL(
            url => url.pathname === '/contact-us',
            {
                timeout: 30000
            }
        );
    }

    async openSearch() {
        await this.searchButton.click();

        await expect(
            this.searchInput
        ).toBeVisible();
    }

    async searchFor(searchValue) {
        expect(searchValue).toBeTruthy();

        await this.openSearch();

        await this.searchInput.fill(searchValue);

        await this.searchInput.press('Enter');
    }
}

module.exports = {
    HeaderComponent
};