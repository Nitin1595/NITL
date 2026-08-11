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

class FoodCategoryPage {
    constructor(page) {
        this.page = page;

        // Reusable website components
        this.header = new HeaderComponent(page);
        this.footer = new FooterComponent(page);
        this.cookieConsent =
            new CookieConsentComponent(page);

        // Main page content
        this.mainContent = page.locator(
            '#block-retailx-content'
        );

        // Active Who We Are navigation
        this.activeWhoWeAreMenu = page.locator(
            '#header li.menu-item--expanded.active'
        );

        this.activeFoodCategoryLink =
            this.activeWhoWeAreMenu.locator(
                'a.nav-link--food-1-category'
            );

        // Hero section
        this.heroSection = page.locator(
            '#block-hero'
        );

        this.heroDescription =
            this.heroSection.getByRole(
                'heading',
                {
                    level: 6
                }
            );

        this.heroHeading =
            this.heroSection.getByRole(
                'heading',
                {
                    level: 1
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

        // Helping the food category take off
        this.helpingFoodHeading =
            this.mainContent.getByRole(
                'heading',
                {
                    name:
                        'Helping the food category take off',
                    exact: true
                }
            );

        this.helpingFoodSection =
            this.helpingFoodHeading.locator(
                'xpath=ancestor::div[contains(@class, "paragraph")][1]'
            );

        this.helpingFoodDescription =
            this.helpingFoodSection.locator(
                '.field--name-field-c-text'
            );

        // Research graph
        this.researchGraphImage =
            this.mainContent.locator(
                'img[src*="3_Food_2_Graphs"]'
            );

        this.researchText =
            this.mainContent.getByText(
                /in-depth research study/i
            );

        // Taking the category to new shores
        this.newShoresHeading =
            this.mainContent.getByRole(
                'heading',
                {
                    name:
                        /taking the category to new shores/i
                }
            );

        this.newShoresSection =
            this.newShoresHeading.locator(
                'xpath=ancestor::div[contains(@class, "paragraph")][1]'
            );

        this.newShoresImage =
            this.newShoresSection.locator(
                'img.image-style-text-image'
            );

        this.newShoresDescription =
            this.newShoresSection.locator(
                '.field--name-field-c-text'
            );

        // Introducing VERSE
        this.verseHeading =
            this.mainContent.getByRole(
                'heading',
                {
                    name: 'Introducing VERSE',
                    exact: true
                }
            );

        this.verseSection =
            this.verseHeading.locator(
                'xpath=ancestor::div[contains(@class, "field__item")][1]'
            );

        this.verseDescription =
            this.verseHeading
                .locator(
                    'xpath=ancestor::div[contains(@class, "paragraph")][1]'
                )
                .locator(
                    '.field--name-field-c-text'
                );

        this.verseMainImage =
            this.mainContent.locator(
                'img[src*="VERSE"]'
            ).first();

        /*
         * Original slides only.
         * Slick creates cloned slides for carousel animation.
         */
        this.verseOriginalSlides =
            this.mainContent.locator(
                '.slick-slide:not(.slick-cloned) ' +
                '.paragraph--type--c-teasercycle-item'
            );

        /*
         * Carousel controls are optional.
         * Slick may hide or remove these controls when all four
         * cards fit within the desktop viewport.
         */
        this.verseCarousel =
            this.mainContent.locator(
                '.paragraph--type--c-teasercycle'
            ).filter({
                has: this.mainContent.getByText(
                    /the 5 key drivers of growth in food/i
                )
            });

        this.verseNextButton =
            this.mainContent.locator(
                'button.slick-next[aria-label="Next"]'
            );

        this.versePreviousButton =
            this.mainContent.locator(
                'button.slick-prev[aria-label="Previous"]'
            );

        // Beyond Confectionery
        this.beyondConfectioneryHeading =
            this.mainContent.getByRole(
                'heading',
                {
                    name: 'Beyond Confectionery',
                    exact: true
                }
            );

        this.beyondConfectionerySection =
            this.beyondConfectioneryHeading.locator(
                'xpath=ancestor::div[contains(@class, "paragraph")][1]'
            );

        this.beyondConfectioneryCards =
            this.beyondConfectionerySection.locator(
                '.paragraph--type--ln-c-grid-card-item'
            );

        // A Powerful Companion
        this.powerfulCompanionHeading =
            this.mainContent.getByRole(
                'heading',
                {
                    name: 'A Powerful Companion',
                    exact: true
                }
            );

        this.powerfulCompanionSection =
            this.powerfulCompanionHeading.locator(
                'xpath=ancestor::div[contains(@class, "paragraph")][1]'
            );

        this.powerfulCompanionDescription =
            this.powerfulCompanionSection.locator(
                '.field--name-field-c-text'
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
            this.activeFoodCategoryLink
        ).toHaveClass(/is-active/);

        await expect(
            this.activeFoodCategoryLink
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
            this.heroHeading
        ).toHaveText(heroData.heading);

        await expect(
            this.heroDescription
        ).toHaveText(heroData.description);

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

    async verifyHelpingFoodSection(
        expectedHeading,
        expectedKeyword
    ) {
        await this.helpingFoodHeading
            .scrollIntoViewIfNeeded();

        await expect(
            this.helpingFoodHeading
        ).toBeVisible();

        await expect(
            this.helpingFoodHeading
        ).toHaveText(expectedHeading);

        await expect(
            this.helpingFoodDescription
        ).toBeVisible();

        await expect(
            this.helpingFoodDescription
        ).toContainText(expectedKeyword);
    }

    async verifyResearchSection(
        expectedKeyword
    ) {
        await this.researchGraphImage
            .scrollIntoViewIfNeeded();

        await expect(
            this.researchGraphImage
        ).toBeVisible();

        await expect(
            this.researchGraphImage
        ).toHaveAttribute(
            'src',
            /.+/
        );

        await expect(
            this.researchText
        ).toBeVisible();

        await expect(
            this.researchText
        ).toContainText(expectedKeyword);
    }

    async verifyNewShoresSection(
        expectedHeading,
        basketKeyword,
        progressKeyword
    ) {
        await this.newShoresHeading
            .scrollIntoViewIfNeeded();

        await expect(
            this.newShoresHeading
        ).toBeVisible();

        await expect(
            this.newShoresHeading
        ).toHaveText(expectedHeading);

        await expect(
            this.newShoresImage
        ).toBeVisible();

        await expect(
            this.newShoresDescription
        ).toContainText(basketKeyword);

        await expect(
            this.newShoresDescription
        ).toContainText(progressKeyword);
    }

    async verifyVerseSection(
        expectedHeading,
        expectedDescription,
        expectedDrivers,
        minimumDriverCount
    ) {
        await this.verseHeading
            .scrollIntoViewIfNeeded();

        await expect(
            this.verseHeading
        ).toBeVisible();

        await expect(
            this.verseHeading
        ).toHaveText(expectedHeading);

        await expect(
            this.verseDescription
        ).toContainText(
            expectedDescription
        );

        await expect(
            this.verseMainImage
        ).toBeVisible();

        const driverCount =
            await this.verseOriginalSlides.count();

        expect(
            driverCount,
            `Expected at least ${minimumDriverCount} VERSE drivers`
        ).toBeGreaterThanOrEqual(
            minimumDriverCount
        );

        for (
            const expectedDriver
            of expectedDrivers
        ) {
            const driverCard =
                this.verseOriginalSlides.filter({
                    hasText:
                        expectedDriver.title
                });

            await expect(
                driverCard,
                `VERSE driver should exist: ${expectedDriver.title}`
            ).toBeAttached();

            await expect(
                driverCard
            ).toContainText(
                expectedDriver.description
            );

            const driverImage =
                driverCard.locator('img');

            await expect(
                driverImage
            ).toBeAttached();

            await expect(
                driverImage
            ).toHaveAttribute(
                'src',
                /.+/
            );
        }
    }

    async verifyVerseControls() {
        const nextButtonCount =
            await this.verseNextButton.count();

        const previousButtonCount =
            await this.versePreviousButton.count();

        /*
         * Controls are not required when Slick displays all
         * VERSE cards simultaneously on the current viewport.
         */
        if (
            nextButtonCount === 0 ||
            previousButtonCount === 0
        ) {
            console.log(
                'VERSE carousel controls are not rendered because all cards fit in the viewport.'
            );

            return;
        }

        const nextButtonVisible =
            await this.verseNextButton
                .isVisible()
                .catch(() => false);

        const previousButtonVisible =
            await this.versePreviousButton
                .isVisible()
                .catch(() => false);

        if (
            !nextButtonVisible ||
            !previousButtonVisible
        ) {
            console.log(
                'VERSE carousel controls are hidden because navigation is not required at this viewport.'
            );

            return;
        }

        await expect(
            this.verseNextButton
        ).toBeEnabled();

        await expect(
            this.versePreviousButton
        ).toBeEnabled();
    }

    async verifyBeyondConfectionerySection(
        expectedHeading,
        expectedCards,
        minimumCardCount
    ) {
        await this.beyondConfectioneryHeading
            .scrollIntoViewIfNeeded();

        await expect(
            this.beyondConfectioneryHeading
        ).toBeVisible();

        await expect(
            this.beyondConfectioneryHeading
        ).toHaveText(expectedHeading);

        const cardCount =
            await this.beyondConfectioneryCards.count();

        expect(
            cardCount,
            `Expected at least ${minimumCardCount} Beyond Confectionery cards`
        ).toBeGreaterThanOrEqual(
            minimumCardCount
        );

        for (
            const expectedCard
            of expectedCards
        ) {
            const card =
                this.beyondConfectioneryCards.filter({
                    hasText:
                        expectedCard.title
                });

            await expect(
                card,
                `Card should be visible: ${expectedCard.title}`
            ).toBeVisible();

            await expect(
                card
            ).toContainText(
                expectedCard.descriptionKeyword
            );

            const cardImage =
                card.locator('img');

            await expect(
                cardImage
            ).toBeVisible();

            await expect(
                cardImage
            ).toHaveAttribute(
                'src',
                /.+/
            );
        }
    }

    async verifyPowerfulCompanionSection(
        expectedHeading,
        expectedKeyword
    ) {
        await this.powerfulCompanionHeading
            .scrollIntoViewIfNeeded();

        await expect(
            this.powerfulCompanionHeading
        ).toBeVisible();

        await expect(
            this.powerfulCompanionHeading
        ).toHaveText(expectedHeading);

        await expect(
            this.powerfulCompanionDescription
        ).toBeVisible();

        await expect(
            this.powerfulCompanionDescription
        ).toContainText(
            expectedKeyword
        );
    }
}

module.exports = { FoodCategoryPage };
