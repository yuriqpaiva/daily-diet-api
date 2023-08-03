import { app } from './app';

try {
  await app.listen({ port: 3333 });
  console.log('Server listening on port 3333');
} catch (err) {
  app.log.error(err);
}
