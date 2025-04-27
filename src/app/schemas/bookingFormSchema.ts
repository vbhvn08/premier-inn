import { z } from 'zod';

// Contact Details Schema
export const contactDetailsSchema = z.object({
  title: z.string().min(1, { message: 'Please select a title' }),
  firstName: z
    .string()
    .nonempty({ message: 'First name is required' })
    .min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z
    .string()
    .nonempty({ message: 'Last name is required' })
    .min(2, { message: 'Last name must be at least 2 characters' }),
  phone: z
    .string()
    .nonempty({ message: 'Phone number is required' })
    .regex(/^\d+$/, { message: 'Phone number must contain only digits' }),
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
});

// Booking Details Schema
export const bookingDetailsSchema = z
  .object({
    bookerType: z.enum(
      [
        'personal',
        'business',
        'travelManagementCompany',
        'travelAgentTourOperator',
      ],
      {
        required_error: 'Please select a type of booker before proceeding.',
      },
    ),
    stayingFor: z.enum(['business', 'leisure'], {
      required_error: 'Please select the nature of your stay.',
    }),
    isSchoolOrYouthGroup: z.boolean().optional(),
    reasonForVisit: z
      .string()
      .min(1, { message: 'Please select a reason before proceeding.' }),
    hotel: z.string().min(1, {
      message: 'Please select the hotel you would like to make a booking.',
    }),
    checkIn: z.string().min(1, {
      message: 'Please select the dates you would like to make a booking.',
    }),
    checkOut: z.string().min(1, {
      message: 'Please select the dates you would like to make a booking.',
    }),
  })
  .refine(
    (data) => {
      if (!data.checkIn || !data.checkOut) return true;
      return new Date(data.checkOut) > new Date(data.checkIn);
    },
    {
      message: 'Check-out date must be after check-in date',
      path: ['checkOut'],
    },
  );

// Room Requirements Schema
export const roomRequirementsSchema = z
  .object({
    singleOccupancyRooms: z.number().int().min(0).default(0),
    doubleOccupancyRooms: z.number().int().min(0).default(0),
    twinRooms: z.number().int().min(0).default(0),
    hasChildrenStaying: z.boolean().optional(),
    needsAccessibleRoom: z.boolean().optional(),
    additionalInformation: z.string().optional(),
  })
  .refine(
    (data) => {
      const totalRooms =
        (data.singleOccupancyRooms || 0) +
        (data.doubleOccupancyRooms || 0) +
        (data.twinRooms || 0);
      return totalRooms > 0;
    },
    {
      message: 'Please select at least one room',
      path: ['singleOccupancyRooms'],
    },
  );

// Complete Form Schema
export const bookingFormSchema = z.object({
  contactDetails: contactDetailsSchema,
  bookingDetails: bookingDetailsSchema,
  roomRequirements: roomRequirementsSchema,
});

export type ContactDetails = z.infer<typeof contactDetailsSchema>;
export type BookingDetails = z.infer<typeof bookingDetailsSchema>;
export type RoomRequirements = z.infer<typeof roomRequirementsSchema>;
export type BookingForm = z.infer<typeof bookingFormSchema>;
