import { Router } from 'express';
import { db } from '../db/db.js';
import { commentary } from '../db/schema.js';
import { createCommentarySchema, listCommentaryQuerySchema } from '../validation/commentary.js';
import { matchIdParamSchema } from '../validation/matches.js';
import { desc, eq } from 'drizzle-orm';

export const commentaryRouter = Router({ mergeParams: true });

commentaryRouter.get('/', async (req, res) => {
    const paramsResult = matchIdParamSchema.safeParse(req.params);

    if (!paramsResult.success) {
        return res.status(400).json({
            error: 'Invalid match id.',
            details: JSON.stringify(paramsResult.error),
        });
    }

    const queryResult = listCommentaryQuerySchema.safeParse(req.query);

    if (!queryResult.success) {
        return res.status(400).json({
            error: 'Invalid query parameters.',
            details: JSON.stringify(queryResult.error),
        });
    }

    const MAX_LIMIT = 100;
    const limit = Math.min(queryResult.data.limit ?? 10, MAX_LIMIT);

    try {
        const data = await db
            .select()
            .from(commentary)
            .where(eq(commentary.matchId, paramsResult.data.id))
            .orderBy(desc(commentary.createdAt))
            .limit(limit);

        res.status(200).json({ data });
    } catch (error) {
        console.error('Failed to fetch commentary.', error);
        res.status(500).json({ error: 'Failed to fetch commentary.' });
    }
});

commentaryRouter.post('/', async (req, res) => {
    const paramsResult = matchIdParamSchema.safeParse(req.params);

    if (!paramsResult.success) {
        return res.status(400).json({
            error: 'Invalid match id.',
            details: JSON.stringify(paramsResult.error),
        });
    }

    const bodyResult = createCommentarySchema.safeParse(req.body);

    if (!bodyResult.success) {
        return res.status(400).json({
            error: 'Invalid payload.',
            details: JSON.stringify(bodyResult.error),
        });
    }

    try {
        const [entry] = await db
            .insert(commentary)
            .values({
                matchId: paramsResult.data.id,
                minute: bodyResult.data.minutes ?? 0,
                sequence: bodyResult.data.sequence ?? 0,
                period: bodyResult.data.period ?? '',
                eventType: bodyResult.data.eventType ?? '',
                actor: bodyResult.data.actor ?? null,
                team: bodyResult.data.team ?? null,
                message: bodyResult.data.message,
                metadata: bodyResult.data.metadata ?? null,
                tags: bodyResult.data.tags ?? null,
            })
            .returning();

            if(res.app.locals.broadcastCommentary){
                res.app.locals.broadcastCommentary(entry.matchId, entry)
            }


            res.status(201).json({ data: entry });
    } catch (error) {
        console.error('Failed to create commentary.', error);
        res.status(500).json({ error: 'Failed to create commentary.' });
    }
});