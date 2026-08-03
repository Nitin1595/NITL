const { expect } = require('@playwright/test');

class FooterComponent {
    constructor(page) {
        this.page = page;

        // Complete footer
        this.footer = page.locator('footer.site-footer');

        // Footer navigation
        this.footerNavigation = this.footer.locator(
            'nav.menu--footer'
        );

        // Footer links
        this.aboutUsLink = this.footer.locator(
            'a.nav-link--about-us'
        );

        this.contactUsLink = this.footer.locator(
            'a.nav-link--contact-us'
        );

        this.privacyPolicyLink = this.footer.locator(
            'a[href*="privacy"]'
        );

        this.cookiePolicyLink = this.footer.locator(
            'a[href*="cookies"]'
        );

        this.sitemapLink = this.footer.locator(
            'a.nav-link--sitemap'
        );

        this.b2bLoginLink = this.footer.locator(
            'a.nav-link--login-modal'
        );

        // Copyright information
        this.copyrightText = this.footer.locator(
            '#block-copyright'
        );
    }

    async verifyFooterDisplayed() {
        await this.footer.scrollIntoViewIfNeeded();
        await expect(this.footer).toBeVisible();
    }

    async verifyFooterNavigationDisplayed() {
        await this.verifyFooterDisplayed();

        await expect(this.footerNavigation).toBeVisible();
        await expect(this.aboutUsLink).toBeVisible();
        await expect(this.contactUsLink).toBeVisible();
        await expect(this.privacyPolicyLink).toBeVisible();
        await expect(this.cookiePolicyLink).toBeVisible();
        await expect(this.sitemapLink).toBeVisible();
        await expect(this.b2bLoginLink).toBeVisible();
        await expect(this.copyrightText).toBeVisible();
    }

    async navigateToAboutUs() {
        await this.footer.scrollIntoViewIfNeeded();
        await this.aboutUsLink.click();
    }

    async navigateToContactUs() {
        await this.footer.scrollIntoViewIfNeeded();
        await this.contactUsLink.click();
    }

    async navigateToSitemap() {
        await this.footer.scrollIntoViewIfNeeded();
        await this.sitemapLink.click();
    }

    async openB2BLogin() {
        await this.footer.scrollIntoViewIfNeeded();
        await this.b2bLoginLink.click();
    }

    async verifyCopyrightText(expectedText) {
        await this.footer.scrollIntoViewIfNeeded();

        await expect(this.copyrightText).toBeVisible();

        await expect(this.copyrightText).toContainText(
            expectedText
        );
    }
}

module.exports = { FooterComponent };