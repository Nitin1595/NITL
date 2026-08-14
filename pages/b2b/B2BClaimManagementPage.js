const { expect } = require('@playwright/test');

class B2BClaimManagementPage {
    constructor(page) {
        this.page = page;

        // Main authenticated Claim Management form
        this.claimForm = page.locator(
            '#webform-submission-claim-management-form-add-form'
        );

        this.heading = this.claimForm.getByRole(
            'heading',
            {
                name: 'Claim management form',
                level: 1,
                exact: true
            }
        );

        // Breadcrumb
        this.breadcrumb = page.locator(
            'nav[aria-label="breadcrumb"]'
        );

        this.breadcrumbItems = this.breadcrumb.locator(
            '.breadcrumb-item'
        );

        // Authenticated Dashboard navigation
        this.dashboardMenu = page.locator(
            '#block-retailx-dashboardmenu'
        );

        this.fileClaimTab = this.dashboardMenu.getByRole(
            'link',
            {
                name: 'File a Claim',
                exact: true
            }
        );

        // Form fields
        this.customerNameInput = this.claimForm.locator(
            '#edit-customer-name'
        );

        this.emailAddressInput = this.claimForm.locator(
            '#edit-email-address'
        );

        this.orderInvoiceInput = this.claimForm.locator(
            '#edit-order-invoice'
        );

        this.customerPoInput = this.claimForm.locator(
            '#edit-customer-po'
        );

        this.nitrSoInput = this.claimForm.locator(
            '#edit-nitr-so'
        );

        this.goodsReceiptDateInput = this.claimForm.locator(
            '#edit-date-of-goods-receipt'
        );

        this.goodsReceiptLocationInput = this.claimForm.locator(
            '#edit-location-of-goods-receipt'
        );

        this.itemCodeInput = this.claimForm.locator(
            '#edit-item-code'
        );

        this.batchCodeInput = this.claimForm.locator(
            '#edit-batch-code'
        );

        this.itemNameInput = this.claimForm.locator(
            '#edit-item-name'
        );

        this.complaintDescriptionInput = this.claimForm.locator(
            '#edit-description-of-complaint'
        );

        this.quantityInput = this.claimForm.locator(
            '#edit-quantity'
        );

        this.valueAndCurrencyInput = this.claimForm.locator(
            '#edit-value-and-currency'
        );

        // File-upload controls
        this.proofOfDeliveryInput = this.claimForm.locator(
            '#edit-copy-of-transport-cmr-upload'
        );

        this.proofOfDeliveryLabel = this.claimForm.locator(
            '#edit-copy-of-transport-cmr--label'
        );

        this.proofOfDeliveryDescription = this.claimForm.locator(
            '#edit-copy-of-transport-cmr--description'
        );

        this.photosInput = this.claimForm.locator(
            '#edit-photos-pictures-of-items-impacted-with-batch-code-visible-pictur-upload'
        );

        this.photosLabel = this.claimForm.locator(
            '#edit-photos-pictures-of-items-impacted-with-batch-code-visible-pictur--label'
        );

        this.photosDescription = this.claimForm.locator(
            '#edit-photos-pictures-of-items-impacted-with-batch-code-visible-pictur--description'
        );

        this.browseFileLinks = this.claimForm.getByRole(
            'link',
            {
                name: 'Browse files',
                exact: true
            }
        );

        // CAPTCHA validation only
        this.captchaFieldset = this.claimForm.locator(
            'fieldset.captcha'
        );

        this.captchaLegend = this.captchaFieldset.locator(
            'legend'
        );

        this.captchaDescription = this.captchaFieldset.locator(
            '.captcha__description'
        );

        this.recaptchaFrame = this.captchaFieldset.locator(
            'iframe[title="reCAPTCHA"]'
        );

        // Submit button, validation only
        this.submitButton = this.claimForm.getByRole(
            'button',
            {
                name: 'Submit claim',
                exact: true
            }
        );

        // Authenticated Footer
        this.footer = page.locator(
            'footer.site-footer'
        );

        this.footerNavigation = this.footer.locator(
            'nav.menu--footer'
        );

        this.logoutLink = this.footerNavigation.getByRole(
            'link',
            {
                name: 'Log out',
                exact: true
            }
        );

        this.footerCopyright = this.footer.locator(
            '#block-copyright'
        );
    }

