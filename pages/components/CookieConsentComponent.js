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

        // Dark overlay that can block page interactions
        this.cookieOverlay = page.locator(
            '.onetrust-pc-dark-filter'
        );

        // Stable OneTrust action-button selectors
        this.acceptAllButton = page.locator(
            '#onetrust-accept-btn-handler'
        );

        this.rejectAllButton = page.locator(
            '#onetrust-reject-all-handler'
        );

        this.cookieSettingsButton = page.locator(
            '#onetrust-pc-btn-handler'
        );

        // Accessible fallback selectors
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

        this.cookieSettingsButtonByRole =
            page.getByRole(
                'button',
                {
                    name: /cookie settings/i
                }
            );
    }

    async getVisibleAcceptButton() {
        const buttonByIdVisible =
            await this.acceptAllButton
                .isVisible({
                    timeout: 2000
                })
                .catch(() => false);

        if (buttonByIdVisible) {
            return this.acceptAllButton;
        }

        const buttonByRoleVisible =
            await this.acceptAllButtonByRole
                .isVisible({
                    timeout: 2000
                })
                .catch(() => false);

        if (buttonByRoleVisible) {
            return this.acceptAllButtonByRole;
        }

        return null;
    }

    async getVisibleRejectButton() {
        const buttonByIdVisible =
            await this.rejectAllButton
                .isVisible({
                    timeout: 2000
                })
                .catch(() => false);

        if (buttonByIdVisible) {
            return this.rejectAllButton;
        }

        const buttonByRoleVisible =
            await this.rejectAllButtonByRole
                .isVisible({
                    timeout: 2000
                })
                .catch(() => false);

        if (buttonByRoleVisible) {
            return this.rejectAllButtonByRole;
        }

        return null;
    }

    async isCookiePopupDisplayed() {
        const acceptButton =
            await this.getVisibleAcceptButton();

        return acceptButton !== null;
    }

    async acceptAllCookies() {
        const acceptButton =
            await this.getVisibleAcceptButton();

        if (acceptButton) {
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
                'Cookie banner should close after accepting cookies'
            ).toBeHidden({
                timeout: 15000
            });
        }

        await this.waitUntilCookieOverlayIsClosed();
    }

    async rejectAllCookies() {
        const rejectButton =
            await this.getVisibleRejectButton();

        if (rejectButton) {
            await expect(
                rejectButton,
                'Reject All button should be visible'
            ).toBeVisible();

            await expect(
                rejectButton,
                'Reject All button should be enabled'
            ).toBeEnabled();

            await rejectButton.click();

            await expect(
                rejectButton,
                'Cookie banner should close after rejecting cookies'
            ).toBeHidden({
                timeout: 15000
            });
        }

        await this.waitUntilCookieOverlayIsClosed();
    }

    async waitUntilCookieOverlayIsClosed() {
        const overlayCount =
            await this.cookieOverlay.count();

        if (overlayCount === 0) {
            return;
        }

        const overlayVisible =
            await this.cookieOverlay
                .isVisible()
                .catch(() => false);

        if (!overlayVisible) {
            return;
        }

        /*
         * OneTrust can keep the overlay visible briefly while
         * completing the banner-closing animation.
         */
        await expect(
            this.cookieOverlay,
            'OneTrust cookie overlay should disappear'
        ).toBeHidden({
            timeout: 15000
        });
    }

    async ensureCookiePopupIsClosed() {
        const acceptButton =
            await this.getVisibleAcceptButton();

        if (acceptButton) {
            await expect(
                acceptButton
            ).toBeVisible();

            await acceptButton.click();

            await expect(
                acceptButton
            ).toBeHidden({
                timeout: 15000
            });
        }

        await this.waitUntilCookieOverlayIsClosed();

        await this.page.evaluate(() => {
            document.querySelectorAll('.onetrust-pc-dark-filter').forEach(
                overlay => {
                    overlay.style.display = 'none';
                    overlay.style.pointerEvents = 'none';
                    overlay.style.visibility = 'hidden';
                }
            );
        });
    }

    async verifyCookiePopupDisplayed() {
        await expect(
            this.cookieConsentSdk
        ).toBeAttached();

        const acceptButton =
            await this.getVisibleAcceptButton();

        expect(
            acceptButton,
            'Accept all cookies button should exist'
        ).not.toBeNull();

        await expect(
            acceptButton
        ).toBeVisible();

        const rejectButton =
            await this.getVisibleRejectButton();

        expect(
            rejectButton,
            'Reject All button should exist'
        ).not.toBeNull();

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