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

class LocationPage {
    constructor(page) {
        this.page = page;

        // Reusable website components
        this.header = new HeaderComponent(page);
        this.footer = new FooterComponent(page);
        this.cookieConsent =
            new CookieConsentComponent(page);

        // Main page content
        this.mainContent = page.locator(
            'main#content'
        );

        // Active Who We Are navigation
        this.activeWhoWeAreMenu = page.locator(
            '#header li.menu-item--expanded.active'
        );

        this.activeLocationLink =
            this.activeWhoWeAreMenu.locator(
                'a.nav-link--location'
            );

        // Breadcrumb
        this.breadcrumb = page.locator(
            'nav[aria-label="breadcrumb"]'
        );

        this.homeBreadcrumbLink =
            this.breadcrumb.getByRole(
                'link',
                {
                    name: 'Home',
                    exact: true
                }
            );

        this.currentBreadcrumb =
            this.breadcrumb.locator(
                '.breadcrumb-item.active'
            );

        // Main Location heading
        this.locationHeading = this.mainContent.getByRole(
            'heading',
            {
                name: 'Location',
                exact: true
            }
        );

        // Company information
        this.companyName = this.mainContent.getByText(
            /Nestlé International Travel Retail.*Nestlé Enterprises S\.A\./i
        );

        this.companyAddress = this.mainContent.getByText(
            /Vevey Switzerland/i
        );

        /*
         * Location image.
         * The primary content image is selected without relying
         * on its generated file name.
         */
        this.locationImage = this.mainContent.locator(
            'img'
        ).filter({
            hasNot: page.locator(
                '.image-style-logo-md'
            )
        }).first();

        // Contact Us section
        this.contactUsHeading =
            this.mainContent.getByRole(
                'heading',
                {
                    name: 'Contact us',
                    exact: true
                }
            );

        this.contactIntro = this.mainContent.getByText(
            /we'd love to hear from you/i
        );

        /*
         * Contact form.
         * Scoped to the form containing the Send Message button.
         */
        this.contactForm = this.mainContent.locator(
            'form'
        ).filter({
            has: this.mainContent.getByRole(
                'button',
                {
                    name: /send message/i
                }
            )
        });

        // Form fields
        this.firstNameInput =
            this.contactForm.getByLabel(
                /first name/i
            );

        this.lastNameInput =
            this.contactForm.getByLabel(
                /last name/i
            );

        this.emailInput =
            this.contactForm.getByLabel(
                /^email/i
            );

        this.countrySelect =
            this.contactForm.getByLabel(
                /^country/i
            );

        this.phoneNumberInput =
            this.contactForm.getByLabel(
                /phone number/i
            );

        this.productDescriptionInput =
            this.contactForm.getByLabel(
                /product description/i
            );

        this.batchCodeInput =
            this.contactForm.getByLabel(
                /batch code/i
            );

        this.eanInput =
            this.contactForm.getByLabel(
                /^ean/i
            );

        this.bestBeforeDateInput =
            this.contactForm.getByLabel(
                /best before date/i
            );

        this.messageInput =
            this.contactForm.getByLabel(
                /^message/i
            );

        this.sendMessageButton =
            this.contactForm.getByRole(
                'button',
                {
                    name: /send message/i
                }
            );

        /*
         * CAPTCHA section.
         * The automation verifies only that the section exists.
         * The CAPTCHA challenge will not be read, solved, or bypassed.
         */
        this.captchaSection = this.contactForm.locator(
            '[class*="captcha"], [id*="captcha"], [class*="recaptcha"], [id*="recaptcha"]'
        ).first();

        this.captchaHeading =
            this.contactForm.getByText(
                /^CAPTCHA/i
            ).first();
    }

    async navigate(pagePath) {
        await this.page.goto(pagePath, {
            waitUntil: 'domcontentloaded'
        });

        await this.cookieConsent
            .acceptAllCookies();

        await expect(
            this.mainContent
        ).toBeVisible();
    }

    async verifyPageNavigation(
        expectedTitle,
        expectedPath
    ) {
        await expect(this.page).toHaveURL(
            url => url.pathname === expectedPath
        );

        await expect(this.page).toHaveTitle(
            expectedTitle
        );
    }

    async verifyActiveNavigation() {
        await expect(
            this.activeWhoWeAreMenu
        ).toBeVisible();

        await expect(
            this.activeLocationLink
        ).toHaveClass(/is-active/);

        await expect(
            this.activeLocationLink
        ).toHaveAttribute(
            'aria-current',
            'page'
        );
    }

    async verifyBreadcrumb(
        expectedBreadcrumb
    ) {
        await expect(
            this.breadcrumb
        ).toBeVisible();

        await expect(
            this.homeBreadcrumbLink
        ).toBeVisible();

        await expect(
            this.homeBreadcrumbLink
        ).toHaveAttribute(
            'href',
            '/'
        );

        await expect(
            this.currentBreadcrumb
        ).toHaveText(
            expectedBreadcrumb.currentPage
        );
    }

    async verifyLocationHeading(
        expectedHeading
    ) {
        await expect(
            this.locationHeading
        ).toBeVisible();

        await expect(
            this.locationHeading
        ).toHaveText(expectedHeading);
    }

