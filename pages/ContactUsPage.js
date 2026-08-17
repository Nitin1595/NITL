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

class ContactUsPage {
    constructor(page) {
        this.page = page;

        this.header = new HeaderComponent(page);
        this.footer = new FooterComponent(page);

        this.cookieConsent =
            new CookieConsentComponent(page);

        // Main Contact Us page
        this.mainContent = page.locator(
            'main#content'
        );

        this.pageTitleBlock = page.locator(
            '#block-retailx-page-title'
        );

        this.pageHeading = this.pageTitleBlock.getByRole(
            'heading',
            {
                name: 'Contact Us',
                level: 1,
                exact: true
            }
        );

        this.contactArticle = this.mainContent.locator(
            'article.node--type-dsu-component-page'
        );

        // Breadcrumb
        this.breadcrumb = page.locator(
            'nav[aria-label="breadcrumb"]'
        );

        this.breadcrumbItems = this.breadcrumb.locator(
            '.breadcrumb-item'
        );

        this.homeBreadcrumbLink =
            this.breadcrumb.getByRole(
                'link',
                {
                    name: 'Home',
                    exact: true
                }
            );

        this.activeBreadcrumb = this.breadcrumb.locator(
            '.breadcrumb-item.active'
        );

        // Address section
        this.addressSection = this.contactArticle.locator(
            '.field--name-field-column-first'
        );

        this.addressHeading =
            this.addressSection.getByRole(
                'heading',
                {
                    name: 'Our Address',
                    level: 6,
                    exact: true
                }
            );

        this.addressContent = this.addressSection.locator(
            '.field--name-field-c-text'
        );

        // Contact form
        this.contactForm = page.locator(
            'form#webform-submission-contact-paragraph-143-add-form'
        );

        this.formHeading = this.contactForm.getByRole(
            'heading',
            {
                name: 'Send us a message',
                level: 6,
                exact: true
            }
        );

        // Required fields
        this.firstNameInput = this.contactForm.locator(
            '#edit-first-name'
        );

        this.lastNameInput = this.contactForm.locator(
            '#edit-last-name'
        );

        this.emailInput = this.contactForm.locator(
            '#edit-wf-email'
        );

        // Optional fields
        this.countrySelect = this.contactForm.locator(
            '#edit-country'
        );

        this.phoneInput = this.contactForm.locator(
            '#edit-phone'
        );

        this.productDescriptionInput =
            this.contactForm.locator(
                '#edit-product-description'
            );

        this.batchCodeInput = this.contactForm.locator(
            '#edit-batch-code'
        );

        this.eanInput = this.contactForm.locator(
            '#edit-ean'
        );

        this.bestBeforeDateInput =
            this.contactForm.locator(
                '#edit-best-before-date'
            );

        this.messageInput = this.contactForm.locator(
            '#edit-message'
        );

        // Country options
        this.countryOptions = this.countrySelect.locator(
            'option'
        );

        this.selectedCountryOption =
            this.countrySelect.locator(
                'option:checked'
            );

        // Phone widget
        this.phoneWidget = this.contactForm.locator(
            '.iti'
        );

        this.phoneCountryFlag = this.phoneWidget.locator(
            '.iti__selected-flag'
        );

        this.phoneValidationMessage =
            this.contactForm.locator(
                '.js-form-item-phone ' +
                '.form-item--error-message'
            );

        // CAPTCHA presence validation only
        this.captchaFieldset = this.contactForm.locator(
            'fieldset.captcha'
        );

        this.captchaLegend = this.captchaFieldset.locator(
            'legend.captcha__title'
        );

        this.captchaDescription =
            this.captchaFieldset.locator(
                '.captcha__description'
            );

        this.recaptchaFrame = this.captchaFieldset.locator(
            'iframe[title="reCAPTCHA"]'
        );

        // Submit button presence validation only
        this.sendMessageButton =
            this.contactForm.getByRole(
                'button',
                {
                    name: 'Send Message',
                    exact: true
                }
            );

        // Submission confirmation indicators
        this.submissionConfirmation = page.getByText(
            /your message has been sent|thank you for your submission/i
        ).first();
    }

