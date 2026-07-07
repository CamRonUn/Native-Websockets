import { z } from 'zod';

// ============================================================================
// 1. CONSTANTS & ENUMS
// ============================================================================

/**
 * Single source of truth for match progression states.
 * Aligns natively with the database enum layer.
 */
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

// Helper array for Zod enum validation if needed elsewhere
const MATCH_STATUS_VALUES = Object.values(MATCH_STATUS);

// ============================================================================
// 2. SCHEMAS
// ============================================================================

/**
 * Validates query parameters for paginated or filtered match listings.
 * Coerces string parameters from URLs into valid integers.
 */
export const listMatchesQuerySchema = z.object({
  limit: z
    .preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().int().positive().max(100))
    .optional(),
});

/**
 * Validates request parameters containing a core record identifier.
 */
export const matchIdParamSchema = z.object({
  id: z.preprocess((val) => Number(val), z.number().int().positive()),
});

/**
 * Validates payload structures meant for creating a new match fixture.
 * Guarantees text integrity, handles data type coercion, and runs timeline checks.
 */
export const createMatchSchema = z
  .object({
    sport: z.string().trim().min(1, { message: "Sport field cannot be empty" }),
    homeTeam: z.string().trim().min(1, { message: "Home team field cannot be empty" }),
    awayTeam: z.string().trim().min(1, { message: "Away team field cannot be empty" }),
    startTime: z.string().datetime({ message: "Invalid ISO 8601 date string for startTime" }),
    endTime: z.string().datetime({ message: "Invalid ISO 8601 date string for endTime" }).optional(),
    homeScore: z.preprocess((val) => (val === undefined ? 0 : Number(val)), z.number().int().nonnegative()).optional(),
    awayScore: z.preprocess((val) => (val === undefined ? 0 : Number(val)), z.number().int().nonnegative()).optional(),
  })
  // Chronological verification across matching timeline elements
  .superRefine((data, ctx) => {
    if (!data.endTime) return;

    const start = new Date(data.startTime).getTime();
    const end = new Date(data.endTime).getTime();

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The match endTime must be chronologically after the startTime",
        path: ["endTime"],
      });
    }
  });

/**
 * Validates telemetry updates when pushing live score corrections.
 */
export const updateScoreSchema = z.object({
  homeScore: z.preprocess((val) => Number(val), z.number().int().nonnegative()),
  awayScore: z.preprocess((val) => Number(val), z.number().int().nonnegative()),
});