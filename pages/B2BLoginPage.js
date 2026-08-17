const { expect } = require('@playwright/test');

const {
    HeaderComponent
} = require('./components/HeaderComponent');

const {
    FooterComponent
} = require('./components/FooterComponent');

const {
    CookieConsentComponent
} = require('./components/CookieConsentComponent');

class B2BLoginPage {
    constructor(page) {
        this.page = page;

        this.header = new HeaderComponent(page);
        this.footer = new FooterComponent(page);

        this.cookieConsent =
            new CookieConsentComponent(page);

        this.b2bLoginLink = page.locator(
            [
                '#header a[href="/login-modal"]',
                '#header a.nav-link--login-modal',
                'a[data-drupal-link-system-path="login-modal"]'
            ].join(', ')
        ).first();

        /*
         * Stable Drupal Login form.
         * This is the primary modal-open indicator.
         */
        this.loginForm = page.locator(
            'form#custom-popup-login-form'
        ).first();

        /*
         * Modal content can contain text outside the form.
         */
        this.modalContent = page.locator(
            '#drupal-modal'
        ).filter({
            has: this.loginForm
        }).first();

        this.loginDialog = this.loginForm.locator(
            'xpath=ancestor::*[contains(@class, "ui-dialog")][1]'
        );

        this.dialogTitle = page.locator(
            '.ui-dialog-title'
        ).first();

        this.closeButton = page.locator(
            'button.ui-dialog-titlebar-close'
        ).first();

        this.modalCloseButton =
            this.closeButton;

        /*
         * Flexible text locators.
         * These do not depend on heading roles.
         */
        this.welcomeHeading = this.modalContent
            .getByText(
                'Welcome back',
                {
                    exact: true
                }
            )
            .first();

        this.signInInstruction = this.modalContent
            .getByText(
                'Please use your credentials to sign in below',
                {
                    exact: true
                }
            )
            .first();

        this.usernameInput =
            this.loginForm.locator(
                'input[name="name"]'
            ).first();

        this.passwordInput =
            this.loginForm.locator(
                'input[name="pass"]'
            ).first();

        this.usernameLabel =
            this.loginForm.locator(
                'label[for^="edit-name"]'
            ).first();

        this.passwordLabel =
            this.loginForm.locator(
                'label[for^="edit-pass"]'
            ).first();

        this.usernameDescription =
            this.loginForm.locator(
                [
                    'small[id^="edit-name"]',
                    '[id^="edit-name"][class*="description"]'
                ].join(', ')
            ).first();

        this.forgotPasswordLink =
            this.loginForm.getByRole(
                'link',
                {
                    name: /forgot.*password/i
                }
            );

        this.loginButton =
            this.loginForm.getByRole(
                'button',
                {
                    name: 'Login',
                    exact: true
                }
            );

        this.dialogOverlay = page.locator(
            '.ui-widget-overlay'
        );

        this.loginErrorMessage = page.locator(
            [
                '.messages--error',
                '.alert-danger',
                '.form-item--error-message',
                '[role="alert"]'
            ].join(', ')
        ).first();

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

        this.dashboardContent = page.locator(
            '#block-retailx-dashboardmenu'
        );
    }

    async isVisible(
        locator,
        timeout = 1500
    ) {
        return locator.isVisible({
            timeout
        }).catch(() => false);
    }

    async clickIfVisible(locator) {
        const visible =
            await this.isVisible(locator);

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

        if (
            preferenceVisible ||
            overlayVisible
        ) {
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

        await this.oneTrustBanner.waitFor({
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
                        overlay.style.display =
                            'none';

                        overlay.style.visibility =
                            'hidden';

                        overlay.style.pointerEvents =
                            'none';
                    });
            });

