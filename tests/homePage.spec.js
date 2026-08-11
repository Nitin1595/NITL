// const { test, expect } = require('@playwright/test');

// const { HomePage } = require('../pages/HomePage');

// const homePageData = require(
//     '../testData/homePageData.json'
// );

// test.describe(
//     'NestlÃ© International Travel Retail Home Page',
//     () => {
//         test.beforeEach(async ({ page }) => {
//             const homePage = new HomePage(page);

//             await homePage.navigate(
//                 homePageData.pagePath
//             );
//         });

//         test(
//             'Navigation to Home page',
//             async ({ page }) => {
//                 const homePage = new HomePage(page);

//                 await homePage.verifyHomePageNavigation(
//                     homePageData.expectedTitle,
//                     homePageData.breadcrumb
//                 );
//             }
//         );

//         test(
//             'NestlÃ© International Travel Retail logo is displayed',
//             async ({ page }) => {
//                 const homePage = new HomePage(page);

//                 await homePage.header
//                     .verifyLogoDisplayed();
//             }
//         );

//         test(
//             'Products tab is displayed on Home page',
//             async ({ page }) => {
//                 const homePage = new HomePage(page);

//                 await expect(
//                     homePage.header.productsLink
//                 ).toBeVisible();
//             }
//         );

//         test(
//             'Who We Are menu is displayed on Home page',
//             async ({ page }) => {
//                 const homePage = new HomePage(page);

//                 await expect(
//                     homePage.header.whoWeAreMenu
//                 ).toBeVisible();
//             }
//         );

//         test(
//             'B2B Log In tab is displayed on Home page',
//             async ({ page }) => {
//                 const homePage = new HomePage(page);

//                 await expect(
//                     homePage.header.b2bLoginLink
//                 ).toBeVisible();
//             }
//         );

//         test(
//             'Contact Us tab is displayed on Home page',
//             async ({ page }) => {
//                 const homePage = new HomePage(page);

//                 await expect(
//                     homePage.header.contactUsLink
//                 ).toBeVisible();
//             }
//         );

//         test(
//             'Search icon is displayed on Home page',
//             async ({ page }) => {
//                 const homePage = new HomePage(page);

//                 await homePage.header
//                     .verifySearchButtonDisplayed();
//             }
//         );

//         test(
//             'Travel with a trusted partner banner is displayed',
//             async ({ page }) => {
//                 const homePage = new HomePage(page);

//                 await homePage.verifyHeroSection(
//                     homePageData.headings
//                 );
//             }
//         );

//         test(
//             'Making travel retail fly section is displayed',
//             async ({ page }) => {
//                 const homePage = new HomePage(page);

//                 await homePage
//                     .verifyIntroductionSection(
//                         homePageData.headings
//                             .introduction
//                     );
//             }
//         );

//         test(
//             'Brand logos are displayed on Home page',
//             async ({ page }) => {
//                 const homePage = new HomePage(page);

//                 await homePage.verifyBrandLogos(
//                     homePageData.minimumBrandLogoCount
//                 );
//             }
//         );

//         test(
//             'View all products button is working',
//             async ({ page }) => {
//                 const homePage = new HomePage(page);

//                 await homePage
//                     .verifyViewAllProductsButton();

//                 await homePage.navigateToProducts();

//                 await expect(page).toHaveURL(
//                     new RegExp(
//                         `${homePageData.paths.products}/?$`
//                     )
//                 );
//             }
//         );

//         test(
//             'Travel Retail Business Lounge section is displayed',
//             async ({ page }) => {
//                 const homePage = new HomePage(page);

//                 await homePage
//                     .verifyBusinessLoungeSection(
//                         homePageData.headings
//                             .businessLounge
//                     );
//             }
//         );

//         test(
//             'Prepare for take off button is displayed',
//             async ({ page }) => {
//                 const homePage = new HomePage(page);

//                 await homePage
//                     .verifyPrepareForTakeOffButton();
//             }
//         );

//         test(
//             'Prepare for take off button navigates to Login page',
//             async ({ page }) => {
//                 const homePage = new HomePage(page);

//                 await homePage.navigateToUserLogin();

//                 await expect(page).toHaveURL(
//                     new RegExp(
//                         `${homePageData.paths.userLogin}/?$`
//                     )
//                 );
//             }
//         );

//         test(
//             'Footer navigation links are displayed',
//             async ({ page }) => {
//                 const homePage = new HomePage(page);