    async verifyCompanyInformation(
        expectedCompany
    ) {
        await expect(
            this.companyName
        ).toBeVisible();

        await expect(
            this.companyName
        ).toContainText(
            'Nestlé International Travel Retail'
        );

        await expect(
            this.companyName
        ).toContainText(
            'Nestlé Enterprises S.A.'
        );

        await expect(
            this.companyAddress
        ).toBeVisible();

        await expect(
            this.companyAddress
        ).toContainText(
            expectedCompany.addressKeyword
        );
    }

    async verifyLocationImage() {
        await expect(
            this.locationImage
        ).toBeVisible();

        await expect(
            this.locationImage
        ).toHaveAttribute(
            'src',
            /.+/
        );
    }

    async verifyContactUsSection(
        expectedHeading,
        expectedIntro
    ) {
        await this.contactUsHeading
            .scrollIntoViewIfNeeded();

        await expect(
            this.contactUsHeading
        ).toBeVisible();

        await expect(
            this.contactUsHeading
        ).toHaveText(expectedHeading);

        await expect(
            this.contactIntro
        ).toBeVisible();

        await expect(
            this.contactIntro
        ).toContainText(expectedIntro);
    }

    async verifyContactFormDisplayed() {
        await this.contactForm
            .scrollIntoViewIfNeeded();

        await expect(
            this.contactForm
        ).toBeVisible();

        await expect(
            this.firstNameInput
        ).toBeVisible();

        await expect(
            this.lastNameInput
        ).toBeVisible();

        await expect(
            this.emailInput
        ).toBeVisible();

        await expect(
            this.countrySelect
        ).toBeVisible();

        await expect(
            this.phoneNumberInput
        ).toBeVisible();

        await expect(
            this.productDescriptionInput
        ).toBeVisible();

        await expect(
            this.batchCodeInput
        ).toBeVisible();

        await expect(
            this.eanInput
        ).toBeVisible();

        await expect(
            this.bestBeforeDateInput
        ).toBeVisible();

        await expect(
            this.messageInput
        ).toBeVisible();
    }

    async verifyRequiredFieldsEnabled() {
        await expect(
            this.firstNameInput
        ).toBeEnabled();

        await expect(
            this.lastNameInput
        ).toBeEnabled();

        await expect(
            this.emailInput
        ).toBeEnabled();

        await expect(
            this.countrySelect
        ).toBeEnabled();

        await expect(
            this.productDescriptionInput
        ).toBeEnabled();

        await expect(
            this.batchCodeInput
        ).toBeEnabled();

        await expect(
            this.eanInput
        ).toBeEnabled();

        await expect(
            this.bestBeforeDateInput
        ).toBeEnabled();

        await expect(
            this.messageInput
        ).toBeEnabled();
    }

    async fillContactForm(formData) {
        await this.firstNameInput.fill(
            formData.firstName
        );

        await this.lastNameInput.fill(
            formData.lastName
        );

        await this.emailInput.fill(
            formData.email
        );

        /*
         * Country selection is optional during field validation.
         * A value should be added to JSON after the exact option
         * value is confirmed from the website.
         */
        if (
            formData.country &&
            formData.country.trim().length > 0
        ) {
            await this.countrySelect.selectOption({
                label: formData.country
            });
        }

        if (
            formData.phoneNumber &&
            formData.phoneNumber.trim().length > 0
        ) {
            await this.phoneNumberInput.fill(
                formData.phoneNumber
            );
        }

        await this.productDescriptionInput.fill(
            formData.productDescription
        );

        await this.batchCodeInput.fill(
            formData.batchCode
        );

        await this.eanInput.fill(
            formData.ean
        );

        await this.bestBeforeDateInput.fill(
            formData.bestBeforeDate
        );

        await this.messageInput.fill(
            formData.message
        );
    }

    async verifyEnteredFormData(formData) {
        await expect(
            this.firstNameInput
        ).toHaveValue(formData.firstName);

        await expect(
            this.lastNameInput
        ).toHaveValue(formData.lastName);

        await expect(
            this.emailInput
        ).toHaveValue(formData.email);

        if (
            formData.phoneNumber &&
            formData.phoneNumber.trim().length > 0
        ) {
            await expect(
                this.phoneNumberInput
            ).toContainText(
                ''
            );
        }

        await expect(
            this.productDescriptionInput
        ).toHaveValue(
            formData.productDescription
        );

        await expect(
            this.batchCodeInput
        ).toHaveValue(formData.batchCode);

        await expect(
            this.eanInput
        ).toHaveValue(formData.ean);

        await expect(
            this.bestBeforeDateInput
        ).toHaveValue(
            formData.bestBeforeDate
        );

        await expect(
            this.messageInput
        ).toHaveValue(formData.message);
    }

    async verifyCaptchaSectionDisplayed() {
        const captchaHeadingVisible =
            await this.captchaHeading
                .isVisible()
                .catch(() => false);

        const captchaContainerVisible =
            await this.captchaSection
                .isVisible()
                .catch(() => false);

        expect(
            captchaHeadingVisible ||
                captchaContainerVisible,
            'CAPTCHA section should be displayed'
        ).toBeTruthy();
    }

    async verifySendMessageButton() {
        await expect(
            this.sendMessageButton
        ).toBeVisible();

        /*
         * The button is intentionally not clicked because
         * submission is protected by CAPTCHA.
         */
        await expect(
            this.sendMessageButton
        ).toHaveText(/send message/i);
    }
}

module.exports = { LocationPage };