            await this.oneTrustDarkOverlay.waitFor({
                state: 'hidden',
                timeout: 5000
            }).catch(() => {});
        }
    }

    async navigate(pagePath = '/') {
        await this.page.goto(pagePath, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        await expect(
            this.header.header,
            'Public Header should be displayed'
        ).toBeVisible({
            timeout: 30000
        });

        await this.ensureOneTrustIsClosed();

        await expect(this.page).toHaveURL(
            url =>
                url.pathname === pagePath
        );
    }

    async clickB2BLoginLink() {
        await expect(
            this.b2bLoginLink,
            'B2B Log in link should exist'
        ).toBeAttached({
            timeout: 15000
        });

        await expect(
            this.b2bLoginLink,
            'B2B Log in link should be visible'
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.b2bLoginLink,
            'B2B Log in link should be enabled'
        ).toBeEnabled();

        await this.b2bLoginLink.click({
            force: true,
            timeout: 15000
        });
    }

    async waitForLoginForm(
        timeout = 15000
    ) {
        return this.loginForm
            .waitFor({
                state: 'visible',
                timeout
            })
            .then(() => true)
            .catch(() => false);
    }

    async openLoginModal() {
        await this.ensureOneTrustIsClosed();

        await this.clickB2BLoginLink();

        let formDisplayed =
            await this.waitForLoginForm(
                15000
            );

        if (!formDisplayed) {
            await this.ensureOneTrustIsClosed();

            await this.b2bLoginLink.evaluate(
                linkElement => {
                    linkElement.click();
                }
            );

            formDisplayed =
                await this.waitForLoginForm(
                    15000
                );
        }

        expect(
            formDisplayed,
            'B2B Login form should open after clicking the Header link'
        ).toBeTruthy();

        await expect(
            this.loginForm,
            'B2B Login form should be displayed'
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.modalContent,
            'Drupal modal content should be displayed'
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.usernameInput,
            'B2B username field should be displayed'
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.passwordInput,
            'B2B password field should be displayed'
        ).toBeVisible({
            timeout: 15000
        });

        await this.ensureOneTrustIsClosed();
    }

    async verifyModalDisplayed(
        expectedModal
    ) {
        await expect(
            this.loginForm,
            'B2B Login form should be visible'
        ).toBeVisible();

        await expect(
            this.modalContent,
            'B2B modal content should be visible'
        ).toBeVisible();

        const titleCount =
            await this.dialogTitle.count();

        if (
            titleCount > 0 &&
            expectedModal?.dialogTitle
        ) {
            await expect(
                this.dialogTitle
            ).toContainText(
                expectedModal.dialogTitle
            );
        }

        if (expectedModal?.heading) {
            const expectedHeading =
                this.modalContent
                    .getByText(
                        expectedModal.heading,
                        {
                            exact: true
                        }
                    )
                    .first();

            await expect(
                expectedHeading,
                `B2B modal should contain heading text: ${expectedModal.heading}`
            ).toBeVisible();
        }

        if (expectedModal?.instruction) {
            const expectedInstruction =
                this.modalContent
                    .getByText(
                        expectedModal.instruction,
                        {
                            exact: true
                        }
                    )
                    .first();

            await expect(
                expectedInstruction,
                `B2B modal should contain instruction text: ${expectedModal.instruction}`
            ).toBeVisible();
        }
    }

    async verifyLoginModal() {
        await expect(
            this.loginForm
        ).toBeVisible();

        await expect(
            this.usernameInput
        ).toBeVisible();

        await expect(
            this.passwordInput
        ).toBeVisible();

        await expect(
            this.loginButton
        ).toBeVisible();
    }

    async verifyUsernameField(
        expectedFields,
        expectedValidation
    ) {
        await expect(
            this.usernameLabel
        ).toBeVisible();

        await expect(
            this.usernameLabel
        ).toContainText(
            expectedFields.usernameLabel
        );

        await expect(
            this.usernameInput
        ).toBeVisible();

        await expect(
            this.usernameInput
        ).toBeEnabled();

        await expect(
            this.usernameInput
        ).toHaveAttribute(
            'type',
            'text'
        );

        await expect(
            this.usernameInput
        ).toHaveAttribute(
            'name',
            'name'
        );

        if (
            expectedValidation
                .usernameMaximumLength
        ) {
            await expect(
                this.usernameInput
            ).toHaveAttribute(
                'maxlength',
                expectedValidation
                    .usernameMaximumLength
            );
        }

        if (
            expectedValidation
                .usernameRequired
        ) {
            await expect(
                this.usernameInput
            ).toHaveAttribute(
                'required',
                'required'
            );
        }

        const descriptionCount =
            await this.usernameDescription
                .count();

        if (
            descriptionCount > 0 &&
            expectedFields
                .usernameDescription
        ) {
            await expect(
                this.usernameDescription
            ).toContainText(
                expectedFields
                    .usernameDescription
            );
        }
    }

    async verifyPasswordField(
        expectedFields,
        expectedValidation
    ) {
        await expect(
            this.passwordLabel
        ).toBeVisible();

        await expect(
            this.passwordLabel
        ).toContainText(
            expectedFields.passwordLabel
        );

        await expect(
            this.passwordInput
        ).toBeVisible();

        await expect(
            this.passwordInput
        ).toBeEnabled();

        await expect(
            this.passwordInput
        ).toHaveAttribute(
            'type',
            expectedValidation
                .passwordInputType
        );

        await expect(
            this.passwordInput
        ).toHaveAttribute(
            'name',
            'pass'
        );

        if (
            expectedValidation
                .passwordMaximumLength
        ) {
            await expect(
                this.passwordInput
            ).toHaveAttribute(
                'maxlength',
                expectedValidation
                    .passwordMaximumLength
            );
        }

        if (
            expectedValidation
                .passwordRequired
        ) {
            await expect(
                this.passwordInput
            ).toHaveAttribute(
                'required',
                'required'
            );
        }
    }

    async verifyFieldsInitiallyEmpty() {
        await expect(
            this.usernameInput
        ).toHaveValue('');

        await expect(
            this.passwordInput
        ).toHaveValue('');
    }

    async verifyForgotPasswordLink(
        expectedText,
        expectedPath
    ) {
        await expect(
            this.forgotPasswordLink
        ).toBeVisible();

        if (expectedText) {
            await expect(
                this.forgotPasswordLink
            ).toHaveText(
                expectedText
            );
        }

        if (expectedPath) {
            await expect(
                this.forgotPasswordLink
            ).toHaveAttribute(
                'href',
                expectedPath
            );
        }
    }

    async verifyLoginButton(
        expectedText
    ) {
        await expect(
            this.loginButton
        ).toBeVisible();

        await expect(
            this.loginButton
        ).toBeEnabled();

        await expect(
            this.loginButton
        ).toHaveText(
            expectedText
        );

        await expect(
            this.loginButton
        ).toHaveAttribute(
            'type',
            'submit'
        );
    }

    async verifyCloseButton() {
        await expect(
            this.closeButton
        ).toBeVisible();

        await expect(
            this.closeButton
        ).toBeEnabled();
    }

    async fillUsername(username) {
        expect(
            username,
            'B2B username should be provided'
        ).toBeTruthy();

        await this.usernameInput.fill(
            username
        );
    }

    async fillPassword(password) {
        expect(
            password,
            'B2B password should be provided'
        ).toBeTruthy();

        await this.passwordInput.fill(
            password
        );
    }

    async fillCredentials(
        username,
        password
    ) {
        await this.fillUsername(username);

        await this.fillPassword(password);
    }

    async verifyCredentialsEntered() {
        const usernameValue =
            await this.usernameInput
                .inputValue();

        const passwordValue =
            await this.passwordInput
                .inputValue();

        expect(
            usernameValue.length,
            'Username field should contain a value'
        ).toBeGreaterThan(0);

        expect(
            passwordValue.length,
            'Password field should contain a value'
        ).toBeGreaterThan(0);

        await expect(
            this.passwordInput
        ).toHaveAttribute(
            'type',
            'password'
        );
    }

    async submitLogin(
        expectedDashboardPath = '/dashboard'
    ) {
        await this.ensureOneTrustIsClosed();

        await expect(
            this.loginButton,
            'B2B Login button should be visible'
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.loginButton,
            'B2B Login button should be enabled'
        ).toBeEnabled();

        await this.loginButton.click({
            force: true,
            timeout: 15000
        });

        await expect(this.page).toHaveURL(
            url =>
                url.pathname ===
                expectedDashboardPath,
            {
                timeout: 30000
            }
        );

        await expect(
            this.dashboardContent,
            'Authenticated Dashboard menu should be displayed'
        ).toBeVisible({
            timeout: 30000
        });
    }

    async login(
        username,
        password,
        expectedDashboardPath
    ) {
        await this.fillCredentials(
            username,
            password
        );

        await this.verifyCredentialsEntered();

        await this.submitLogin(
            expectedDashboardPath
        );
    }

    async verifyLoginErrorDisplayed() {
        await expect(
            this.loginErrorMessage
        ).toBeVisible();
    }

    async openForgotPasswordPage(
        expectedPath
    ) {
        await expect(
            this.forgotPasswordLink
        ).toBeVisible();

        await this.forgotPasswordLink.click();

        await expect(this.page).toHaveURL(
            url =>
                url.pathname ===
                expectedPath
        );
    }

    async closeLoginModal() {
        await expect(
            this.closeButton
        ).toBeVisible();

        await this.closeButton.click({
            force: true
        });

        await expect(
            this.loginForm
        ).toBeHidden({
            timeout: 10000
        });
    }

    async verifyModalClosed() {
        await expect(
            this.loginForm
        ).toBeHidden({
            timeout: 10000
        });
    }

    async verifyCurrentPagePath(
        expectedPath
    ) {
        await expect(this.page).toHaveURL(
            url =>
                url.pathname ===
                expectedPath
        );
    }
}

module.exports = {
    B2BLoginPage
};