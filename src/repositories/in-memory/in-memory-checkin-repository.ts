/* eslint-disable @typescript-eslint/no-unused-vars */
import { ICheckInsRepository } from '@/repositories/checkin-repository';
import { Prisma, CheckIn } from '@prisma/client';
import { randomUUID } from 'node:crypto';

export class InMemoryCheckInsRepository implements ICheckInsRepository {
 
  public items: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      createdAt: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }

  findByUserIdOnDate(userId: string, date: Date) {
    const checkInOnSameDate = this.items.find(checkIn => checkIn.user_id === userId);
    if(!checkInOnSameDate) return null;

    return checkInOnSameDate;
  }
}