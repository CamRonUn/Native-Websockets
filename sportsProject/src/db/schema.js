import { 
  pgTable, 
  serial, 
  text, 
  integer, 
  timestamp, 
  jsonb, 
  pgEnum 
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// 1. ENUMS
// ============================================================================

/**
 * Defines the progression states of a live sporting fixture.
 */
export const matchStatusEnum = pgEnum('match_status', ['scheduled', 'live', 'finished']);

// ============================================================================
// 2. TABLES
// ============================================================================

/**
 * Matches Table
 * Core entity containing state and live telemetry scores.
 */
export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  sport: text('sport').notNull(),
  homeTeam: text('home_team').notNull(),
  awayTeam: text('away_team').notNull(),
  status: matchStatusEnum('status').default('scheduled').notNull(),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }),
  homeScore: integer('home_score').default(0).notNull(),
  awayScore: integer('away_score').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Commentary Table
 * Time-series-like entries capturing granular event ticks for real-time streaming.
 */
export const commentary = pgTable('commentary', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id')
    .notNull()
    .references(() => matches.id, { onDelete: 'cascade' }),
  minute: integer('minute').notNull(),
  sequence: integer('sequence').notNull(), // Used alongside minute to resolve ordering race conditions
  period: text('period').notNull(),        // e.g., 'H1', 'Q3', 'OT'
  eventType: text('event_type').notNull(),  // e.g., 'goal', 'foul', 'substitution'
  actor: text('actor'),                    // Player name or referee involved
  team: text('team'),                      // Team associated with the action
  message: text('message').notNull(),      // Human-readable commentary text
  metadata: jsonb('metadata'),             // Flexible storage for sport-specific stats (e.g., xG, coordinates)
  tags: text('tags').array(),              // Array indexing for indexing/filtering feeds (e.g., ['key-event', 'card'])
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================================
// 3. RELATIONS (Application Layer Shortcuts)
// ============================================================================

export const matchesRelations = relations(matches, ({ many }) => ({
  commentaries: many(commentary),
}));

export const commentaryRelations = relations(commentary, ({ one }) => ({
  match: one(matches, {
    fields: [commentary.matchId],
    references: [matches.id],
  }),
}));