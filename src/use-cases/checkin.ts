import { CheckIn } from '@prisma/client';
import { ICheckInsRepository } from '@/repositories/checkin-repository';

type CheckInUseCaseRequest = {
  userId: string
  gymId: string

}

type CheckInUseCaseResponse = {
  checkIn: CheckIn
}
export class CheckInUseCase {
  constructor(private checkInsRepository: ICheckInsRepository){}

  async execute({userId, gymId}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse>{
    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());
    if(checkInOnSameDate) throw new Error();
    const checkIn = await this.checkInsRepository.create({gym_id: gymId, user_id: userId});
    return {checkIn};
  }
}