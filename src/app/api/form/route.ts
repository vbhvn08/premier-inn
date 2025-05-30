import { NextResponse } from 'next/server';
import { bookingFormSchema } from '@/app/schemas/bookingFormSchema';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate using Zod schema
    try {
      bookingFormSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        // Convert Zod validation errors to a more user-friendly format
        const formattedErrors: Record<string, string> = {};

        error.errors.forEach((err) => {
          const path = err.path.join('.');
          formattedErrors[path] = err.message;
        });

        return NextResponse.json(
          {
            success: false,
            errors: formattedErrors,
          },
          { status: 400 },
        );
      }

      throw error; // Re-throw if it's not a ZodError
    }

    // Server-side validation for group booking requirements
    const errors: Record<string, string> = {};

    if (body.bookingDetails?.checkIn && body.bookingDetails?.checkOut) {
      const checkIn = new Date(body.bookingDetails.checkIn);
      const checkOut = new Date(body.bookingDetails.checkOut);
      if (checkIn >= checkOut) {
        errors.dateRange = 'Check-out date must be after check-in date.';
      }
    }

    // Group booking validation: Calculate total number of rooms
    if (body.roomRequirements) {
      const {
        singleOccupancyRooms = 0,
        doubleOccupancyRooms = 0,
        twinRooms = 0,
      } = body.roomRequirements;
      const totalRooms =
        singleOccupancyRooms + doubleOccupancyRooms + twinRooms;

      // Standard group bookings require at least 10 rooms
      if (totalRooms < 10) {
        // Invalid group booking, add error
        errors['roomRequirements'] =
          'Group bookings require a minimum of 10 rooms. Please add more rooms to continue.';
      }
    }

    if (Object.keys(errors).length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate server-side delay
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Generate a reference number
    const referenceNumber =
      'CAS-' + Math.floor(100000 + Math.random() * 900000);

    // Extract required information from form data
    const { email, firstName, lastName } = body.contactDetails || {};

    // Build URL parameters for the success page
    const params = new URLSearchParams();
    params.append('ref', referenceNumber);
    if (email) params.append('email', email);
    if (firstName) params.append('firstName', firstName);
    if (lastName) params.append('lastName', lastName);

    // Save the booking data to database or external service here
    // [Database saving logic would go here]

    // return success with redirect URL
    return NextResponse.json({
      success: true,
      message: 'Booking submitted successfully.',
      redirectUrl: `/success?${params.toString()}`,
    });
  } catch (error) {
    console.error('Error processing booking form:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 },
    );
  }
}
