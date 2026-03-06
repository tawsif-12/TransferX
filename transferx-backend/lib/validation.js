import { z } from 'zod';

/**
 * Validation schemas for API inputs
 */

// Auth schemas
// helper to reject angle brackets or common encoded entities
const noHtml = z
  .string()
  .refine((v) => !/[<>]/.test(v), {
    message: 'Value cannot contain HTML or script characters',
  })
  .refine((v) => !/&lt;|&gt;/.test(v), {
    message: 'Value cannot contain encoded HTML entities',
  });

export const signupSchema = z.object({
  email: noHtml.email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: noHtml.min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['PLAYER', 'AGENT', 'CLUB_MANAGER']).optional(),
});

export const loginSchema = z.object({
  email: noHtml.email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Player profile schema
export const playerProfileSchema = z.object({
  position: z.enum(['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD']).optional(),
  nationality: z.string().optional(),
  dateOfBirth: z.string().optional(),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  preferredFoot: z.string().optional(),
  currentClubId: z.number().int().optional(),
  marketValue: z.number().nonnegative().optional(),
  goalsScored: z.number().int().nonnegative().optional(),
  assists: z.number().int().nonnegative().optional(),
  appearances: z.number().int().nonnegative().optional(),
  rating: z.number().min(0).max(10).optional(),
  bio: z.string().optional(),
});

// User update schema
export const userUpdateSchema = z.object({
  fullName: z.string().min(2).optional(),
  playerProfile: playerProfileSchema.optional(),
});

// Transfer request schema
export const transferRequestSchema = z.object({
  clubId: z.number().int().positive('Club ID is required'),
  leagueId: z.number().int().positive().optional(),
  proposedFee: z.number().positive().optional(),
  proposedSalary: z.number().positive().optional(),
  contractLength: z.number().int().positive().optional(),
  transferWindow: z.enum(['SUMMER', 'WINTER']).optional(),
  coverLetter: z.string().optional(),
});

// Rating schema
export const ratingSchema = z.object({
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  review: z.string().optional(),
  professionalism: z.number().min(1).max(5).optional(),
  facilities: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  isAnonymous: z.boolean().optional(),
});

// Document upload schema
export const documentUploadSchema = z.object({
  documentType: z.string().min(1, 'Document type is required'),
});

// Admin schemas
export const clubCreateSchema = z.object({
  name: z.string().min(2, 'Club name is required'),
  leagueId: z.number().int().positive('League ID is required'),
  country: z.string().min(2, 'Country is required'),
  city: z.string().optional(),
  founded: z.number().int().optional(),
  stadium: z.string().optional(),
  capacity: z.number().int().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
});

export const leagueCreateSchema = z.object({
  name: z.string().min(2, 'League name is required'),
  country: z.string().min(2, 'Country is required'),
  tier: z.number().int().min(1).max(3, 'Tier must be 1, 2, or 3'),
  logoUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
});

export const transferOpportunitySchema = z.object({
  clubId: z.number().int().positive('Club ID is required'),
  position: z.enum(['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD']),
  minRating: z.number().min(0).max(10),
  maxBudget: z.number().positive('Budget must be positive'),
  description: z.string().min(10, 'Description is required'),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  endDate: z.string().optional(),
});

/**
 * Validate data against a Zod schema
 */
export function validateData(schema, data) {
  try {
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ message: 'Validation failed' }] };
  }
}
