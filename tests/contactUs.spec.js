const {
    test,
    expect
} = require('@playwright/test');

const {
    ContactUsPage
} = require('../pages/ContactUsPage');

const contactUsData = require(
    '../testData/contactUsData.json'
);

test.describe(
    'Nestle International Travel Retail Contact Us Page',
    () => {
        test(
            'Validate all Contact Us page components without submitting the form',
            async ({ page }) => {
                const contactUsPage =
                    new ContactUsPage(page);

                await test.step(
                    'Open the Contact Us page',
                    async () => {
                        await contactUsPage.navigate(
                            contactUsData.page.path
                        );
                    }
                );

                await test.step(
                    'Verify Contact Us URL title heading and content',
                    async () => {
                        await contactUsPage.verifyPage(
                            contactUsData.page
                        );
                    }
                );

                await test.step(
                    'Verify Contact Us breadcrumb',
                    async () => {
                        await contactUsPage
                            .verifyBreadcrumb(
                                contactUsData.breadcrumb
                            );
                    }
                );

                await test.step(
                    'Verify public Header and navigation',
                    async () => {
                        await contactUsPage
                            .verifyPublicHeader(
                                contactUsData.header
                            );
                    }
                );

                await test.step(
                    'Verify Contact Us address',
                    async () => {
                        await contactUsPage
                            .verifyAddress(
                                contactUsData.address
                            );
                    }
                );

                await test.step(
                    'Verify Contact Us form structure',
                    async () => {
                        await contactUsPage
                            .verifyFormStructure(
                                contactUsData.form
                            );
                    }
                );

                await test.step(
                    'Verify all Contact Us form fields',
                    async () => {
                        await contactUsPage
                            .verifyAllFields(
                                contactUsData.fields
                            );
                    }
                );

                await test.step(
                    'Verify required and optional Contact Us fields',
                    async () => {
                        await contactUsPage
                            .verifyRequiredAndOptionalFields(
                                contactUsData
                                    .requiredFieldKeys,

                                contactUsData
                                    .optionalFieldKeys
                            );
                    }
                );

                await test.step(
                    'Verify Contact Us fields are initially empty',
                    async () => {
                        await contactUsPage
                            .verifyFieldsInitiallyEmpty();
                    }
                );

                await test.step(
                    'Verify Country dropdown and options',
                    async () => {
                        await contactUsPage
                            .verifyCountryDropdown(
                                contactUsData
                                    .fields
                                    .country,

                                contactUsData
                                    .countryValidation
                            );
                    }
                );

                await test.step(
                    'Verify optional international phone control',
                    async () => {
                        await contactUsPage
                            .verifyPhoneControl(
                                contactUsData
                                    .fields
                                    .phone
                            );
                    }
                );

                await test.step(
                    'Verify CAPTCHA component without interaction',
                    async () => {
                        await contactUsPage
                            .verifyCaptcha(
                                contactUsData.captcha
                            );
                    }
                );

                await test.step(
                    'Verify Send Message button without clicking',
                    async () => {
                        await contactUsPage
                            .verifySendMessageButton(
                                contactUsData
                                    .buttons
                                    .submit
                            );
                    }
                );

                await test.step(
                    'Confirm Contact Us form was not submitted',
                    async () => {
                        await contactUsPage
                            .verifyFormNotSubmitted(
                                contactUsData
                                    .page
                                    .path,

                                contactUsData
                                    .safety
                            );
                    }
                );

                await test.step(
                    'Verify Contact Us Footer',
                    async () => {
                        await contactUsPage
                            .verifyFooter(
                                contactUsData.footer
                            );
                    }
                );

                await test.step(
                    'Confirm test remains on Contact Us page',
                    async () => {
                        await expect(page).toHaveURL(
                            url =>
                                url.pathname ===
                                contactUsData
                                    .page
                                    .path
                        );

                        await expect(
                            contactUsPage.contactForm
                        ).toBeVisible();

                        await expect(
                            contactUsPage
                                .sendMessageButton
                        ).toBeVisible();
                    }
                );
            }
        );
    }
);