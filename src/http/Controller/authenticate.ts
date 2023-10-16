import {FastifyRequest, FastifyReply} from 'fastify';
import { z } from 'zod';
import { InvalidCredentialsErrors } from '@/use-cases/errors/invalid-credentials-erros';
import { makeAuthenticateUseCase } from '@/use-cases/factory/make-authenticate-use-case';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  });
  const {email, password} = authenticateBodySchema.parse(request.body);
  try {
    const authenticateUseCase = makeAuthenticateUseCase();
    await authenticateUseCase.execute({ email, password});
  } catch (error) {
    if(error instanceof InvalidCredentialsErrors) {
      return reply.status(400).send();
    }
    throw error;
  }
  return reply.status(200).send();
}