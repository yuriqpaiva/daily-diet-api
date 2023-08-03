import { FastifyInstance } from 'fastify';
import { knex } from '../database';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { checkSessionCookie } from '../middlewares/check-session-cookie';

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionCookie],
    },
    async (request) => {
      const sessionId = request.cookies.sessionId ?? '';

      const meals = await knex('meals')
        .where({ session_id: sessionId })
        .select();

      return { meals };
    }
  );

  app.get('/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const { sessionId } = request.cookies;

    const meal = await knex('meals')
      .where({ id, session_id: sessionId })
      .first();

    if (!meal) {
      return reply.status(404).send();
    }

    return { meal };
  });

  app.post('/', async (request, reply) => {
    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      is_diet: z.boolean(),
    });

    const { name, description, is_diet } = createMealSchema.parse(request.body);

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
      });
    }

    await knex('meals').insert({
      id: randomUUID(),
      session_id: sessionId,
      name,
      description,
      is_diet,
    });

    return reply.status(201).send();
  });

  app.put(
    '/:id',
    {
      preHandler: [checkSessionCookie],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(request.params);

      const updateMealSchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        is_diet: z.boolean().optional(),
      });

      const meal = updateMealSchema.parse(request.body);

      await knex('meals')
        .where({ id, session_id: sessionId })
        .update({
          ...meal,
        });

      return reply.status(204).send();
    }
  );

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionCookie],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(request.params);

      await knex('meals').where({ id, session_id: sessionId }).delete();

      return reply.status(204).send();
    }
  );

  app.get('/metrics', async (request, reply) => {
    const { sessionId } = request.cookies;

    const allMealsCount = await knex('meals')
      .where({ session_id: sessionId })
      .select()
      .count();

    const dietMealsCount = await knex('meals')
      .where({ is_diet: true, session_id: sessionId })
      .select()
      .count();

    const notDietMealsCount = await knex('meals')
      .where({ is_diet: false, session_id: sessionId })
      .count();

    const mealsOrderedByCreatedAt = await knex('meals')
      .where({
        session_id: sessionId,
      })
      .orderBy('created_at', 'asc');

    const { bestScore } = mealsOrderedByCreatedAt.reduce(
      (acc, meal) => {
        if (meal.is_diet) {
          acc.currentScore += 1;
          if (acc.currentScore > acc.bestScore) {
            acc.bestScore = acc.currentScore;
          }
        } else {
          acc.currentScore = 0;
        }

        return acc;
      },
      {
        bestScore: 0,
        currentScore: 0,
      }
    );

    return {
      allMealsCount: Number(allMealsCount[0]['count(*)']),
      dietMealsCount: Number(dietMealsCount[0]['count(*)']),
      notDietMealsCount: Number(notDietMealsCount[0]['count(*)']),
      bestScore,
    };
  });
}