    getFieldLocator(fieldKey) {
        const fieldMap = {
            firstName: this.firstNameInput,
            lastName: this.lastNameInput,
            email: this.emailInput,
            country: this.countrySelect,
            phone: this.phoneInput,
            productDescription:
                this.productDescriptionInput,
            batchCode: this.batchCodeInput,
            ean: this.eanInput,
            bestBeforeDate:
                this.bestBeforeDateInput,
            message: this.messageInput
        };

        return fieldMap[fieldKey];
    }

    async navigate(pagePath) {
        await this.page.goto(pagePath, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        if (
            this.cookieConsent &&
            typeof this.cookieConsent
                .ensureCookiePopupIsClosed ===
                'function'
        ) {
            await this.cookieConsent
                .ensureCookiePopupIsClosed();
        } else if (
            this.cookieConsent &&
            typeof this.cookieConsent
                .acceptAllCookies ===
                'function'
        ) {
            await this.cookieConsent
                .acceptAllCookies();
        }

        await expect(
            this.mainContent,
            'Contact Us main content should be displayed'
        ).toBeVisible({
            timeout: 30000
        });

        await expect(
            this.contactForm,
            'Contact Us form should be displayed'
        ).toBeVisible({
            timeout: 30000
        });
    }

    async verifyPage(expectedPage) {
        await expect(this.page).toHaveURL(
            url =>
                url.pathname === expectedPage.path
        );

        await expect(this.page).toHaveTitle(
            expectedPage.expectedTitle
        );

        await expect(
            this.pageTitleBlock
        ).toBeVisible();

        await expect(
            this.pageHeading
        ).toBeVisible();

        await expect(
            this.pageHeading
        ).toHaveText(
            expectedPage.heading
        );

        await expect(
            this.contactArticle
        ).toBeVisible();

        await expect(
            this.contactForm
        ).toBeVisible();
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
            this.activeBreadcrumb
        ).toHaveText(
            expectedBreadcrumb[
                expectedBreadcrumb.length - 1
            ]
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

    async verifyAddress(expectedAddress) {
        await expect(
            this.addressSection
        ).toBeVisible();

        await expect(
            this.addressHeading
        ).toBeVisible();

        await expect(
            this.addressHeading
        ).toHaveText(
            expectedAddress.heading
        );

        await expect(
            this.addressContent
        ).toContainText(
            expectedAddress.company
        );

        await expect(
            this.addressContent
        ).toContainText(
            expectedAddress.division
        );

        await expect(
            this.addressContent
        ).toContainText(
            expectedAddress.addressKeyword
        );

        await expect(
            this.addressContent
        ).toContainText(
            expectedAddress.cityKeyword
        );

        await expect(
            this.addressContent
        ).toContainText(
            expectedAddress.postalCode
        );

        await expect(
            this.addressContent
        ).toContainText(
            expectedAddress.country
        );
    }

    async verifyFormStructure(expectedForm) {
        await expect(
            this.contactForm
        ).toBeVisible();

        await expect(
            this.contactForm
        ).toHaveAttribute(
            'action',
            expectedForm.action
        );

        await expect(
            this.contactForm
        ).toHaveAttribute(
            'method',
            expectedForm.method
        );

        await expect(
            this.formHeading
        ).toBeVisible();

        await expect(
            this.formHeading
        ).toContainText(
            expectedForm.heading
        );
    }

    async verifyFormField(
        fieldKey,
        expectedField
    ) {
        const field =
            this.getFieldLocator(fieldKey);

        expect(
            field,
            `A locator should exist for field: ${fieldKey}`
        ).toBeTruthy();

        await expect(
            field,
            `Field should be attached: ${fieldKey}`
        ).toBeAttached();

        /*
         * The native Country select is hidden by the Selectric
         * JavaScript widget. Other controls should be visible.
         */
        if (fieldKey !== 'country') {
            await expect(
                field,
                `Field should be visible: ${fieldKey}`
            ).toBeVisible();

            await expect(
                field,
                `Field should be enabled: ${fieldKey}`
            ).toBeEnabled();
        }

        await expect(
            field
        ).toHaveAttribute(
            'id',
            expectedField.id
        );

        await expect(
            field
        ).toHaveAttribute(
            'name',
            expectedField.name
        );

        if (expectedField.type) {
            await expect(
                field
            ).toHaveAttribute(
                'type',
                expectedField.type
            );
        }

        if (expectedField.maximumLength) {
            await expect(
                field
            ).toHaveAttribute(
                'maxlength',
                expectedField.maximumLength
            );
        }

        if (expectedField.placeholder) {
            await expect(
                field
            ).toHaveAttribute(
                'placeholder',
                expectedField.placeholder
            );
        }

        if (expectedField.rows) {
            await expect(
                field
            ).toHaveAttribute(
                'rows',
                expectedField.rows
            );
        }

        if (expectedField.required) {
            await expect(
                field
            ).toHaveAttribute(
                'required',
                'required'
            );
        } else {
            await expect(
                field
            ).not.toHaveAttribute(
                'required',
                'required'
            );
        }

        const fieldId =
            await field.getAttribute('id');

        const label = this.contactForm.locator(
            `label[for="${fieldId}"]`
        );

        await expect(
            label,
            `Label should exist for field: ${fieldKey}`
        ).toBeAttached();

        await expect(
            label
        ).toContainText(
            expectedField.label
        );
    }

    async verifyAllFields(expectedFields) {
        for (
            const [
                fieldKey,
                expectedField
            ] of Object.entries(expectedFields)
        ) {
            await this.verifyFormField(
                fieldKey,
                expectedField
            );
        }
    }

    async verifyRequiredAndOptionalFields(
        requiredFieldKeys,
        optionalFieldKeys
    ) {
        for (
            const fieldKey
            of requiredFieldKeys
        ) {
            const field =
                this.getFieldLocator(fieldKey);

            await expect(
                field,
                `Required field should include required attribute: ${fieldKey}`
            ).toHaveAttribute(
                'required',
                'required'
            );
        }

        for (
            const fieldKey
            of optionalFieldKeys
        ) {
            const field =
                this.getFieldLocator(fieldKey);

            await expect(
                field,
                `Optional field should not include required attribute: ${fieldKey}`
            ).not.toHaveAttribute(
                'required',
                'required'
            );
        }
    }

    async verifyCountryDropdown(
        expectedField,
        expectedValidation
    ) {
        await expect(
            this.countrySelect
        ).toBeAttached();

        await expect(
            this.countrySelect
        ).toHaveValue(
            expectedField.defaultValue
        );

        await expect(
            this.selectedCountryOption
        ).toHaveText(
            expectedField.defaultText
        );

        const optionCount =
            await this.countryOptions.count();

        expect(
            optionCount,
            'Country dropdown should contain the expected minimum number of options'
        ).toBeGreaterThanOrEqual(
            expectedValidation.minimumOptionCount
        );

        const countryOptionTexts =
            await this.countryOptions
                .allTextContents();

        for (
            const expectedCountry
            of expectedValidation.sampleOptions
        ) {
            expect(
                countryOptionTexts,
                `Country option should exist: ${expectedCountry}`
            ).toContain(expectedCountry);
        }
    }

    async verifyPhoneControl(
        expectedPhone
    ) {
        await expect(
            this.phoneWidget
        ).toBeVisible();

        await expect(
            this.phoneInput
        ).toBeVisible();

        await expect(
            this.phoneInput
        ).toHaveAttribute(
            'type',
            expectedPhone.type
        );

        await expect(
            this.phoneInput
        ).toHaveAttribute(
            'placeholder',
            expectedPhone.placeholder
        );

        await expect(
            this.phoneCountryFlag
        ).toBeVisible();

        const validationMessageCount =
            await this.phoneValidationMessage.count();

        if (validationMessageCount > 0) {
            await expect(
                this.phoneValidationMessage
            ).toBeHidden();
        }
    }

    async verifyFieldsInitiallyEmpty() {
        const emptyFields = [
            this.firstNameInput,
            this.lastNameInput,
            this.emailInput,
            this.phoneInput,
            this.productDescriptionInput,
            this.batchCodeInput,
            this.eanInput,
            this.bestBeforeDateInput,
            this.messageInput
        ];

        for (const field of emptyFields) {
            await expect(field).toHaveValue('');
        }

        await expect(
            this.countrySelect
        ).toHaveValue('');
    }

    async verifyCaptcha(expectedCaptcha) {
        expect(
            expectedCaptcha.validatePresenceOnly,
            'CAPTCHA should use presence validation only'
        ).toBe(true);

        expect(
            expectedCaptcha.interact,
            'Contact Us automation must not interact with CAPTCHA'
        ).toBe(false);

        await expect(
            this.captchaFieldset
        ).toBeVisible();

        await expect(
            this.captchaLegend
        ).toContainText(
            expectedCaptcha.legend
        );

        await expect(
            this.captchaDescription
        ).toContainText(
            expectedCaptcha.descriptionKeyword
        );

        /*
         * Validate only that the reCAPTCHA frame exists.
         * Do not access, click, describe, or solve its contents.
         */
        await expect(
            this.recaptchaFrame
        ).toBeAttached();

        await expect(
            this.recaptchaFrame
        ).toHaveAttribute(
            'title',
            expectedCaptcha.iframeTitle
        );
    }

    async verifySendMessageButton(
        expectedButton
    ) {
        expect(
            expectedButton.click,
            'Send Message button must not be clicked'
        ).toBe(false);

        await expect(
            this.sendMessageButton
        ).toBeVisible();

        await expect(
            this.sendMessageButton
        ).toBeEnabled();

        await expect(
            this.sendMessageButton
        ).toHaveText(
            expectedButton.text
        );

        await expect(
            this.sendMessageButton
        ).toHaveAttribute(
            'type',
            expectedButton.type
        );
    }

    async verifyFormNotSubmitted(
        expectedPath,
        expectedSafety
    ) {
        expect(
            expectedSafety.fillForm
        ).toBe(false);

        expect(
            expectedSafety.interactWithCaptcha
        ).toBe(false);

        expect(
            expectedSafety.clickSendMessage
        ).toBe(false);

        expect(
            expectedSafety.submitForm
        ).toBe(false);

        expect(
            expectedSafety.validateOnly
        ).toBe(true);

        await expect(this.page).toHaveURL(
            url => url.pathname === expectedPath
        );

        await expect(
            this.contactForm
        ).toBeVisible();

        await expect(
            this.sendMessageButton
        ).toBeVisible();

        const confirmationCount =
            await this.submissionConfirmation.count();

        if (confirmationCount > 0) {
            await expect(
                this.submissionConfirmation
            ).toBeHidden();
        }
    }

    async verifyFooter(expectedFooter) {
        await this.footer.footer
            .scrollIntoViewIfNeeded();

        await expect(
            this.footer.footer
        ).toBeVisible();

        for (
            const expectedLink
            of expectedFooter.internalLinks
        ) {
            const footerLink =
                this.footer.footer.locator(
                    `a[href="${expectedLink.path}"]`
                ).filter({
                    hasText: expectedLink.name
                }).first();

            await expect(
                footerLink,
                `Footer link should be visible: ${expectedLink.name}`
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
                this.footer.footer.getByRole(
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

            expect(hrefValue).toBeTruthy();

            expect(
                hrefValue.includes(
                    expectedExternalLink
                        .hrefKeyword
                )
            ).toBeTruthy();
        }

        const copyrightElement =
            this.footer.footer.locator(
                '#block-copyright'
            );

        await expect(
            copyrightElement
        ).toContainText(
            expectedFooter.copyrightKeyword
        );

        await expect(
            copyrightElement
        ).toContainText(
            expectedFooter.copyrightText
        );
    }
}

module.exports = {
    ContactUsPage
};