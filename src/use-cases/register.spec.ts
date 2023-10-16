import {describe, it, expect, beforeEach} from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;
describe('Register UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });
  it('Should hash user password upon registration', async () => {
    const data = {name : 'Daniel', email: 'daniel@testeEmail.com', password: '123456'};
    const {user} = await sut.execute(data);
    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);
    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('Should not be able to register with same email twice', async() => {
    const data = {name : 'Daniel', email: 'daniel@testeEmail.com', password: '123456'};
    await sut.execute(data);
    await expect(() =>sut.execute(data)).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
