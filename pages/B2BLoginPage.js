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

        this.loginDialog = page.locator(
            'div.ui-dialog[role="dialog"]'
        );

        this.modalContent = this.loginDialog.locator(
            '#drupal-modal'
        );

        this.dialogTitle = this.loginDialog.locator(
            'h1.ui-dialog-title, .ui-dialog-title'
        ).first();

        this.closeButton = this.loginDialog.locator(
            'button.ui-dialog-titlebar-close'
        );

        this.modalCloseButton = this.closeButton;

        this.welcomeHeading =
            this.modalContent.getByRole(
                'heading',
                {
                    name: 'Welcome back',
                    exact: true
                }
            );

        this.signInInstruction =
            this.modalContent.getByRole(
                'heading',
                {
                    name:
                        'Please use your credentials to sign in below',
                    exact: true
                }
            );

        this.loginForm = this.modalContent.locator(
            'form#custom-popup-login-form'
        );

        this.usernameInput = this.loginForm.locator(
            'input[name="name"]'
        ).first();

        this.passwordInput = this.loginForm.locator(
            'input[name="pass"]'
        ).first();

        this.usernameLabel = this.loginForm.locator(
            'label[for^="edit-name"]'
        ).first();

        this.passwordLabel = this.loginForm.locator(
            'label[for^="edit-pass"]'
        ).first();

        this.usernameDescription = this.loginForm.locator(
            'small[id^="edit-name"], ' +
            '[id^="edit-name"][class*="description"]'
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

    async navigate(pagePath = '/') {
        await this.page.goto(pagePath, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        await this.ensureOneTrustIsClosed();

        await expect(this.page).toHaveURL(
            url => url.pathname === pagePath
        );
    }

    async openLoginModal() {
        await this.ensureOneTrustIsClosed();

        await this.header.openB2BLogin();

        await expect(
            this.loginDialog
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.loginForm
        ).toBeVisible({
            timeout: 15000
        });

        await this.ensureOneTrustIsClosed();
    }

    async verifyModalDisplayed(expectedModal) {
        await expect(
            this.loginDialog
        ).toBeVisible();

        await expect(
            this.modalContent
        ).toBeVisible();

        await expect(
            this.dialogTitle
        ).toBeAttached();

        if (expectedModal?.dialogTitle) {
            await expect(
                this.dialogTitle
            ).toHaveText(
                expectedModal.dialogTitle
            );
        }

        if (expectedModal?.heading) {
            await expect(
                this.welcomeHeading
            ).toHaveText(
                expectedModal.heading
            );
        }

        if (expectedModal?.instruction) {
            await expect(
                this.signInInstruction
            ).toHaveText(
                expectedModal.instruction
            );
        }
    }

    async verifyLoginModal() {
        await expect(
            this.loginDialog
        ).toBeVisible();

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
        ).toHaveAttribute('type', 'text');

        await expect(
            this.usernameInput
        ).toHaveAttribute('name', 'name');

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
            expectedValidation.usernameRequired
        ) {
            await expect(
                this.usernameInput
            ).toHaveAttribute(
                'required',
                'required'
            );
        }

        const descriptionCount =
            await this.usernameDescription.count();

        if (
            descriptionCount > 0 &&
            expectedFields.usernameDescription
        ) {
            await expect(
                this.usernameDescription
            ).toContainText(
                expectedFields.usernameDescription
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
        ).toHaveAttribute(
            'type',
            expectedValidation.passwordInputType
        );

        await expect(
            this.passwordInput
        ).toHaveAttribute('name', 'pass');

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
            expectedValidation.passwordRequired
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
            ).toHaveText(expectedText);
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

    async verifyLoginButton(expectedText) {
        await expect(
            this.loginButton
        ).toBeVisible();

        await expect(
            this.loginButton
        ).toBeEnabled();

        await expect(
            this.loginButton
        ).toHaveText(expectedText);

        await expect(
            this.loginButton
        ).toHaveAttribute('type', 'submit');
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
        expect(username).toBeTruthy();

        await this.usernameInput.fill(username);
    }

    async fillPassword(password) {
        expect(password).toBeTruthy();

        await this.passwordInput.fill(password);
    }

    async fillCredentials(username, password) {
        await this.fillUsername(username);
        await this.fillPassword(password);
    }

    async verifyCredentialsEntered() {
        const usernameValue =
            await this.usernameInput.inputValue();

        const passwordValue =
            await this.passwordInput.inputValue();

        expect(
            usernameValue.length
        ).toBeGreaterThan(0);

        expect(
            passwordValue.length
        ).toBeGreaterThan(0);

        await expect(
            this.passwordInput
        ).toHaveAttribute('type', 'password');
    }

    async submitLogin(
        expectedDashboardPath = '/dashboard'
    ) {
        await this.ensureOneTrustIsClosed();

        await expect(
            this.loginButton
        ).toBeVisible();

        await expect(
            this.loginButton
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
            this.dashboardContent
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

    async openForgotPasswordPage(expectedPath) {
        await this.forgotPasswordLink.click();

        await expect(this.page).toHaveURL(
            url => url.pathname === expectedPath
        );
    }

    async closeLoginModal() {
        await this.closeButton.click({
            force: true
        });

        await expect(
            this.loginDialog
        ).toBeHidden({
            timeout: 10000
        });
    }

    async verifyModalClosed() {
        await expect(
            this.loginDialog
        ).toBeHidden();
    }

    async verifyCurrentPagePath(expectedPath) {
        await expect(this.page).toHaveURL(
            url => url.pathname === expectedPath
        );
    }
}

module.exports = {
    B2BLoginPage
};