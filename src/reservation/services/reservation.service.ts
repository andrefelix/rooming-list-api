import { Injectable } from '@nestjs/common';
import { RoomingListsRepository } from '../repositories/rooming-lists.repository';
import { RoomingListsQueryDTO } from '../dto/rooming-lists-query.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly roomingListsRepo: RoomingListsRepository) {}

  async getAllRoomingListsWithBookings(filters: RoomingListsQueryDTO) {
    return await this.roomingListsRepo.findAllWithBookings(filters);
  }
}
