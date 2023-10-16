import {FastifyInstance} from 'fastify';
import { register } from './Controller/register';
import { prisma } from '@/lib/prisma';
import { authenticate } from './Controller/authenticate';


export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', authenticate);


  app.get('/users', async (request, reply) => {
    const getUsers = await prisma.user.findMany();
    return reply.status(200).send(getUsers);
  });
} 


