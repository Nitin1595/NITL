const { expect } = require('@playwright/test');

const {
    HeaderComponent
} = require('../components/HeaderComponent');

const {
    FooterComponent
} = require('../components/FooterComponent');

const {
    CookieConsentComponent
} = require('../components/CookieConsentComponent');

class AboutUsPage {
    constructor(page) {
        this.page = page;

        // Reusable website components
        this.header = new HeaderComponent(page);
        this.footer = new FooterComponent(page);
        this.cookieConsent =
            new CookieConsentComponent(page);

        // About Us page content
        this.mainContent = page.locator(
            '#block-retailx-content'
        );

        // Active Who We Are navigation
        this.activeWhoWeAreMenu = page.locator(
            '#header li.menu-item--expanded.active'
        );

        this.activeAboutUsMenuLink =
            this.activeWhoWeAreMenu.locator(
                'a.nav-link--about-us'
            );

        // Hero section
        this.heroSection = page.locator(
            '#block-hero'
        );

        this.heroLabel =
            this.heroSection.locator(
                '.field--name-field-c-advanced-title'
            );

        this.heroHeading =
            this.heroSection.getByRole(
                'heading',
                {
                    level: 2
                }
            );

        this.heroImage =
            this.heroSection.locator(
                'picture img'
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

        // Travel Retail Experience section
        this.travelRetailHeading =
            this.mainContent.getByRole(
                'heading',
                {
                    name: /exploring the travel retail experience/i
                }
            );

        this.travelRetailSection =
            this.travelRetailHeading.locator(
                'xpath=ancestor::div[contains(@class, "paragraph")][1]'
            );

        this.travelRetailImage =
            this.travelRetailSection.locator(
                'img.image-style-text-image'
            );

        this.travelRetailDescription =
            this.travelRetailSection.locator(
                '.field--name-field-c-text'
            );

        // Award logos section
        this.awardsSection =
            this.mainContent.locator(
                '.paragraph--type--c-teasercycle'
            );

        this.awardLogos =
            this.awardsSection.locator(
                'img.image-style-logo-md'
            );

        // Who We Are section
        this.whoWeAreHeading =
            this.mainContent.getByRole(
                'heading',
                {
                    name: 'Who we are',
                    exact: true
                }
            );

        this.whoWeAreSection =
            this.whoWeAreHeading.locator(
                'xpath=ancestor::div[contains(@class, "paragraph")][1]'
            );

        this.whoWeAreImage =
            this.whoWeAreSection.locator(
                'img.image-style-text-image'
            );

        this.whoWeAreDescription =
            this.whoWeAreSection.locator(
                '.field--name-field-c-text'
            );

        // Onwards to No.1 section
        this.onwardsHeading =
            this.mainContent.getByRole(
                'heading',
                {
                    name: 'Onwards to No.1',
                    exact: true
                }
            );

        this.onwardsSection =
            this.onwardsHeading.locator(
                'xpath=ancestor::div[contains(@class, "paragraph")][1]'
            );

        this.onwardsImage =
            this.onwardsSection.locator(
                'img.image-style-text-image'
            );

        this.onwardsDescription =
            this.onwardsSection.locator(
                '.field--name-field-c-text'
            );

        this.discoverMoreButton =
            this.onwardsSection.getByRole(
                'link',
                {
                    name: 'Discover more',
                    exact: true
                }
            );

        // Expand Your Horizons section
        this.expandHorizonsHeading =
            this.mainContent.getByRole(
                'heading',
                {
                    name: 'Expand your horizons',
                    exact: true
                }
            );

        this.horizonCards =
            this.mainContent.locator(
                '.paragraph--type--ln-c-grid-card-item'
            );

        // More from Nestle section
        this.moreFromNestleHeading =
            this.mainContent.getByRole(
                'heading',
                {
                    name: /more from nestlé and our company/i
                }
            );

        this.moreFromNestleSection =
            this.moreFromNestleHeading.locator(
                'xpath=ancestor::div[contains(@class, "paragraph")][1]'
            );

        this.moreFromNestleImage =
            this.moreFromNestleSection.locator(
                'img.image-style-text-image'
            );
    }

    async navigate(pagePath) {
        await this.page.goto(pagePath, {
            waitUntil: 'domcontentloaded'
        });

        await this.cookieConsent
            .acceptAllCookies();

        await expect(
            this.mainContent
        ).toBeVisible();
    }

    async verifyPageNavigation(
        expectedTitle,
        expectedPath
    ) {
        await expect(this.page).toHaveURL(
            url =>
                url.pathname === expectedPath
        );

        await expect(this.page).toHaveTitle(
            expectedTitle
        );
    }

    async verifyActiveNavigation() {
        await expect(
            this.activeWhoWeAreMenu
        ).toBeVisible();

        await expect(
            this.activeAboutUsMenuLink
        ).toHaveClass(/is-active/);

        await expect(
            this.activeAboutUsMenuLink
        ).toHaveAttribute(
            'aria-current',
            'page'
        );
    }

    async verifyHeroSection(heroData) {
        await expect(
            this.heroSection
        ).toBeVisible();

        await expect(
            this.heroLabel
        ).toContainText(heroData.label);

        await expect(
            this.heroHeading
        ).toHaveText(heroData.heading);

        await expect(
            this.heroImage
        ).toBeVisible();

        await expect(
            this.heroImage
        ).toHaveAttribute(
            'src',
            /.+/
        );
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

    async verifyTravelRetailSection(
        expectedHeading
    ) {
        await this.travelRetailHeading
            .scrollIntoViewIfNeeded();

        await expect(
            this.travelRetailHeading
        ).toBeVisible();

        await expect(
            this.travelRetailHeading
        ).toHaveText(expectedHeading);

        await expect(
            this.travelRetailImage
        ).toBeVisible();

        await expect(
            this.travelRetailDescription
        ).toBeVisible();

        const description =
            await this.travelRetailDescription
                .textContent();

        expect(
            description?.trim().length,
            'Travel Retail description should not be empty'
        ).toBeGreaterThan(0);
    }

    async verifyAwardLogos(
        expectedAwardLogos,
        minimumLogoCount
    ) {
        await this.awardsSection
            .scrollIntoViewIfNeeded();

        await expect(
            this.awardsSection
        ).toBeVisible();

        const awardLogoCount =
            await this.awardLogos.count();

        expect(
            awardLogoCount,
            `Expected at least ${minimumLogoCount} award logos`
        ).toBeGreaterThanOrEqual(
            minimumLogoCount
        );

        for (
            const expectedLogo
            of expectedAwardLogos
        ) {
            const awardLogo =
                this.awardsSection.locator(
                    `img[alt="${expectedLogo}"]`
                );

            await expect(
                awardLogo,
                `Award logo should be visible: ${expectedLogo}`
            ).toBeVisible();
        }
    }

    async verifyWhoWeAreSection(
        expectedHeading
    ) {
        await this.whoWeAreHeading
            .scrollIntoViewIfNeeded();

        await expect(
            this.whoWeAreHeading
        ).toBeVisible();

        await expect(
            this.whoWeAreHeading
        ).toHaveText(expectedHeading);

        await expect(
            this.whoWeAreImage
        ).toBeVisible();

        await expect(
            this.whoWeAreDescription
        ).toBeVisible();

        await expect(
            this.whoWeAreDescription
        ).toContainText(
            'Nestlé International Travel Retail'
        );
    }

    async verifyOnwardsSection(
        expectedHeading,
        expectedPath
    ) {
        await this.onwardsHeading
            .scrollIntoViewIfNeeded();

        await expect(
            this.onwardsHeading
        ).toBeVisible();

        await expect(
            this.onwardsHeading
        ).toHaveText(expectedHeading);

        await expect(
            this.onwardsImage
        ).toBeVisible();

        await expect(
            this.onwardsDescription
        ).toBeVisible();

        await expect(
            this.discoverMoreButton
        ).toBeVisible();

        await expect(
            this.discoverMoreButton
        ).toBeEnabled();

        await expect(
            this.discoverMoreButton
        ).toHaveAttribute(
            'href',
            expectedPath
        );
    }

    async verifyExpandHorizonsSection(
        expectedHeading,
        expectedCards,
        minimumCardCount
    ) {
        await this.expandHorizonsHeading
            .scrollIntoViewIfNeeded();

        await expect(
            this.expandHorizonsHeading
        ).toBeVisible();

        await expect(
            this.expandHorizonsHeading
        ).toHaveText(expectedHeading);

        const cardCount =
            await this.horizonCards.count();

        expect(
            cardCount,
            `Expected at least ${minimumCardCount} horizon cards`
        ).toBeGreaterThanOrEqual(
            minimumCardCount
        );

        for (
            const expectedCard
            of expectedCards
        ) {
            const card =
                this.horizonCards.filter({
                    hasText: expectedCard.title
                });

            await expect(
                card,
                `Card should be visible: ${expectedCard.title}`
            ).toBeVisible();

            await expect(
                card
            ).toContainText(
                expectedCard.subtitle
            );

            const cardLink =
                card.locator('a').first();

            await expect(
                cardLink
            ).toHaveAttribute(
                'href',
                expectedCard.path
            );
        }
    }

    async verifyMoreFromNestleSection(
        expectedHeading,
        expectedLinks
    ) {
        await this.moreFromNestleHeading
            .scrollIntoViewIfNeeded();

        await expect(
            this.moreFromNestleHeading
        ).toBeVisible();

        await expect(
            this.moreFromNestleHeading
        ).toHaveText(expectedHeading);

        await expect(
            this.moreFromNestleImage
        ).toBeVisible();

        for (
            const expectedLinkText
            of expectedLinks
        ) {
            const externalLink =
                this.moreFromNestleSection
                    .getByRole(
                        'link',
                        {
                            name:
                                expectedLinkText,
                            exact: true
                        }
                    );

            await expect(
                externalLink,
                `External link should be visible: ${expectedLinkText}`
            ).toBeVisible();

            await expect(
                externalLink
            ).toHaveAttribute(
                'href',
                /^https:\/\/www\.nestle\.com\/.+/
            );
        }
    }

    async navigateToFoodCategory() {
        await this.discoverMoreButton.click();

        await this.page.waitForLoadState(
            'domcontentloaded'
        );
    }
}

module.exports = { AboutUsPage };
