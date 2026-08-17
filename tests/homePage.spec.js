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

//this is for the above code relvanted to the B2BLoginPage.js need to paste this one
//const { expect } = require('@playwright/test');

// const {
//     HeaderComponent
// } = require('./components/HeaderComponent');

// const {
//     FooterComponent
// } = require('./components/FooterComponent');

// const {
//     CookieConsentComponent
// } = require('./components/CookieConsentComponent');

// class B2BLoginPage {
//     constructor(page) {
//         this.page = page;

//         this.header = new HeaderComponent(page);
//         this.footer = new FooterComponent(page);

//         this.cookieConsent =
//             new CookieConsentComponent(page);

//         this.b2bLoginLink = page.locator(
//             [
//                 '#header a[href="/login-modal"]',
//                 '#header a.nav-link--login-modal',
//                 'a[data-drupal-link-system-path="login-modal"]'
//             ].join(', ')
//         ).first();

//         /*
//          * Drupal can render the modal with or without role="dialog".
//          * The Login form is the primary stable element.
//          */
//         this.loginForm = page.locator(
//             'form#custom-popup-login-form'
//         ).first();

//         this.loginDialog = page.locator(
//             [
//                 'div.ui-dialog:has(form#custom-popup-login-form)',
//                 'div[role="dialog"]:has(form#custom-popup-login-form)',
//                 '#drupal-modal:has(form#custom-popup-login-form)'
//             ].join(', ')
//         ).first();

//         this.modalContent = page.locator(
//             '#drupal-modal'
//         ).first();

//         this.dialogTitle = page.locator(
//             [
//                 '.ui-dialog-title',
//                 'h1.ui-dialog-title',
//                 '[role="dialog"] .ui-dialog-title'
//             ].join(', ')
//         ).first();

//         this.closeButton = page.locator(
//             [
//                 'button.ui-dialog-titlebar-close',
//                 '.ui-dialog-titlebar-close'
//             ].join(', ')
//         ).first();

//         this.modalCloseButton = this.closeButton;

//         this.welcomeHeading = this.loginForm.getByRole(
//             'heading',
//             {
//                 name: 'Welcome back',
//                 exact: true
//             }
//         );

//         this.signInInstruction = this.loginForm.getByRole(
//             'heading',
//             {
//                 name:
//                     'Please use your credentials to sign in below',
//                 exact: true
//             }
//         );

//         this.usernameInput = this.loginForm.locator(
//             'input[name="name"]'
//         ).first();

//         this.passwordInput = this.loginForm.locator(
//             'input[name="pass"]'
//         ).first();

//         this.usernameLabel = this.loginForm.locator(
//             'label[for^="edit-name"]'
//         ).first();

//         this.passwordLabel = this.loginForm.locator(
//             'label[for^="edit-pass"]'
//         ).first();

//         this.usernameDescription = this.loginForm.locator(
//             [
//                 'small[id^="edit-name"]',
//                 '[id^="edit-name"][class*="description"]'
//             ].join(', ')
//         ).first();

//         this.forgotPasswordLink =
//             this.loginForm.getByRole(
//                 'link',
//                 {
//                     name: /forgot.*password/i
//                 }
//             );

//         this.loginButton =
//             this.loginForm.getByRole(
//                 'button',
//                 {
//                     name: 'Login',
//                     exact: true
//                 }
//             );

//         this.dialogOverlay = page.locator(
//             '.ui-widget-overlay'
//         );

//         this.loginErrorMessage = page.locator(
//             [
//                 '.messages--error',
//                 '.alert-danger',
//                 '.form-item--error-message',
//                 '[role="alert"]'
//             ].join(', ')
//         ).first();

//         this.oneTrustBanner = page.locator(
//             '#onetrust-banner-sdk'
//         );

//         this.oneTrustPreferenceCenter = page.locator(
//             '#onetrust-pc-sdk'
//         );

//         this.oneTrustDarkOverlay = page.locator(
//             '.onetrust-pc-dark-filter'
//         );

//         this.acceptAllCookiesButton = page.locator(
//             '#onetrust-accept-btn-handler'
//         );

