import { z } from 'zod';

/**
 * Validates query parameters for listing commentary entries.
 * Coerces string values into integers and bounds the result size.
 */
export const listCommentaryQuerySchema = z.object({
  limit: z
    .preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().int().positive().max(100))
    .optional(),
});

/**
 * Validates payload structures for creating a new commentary entry.
 */
export const createCommentarySchema = z.object({
  minutes: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().int().nonnegative()).optional(),
  sequence: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().int().nonnegative()).optional(),
  period: z.string().trim().min(1).optional(),
  eventType: z.string().trim().min(1).optional(),
  actor: z.string().trim().min(1).optional(),
  team: z.string().trim().min(1).optional(),
  message: z.string().trim().min(1, { message: 'Message field cannot be empty' }),
  metadata: z.record(z.unknown()).optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
});
