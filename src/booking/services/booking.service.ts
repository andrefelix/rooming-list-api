import { Injectable } from '@nestjs/common';
import { RoomingListsRepository } from '../repositories/rooming-lists.repository';

@Injectable()
export class BookingService {
  constructor(private readonly roomingListsRepo: RoomingListsRepository) {}

  async getAllRoomingListsWithBookings() {
    return await this.roomingListsRepo.findAllWithBookings();
  }
}