//         this.rejectAllCookiesButton = page.locator(
//             '#onetrust-reject-all-handler'
//         );

//         this.acceptRecommendedButton = page.locator(
//             '#accept-recommended-btn-handler'
//         );

//         this.savePreferencesButton = page.locator(
//             '.save-preference-btn-handler'
//         );

//         this.closePreferencesButton = page.locator(
//             '#close-pc-btn-handler'
//         );

//         this.dashboardContent = page.locator(
//             '#block-retailx-dashboardmenu'
//         );
//     }

//     async isVisible(locator, timeout = 1500) {
//         return locator.isVisible({
//             timeout
//         }).catch(() => false);
//     }

//     async clickIfVisible(locator) {
//         const visible = await this.isVisible(
//             locator
//         );

//         if (!visible) {
//             return false;
//         }

//         await locator.click({
//             force: true,
//             timeout: 5000
//         }).catch(() => {});

//         return true;
//     }

//     async ensureOneTrustIsClosed() {
//         const preferenceVisible =
//             await this.isVisible(
//                 this.oneTrustPreferenceCenter
//             );

//         const overlayVisible =
//             await this.isVisible(
//                 this.oneTrustDarkOverlay
//             );

//         if (
//             preferenceVisible ||
//             overlayVisible
//         ) {
//             const accepted =
//                 await this.clickIfVisible(
//                     this.acceptRecommendedButton
//                 );

//             if (!accepted) {
//                 const saved =
//                     await this.clickIfVisible(
//                         this.savePreferencesButton
//                     );

//                 if (!saved) {
//                     await this.clickIfVisible(
//                         this.closePreferencesButton
//                     );
//                 }
//             }
//         }

//         const bannerVisible =
//             await this.isVisible(
//                 this.oneTrustBanner
//             );

//         if (bannerVisible) {
//             const accepted =
//                 await this.clickIfVisible(
//                     this.acceptAllCookiesButton
//                 );

//             if (!accepted) {
//                 await this.clickIfVisible(
//                     this.rejectAllCookiesButton
//                 );
//             }
//         }

//         await this.oneTrustPreferenceCenter.waitFor({
//             state: 'hidden',
//             timeout: 5000
//         }).catch(() => {});

//         await this.oneTrustBanner.waitFor({
//             state: 'hidden',
//             timeout: 5000
//         }).catch(() => {});

//         await this.oneTrustDarkOverlay.waitFor({
//             state: 'hidden',
//             timeout: 5000
//         }).catch(() => {});

//         const overlayStillVisible =
//             await this.isVisible(
//                 this.oneTrustDarkOverlay
//             );

//         if (overlayStillVisible) {
//             await this.page.evaluate(() => {
//                 document
//                     .querySelectorAll(
//                         '.onetrust-pc-dark-filter'
//                     )
//                     .forEach(overlay => {
//                         overlay.style.display = 'none';
//                         overlay.style.visibility = 'hidden';
//                         overlay.style.pointerEvents = 'none';
//                     });
//             });

//             await this.oneTrustDarkOverlay.waitFor({
//                 state: 'hidden',
//                 timeout: 5000
//             }).catch(() => {});
//         }
//     }

//     async navigate(pagePath = '/') {
//         await this.page.goto(pagePath, {
//             waitUntil: 'domcontentloaded',
//             timeout: 60000
//         });

//         await expect(
//             this.header.header,
//             'Public Header should be displayed'
//         ).toBeVisible({
//             timeout: 30000
//         });

//         await this.ensureOneTrustIsClosed();

//         await expect(this.page).toHaveURL(
//             url => url.pathname === pagePath
//         );
//     }

//     async clickB2BLoginLink() {
//         await expect(
//             this.b2bLoginLink,
//             'B2B Log in link should exist'
//         ).toBeAttached({
//             timeout: 15000
//         });

//         await expect(
//             this.b2bLoginLink,
//             'B2B Log in link should be visible'
//         ).toBeVisible({
//             timeout: 15000
//         });

//         await expect(
//             this.b2bLoginLink,
//             'B2B Log in link should be enabled'
//         ).toBeEnabled();

