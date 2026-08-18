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

class B2BForgotPasswordPage {
    constructor(page) {
        this.page = page;

        this.header = new HeaderComponent(page);
        this.footerComponent =
            new FooterComponent(page);

        this.cookieConsent =
            new CookieConsentComponent(page);

        // Main Reset Password page
        this.mainContent = page.locator(
            'main#content'
        );

        this.pageHeading = this.mainContent
            .getByText(
                'Reset your password',
                {
                    exact: true
                }
            )
            .first();

        this.instructionText = this.mainContent
            .getByText(
                'Password reset instructions will be sent to your registered email address.',
                {
                    exact: true
                }
            )
            .first();

        // Breadcrumb
        this.breadcrumb = page.locator(
            'nav[aria-label="breadcrumb"]'
        );

        this.breadcrumbItems = this.breadcrumb.locator(
            '.breadcrumb-item'
        );

        this.homeBreadcrumbLink =
            this.breadcrumb.locator(
                'a[href="/"]'
            ).first();

        // Reset Password form
        this.resetForm = page.locator(
            'form#user-pass'
        );

        this.usernameOrEmailInput =
            this.resetForm.locator(
                '#edit-name'
            );

        this.usernameOrEmailLabel =
            this.resetForm.locator(
                'label[for="edit-name"]'
            );

        this.submitButton =
            this.resetForm.getByRole(
                'button',
                {
                    name: 'Submit',
                    exact: true
                }
            );

        this.formIdInput = this.resetForm.locator(
            'input[name="form_id"]'
        );

        // Public Drupal error monitoring
        this.drupalErrorAlert = page.locator(
            '[data-drupal-messages] .alert-danger'
        ).first();

        this.drupalErrorHeading =
            this.drupalErrorAlert.locator(
                '.alert-heading'
            ).first();

        // Footer
        this.footer = page.locator(
            'footer.site-footer'
        );

        this.footerNavigation = this.footer.locator(
            'nav.menu--footer'
        );

        this.footerCopyright = this.footer.locator(
            '#block-copyright'
        );
    }

    async closeCookieConsent() {
        if (
            this.cookieConsent &&
            typeof this.cookieConsent
                .ensureCookiePopupIsClosed ===
                'function'
        ) {
            await this.cookieConsent
                .ensureCookiePopupIsClosed();

            return;
        }

        if (
            this.cookieConsent &&
            typeof this.cookieConsent
                .acceptAllCookies ===
                'function'
        ) {
            await this.cookieConsent
                .acceptAllCookies();
        }
    }

