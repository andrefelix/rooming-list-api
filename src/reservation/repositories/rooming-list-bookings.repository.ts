import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomingListBookings } from '../entities/rooming-list-bookings.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomingListBookingsRepository {
  constructor(
    @InjectRepository(RoomingListBookings)
    private readonly repo: Repository<RoomingListBookings>,
  ) {}

  async exists(roomingListId: number, bookingId: number): Promise<boolean> {
    const found = await this.repo.findOne({
      where: { roomingListId, bookingId },
    });

    return !!found;
  }

  async create(
    data: Partial<RoomingListBookings>,
  ): Promise<RoomingListBookings> {
    const entity = this.repo.create(data);

    return this.repo.save(entity);
  }
}