//         await this.b2bLoginLink.click({
//             force: true,
//             timeout: 15000
//         });
//     }

//     async waitForLoginForm() {
//         return this.loginForm.waitFor({
//             state: 'visible',
//             timeout: 10000
//         }).then(() => true)
//             .catch(() => false);
//     }

//     async openLoginModal() {
//         await this.ensureOneTrustIsClosed();

//         await this.clickB2BLoginLink();

//         let formDisplayed =
//             await this.waitForLoginForm();

//         /*
//          * Drupal AJAX behavior may not be ready during the first click.
//          * Retry once using a native DOM click.
//          */
//         if (!formDisplayed) {
//             await this.ensureOneTrustIsClosed();

//             await this.b2bLoginLink.evaluate(
//                 linkElement => linkElement.click()
//             );

//             formDisplayed =
//                 await this.waitForLoginForm();
//         }

//         expect(
//             formDisplayed,
//             'B2B Login form should open after clicking the Header link'
//         ).toBeTruthy();

//         await expect(
//             this.loginForm,
//             'B2B Login form should be displayed'
//         ).toBeVisible({
//             timeout: 15000
//         });

//         await expect(
//             this.usernameInput,
//             'B2B username field should be displayed'
//         ).toBeVisible({
//             timeout: 15000
//         });

//         await expect(
//             this.passwordInput,
//             'B2B password field should be displayed'
//         ).toBeVisible({
//             timeout: 15000
//         });

//         await this.ensureOneTrustIsClosed();
//     }

//     async verifyModalDisplayed(
//         expectedModal
//     ) {
//         await expect(
//             this.loginForm
//         ).toBeVisible();

//         const dialogTitleCount =
//             await this.dialogTitle.count();

//         if (
//             dialogTitleCount > 0 &&
//             expectedModal?.dialogTitle
//         ) {
//             await expect(
//                 this.dialogTitle
//             ).toHaveText(
//                 expectedModal.dialogTitle
//             );
//         }

//         if (expectedModal?.heading) {
//             await expect(
//                 this.welcomeHeading
//             ).toHaveText(
//                 expectedModal.heading
//             );
//         }

//         if (expectedModal?.instruction) {
//             await expect(
//                 this.signInInstruction
//             ).toHaveText(
//                 expectedModal.instruction
//             );
//         }
//     }

//     async verifyLoginModal() {
//         await expect(
//             this.loginForm
//         ).toBeVisible();

//         await expect(
//             this.usernameInput
//         ).toBeVisible();

//         await expect(
//             this.passwordInput
//         ).toBeVisible();

//         await expect(
//             this.loginButton
//         ).toBeVisible();
//     }

//     async verifyUsernameField(
//         expectedFields,
//         expectedValidation
//     ) {
//         await expect(
//             this.usernameLabel
//         ).toBeVisible();

//         await expect(
//             this.usernameLabel
//         ).toContainText(
//             expectedFields.usernameLabel
//         );

//         await expect(
//             this.usernameInput
//         ).toBeVisible();

//         await expect(
//             this.usernameInput
//         ).toBeEnabled();

//         await expect(
//             this.usernameInput
//         ).toHaveAttribute(
//             'type',
//             'text'
//         );

//         await expect(
//             this.usernameInput
//         ).toHaveAttribute(
//             'name',
//             'name'
//         );

//         if (
//             expectedValidation
//                 .usernameMaximumLength
//         ) {
//             await expect(
//                 this.usernameInput
//             ).toHaveAttribute(
//                 'maxlength',
//                 expectedValidation
//                     .usernameMaximumLength
//             );
//         }

//         if (
//             expectedValidation
//                 .usernameRequired
//         ) {
//             await expect(
//                 this.usernameInput
//             ).toHaveAttribute(
//                 'required',
//                 'required'
//             );
//         }

//         const descriptionCount =
//             await this.usernameDescription.count();

//         if (
//             descriptionCount > 0 &&
//             expectedFields.usernameDescription
//         ) {
//             await expect(
//                 this.usernameDescription
//             ).toContainText(
//                 expectedFields.usernameDescription
//             );
//         }
//     }

