const { expect } = require('@playwright/test');

class CookieConsentComponent {
    constructor(page) {
        this.page = page;

        this.cookieSettingsButton = page.getByRole(
            'button',
            {
                name: 'Cookie Settings',
                exact: true
            }
        );

        this.rejectAllButton = page.getByRole(
            'button',
            {
                name: 'Reject All',
                exact: true
            }
        );

        this.acceptAllButton = page.getByRole(
            'button',
            {
                name: 'Accept all cookies',
                exact: true
            }
        );
    }

    async isCookiePopupDisplayed() {
        return this.acceptAllButton
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

        await expect(
            this.acceptAllButton
        ).toBeVisible();

        await this.acceptAllButton.click();

        await expect(
            this.acceptAllButton
        ).toBeHidden({
            timeout: 10000
        });
    }

    async rejectAllCookies() {
        const rejectButtonDisplayed =
            await this.rejectAllButton
                .isVisible({
                    timeout: 3000
                })
                .catch(() => false);

        if (!rejectButtonDisplayed) {
            return;
        }

        await this.rejectAllButton.click();

        await expect(
            this.rejectAllButton
        ).toBeHidden({
            timeout: 10000
        });
    }

    async verifyCookiePopupDisplayed() {
        await expect(
            this.acceptAllButton
        ).toBeVisible();

        await expect(
            this.rejectAllButton
        ).toBeVisible();

        await expect(
            this.cookieSettingsButton
        ).toBeVisible();
    }
}

module.exports = { CookieConsentComponent };