const path = require('path');

const {
    test,
    expect
} = require('@playwright/test');

require('dotenv').config({
    path: path.resolve(
        process.cwd(),
        '.env'
    ),
    quiet: true,
    override: true
});

const {
    B2BLoginPage
} = require('../pages/B2BLoginPage');

const {
    B2BClaimManagementPage
} = require(
    '../pages/b2b/B2BClaimManagementPage'
);

const b2bLoginData = require(
    '../testData/b2bLoginData.json'
);

const b2bClaimManagementData = require(
    '../testData/b2bClaimManagementData.json'
);

test.describe(
    'Nestle International Travel Retail B2B Claim Management',
    () => {
        test(
            'Validate Claim Management form and synthetic attachments without submission',
            async ({ page }) => {
                const b2bLoginPage =
                    new B2BLoginPage(page);

                const claimManagementPage =
                    new B2BClaimManagementPage(page);

                const username =
                    process.env.B2B_USERNAME?.trim();

                const password =
                    process.env.B2B_PASSWORD;

                expect(
                    username,
                    'B2B_USERNAME is missing from the project .env file'
                ).toBeTruthy();

                expect(
                    password,
                    'B2B_PASSWORD is missing from the project .env file'
                ).toBeTruthy();

                await test.step(
                    'Open Home page for B2B authentication',
                    async () => {
                        await b2bLoginPage.navigate(
                            b2bLoginData
                                .backgroundPagePath
                        );
                    }
                );

                await test.step(
                    'Open B2B Login modal',
                    async () => {
                        await b2bLoginPage
                            .openLoginModal();
                    }
                );

                await test.step(
                    'Enter B2B credentials securely',
                    async () => {
                        await b2bLoginPage
                            .fillCredentials(
                                username,
                                password
                            );

                        await b2bLoginPage
                            .verifyCredentialsEntered();
                    }
                );

                await test.step(
                    'Submit B2B Login form',
                    async () => {
                        await b2bLoginPage
                            .submitLogin(
                                b2bLoginData
                                    .paths
                                    .dashboard
                            );
                    }
                );

                await test.step(
                    'Open authenticated Claim Management page',
                    async () => {
                        await claimManagementPage
                            .openClaimManagementPage(
                                b2bClaimManagementData
                                    .page
                                    .path
                            );
                    }
                );

                await test.step(
                    'Verify Claim Management URL title and heading',
                    async () => {
                        await claimManagementPage
                            .verifyPage(
                                b2bClaimManagementData
                                    .page
                            );
                    }
                );

                await test.step(
                    'Verify Claim Management breadcrumb',
                    async () => {
                        await claimManagementPage
                            .verifyBreadcrumb(
                                b2bClaimManagementData
                                    .breadcrumb
                            );
                    }
                );

                await test.step(
                    'Verify authenticated Dashboard navigation',
                    async () => {
                        await claimManagementPage
                            .verifyDashboardNavigation(
                                b2bClaimManagementData
                                    .dashboardNavigation
                            );
                    }
                );

                await test.step(
                    'Verify File a Claim navigation tab',
                    async () => {
                        await claimManagementPage
                            .verifyFileClaimTab();
                    }
                );

                await test.step(
                    'Verify all Claim Management fields',
                    async () => {
                        await claimManagementPage
                            .verifyAllFields(
                                b2bClaimManagementData
                                    .fields
                            );
                    }
                );

                await test.step(
                    'Verify authenticated email field safely',
                    async () => {
                        await claimManagementPage
                            .verifyAuthenticatedEmail();
                    }
                );

                await test.step(
                    'Verify goods receipt date restriction',
                    async () => {
                        await claimManagementPage
                            .verifyDateRestriction();
                    }
                );

                await test.step(
                    'Verify Claim Management upload controls and rules',
                    async () => {
                        await claimManagementPage
                            .verifyUploadControls(
                                b2bClaimManagementData
                                    .uploads
                            );
                    }
                );

                await test.step(
                    'Attach synthetic proof of delivery',
                    async () => {
                        const proofPath =
                            path.resolve(
                                process.cwd(),
                                b2bClaimManagementData
                                    .uploads
                                    .proofOfDelivery
                                    .fixturePath
                            );

                        expect(
                            proofPath,
                            'Proof-of-delivery fixture path should be available'
                        ).toBeTruthy();

                        await claimManagementPage
                            .attachProofOfDelivery(
                                proofPath
                            );

                        await claimManagementPage
                            .verifyProofOfDeliveryAttached(
                                b2bClaimManagementData
                                    .uploads
                                    .proofOfDelivery
                                    .expectedFileName
                            );
                    }
                );

                await test.step(
                    'Attach synthetic product photos',
                    async () => {
                        const photoPaths =
                            b2bClaimManagementData
                                .uploads
                                .photos
                                .fixturePaths
                                .map(filePath =>
                                    path.resolve(
                                        process.cwd(),
                                        filePath
                                    )
                                );

                        expect(
                            photoPaths.length,
                            'Synthetic product-photo fixtures should be available'
                        ).toBeGreaterThan(0);

                        expect(
                            photoPaths.length,
                            'No more than five product photos should be selected'
                        ).toBeLessThanOrEqual(5);

                        await claimManagementPage
                            .attachProductPhotos(
                                photoPaths
                            );

                        await claimManagementPage
                            .verifyProductPhotosAttached(
                                b2bClaimManagementData
                                    .uploads
                                    .photos
                                    .expectedFileNames
                            );
                    }
                );

                await test.step(
                    'Verify claim remains unsubmitted after attachments',
                    async () => {
                        await claimManagementPage
                            .verifyClaimNotSubmitted(
                                b2bClaimManagementData
                                    .page
                                    .path
                            );
                    }
                );

                await test.step(
                    'Clear all synthetic attachments',
                    async () => {
                        await claimManagementPage
                            .clearAttachedFiles();

                        await claimManagementPage
                            .verifyAttachedFilesCleared();
                    }
                );

                await test.step(
                    'Verify CAPTCHA component without interaction',
                    async () => {
                        await claimManagementPage
                            .verifyCaptcha(
                                b2bClaimManagementData
                                    .captcha
                            );
                    }
                );

                await test.step(
                    'Verify Submit claim button without clicking',
                    async () => {
                        await claimManagementPage
                            .verifySubmitButton(
                                b2bClaimManagementData
                                    .buttons
                                    .submit
                            );
                    }
                );

                await test.step(
                    'Confirm Claim Management form was not submitted',
                    async () => {
                        await expect(page).toHaveURL(
                            url =>
                                url.pathname ===
                                b2bClaimManagementData
                                    .page
                                    .path
                        );

                        await expect(
                            claimManagementPage
                                .claimForm
                        ).toBeVisible();

                        await expect(
                            claimManagementPage
                                .submitButton
                        ).toBeVisible();

                        await expect(
                            page.getByText(
                                'Your message has been sent',
                                {
                                    exact: true
                                }
                            )
                        ).toBeHidden();
                    }
                );

                await test.step(
                    'Verify authenticated Claim Management Footer',
                    async () => {
                        await claimManagementPage
                            .verifyFooter(
                                b2bClaimManagementData
                                    .footer
                            );
                    }
                );

                await test.step(
                    'Verify Claim Management Log out link',
                    async () => {
                        await claimManagementPage
                            .verifyLogoutLink(
                                b2bClaimManagementData
                                    .footer
                                    .logoutText,

                                b2bClaimManagementData
                                    .paths
                                    .logoutPrefix
                            );
                    }
                );

                await test.step(
                    'Log out after Claim Management validation',
                    async () => {
                        await claimManagementPage
                            .logout();
                    }
                );

                await test.step(
                    'Verify B2B Claim Management session is closed',
                    async () => {
                        await claimManagementPage
                            .verifyLoggedOut();
                    }
                );
            }
        );
    }
);