//     async verifyPasswordField(
//         expectedFields,
//         expectedValidation
//     ) {
//         await expect(
//             this.passwordLabel
//         ).toBeVisible();

//         await expect(
//             this.passwordLabel
//         ).toContainText(
//             expectedFields.passwordLabel
//         );

//         await expect(
//             this.passwordInput
//         ).toBeVisible();

//         await expect(
//             this.passwordInput
//         ).toBeEnabled();

//         await expect(
//             this.passwordInput
//         ).toHaveAttribute(
//             'type',
//             expectedValidation.passwordInputType
//         );

//         await expect(
//             this.passwordInput
//         ).toHaveAttribute(
//             'name',
//             'pass'
//         );

//         if (
//             expectedValidation
//                 .passwordMaximumLength
//         ) {
//             await expect(
//                 this.passwordInput
//             ).toHaveAttribute(
//                 'maxlength',
//                 expectedValidation
//                     .passwordMaximumLength
//             );
//         }

//         if (
//             expectedValidation
//                 .passwordRequired
//         ) {
//             await expect(
//                 this.passwordInput
//             ).toHaveAttribute(
//                 'required',
//                 'required'
//             );
//         }
//     }

//     async verifyFieldsInitiallyEmpty() {
//         await expect(
//             this.usernameInput
//         ).toHaveValue('');

//         await expect(
//             this.passwordInput
//         ).toHaveValue('');
//     }

//     async verifyForgotPasswordLink(
//         expectedText,
//         expectedPath
//     ) {
//         await expect(
//             this.forgotPasswordLink
//         ).toBeVisible();

//         if (expectedText) {
//             await expect(
//                 this.forgotPasswordLink
//             ).toHaveText(expectedText);
//         }

//         if (expectedPath) {
//             await expect(
//                 this.forgotPasswordLink
//             ).toHaveAttribute(
//                 'href',
//                 expectedPath
//             );
//         }
//     }

//     async verifyLoginButton(
//         expectedText
//     ) {
//         await expect(
//             this.loginButton
//         ).toBeVisible();

//         await expect(
//             this.loginButton
//         ).toBeEnabled();

//         await expect(
//             this.loginButton
//         ).toHaveText(expectedText);

//         await expect(
//             this.loginButton
//         ).toHaveAttribute(
//             'type',
//             'submit'
//         );
//     }

//     async verifyCloseButton() {
//         await expect(
//             this.closeButton
//         ).toBeVisible();

//         await expect(
//             this.closeButton
//         ).toBeEnabled();
//     }

//     async fillUsername(username) {
//         expect(
//             username,
//             'B2B username should be provided'
//         ).toBeTruthy();

//         await this.usernameInput.fill(
//             username
//         );
//     }

//     async fillPassword(password) {
//         expect(
//             password,
//             'B2B password should be provided'
//         ).toBeTruthy();

//         await this.passwordInput.fill(
//             password
//         );
//     }

//     async fillCredentials(
//         username,
//         password
//     ) {
//         await this.fillUsername(username);

//         await this.fillPassword(password);
//     }

//     async verifyCredentialsEntered() {
//         const usernameValue =
//             await this.usernameInput.inputValue();

//         const passwordValue =
//             await this.passwordInput.inputValue();

//         expect(
//             usernameValue.length,
//             'Username field should contain a value'
//         ).toBeGreaterThan(0);

//         expect(
//             passwordValue.length,
//             'Password field should contain a value'
//         ).toBeGreaterThan(0);

//         await expect(
//             this.passwordInput
//         ).toHaveAttribute(
//             'type',
//             'password'
//         );
//     }

//     async submitLogin(
//         expectedDashboardPath = '/dashboard'
//     ) {
//         await this.ensureOneTrustIsClosed();

//         await expect(
//             this.loginButton
//         ).toBeVisible({
//             timeout: 15000
//         });

//         await expect(
//             this.loginButton
//         ).toBeEnabled();

//         await this.loginButton.click({
//             force: true,
//             timeout: 15000
//         });

