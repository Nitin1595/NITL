const { expect } = require('@playwright/test');

class CookieConsentComponent {
    constructor(page) {
        this.page = page;

        // Complete OneTrust cookie-consent container
        this.cookieConsentSdk = page.locator(
            '#onetrust-consent-sdk'
        );

        // Main cookie banner
        this.cookieBanner = page.locator(
            '#onetrust-banner-sdk'
        );

        // Dark overlay covering the website
        this.cookieOverlay = page.locator(
            '.onetrust-pc-dark-filter'
        );

        // Cookie action buttons
        this.acceptAllButton = page.locator(
            '#onetrust-accept-btn-handler'
        );

        this.rejectAllButton = page.locator(
            '#onetrust-reject-all-handler'
        );

        this.cookieSettingsButton = page.locator(
            '#onetrust-pc-btn-handler'
        );

        // Accessible-name fallbacks
        this.acceptAllButtonByRole = page.getByRole(
            'button',
            {
                name: /accept all cookies/i
            }
        );

        this.rejectAllButtonByRole = page.getByRole(
            'button',
            {
                name: /reject all/i
            }
        );

        this.cookieSettingsButtonByRole = page.getByRole(
            'button',
            {
                name: /cookie settings/i
            }
        );
    }

    async isCookiePopupDisplayed() {
        const acceptButtonByIdVisible =
            await this.acceptAllButton
                .isVisible({
                    timeout: 3000
                })
                .catch(() => false);

        if (acceptButtonByIdVisible) {
            return true;
        }

        return this.acceptAllButtonByRole
            .isVisible({
                timeout: 3000
            })
            .catch(() => false);
    }

    async acceptAllCookies() {
        const cookiePopupDisplayed =
            await this.isCookiePopupDisplayed();

        if (!cookiePopupDisplayed) {
            return;
        }

        const acceptButtonByIdVisible =
            await this.acceptAllButton
                .isVisible()
                .catch(() => false);

        const acceptButton =
            acceptButtonByIdVisible
                ? this.acceptAllButton
                : this.acceptAllButtonByRole;

        await expect(
            acceptButton,
            'Accept all cookies button should be visible'
        ).toBeVisible();

        await expect(
            acceptButton,
            'Accept all cookies button should be enabled'
        ).toBeEnabled();

        await acceptButton.click();

        await expect(
            acceptButton,
            'Cookie popup should close after accepting cookies'
        ).toBeHidden({
            timeout: 15000
        });

        await this.waitForCookieOverlayToDisappear();
    }

    async rejectAllCookies() {
        const rejectButtonByIdVisible =
            await this.rejectAllButton
                .isVisible({
                    timeout: 3000
                })
                .catch(() => false);

        const rejectButtonByRoleVisible =
            await this.rejectAllButtonByRole
                .isVisible({
                    timeout: 3000
                })
                .catch(() => false);

        if (
            !rejectButtonByIdVisible &&
            !rejectButtonByRoleVisible
        ) {
            return;
        }

        const rejectButton =
            rejectButtonByIdVisible
                ? this.rejectAllButton
                : this.rejectAllButtonByRole;

        await expect(
            rejectButton,
            'Reject All button should be visible'
        ).toBeVisible();

        await rejectButton.click();

        await expect(
            rejectButton,
            'Cookie popup should close after rejecting cookies'
        ).toBeHidden({
            timeout: 15000
        });

        await this.waitForCookieOverlayToDisappear();
    }

    async waitForCookieOverlayToDisappear() {
        const overlayExists =
            await this.cookieOverlay.count();

        if (overlayExists === 0) {
            return;
        }

        await expect(
            this.cookieOverlay,
            'Cookie overlay should disappear'
        ).toBeHidden({
            timeout: 15000
        });
    }

    async verifyCookiePopupDisplayed() {
        await expect(
            this.cookieConsentSdk
        ).toBeAttached();

        const acceptButtonByIdVisible =
            await this.acceptAllButton
                .isVisible()
                .catch(() => false);

        const acceptButton =
            acceptButtonByIdVisible
                ? this.acceptAllButton
                : this.acceptAllButtonByRole;

        await expect(
            acceptButton
        ).toBeVisible();

        const rejectButtonByIdVisible =
            await this.rejectAllButton
                .isVisible()
                .catch(() => false);

        const rejectButton =
            rejectButtonByIdVisible
                ? this.rejectAllButton
                : this.rejectAllButtonByRole;

        await expect(
            rejectButton
        ).toBeVisible();

        const settingsButtonByIdVisible =
            await this.cookieSettingsButton
                .isVisible()
                .catch(() => false);

        const settingsButton =
            settingsButtonByIdVisible
                ? this.cookieSettingsButton
                : this.cookieSettingsButtonByRole;

        await expect(
            settingsButton
        ).toBeVisible();
    }
}

module.exports = { CookieConsentComponent };
