const { expect } = require('@playwright/test');

const {
    HeaderComponent
} = require('./components/HeaderComponent');

const {
    FooterComponent
} = require('./components/FooterComponent');

class HomePage {
    constructor(page) {
        this.page = page;

        // Reusable Header and Footer components
        this.header = new HeaderComponent(page);
        this.footer = new FooterComponent(page);

        // Home page breadcrumb
        this.breadcrumb = page.locator(
            'nav[aria-label="breadcrumb"]'
        );

        // Hero banner
        this.heroSection = page.locator('#block-hero');

        this.heroHeading = this.heroSection.getByRole(
            'heading',
            {
                level: 1
            }
        );

        this.heroSubtitle = this.heroSection.getByRole(
            'heading',
            {
                level: 5
            }
        );

        this.heroImage = this.heroSection.locator(
            'picture img'
        );

        // Making Travel Retail Fly section
        this.introductionHeading = page.getByRole(
            'heading',
            {
                name: /making travel retail fly/i
            }
        );

        // Brand logos section
        this.brandLogoSection = page.locator(
            '.paragraph--type--c-teasercycle'
        );

        this.brandLogos = this.brandLogoSection.locator(
            'img.image-style-logo-md'
        );

        // View All Products button
        this.viewAllProductsButton = page.locator(
            'a.btn.btn-primary[href="/products"]'
        );

        // Travel Retail Business Lounge section
        this.businessLoungeHeading = page.getByRole(
            'heading',
            {
                name: /welcome to travel retails business lounge/i
            }
        );

        this.businessLoungeSection =
            this.businessLoungeHeading.locator(
                'xpath=ancestor::div[contains(@class, "paragraph")][1]'
            );

        this.businessLoungeImage =
            this.businessLoungeSection.locator(
                'img.image-style-text-image'
            );

        // Prepare for Take Off button
        this.prepareForTakeOffButton = page.locator(
            'a.btn[href="/user/login"]'
        );
    }

    async navigate(pagePath) {
        await this.page.goto(pagePath);
        await this.page.waitForLoadState(
            'domcontentloaded'
        );
    }

    async verifyHomePageNavigation(
        expectedTitle,
        expectedBreadcrumb
    ) {
        await expect(this.page).toHaveURL(/\/$/);

        await expect(this.page).toHaveTitle(
            new RegExp(expectedTitle, 'i')
        );

        await expect(this.breadcrumb).toBeVisible();

        await expect(this.breadcrumb).toContainText(
            expectedBreadcrumb
        );
    }

    async verifyHeroSection(expectedHeadings) {
        await expect(this.heroSection).toBeVisible();

        await expect(this.heroHeading).toHaveText(
            expectedHeadings.hero
        );

        await expect(this.heroSubtitle).toHaveText(
            expectedHeadings.heroSubtitle
        );

        await expect(this.heroImage).toBeVisible();
    }

    async verifyIntroductionSection(expectedHeading) {
        await expect(
            this.introductionHeading
        ).toBeVisible();

        await expect(
            this.introductionHeading
        ).toHaveText(expectedHeading);
    }

    async verifyBrandLogos(minimumLogoCount) {
        await this.brandLogoSection.scrollIntoViewIfNeeded();

        await expect(
            this.brandLogoSection
        ).toBeVisible();

        const totalLogos = await this.brandLogos.count();

        expect(
            totalLogos,
            `Expected at least ${minimumLogoCount} brand logo`
        ).toBeGreaterThanOrEqual(minimumLogoCount);

        for (
            let index = 0;
            index < totalLogos;
            index += 1
        ) {
            await expect(
                this.brandLogos.nth(index)
            ).toBeVisible();
        }
    }

    async verifyViewAllProductsButton() {
        await expect(
            this.viewAllProductsButton
        ).toBeVisible();

        await expect(
            this.viewAllProductsButton
        ).toBeEnabled();

        await expect(
            this.viewAllProductsButton
        ).toHaveAttribute('href', '/products');
    }

    async navigateToProducts() {
        await this.viewAllProductsButton.click();
    }

    async verifyBusinessLoungeSection(
        expectedHeading
    ) {
        await this.businessLoungeHeading
            .scrollIntoViewIfNeeded();

        await expect(
            this.businessLoungeHeading
        ).toBeVisible();

        await expect(
            this.businessLoungeHeading
        ).toHaveText(expectedHeading);

        await expect(
            this.businessLoungeImage
        ).toBeVisible();

        await expect(
            this.prepareForTakeOffButton
        ).toBeVisible();

        await expect(
            this.prepareForTakeOffButton
        ).toHaveAttribute(
            'href',
            '/user/login'
        );
    }

    async verifyPrepareForTakeOffButton() {
        await this.prepareForTakeOffButton
            .scrollIntoViewIfNeeded();

        await expect(
            this.prepareForTakeOffButton
        ).toBeVisible();

        await expect(
            this.prepareForTakeOffButton
        ).toBeEnabled();

        await expect(
            this.prepareForTakeOffButton
        ).toHaveAttribute(
            'href',
            '/user/login'
        );
    }

    async navigateToUserLogin() {
        await this.prepareForTakeOffButton.click();
    }
}

module.exports = { HomePage };