import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GroupBookingForm from '../../src/app/components/BookingForm';

// Mock zod resolver to avoid validation issues in tests
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => () => ({
    values: {},
    errors: {},
    isValid: true,
  }),
}));

// Mock react-hook-form trigger method
jest.mock('react-hook-form', () => {
  const originalModule = jest.requireActual('react-hook-form');
  return {
    ...originalModule,
    useForm: () => ({
      ...originalModule.useForm(),
      trigger: jest.fn().mockResolvedValue(true),
      formState: { errors: {} },
      getValues: () => ({
        contactDetails: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          phone: '1234567890',
          title: 'Mr',
        },
        bookingDetails: {
          hotel: 'Test Hotel',
          checkIn: '2025-05-01',
          checkOut: '2025-05-05',
          bookerType: 'personal',
          stayingFor: 'business',
          reasonForVisit: 'business',
        },
        roomRequirements: {
          singleOccupancyRooms: 1,
          doubleOccupancyRooms: 0,
          twinRooms: 0,
        },
      }),
      reset: jest.fn(),
      setError: jest.fn(),
    }),
  };
});

// Mock the child components
jest.mock('../../src/app/components/ContactDetailsForm', () => ({
  __esModule: true,
  default: ({ onContinue }) => (
    <div data-testid='contact-details-form'>
      <button data-testid='contact-continue-btn' onClick={onContinue}>
        Continue
      </button>
    </div>
  ),
}));

jest.mock('../../src/app/components/BookingDetailsForm', () => ({
  __esModule: true,
  default: ({ onContinue }) => (
    <div data-testid='booking-details-form'>
      <button data-testid='booking-continue-btn' onClick={onContinue}>
        Continue
      </button>
    </div>
  ),
}));

jest.mock('../../src/app/components/RoomRequirementsForm', () => ({
  __esModule: true,
  default: ({ onSubmit, isSubmitting, submissionError }) => (
    <div data-testid='room-requirements-form'>
      <span data-testid='submission-error'>{submissionError || ''}</span>
      <button
        data-testid='room-submit-btn'
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  ),
}));

// Mock CollapsibleSection component
jest.mock('../../src/app/components/CollapsibleSection', () => ({
  __esModule: true,
  default: ({ title, isOpen, onToggle, children }) => (
    <div data-testid={`section-${title}`}>
      <button onClick={onToggle} data-testid={`toggle-${title}`}>
        {title} {isOpen ? 'Close' : 'Open'}
      </button>
      {isOpen && <div data-testid={`content-${title}`}>{children}</div>}
    </div>
  ),
}));

// Begin test suite
describe('GroupBookingForm', () => {
  beforeEach(() => {
    // Mock fetch implementation for each test
    global.fetch = jest.fn();
  });

  test('renders the form with ContactDetails section open by default', () => {
    render(<GroupBookingForm />);

    // Check that the contact details section is open
    expect(
      screen.getByTestId('content-contactDetailsTitle'),
    ).toBeInTheDocument();

    // Check that the other sections are closed
    expect(
      screen.queryByTestId('content-bookingDetailsTitle'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('content-roomRequirementsTitle'),
    ).not.toBeInTheDocument();
  });

  test('toggles between form sections when continue buttons are clicked', async () => {
    render(<GroupBookingForm />);

    // Initially, contact details section is open
    expect(
      screen.getByTestId('content-contactDetailsTitle'),
    ).toBeInTheDocument();

    // Click continue in contact details form
    fireEvent.click(screen.getByTestId('contact-continue-btn'));

    // Now booking details section should be open and contact details closed
    await waitFor(() => {
      expect(
        screen.queryByTestId('content-contactDetailsTitle'),
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId('content-bookingDetailsTitle'),
      ).toBeInTheDocument();
    });

    // Click continue in booking details form
    fireEvent.click(screen.getByTestId('booking-continue-btn'));

    // Now room requirements section should be open and booking details closed
    await waitFor(() => {
      expect(
        screen.queryByTestId('content-bookingDetailsTitle'),
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId('content-roomRequirementsTitle'),
      ).toBeInTheDocument();
    });
  });

  test('toggles sections when section headers are clicked', async () => {
    render(<GroupBookingForm />);

    // Initially, contact details section is open
    expect(
      screen.getByTestId('content-contactDetailsTitle'),
    ).toBeInTheDocument();

    // Click on the booking details header to open it
    fireEvent.click(screen.getByTestId('toggle-bookingDetailsTitle'));

    // Now booking details section should be open and contact details closed
    await waitFor(() => {
      expect(
        screen.queryByTestId('content-contactDetailsTitle'),
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId('content-bookingDetailsTitle'),
      ).toBeInTheDocument();
    });
  });

  test('handles form submission', async () => {
    // Mock successful form submission
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    // Mock window.alert
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<GroupBookingForm />);

    // Navigate to room requirements section
    fireEvent.click(screen.getByTestId('toggle-roomRequirementsTitle'));
    await waitFor(() => {
      expect(
        screen.getByTestId('content-roomRequirementsTitle'),
      ).toBeInTheDocument();
    });

    // Submit the form
    fireEvent.click(screen.getByTestId('room-submit-btn'));

    // Verify fetch was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/form',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      // Check if alert was shown for successful submission
      expect(mockAlert).toHaveBeenCalledWith('Booking submitted successfully!');
    });

    mockAlert.mockRestore();
  });

  test('handles server errors during form submission', async () => {
    // Mock failed form submission with server errors
    const serverErrors = {
      'contactDetails.email': 'Invalid email format',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: serverErrors }),
    });

    render(<GroupBookingForm />);

    // Navigate to room requirements section
    fireEvent.click(screen.getByTestId('toggle-roomRequirementsTitle'));
    await waitFor(() => {
      expect(
        screen.getByTestId('content-roomRequirementsTitle'),
      ).toBeInTheDocument();
    });

    // Submit the form
    fireEvent.click(screen.getByTestId('room-submit-btn'));

    // Verify fetch was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Check that the form switches back to the contact details section (where the error is)
    await waitFor(() => {
      expect(
        screen.getByTestId('content-contactDetailsTitle'),
      ).toBeInTheDocument();
    });
  });

  test('handles general submission error', async () => {
    // Mock failed form submission with general error message
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Server error occurred' }),
    });

    render(<GroupBookingForm />);

    // Navigate to room requirements section
    fireEvent.click(screen.getByTestId('toggle-roomRequirementsTitle'));
    await waitFor(() => {
      expect(
        screen.getByTestId('content-roomRequirementsTitle'),
      ).toBeInTheDocument();
    });

    // Submit the form
    fireEvent.click(screen.getByTestId('room-submit-btn'));

    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByTestId('submission-error')).toHaveTextContent(
        'Server error occurred',
      );
    });
  });

  test('handles network errors during form submission', async () => {
    // Mock network error
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error'),
    );

    render(<GroupBookingForm />);

    // Navigate to room requirements section
    fireEvent.click(screen.getByTestId('toggle-roomRequirementsTitle'));
    await waitFor(() => {
      expect(
        screen.getByTestId('content-roomRequirementsTitle'),
      ).toBeInTheDocument();
    });

    // Submit the form
    fireEvent.click(screen.getByTestId('room-submit-btn'));

    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByTestId('submission-error')).toHaveTextContent(
        'An unexpected error occurred',
      );
    });
  });
});
