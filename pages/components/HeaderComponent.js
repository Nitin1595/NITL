// const { expect } = require('@playwright/test');

const { test, expect } = require('@playwright/test');

class HeaderComponent {
    constructor(page) {
        this.page = page;

        // Complete site header
        this.header = page.locator('#header');

        // Home logo
        this.homeLogo = this.header.locator(
            'a.navbar-brand[rel="home"]'
        );

        this.homeLogoImage = this.homeLogo.locator('img');

        // Main navigation links
        this.productsLink = this.header.locator(
            'a.nav-link--products'
        );

        this.whoWeAreMenu = this.header.locator(
            'a[data-bs-toggle="dropdown"]'
        );

        this.whoWeAreDropdown = this.header.locator(
            'li.menu-item--expanded.dropdown'
        );

        // Who We Are submenu links
        this.aboutUsLink = this.whoWeAreDropdown.locator(
            'a.nav-link--about-us'
        );

        this.foodCategoryLink = this.whoWeAreDropdown.locator(
            'a.nav-link--food-1-category'
        );

        this.locationLink = this.whoWeAreDropdown.locator(
            'a.nav-link--location'
        );

        // B2B Login and Contact Us
        this.b2bLoginLink = this.header.locator(
            'a.nav-link--login-modal'
        );

        this.contactUsLink = this.header.locator(
            'a.nav-link--contact-us'
        );

        // Search controls
        this.searchButton = this.header.locator(
            'button.search__toggler'
        );

        this.searchInput = this.header.locator(
            'input[name="search"]'
        );

        // Mobile navigation button
        this.mobileMenuButton = this.header.locator(
            'button.navbar-toggler'
        );
    }

    async verifyHeaderDisplayed() {
        await expect(this.header).toBeVisible();
    }

    async verifyLogoDisplayed() {
        await expect(this.homeLogo).toBeVisible();
        await expect(this.homeLogoImage).toBeVisible();

        await expect(this.homeLogo).toHaveAttribute(
            'href',
            '/'
        );

        await expect(this.homeLogoImage).toHaveAttribute(
            'src',
            /logo\.svg/
        );
    }

    async verifyNavigationDisplayed() {
        await expect(this.productsLink).toBeVisible();
        await expect(this.whoWeAreMenu).toBeVisible();
        await expect(this.b2bLoginLink).toBeVisible();
        await expect(this.contactUsLink).toBeVisible();
    }

    async verifySearchButtonDisplayed() {
        await expect(this.searchButton).toBeVisible();
    }

    async navigateToHome() {
        await this.homeLogo.click();
    }

    async navigateToProducts() {
        await this.productsLink.click();
    }

    async openWhoWeAreMenu() {
        await this.whoWeAreMenu.click();
        await expect(this.aboutUsLink).toBeVisible();
    }

    async navigateToAboutUs() {
        await this.openWhoWeAreMenu();
        await this.aboutUsLink.click();
    }

    async navigateToFoodCategory() {
        await this.openWhoWeAreMenu();
        await this.foodCategoryLink.click();
    }

    async navigateToLocation() {
        await this.openWhoWeAreMenu();
        await this.locationLink.click();
    }

    async openB2BLogin() {
        await this.b2bLoginLink.click();
    }

    async navigateToContactUs() {
        await this.contactUsLink.click();
    }

    async openSearch() {
        await this.searchButton.click();
        await expect(this.searchInput).toBeVisible();
    }

    async searchFor(searchValue) {
        await this.openSearch();
        await this.searchInput.fill(searchValue);
        await this.searchInput.press('Enter');
    }
}

module.exports = { HeaderComponent};