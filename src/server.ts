import fastify from 'fastify';
import { mealsRoutes } from './routes/meals';
import fastifyCookie from '@fastify/cookie';

const app = fastify();
app.register(fastifyCookie);
app.register(mealsRoutes, { prefix: '/meals' });

try {
  await app.listen({ port: 3333 });
  console.log('Server listening on port 3333');
} catch (err) {
  app.log.error(err);
}
