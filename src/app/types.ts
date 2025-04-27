import {
  ContactDetails,
  BookingDetails,
  RoomRequirements,
} from './schemas/bookingFormSchema';

// Define form section keys
export type FormSectionKey =
  | 'contactDetails'
  | 'bookingDetails'
  | 'roomRequirements';

// Contact Details Types

export interface ContactDetailsFormProps {
  data: ContactDetails;
  onChange: (data: ContactDetails) => void;
  errors?: string[];
  onContinue?: () => void; // Added for section navigation
}

// Booking Details Types

export interface BookingDetailsFormProps {
  data: BookingDetails;
  onChange: (data: BookingDetails) => void;
  errors?: string[];
  onContinue?: () => void; // Added for section navigation
}

// Room Requirements Types

export interface RoomRequirementsFormProps {
  data: RoomRequirements;
  onChange: (data: RoomRequirements) => void;
  errors?: string[];
  onSubmit?: () => void; // Added for section navigation
  onBack?: () => void; // Added for section navigation
  isSubmitting?: boolean; // Indicates if this is the final form with submit button
  submissionError?: string; // Error message for submission
}

// Form Data Types
export interface FormData {
  contactDetails: ContactDetails;
  bookingDetails: BookingDetails;
  roomRequirements: RoomRequirements;
}

// Collapsible Section Types
export interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

// Hotel
export interface Hotel {
  code: string;
  title: string;
  brand: string;
}