//         await expect(this.page).toHaveURL(
//             url =>
//                 url.pathname ===
//                 expectedDashboardPath,
//             {
//                 timeout: 30000
//             }
//         );

//         await expect(
//             this.dashboardContent
//         ).toBeVisible({
//             timeout: 30000
//         });
//     }

//     async login(
//         username,
//         password,
//         expectedDashboardPath
//     ) {
//         await this.fillCredentials(
//             username,
//             password
//         );

//         await this.verifyCredentialsEntered();

//         await this.submitLogin(
//             expectedDashboardPath
//         );
//     }

//     async verifyLoginErrorDisplayed() {
//         await expect(
//             this.loginErrorMessage
//         ).toBeVisible();
//     }

//     async openForgotPasswordPage(
//         expectedPath
//     ) {
//         await this.forgotPasswordLink.click();

//         await expect(this.page).toHaveURL(
//             url => url.pathname === expectedPath
//         );
//     }

//     async closeLoginModal() {
//         await expect(
//             this.closeButton
//         ).toBeVisible();

//         await this.closeButton.click({
//             force: true
//         });

//         await expect(
//             this.loginForm
//         ).toBeHidden({
//             timeout: 10000
//         });
//     }

//     async verifyModalClosed() {
//         await expect(
//             this.loginForm
//         ).toBeHidden();
//     }

//     async verifyCurrentPagePath(
//         expectedPath
//     ) {
//         await expect(this.page).toHaveURL(
//             url => url.pathname === expectedPath
//         );
//     }
// }

// module.exports = {
//     B2BLoginPage
// };


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
    'Nestle International Travel Retail Home Page',
    () => {
        test(
            'Validate all Home page components and navigation',
            async ({ page }) => {
                const homePage =
                    new HomePage(page);

                await test.step(
                    'Navigate to the Home page',
                    async () => {
                        await homePage.navigate(
                            homePageData.pagePath
                        );

                        await homePage
                            .verifyHomePageNavigation(
                                homePageData
                                    .expectedTitle,

                                homePageData
                                    .breadcrumb
                            );
                    }
                );

                await test.step(
                    'Verify the Nestle International Travel Retail logo',
                    async () => {
                        await homePage.header
                            .verifyLogoDisplayed();
                    }
                );

                await test.step(
                    'Verify Header components',
                    async () => {
                        await homePage.header
                            .verifyHeaderDisplayed();

                        await homePage.header
                            .verifyNavigationDisplayed();
                    }
                );

                await test.step(
                    'Verify Products tab',
                    async () => {
                        await expect(
                            homePage.header.productsLink
                        ).toBeVisible();

                        await expect(
                            homePage.header.productsLink
                        ).toHaveAttribute(
                            'href',
                            homePageData
                                .paths
                                .products
                        );
                    }
                );

                await test.step(
                    'Verify Who We Are menu',
                    async () => {
                        await expect(
                            homePage.header.whoWeAreMenu
                        ).toBeVisible();

                        await homePage.header
                            .verifyWhoWeAreLinksExist();
                    }
                );

                await test.step(
                    'Verify B2B Log In tab',
                    async () => {
                        await homePage.header
                            .verifyPublicB2BLoginDisplayed();
                    }
                );

                await test.step(
                    'Verify Contact Us tab',
                    async () => {
                        await expect(
                            homePage.header.contactUsLink
                        ).toBeVisible();

                        await expect(
                            homePage.header.contactUsLink
                        ).toHaveAttribute(
                            'href',
                            '/contact-us'
                        );
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
                        await homePage
                            .verifyHeroSection(
                                homePageData
                                    .headings
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
                        await homePage
                            .verifyBrandLogos(
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

                        await homePage
                            .navigateToProducts();

                        await expect(page).toHaveURL(
                            new RegExp(
                                `${homePageData
                                    .paths
                                    .products}/?$`
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
                            url =>
                                url.pathname === '/'
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
                                `${homePageData
                                    .paths
                                    .userLogin}/?$`
                            )
                        );
                    }
                );
            }
        );
    }
);