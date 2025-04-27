import { test, expect } from '@playwright/test';
import { BookingFormPage } from './page-objects/BookingFormPage';

test.describe('Complete Booking Form Flow', () => {
  let bookingFormPage: BookingFormPage;

  test.beforeEach(async ({ page }) => {
    bookingFormPage = new BookingFormPage(page);
    await bookingFormPage.goto();
  });

  test.skip('should complete the entire booking process from start to finish', async () => {
    // Step 1: Fill and submit contact details
    await bookingFormPage.expectContactDetailsSectionVisible();
    await bookingFormPage.fillContactDetails(
      'Mr',
      'John',
      'Doe',
      '1234567890',
      'john.doe@example.com',
    );
    await bookingFormPage.submitContactDetails();

    // Step 2: Fill and submit booking details
    await bookingFormPage.expectBookingDetailsSectionVisible();
    await bookingFormPage.fillBookingDetails(
      'personal',
      'leisure',
      'Premier Inn Manchester',
      '2025-06-01',
      '2025-06-03',
    );
    await bookingFormPage.submitBookingDetails();

    // Step 3: Fill and submit room requirements
    await bookingFormPage.expectRoomRequirementsSectionVisible();
    await bookingFormPage.fillRoomRequirements(
      10,
      2,
      1,
      'Need early check-in if possible.',
    );

    // Step 4: Submit the entire form
    await bookingFormPage.submitBookingForm();

    // Step 5: Verify success or confirmation page elements
    await expect(
      bookingFormPage.page.getByText(
        /Thank you for your booking|Confirmation|Successfully submitted/i,
      ),
    ).toBeVisible({ timeout: 10000 });

    // Additional validations - verify booking details presented in confirmation
    await expect(bookingFormPage.page.getByText('John Doe')).toBeVisible();
    await expect(
      bookingFormPage.page.getByText('London Victoria'),
    ).toBeVisible();

    // Capture screenshot of successful submission
    await bookingFormPage.page.screenshot({
      path: 'test-results/successful-booking-submission.png',
    });
  });

  test('should handle validation errors gracefully', async () => {
    // Attempt to submit the form without filling required fields
    await bookingFormPage.submitContactDetails();

    // Verify that error messages appear
    const errorMessages = bookingFormPage.page.locator(
      '[data-testid="form-error"], .error-message, .form-error',
    );
    await expect(errorMessages.first()).toBeVisible();

    // Fill just the required fields
    await bookingFormPage.fillContactDetails(
      'Mr',
      'John',
      'Doe',
      '1234567890',
      'john.doe@example.com',
    );

    // Submit and continue with the form
    await bookingFormPage.submitContactDetails();

    // Verify we can move to next section
    await bookingFormPage.expectBookingDetailsSectionVisible();
  });
});
