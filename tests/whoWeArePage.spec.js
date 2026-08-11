const { test } = require('@playwright/test');

const {
    AboutUsPage
} = require('../pages/whoWeAre/AboutUsPage');

const testData = require(
    '../testData/whoWeArePageData.json'
);

const aboutUsData = testData.aboutUs;

test.describe('About Us page', () => {
    test.beforeEach(async ({ page }) => {
        const aboutUsPage = new AboutUsPage(page);

        await aboutUsPage.navigate(
            aboutUsData.pagePath
        );
    });

    test(
        'page navigation and active navigation are correct',
        async ({ page }) => {
            const aboutUsPage = new AboutUsPage(page);

            await aboutUsPage.verifyPageNavigation(
                aboutUsData.expectedTitle,
                aboutUsData.paths.aboutUs
            );

            await aboutUsPage.verifyActiveNavigation();
            await aboutUsPage.verifyBreadcrumb(
                aboutUsData.breadcrumb
            );
        }
    );

    test(
        'hero section is displayed',
        async ({ page }) => {
            const aboutUsPage = new AboutUsPage(page);

            await aboutUsPage.verifyHeroSection(
                aboutUsData.hero
            );
        }
    );

    test(
        'travel retail experience section is displayed',
        async ({ page }) => {
            const aboutUsPage = new AboutUsPage(page);

            await aboutUsPage.verifyTravelRetailSection(
                aboutUsData.sections.travelRetailExperience
            );
        }
    );

    test(
        'award logos are displayed',
        async ({ page }) => {
            const aboutUsPage = new AboutUsPage(page);

            await aboutUsPage.verifyAwardLogos(
                aboutUsData.awardLogos,
                aboutUsData.minimumAwardLogoCount
            );
        }
    );

    test(
        'Who we are section is displayed',
        async ({ page }) => {
            const aboutUsPage = new AboutUsPage(page);

            await aboutUsPage.verifyWhoWeAreSection(
                aboutUsData.sections.whoWeAre
            );
        }
    );

    test(
        'Onwards to No.1 section is displayed',
        async ({ page }) => {
            const aboutUsPage = new AboutUsPage(page);

            await aboutUsPage.verifyOnwardsSection(
                aboutUsData.sections.onwardsToNumberOne,
                aboutUsData.paths.foodCategory
            );
        }
    );

    test(
        'Expand your horizons cards are displayed',
        async ({ page }) => {
            const aboutUsPage = new AboutUsPage(page);

            await aboutUsPage.verifyExpandHorizonsSection(
                aboutUsData.sections.expandYourHorizons,
                aboutUsData.cards,
                aboutUsData.minimumHorizonCardCount
            );
        }
    );

    test(
        'More from Nestle links are displayed',
        async ({ page }) => {
            const aboutUsPage = new AboutUsPage(page);

            await aboutUsPage.verifyMoreFromNestleSection(
                aboutUsData.sections.moreFromNestle,
                aboutUsData.externalLinks
            );
        }
    );
});

