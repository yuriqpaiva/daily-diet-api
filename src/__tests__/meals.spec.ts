import { describe, it, beforeAll, beforeEach, afterAll, expect } from 'vitest';
import { app } from '../app';
import supertest from 'supertest';
import { execSync } from 'node:child_process';

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
  });

  it('should be able to create a meal', async () => {
    await supertest(app.server)
      .post('/meals')
      .send({
        name: 'Whey protein',
        description: 'Lanche da tarde',
        is_diet: true,
      })
      .expect(201);
  });

  it('should be able to list all meals', async () => {
    const createMealTransaction = await supertest(app.server)
      .post('/meals')
      .send({
        name: 'Test meal name',
        description: 'Test meal description',
        is_diet: true,
      });

    const cookies = createMealTransaction.get('Set-Cookie');

    const getAllMealsRequest = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200);

    expect(getAllMealsRequest.body.meals[0].name).toBe('Test meal name');
    expect(getAllMealsRequest.body.meals[0].description).toBe(
      'Test meal description'
    );
    expect(getAllMealsRequest.body.meals[0].is_diet).toBe(true);
  });

  it('should be able to get a meal by id', async () => {
    const createMealRequest = await supertest(app.server).post('/meals').send({
      name: 'Test meal name',
      description: 'Test meal description',
      is_diet: true,
    });

    const cookies = createMealRequest.get('Set-Cookie');

    const getMealsRequest = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookies);

    const mealId = getMealsRequest.body.meals[0].id;

    const getMailByIdRequest = await supertest(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200);

    expect(getMailByIdRequest.body.meal.name).toBe('Test meal name');
    expect(getMailByIdRequest.body.meal.description).toBe(
      'Test meal description'
    );
    expect(getMailByIdRequest.body.meal.is_diet).toBe(true);
  });

  it('should be able to update a meal', async () => {
    const createMealRequest = await supertest(app.server).post('/meals').send({
      name: 'Test meal name',
      description: 'Test meal description',
      is_diet: true,
    });

    const cookies = createMealRequest.get('Set-Cookie');

    const getMealsRequest = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookies);

    const mealId = getMealsRequest.body.meals[0].id;

    await supertest(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Updated meal name',
        description: 'Updated meal description',
        is_diet: false,
      });

    const getMealByIdRequest = await supertest(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies);

    const { meal } = getMealByIdRequest.body;

    expect(meal.name).toBe('Updated meal name');
    expect(meal.description).toBe('Updated meal description');
    expect(meal.is_diet).toBe(false);
  });

  it('should be able to delete a meal', async () => {
    const createMealRequest = await supertest(app.server).post('/meals').send({
      name: 'Test meal name',
      description: 'Test meal description',
      is_diet: true,
    });

    const cookies = createMealRequest.get('Set-Cookie');

    const getMealsRequest = await supertest(app.server)
      .get('/meals')
      .set('Cookie', cookies);

    const mealId = getMealsRequest.body.meals[0].id;

    await supertest(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies);

    await supertest(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(404);
  });

  it('should be able to get metrics', async () => {
    const createMealRequest = await supertest(app.server).post('/meals').send({
      name: 'Test meal name',
      description: 'Test meal description',
      is_diet: true,
    });

    const cookies = createMealRequest.get('Set-Cookie');

    await supertest(app.server)
      .post('/meals')
      .send({
        name: 'Test meal name',
        description: 'Test meal description',
        is_diet: false,
      })
      .set('Cookie', cookies);

    const metrics = await supertest(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies);

    expect(metrics.body.allMealsCount).toBe(2);
    expect(metrics.body.dietMealsCount).toBe(1);
    expect(metrics.body.notDietMealsCount).toBe(1);
    expect(metrics.body.bestScore).toBe(1);
  });
});
