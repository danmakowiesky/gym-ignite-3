import {describe, it, expect} from 'vitest';
import { compare, hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsErrors } from './errors/invalid-credentials-erros';
import { beforeEach } from 'vitest';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;
describe('Authenticate UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });
  it('Should be able authenticate', async () => {
    const data = {email: 'daniel@testeEmail.com', password: '123456'};
    const registerUser = {name: 'Daniel', email: 'daniel@testeEmail.com', password_hash: await hash('123456', 6)};
    await usersRepository.create(registerUser);
    const {user} = await sut.execute(data);
    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);
    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('Should not be able authenticate with wrong email', async () => {
    const data = {email: 'daniel@testeEmail.com', password: '123456'};
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);
    expect(() => sut.execute(data)).rejects.toBeInstanceOf(InvalidCredentialsErrors);
  });

  it('Should not be able authenticate with wrong password', async () => {
    const data = {email: 'daniel@testeEmail.com', password: '123'};
    const registerUser = {name: 'Daniel', email: 'daniel@testeEmail.com', password_hash: await hash('123456', 6)};
    await usersRepository.create(registerUser);
    expect(() => sut.execute(data)).rejects.toBeInstanceOf(InvalidCredentialsErrors);
  });
});