    async navigate(pagePath) {
        await this.page.goto(pagePath, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        await this.closeCookieConsent();

        await expect(
            this.mainContent,
            'Reset Password main content should be displayed'
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            this.resetForm,
            'Reset Password form should be displayed'
        ).toBeVisible({
            timeout: 30000
        });
    }

    async verifyPage(expectedPage) {
        await expect(this.page).toHaveURL(
            url =>
                url.pathname ===
                expectedPage.path
        );

        await expect(this.page).toHaveTitle(
            expectedPage.expectedTitle
        );

        await expect(
            this.pageHeading,
            'Reset Password heading should be displayed'
        ).toBeVisible();

        await expect(
            this.pageHeading
        ).toHaveText(
            expectedPage.heading
        );

        await expect(
            this.instructionText,
            'Reset Password instruction should be displayed'
        ).toBeVisible();

        await expect(
            this.instructionText
        ).toHaveText(
            expectedPage.instruction
        );
    }

    async verifyBreadcrumb(
        expectedBreadcrumb
    ) {
        await expect(
            this.breadcrumb
        ).toBeVisible();

        await expect(
            this.breadcrumbItems
        ).toHaveText(
            expectedBreadcrumb
        );

        await expect(
            this.homeBreadcrumbLink
        ).toHaveAttribute(
            'href',
            '/'
        );

        await expect(
            this.breadcrumbItems.nth(1)
        ).toContainText(
            expectedBreadcrumb[1]
        );

        await expect(
            this.breadcrumbItems.nth(2)
        ).toContainText(
            expectedBreadcrumb[2]
        );
    }

    async verifyPublicHeader(
        expectedHeader
    ) {
        await this.header
            .verifyHeaderDisplayed();

        await this.header
            .verifyLogoDisplayed();

        await this.header
            .verifyNavigationDisplayed();

        await this.header
            .verifySearchButtonDisplayed();

        await this.header
            .verifyPublicB2BLoginDisplayed();

        await expect(
            this.header.productsLink
        ).toHaveAttribute(
            'href',
            expectedHeader.productsPath
        );

        await expect(
            this.header.aboutUsLink
        ).toHaveAttribute(
            'href',
            expectedHeader.aboutUsPath
        );

        await expect(
            this.header.foodCategoryLink
        ).toHaveAttribute(
            'href',
            expectedHeader.foodCategoryPath
        );

        await expect(
            this.header.locationLink
        ).toHaveAttribute(
            'href',
            expectedHeader.locationPath
        );

        await expect(
            this.header.b2bLoginLink
        ).toHaveAttribute(
            'href',
            expectedHeader.b2bLoginPath
        );

        await expect(
            this.header.contactUsLink
        ).toHaveAttribute(
            'href',
            expectedHeader.contactUsPath
        );

        await expect(
            this.header.searchInput
        ).toBeAttached();

        await expect(
            this.header.searchInput
        ).toHaveAttribute(
            'placeholder',
            expectedHeader.searchPlaceholder
        );

        await expect(
            this.header.searchInput
        ).toHaveAttribute(
            'maxlength',
            expectedHeader.searchMaximumLength
        );
    }

    async verifyForm(expectedForm) {
        await expect(
            this.resetForm
        ).toBeVisible();

        await expect(
            this.resetForm
        ).toHaveAttribute(
            'id',
            expectedForm.id
        );

        await expect(
            this.resetForm
        ).toHaveClass(
            new RegExp(
                expectedForm.classKeyword
            )
        );

        await expect(
            this.resetForm
        ).toHaveAttribute(
            'action',
            expectedForm.action
        );

        await expect(
            this.resetForm
        ).toHaveAttribute(
            'method',
            expectedForm.method
        );

        await expect(
            this.formIdInput
        ).toHaveAttribute(
            'name',
            expectedForm.formIdName
        );

        await expect(
            this.formIdInput
        ).toHaveValue(
            expectedForm.formIdValue
        );
    }

    async verifyUsernameOrEmailField(
        expectedField
    ) {
        await expect(
            this.usernameOrEmailLabel
        ).toBeVisible();

        await expect(
            this.usernameOrEmailLabel
        ).toContainText(
            expectedField.label
        );

        await expect(
            this.usernameOrEmailInput
        ).toBeVisible();

        await expect(
            this.usernameOrEmailInput
        ).toBeEnabled();

        await expect(
            this.usernameOrEmailInput
        ).toHaveValue('');

        await expect(
            this.usernameOrEmailInput
        ).toHaveAttribute(
            'id',
            expectedField.id
        );

        await expect(
            this.usernameOrEmailInput
        ).toHaveAttribute(
            'name',
            expectedField.name
        );

        await expect(
            this.usernameOrEmailInput
        ).toHaveAttribute(
            'type',
            expectedField.type
        );

        await expect(
            this.usernameOrEmailInput
        ).toHaveAttribute(
            'maxlength',
            expectedField.maximumLength
        );

        await expect(
            this.usernameOrEmailInput
        ).toHaveAttribute(
            'autocomplete',
            expectedField.autocomplete
        );

        await expect(
            this.usernameOrEmailInput
        ).toHaveAttribute(
            'autocorrect',
            expectedField.autocorrect
        );

        await expect(
            this.usernameOrEmailInput
        ).toHaveAttribute(
            'autocapitalize',
            expectedField.autocapitalize
        );

        await expect(
            this.usernameOrEmailInput
        ).toHaveAttribute(
            'spellcheck',
            expectedField.spellcheck
        );

        await expect(
            this.usernameOrEmailInput
        ).toHaveAttribute(
            'autofocus',
            expectedField.autofocus
        );

        if (expectedField.required) {
            await expect(
                this.usernameOrEmailInput
            ).toHaveAttribute(
                'required',
                'required'
            );
        }
    }

    async verifySubmitButton(
        expectedButton
    ) {
        expect(
            expectedButton.click,
            'Reset Password Submit button must not be clicked'
        ).toBe(false);

        await expect(
            this.submitButton
        ).toBeVisible();

        await expect(
            this.submitButton
        ).toBeEnabled();

        await expect(
            this.submitButton
        ).toHaveText(
            expectedButton.text
        );

        await expect(
            this.submitButton
        ).toHaveAttribute(
            'id',
            expectedButton.id
        );

        await expect(
            this.submitButton
        ).toHaveAttribute(
            'name',
            expectedButton.name
        );

        await expect(
            this.submitButton
        ).toHaveAttribute(
            'value',
            expectedButton.value
        );

        await expect(
            this.submitButton
        ).toHaveAttribute(
            'type',
            expectedButton.type
        );
    }

    async inspectUnexpectedError(
        expectedErrorMonitoring
    ) {
        expect(
            expectedErrorMonitoring
                .detectUnexpectedError
        ).toBe(true);

        expect(
            expectedErrorMonitoring
                .validateFullStackTrace
        ).toBe(false);

        const errorVisible =
            await this.drupalErrorAlert
                .isVisible()
                .catch(() => false);

        if (!errorVisible) {
            return {
                visible: false,
                matchedKeywords: []
            };
        }

        await expect(
            this.drupalErrorHeading
        ).toContainText(
            expectedErrorMonitoring.heading
        );

        const alertText =
            await this.drupalErrorAlert
                .innerText();

        const matchedKeywords =
            expectedErrorMonitoring
                .knownKeywords
                .filter(keyword =>
                    alertText.includes(keyword)
                );

        return {
            visible: true,
            matchedKeywords
        };
    }

    async verifyNoResetRequestSubmitted(
        expectedPagePath,
        expectedSafety
    ) {
        expect(
            expectedSafety.useRealAccount
        ).toBe(false);

        expect(
            expectedSafety.fillUsernameOrEmail
        ).toBe(false);

        expect(
            expectedSafety.clickSubmit
        ).toBe(false);

        expect(
            expectedSafety.sendResetEmail
        ).toBe(false);

        expect(
            expectedSafety.openMailbox
        ).toBe(false);

        expect(
            expectedSafety.openResetLink
        ).toBe(false);

        expect(
            expectedSafety.changePassword
        ).toBe(false);

        expect(
            expectedSafety.validateOnly
        ).toBe(true);

        await expect(
            this.usernameOrEmailInput
        ).toHaveValue('');

        await expect(this.page).toHaveURL(
            url =>
                url.pathname ===
                expectedPagePath
        );

        await expect(
            this.resetForm
        ).toBeVisible();

        await expect(
            this.submitButton
        ).toBeVisible();
    }

    async verifyFooter(expectedFooter) {
        await this.footer
            .scrollIntoViewIfNeeded();

        await expect(
            this.footer
        ).toBeVisible();

        await expect(
            this.footerNavigation
        ).toBeVisible();

        for (
            const expectedLink
            of expectedFooter.internalLinks
        ) {
            const footerLink =
                this.footerNavigation.locator(
                    `a[href="${expectedLink.path}"]`
                ).filter({
                    hasText: expectedLink.name
                }).first();

            await expect(
                footerLink,
                `Footer link should be displayed: ${expectedLink.name}`
            ).toBeVisible();

            await expect(
                footerLink
            ).toHaveAttribute(
                'href',
                expectedLink.path
            );
        }

        for (
            const expectedExternalLink
            of expectedFooter.externalLinks
        ) {
            const externalLink =
                this.footerNavigation.getByRole(
                    'link',
                    {
                        name:
                            expectedExternalLink.name,
                        exact: true
                    }
                );

            await expect(
                externalLink
            ).toBeVisible();

            const hrefValue =
                await externalLink.getAttribute(
                    'href'
                );

            expect(
                hrefValue,
                `Footer link should have an href: ${expectedExternalLink.name}`
            ).toBeTruthy();

            expect(
                hrefValue.includes(
                    expectedExternalLink.hrefKeyword
                )
            ).toBeTruthy();
        }

        await expect(
            this.footerCopyright
        ).toContainText(
            expectedFooter.copyrightKeyword
        );

        await expect(
            this.footerCopyright
        ).toContainText(
            expectedFooter.copyrightText
        );
    }
}

module.exports = {
    B2BForgotPasswordPage
};