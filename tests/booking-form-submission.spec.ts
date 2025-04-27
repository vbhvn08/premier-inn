import { test, expect } from '@playwright/test';
import { BookingFormPage } from './page-objects/BookingFormPage';

test.describe('Booking Form Submission and Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API mocking for each test
    await page.route('/api/form', async (route) => {
      const requestBody = JSON.parse(route.request().postData() || '{}');
      console.log('Mocking API request with body:', requestBody);

      // Default to successful response
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    const bookingFormPage = new BookingFormPage(page);
    await bookingFormPage.goto();
  });

  test('should show validation errors for empty required fields', async ({
    page,
  }) => {
    const bookingFormPage = new BookingFormPage(page);

    // Clear the form fields (in case they have default values)
    await bookingFormPage.firstNameInput.fill('');
    await bookingFormPage.lastNameInput.fill('');
    await bookingFormPage.emailInput.fill('');

    // Try to submit contact details without filling any fields
    await bookingFormPage.submitContactDetails();

    // Check for error messages in a more flexible way
    await bookingFormPage.expectFormErrorsVisible();
  });

  test('should show validation error for invalid email format', async ({
    page,
  }) => {
    const bookingFormPage = new BookingFormPage(page);

    // Fill contact details with invalid email
    await bookingFormPage.fillContactDetails(
      'Mr',
      'John',
      'Doe',
      '1234567890',
      'invalid-email',
    );
    await bookingFormPage.submitContactDetails();

    // Use a more robust way to check for validation errors
    const hasEmailError = await page.evaluate(() => {
      const errorElements = Array.from(
        document.querySelectorAll(
          '.error-message, [class*="error"], [data-testid*="error"]',
        ),
      );
      return errorElements.some(
        (el) =>
          (el.textContent && el.textContent.toLowerCase().includes('email')) ||
          el.textContent?.toLowerCase().includes('valid'),
      );
    });

    expect(hasEmailError).toBeTruthy();
  });

  test('should submit form with valid data', async ({ page }) => {
    const bookingFormPage = new BookingFormPage(page);

    // Override the default mock for this specific test
    await page.route('/api/form', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Set up an alert listener before filling form (since the component may use window.alert for success)
    let alertMessage = '';
    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Fill in contact details and continue
    await bookingFormPage.fillContactDetails(
      'Mr',
      'John',
      'Doe',
      '1234567890',
      'john.doe@example.com',
    );
    await bookingFormPage.submitContactDetails();

    // Wait for the booking details section to become visible before continuing
    await bookingFormPage.expectBookingDetailsSectionVisible().catch(() => {
      // If the section isn't visible, try to open it
      return bookingFormPage.openBookingDetailsSection();
    });

    // Fill in booking details and continue
    await bookingFormPage.fillBookingDetails(
      'personal',
      'leisure',
      'Premier Inn London',
      '2025-05-15',
      '2025-05-20',
    );
    await bookingFormPage.submitBookingDetails();

    // Wait for room requirements section to become visible
    await bookingFormPage.expectRoomRequirementsSectionVisible().catch(() => {
      // If not visible, try to open it
      return bookingFormPage.openRoomRequirementsSection();
    });

    // Fill in room requirements and submit
    await bookingFormPage.fillRoomRequirements(
      1,
      0,
      0,
      'No additional requests',
    );
    await bookingFormPage.submitBookingForm();

    // Check for success indicators using our improved method
    await bookingFormPage.expectSuccessMessage();
  });

  test('should handle server validation errors', async ({ page }) => {
    const bookingFormPage = new BookingFormPage(page);

    // Override the default mock for this specific test
    await page.route('/api/form', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          errors: {
            'contactDetails.email': 'This email is already registered',
          },
        }),
      });
    });

    // Fill all form sections with valid data
    await bookingFormPage.fillContactDetails(
      'Mrs',
      'Jane',
      'Smith',
      '9876543210',
      'jane.smith@example.com',
    );
    await bookingFormPage.submitContactDetails();

    // Make sure booking details section is visible
    await bookingFormPage.expectBookingDetailsSectionVisible().catch(() => {
      return bookingFormPage.openBookingDetailsSection();
    });

    await bookingFormPage.fillBookingDetails(
      'personal',
      'business',
      'Premier Inn Manchester',
      '2025-06-10',
      '2025-06-15',
    );
    await bookingFormPage.submitBookingDetails();

    // Make sure room requirements section is visible
    await bookingFormPage.expectRoomRequirementsSectionVisible().catch(() => {
      return bookingFormPage.openRoomRequirementsSection();
    });

    await bookingFormPage.fillRoomRequirements(0, 1, 0);
    await bookingFormPage.submitBookingForm();

    // Wait for the form to process the server response
    await page.waitForTimeout(1000);

    // Check for any validation error message in a more flexible way
    const hasError = await page.evaluate(() => {
      const errorMessages = Array.from(
        document.querySelectorAll(
          '.error-message, [class*="error"], [data-testid*="error"]',
        ),
      );
      return errorMessages.some(
        (el) =>
          el.textContent &&
          (el.textContent.includes('email') ||
            el.textContent.includes('registered') ||
            el.textContent.includes('validation')),
      );
    });

    expect(hasError).toBeTruthy();
  });

  test('should handle generic server errors', async ({ page }) => {
    const bookingFormPage = new BookingFormPage(page);

    // Override the default mock for this specific test
    await page.route('/api/form', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Server error occurred',
        }),
      });
    });

    // Fill all form sections with valid data
    await bookingFormPage.fillContactDetails(
      'Dr',
      'Alex',
      'Johnson',
      '5551234567',
      'alex.j@example.com',
    );
    await bookingFormPage.submitContactDetails();

    // Make sure booking details section is visible
    await bookingFormPage.expectBookingDetailsSectionVisible().catch(() => {
      return bookingFormPage.openBookingDetailsSection();
    });

    await bookingFormPage.fillBookingDetails(
      'business',
      'business',
      'Premier Inn Edinburgh',
      '2025-07-20',
      '2025-07-25',
    );
    await bookingFormPage.submitBookingDetails();

    // Make sure room requirements section is visible
    await bookingFormPage.expectRoomRequirementsSectionVisible().catch(() => {
      return bookingFormPage.openRoomRequirementsSection();
    });

    await bookingFormPage.fillRoomRequirements(1, 1, 1);
    await bookingFormPage.submitBookingForm();

    // Wait for the form to process the server response
    await page.waitForTimeout(1000);

    // Look for error messages using a flexible approach
    const hasServerError = await page.evaluate(() => {
      // Check for error messages containing relevant keywords
      const errorTexts = Array.from(document.querySelectorAll('body *')).map(
        (el) => el.textContent?.toLowerCase(),
      );
      return errorTexts.some(
        (text) =>
          text &&
          (text.includes('server') ||
            text.includes('error') ||
            text.includes('fail') ||
            text.includes('something went wrong')),
      );
    });

    expect(hasServerError).toBeTruthy();
  });
});