//                 await homePage.footer
//                     .verifyFooterNavigationDisplayed();
//             }
//         );
//     }
// );


// // test('Basic Playwright test', async ({ page }) => {
// //     const response = await page.goto('/', {
// //         waitUntil: 'domcontentloaded',
// //         timeout: 60000
// //     });

// //     expect(response).not.toBeNull();

// //     expect(
// //         response.status(),
// //         `Website returned HTTP status ${response.status()}`
// //     ).toBeLessThan(500);

// //     await expect(page).toHaveURL(
// //         /master-copy-h5hl5dy-fcsle4rj4pg7c\.eu-5\.platformsh\.site/
// //     );
// // });

const {
    test,
    expect
} = require('@playwright/test');

const {
    HomePage
} = require('../pages/HomePage');

const homePageData = require(
    '../testData/homePageData.json'
);

test.describe(
    'Nestlé International Travel Retail Home Page',
    () => {
        test(
            'Validate all Home page components and navigation',
            async ({ page }) => {
                const homePage = new HomePage(page);

                await test.step(
                    'Navigate to the Home page',
                    async () => {
                        await homePage.navigate(
                            homePageData.pagePath
                        );

                        await homePage
                            .verifyHomePageNavigation(
                                homePageData.expectedTitle,
                                homePageData.breadcrumb
                            );
                    }
                );

                await test.step(
                    'Verify the Nestlé International Travel Retail logo',
                    async () => {
                        await homePage.header
                            .verifyLogoDisplayed();
                    }
                );

                await test.step(
                    'Verify Products tab',
                    async () => {
                        await expect(
                            homePage.header.productsLink
                        ).toBeVisible();
                    }
                );

                await test.step(
                    'Verify Who We Are menu',
                    async () => {
                        await expect(
                            homePage.header.whoWeAreMenu
                        ).toBeVisible();
                    }
                );

                await test.step(
                    'Verify B2B Log In tab',
                    async () => {
                        await expect(
                            homePage.header.b2bLoginLink
                        ).toBeVisible();
                    }
                );

                await test.step(
                    'Verify Contact Us tab',
                    async () => {
                        await expect(
                            homePage.header.contactUsLink
                        ).toBeVisible();
                    }
                );

                await test.step(
                    'Verify Search icon',
                    async () => {
                        await homePage.header
                            .verifySearchButtonDisplayed();
                    }
                );

                await test.step(
                    'Verify Travel with a trusted partner banner',
                    async () => {
                        await homePage.verifyHeroSection(
                            homePageData.headings
                        );
                    }
                );

                await test.step(
                    'Verify Making travel retail fly section',
                    async () => {
                        await homePage
                            .verifyIntroductionSection(
                                homePageData
                                    .headings
                                    .introduction
                            );
                    }
                );

                await test.step(
                    'Verify brand logos',
                    async () => {
                        await homePage.verifyBrandLogos(
                            homePageData
                                .minimumBrandLogoCount
                        );
                    }
                );

                await test.step(
                    'Verify Travel Retail Business Lounge section',
                    async () => {
                        await homePage
                            .verifyBusinessLoungeSection(
                                homePageData
                                    .headings
                                    .businessLounge
                            );
                    }
                );

                await test.step(
                    'Verify Prepare for take off button',
                    async () => {
                        await homePage
                            .verifyPrepareForTakeOffButton();
                    }
                );

                await test.step(
                    'Verify Footer navigation links',
                    async () => {
                        await homePage.footer
                            .verifyFooterNavigationDisplayed();
                    }
                );

                await test.step(
                    'Verify View all products button navigation',
                    async () => {
                        await homePage
                            .verifyViewAllProductsButton();

                        await homePage.navigateToProducts();

                        await expect(page).toHaveURL(
                            new RegExp(
                                `${homePageData.paths.products}/?$`
                            )
                        );
                    }
                );

                await test.step(
                    'Return to the Home page',
                    async () => {
                        await homePage.header
                            .navigateToHome();

                        await expect(page).toHaveURL(
                            /\/$/
                        );
                    }
                );

                await test.step(
                    'Verify Prepare for take off navigation',
                    async () => {
                        await homePage
                            .navigateToUserLogin();

                        await expect(page).toHaveURL(
                            new RegExp(
                                `${homePageData.paths.userLogin}/?$`
                            )
                        );
                    }
                );
            }
        );
    }
);
