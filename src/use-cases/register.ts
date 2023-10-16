import { IUserRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { User } from '@prisma/client';

type RegisterUserCaseParams = {
  name: string;
  email: string;
  password : string
}

type RegisterUserCaseResponse = {
  user: User
}

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({name, email, password}: RegisterUserCaseParams): Promise<RegisterUserCaseResponse> {
    const password_hash = await hash(password, 6);
    const verifyEmailExists = await this.userRepository.findByEmail(email);
    if(verifyEmailExists) throw new UserAlreadyExistsError();
    const user = await this.userRepository.create({name, email, password_hash});
    return {user};  
  }
} 