    async openClaimManagementPage(expectedPath) {
        await this.page.goto(expectedPath, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        await expect(
            this.claimForm,
            'Authenticated Claim Management form should be displayed'
        ).toBeVisible({
            timeout: 30000
        });
    }

    async verifyPage(expectedPage) {
        await expect(this.page).toHaveURL(
            url => url.pathname === expectedPage.path
        );

        await expect(this.page).toHaveTitle(
            expectedPage.expectedTitle
        );

        await expect(this.heading).toBeVisible();

        await expect(this.heading).toHaveText(
            expectedPage.heading
        );
    }

    async verifyBreadcrumb(expectedBreadcrumb) {
        await expect(this.breadcrumb).toBeVisible();

        await expect(
            this.breadcrumbItems
        ).toHaveText(expectedBreadcrumb);

        await expect(
            this.breadcrumb.getByRole(
                'link',
                {
                    name: 'Home',
                    exact: true
                }
            )
        ).toHaveAttribute('href', '/');

        await expect(
            this.breadcrumb.getByRole(
                'link',
                {
                    name: 'Dashboard',
                    exact: true
                }
            )
        ).toHaveAttribute('href', '/dashboard');
    }

    async verifyDashboardNavigation(
        expectedNavigation
    ) {
        await expect(this.dashboardMenu).toBeVisible();

        for (const navigationItem of expectedNavigation) {
            const navigationLink =
                this.dashboardMenu.getByRole(
                    'link',
                    {
                        name: navigationItem.name,
                        exact: true
                    }
                );

            await expect(
                navigationLink,
                `Dashboard link should be visible: ${navigationItem.name}`
            ).toBeVisible();

            await expect(
                navigationLink
            ).toHaveAttribute(
                'href',
                navigationItem.path
            );
        }
    }

    async verifyFileClaimTab() {
        await expect(this.fileClaimTab).toBeVisible();

        await expect(this.fileClaimTab).toHaveAttribute(
            'href',
            '/dashboard/claim-management-form'
        );
    }

    getInputForField(fieldKey) {
        const fieldMap = {
            customerName: this.customerNameInput,
            emailAddress: this.emailAddressInput,
            orderInvoice: this.orderInvoiceInput,
            customerPo: this.customerPoInput,
            nitrSo: this.nitrSoInput,
            goodsReceiptDate: this.goodsReceiptDateInput,
            goodsReceiptLocation:
                this.goodsReceiptLocationInput,
            itemCode: this.itemCodeInput,
            batchCode: this.batchCodeInput,
            itemName: this.itemNameInput,
            complaintDescription:
                this.complaintDescriptionInput,
            quantity: this.quantityInput,
            valueAndCurrency:
                this.valueAndCurrencyInput
        };

        return fieldMap[fieldKey];
    }

    async verifyFormField(fieldKey, expectedField) {
        const field = this.getInputForField(fieldKey);

        expect(
            field,
            `Locator should exist for field: ${fieldKey}`
        ).toBeTruthy();

        await expect(field).toBeVisible();
        await expect(field).toBeEnabled();

        await expect(field).toHaveAttribute(
            'name',
            expectedField.name
        );

        if (expectedField.type) {
            await expect(field).toHaveAttribute(
                'type',
                expectedField.type
            );
        }

        if (expectedField.placeholder) {
            await expect(field).toHaveAttribute(
                'placeholder',
                expectedField.placeholder
            );
        }

        if (expectedField.maximumLength) {
            await expect(field).toHaveAttribute(
                'maxlength',
                expectedField.maximumLength
            );
        }

        if (expectedField.rows) {
            await expect(field).toHaveAttribute(
                'rows',
                expectedField.rows
            );
        }

        if (expectedField.required) {
            await expect(field).toHaveAttribute(
                'required',
                'required'
            );
        } else {
            await expect(field).not.toHaveAttribute(
                'required',
                'required'
            );
        }

        const label = this.claimForm.locator(
            `label[for="${await field.getAttribute('id')}"]`
        );

        await expect(label).toContainText(
            expectedField.label
        );
    }

    async verifyAllFields(expectedFields) {
        for (const [
            fieldKey,
            expectedField
        ] of Object.entries(expectedFields)) {
            await this.verifyFormField(
                fieldKey,
                expectedField
            );
        }
    }

    async verifyAuthenticatedEmail() {
        await expect(
            this.emailAddressInput
        ).toBeVisible();

        const emailValue =
            await this.emailAddressInput.inputValue();

        expect(
            emailValue,
            'Authenticated email field should contain a value'
        ).toBeTruthy();

        expect(
            emailValue,
            'Authenticated email should use a valid email format'
        ).toMatch(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        );
    }

    async verifyDateRestriction() {
        const maximumDate =
            await this.goodsReceiptDateInput
                .getAttribute('max');

        expect(
            maximumDate,
            'Goods receipt date should have a maximum date'
        ).toBeTruthy();

        expect(
            maximumDate,
            'Maximum receipt date should use YYYY-MM-DD format'
        ).toMatch(
            /^\d{4}-\d{2}-\d{2}$/
        );
    }

    async verifyUploadControls(expectedUploads) {
        await expect(
            this.proofOfDeliveryLabel
        ).toContainText(
            expectedUploads.proofOfDelivery.label
        );

        await expect(
            this.proofOfDeliveryInput
        ).toBeAttached();

        await expect(
            this.proofOfDeliveryInput
        ).toHaveAttribute(
            'type',
            'file'
        );

        await expect(
            this.proofOfDeliveryInput
        ).toHaveAttribute(
            'name',
            expectedUploads.proofOfDelivery.name
        );

        await expect(
            this.proofOfDeliveryInput
        ).not.toHaveAttribute(
            'multiple',
            'multiple'
        );

        for (
            const description
            of expectedUploads.proofOfDelivery.description
        ) {
            await expect(
                this.proofOfDeliveryDescription
            ).toContainText(description);
        }

        await expect(
            this.photosLabel
        ).toContainText(
            expectedUploads.photos.labelKeyword
        );

        await expect(
            this.photosInput
        ).toBeAttached();

        await expect(
            this.photosInput
        ).toHaveAttribute(
            'type',
            'file'
        );

        await expect(
            this.photosInput
        ).toHaveAttribute(
            'multiple',
            'multiple'
        );

        await expect(
            this.photosInput
        ).toHaveAttribute(
            'accept',
            expectedUploads.photos.accept
        );

        for (
            const description
            of expectedUploads.photos.description
        ) {
            await expect(
                this.photosDescription
            ).toContainText(description);
        }

        await expect(
            this.browseFileLinks
        ).toHaveCount(2);
    }

    async verifyCaptcha(expectedCaptcha) {
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

    async verifySubmitButton(expectedText) {
        await expect(
            this.submitButton
        ).toBeVisible();

        await expect(
            this.submitButton
        ).toBeEnabled();

        await expect(
            this.submitButton
        ).toHaveText(expectedText);

        await expect(
            this.submitButton
        ).toHaveAttribute(
            'type',
            'submit'
        );
    }

    async fillSyntheticClaimData(testData) {
        await this.customerNameInput.fill(
            testData.customerName
        );

        await this.orderInvoiceInput.fill(
            testData.orderInvoice
        );

        await this.customerPoInput.fill(
            testData.customerPo
        );

        await this.nitrSoInput.fill(
            testData.nitrSo
        );

        await this.goodsReceiptDateInput.fill(
            testData.goodsReceiptDate
        );

        await this.goodsReceiptLocationInput.fill(
            testData.goodsReceiptLocation
        );

        await this.itemCodeInput.fill(
            testData.itemCode
        );

        await this.batchCodeInput.fill(
            testData.batchCode
        );

        await this.itemNameInput.fill(
            testData.itemName
        );

        await this.complaintDescriptionInput.fill(
            testData.complaintDescription
        );

        await this.quantityInput.fill(
            testData.quantity
        );

        await this.valueAndCurrencyInput.fill(
            testData.valueAndCurrency
        );
    }

    async verifySyntheticClaimData(testData) {
        await expect(
            this.customerNameInput
        ).toHaveValue(testData.customerName);

        await expect(
            this.orderInvoiceInput
        ).toHaveValue(testData.orderInvoice);

        await expect(
            this.customerPoInput
        ).toHaveValue(testData.customerPo);

        await expect(
            this.nitrSoInput
        ).toHaveValue(testData.nitrSo);

        await expect(
            this.goodsReceiptDateInput
        ).toHaveValue(
            testData.goodsReceiptDate
        );

        await expect(
            this.goodsReceiptLocationInput
        ).toHaveValue(
            testData.goodsReceiptLocation
        );

        await expect(
            this.itemCodeInput
        ).toHaveValue(testData.itemCode);

        await expect(
            this.batchCodeInput
        ).toHaveValue(testData.batchCode);

        await expect(
            this.itemNameInput
        ).toHaveValue(testData.itemName);

        await expect(
            this.complaintDescriptionInput
        ).toHaveValue(
            testData.complaintDescription
        );

        await expect(
            this.quantityInput
        ).toHaveValue(testData.quantity);

        await expect(
            this.valueAndCurrencyInput
        ).toHaveValue(
            testData.valueAndCurrency
        );
    }

    async clearSyntheticClaimData() {
        const fieldsToClear = [
            this.customerNameInput,
            this.orderInvoiceInput,
            this.customerPoInput,
            this.nitrSoInput,
            this.goodsReceiptDateInput,
            this.goodsReceiptLocationInput,
            this.itemCodeInput,
            this.batchCodeInput,
            this.itemNameInput,
            this.complaintDescriptionInput,
            this.quantityInput,
            this.valueAndCurrencyInput
        ];

        for (const field of fieldsToClear) {
            await field.fill('');
        }
    }

    async verifySyntheticFieldsCleared() {
        const fieldsToValidate = [
            this.customerNameInput,
            this.orderInvoiceInput,
            this.customerPoInput,
            this.nitrSoInput,
            this.goodsReceiptDateInput,
            this.goodsReceiptLocationInput,
            this.itemCodeInput,
            this.batchCodeInput,
            this.itemNameInput,
            this.complaintDescriptionInput,
            this.quantityInput,
            this.valueAndCurrencyInput
        ];

        for (const field of fieldsToValidate) {
            await expect(field).toHaveValue('');
        }

        await this.verifyAuthenticatedEmail();
    }

    async verifyFooter(expectedFooter) {
        await this.footer.scrollIntoViewIfNeeded();

        await expect(this.footer).toBeVisible();

        for (const expectedLink of expectedFooter.links) {
            const footerLink =
                this.footerNavigation.getByRole(
                    'link',
                    {
                        name: expectedLink.name,
                        exact: true
                    }
                );

            await expect(footerLink).toBeVisible();

            await expect(footerLink).toHaveAttribute(
                'href',
                expectedLink.path
            );
        }

        await expect(
            this.footerCopyright
        ).toContainText(
            expectedFooter.copyrightKeyword
        );
    }

    async verifyLogoutLink(
        expectedText,
        expectedPathPrefix
    ) {
        await this.footer.scrollIntoViewIfNeeded();

        await expect(
            this.logoutLink
        ).toBeVisible();

        await expect(
            this.logoutLink
        ).toHaveText(expectedText);

        const logoutHref =
            await this.logoutLink.getAttribute('href');

        expect(
            logoutHref,
            'Logout link should contain an href'
        ).toBeTruthy();

        expect(
            logoutHref.startsWith(
                expectedPathPrefix
            ),
            'Logout URL should use the stable logout path'
        ).toBeTruthy();
    }

    async logout() {
        await this.footer.scrollIntoViewIfNeeded();

        await this.logoutLink.click();

        await this.page.waitForLoadState(
            'domcontentloaded'
        );
    }

    async verifyLoggedOut() {
        await expect(
            this.claimForm
        ).toBeHidden({
            timeout: 15000
        });

        await expect(
            this.logoutLink
        ).toBeHidden({
            timeout: 15000
        });

        await expect(this.page).not.toHaveURL(
            url =>
                url.pathname ===
                '/dashboard/claim-management-form'
        );
    }
    async attachProofOfDelivery(filePath) {
        expect(
            filePath,
            'Proof-of-delivery fixture path should be provided'
        ).toBeTruthy();

        await expect(
            this.proofOfDeliveryInput
        ).toBeAttached();

        await this.proofOfDeliveryInput.setInputFiles(
            filePath
        );
    }

    async verifyProofOfDeliveryAttached(
        expectedFileName
    ) {
        const selectedFiles =
            await this.proofOfDeliveryInput
                .evaluate(inputElement =>
                    Array.from(
                        inputElement.files || []
                    ).map(file => file.name)
                );

        expect(
            selectedFiles,
            'One proof-of-delivery file should be selected'
        ).toHaveLength(1);

        expect(
            selectedFiles[0],
            'Selected proof-of-delivery filename should match'
        ).toBe(expectedFileName);
    }

    async attachProductPhotos(filePaths) {
        expect(
            Array.isArray(filePaths),
            'Product-photo fixture paths should be an array'
        ).toBeTruthy();

        expect(
            filePaths.length,
            'At least one product-photo fixture should be provided'
        ).toBeGreaterThan(0);

        expect(
            filePaths.length,
            'No more than five product photos should be selected'
        ).toBeLessThanOrEqual(5);

        await expect(
            this.photosInput
        ).toBeAttached();

        await this.photosInput.setInputFiles(
            filePaths
        );
    }

    async verifyProductPhotosAttached(
        expectedFileNames
    ) {
        const selectedFiles =
            await this.photosInput
                .evaluate(inputElement =>
                    Array.from(
                        inputElement.files || []
                    ).map(file => file.name)
                );

        expect(
            selectedFiles,
            'Selected product-photo count should match'
        ).toHaveLength(
            expectedFileNames.length
        );

        expect(
            selectedFiles,
            'Selected product-photo filenames should match'
        ).toEqual(expectedFileNames);
    }

    async clearAttachedFiles() {
        await this.proofOfDeliveryInput
            .setInputFiles([]);

        await this.photosInput
            .setInputFiles([]);
    }

    async verifyAttachedFilesCleared() {
        const proofFileCount =
            await this.proofOfDeliveryInput
                .evaluate(inputElement =>
                    inputElement.files?.length || 0
                );

        const photoFileCount =
            await this.photosInput
                .evaluate(inputElement =>
                    inputElement.files?.length || 0
                );

        expect(
            proofFileCount,
            'Proof-of-delivery selection should be cleared'
        ).toBe(0);

        expect(
            photoFileCount,
            'Product-photo selection should be cleared'
        ).toBe(0);
    }

    async verifyClaimNotSubmitted(
        expectedPath
    ) {
        await expect(this.page).toHaveURL(
            url => url.pathname === expectedPath
        );

        await expect(
            this.claimForm,
            'Claim form should remain displayed'
        ).toBeVisible();

        await expect(
            this.submitButton,
            'Submit claim button should remain available'
        ).toBeVisible();
    }


}

module.exports = {B2BClaimManagementPage};