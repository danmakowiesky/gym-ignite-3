import { IUserRepository } from '@/repositories/users-repository';
import { InvalidCredentialsErrors } from './errors/invalid-credentials-erros';
import { compare } from 'bcryptjs';
import { User } from '@prisma/client';

type AuthticateUseCaseRequest = {
  email: string
  password: string
}

type AuthticateUseCaseResponse = {
  user: User
}
export class AuthenticateUseCase {
  constructor(private usersRepository: IUserRepository){}

  async execute({email, password}: AuthticateUseCaseRequest): Promise<AuthticateUseCaseResponse>{
    const user = await this.usersRepository.findByEmail(email);
    if(!user)throw new InvalidCredentialsErrors();
    const doesPasswordMatches = await compare(password, user.password_hash);
    if(!doesPasswordMatches) throw new InvalidCredentialsErrors();
    return {user};
  }
}