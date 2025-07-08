import { BadRequestException, Injectable } from '@nestjs/common';
import { RoomingListsRepository } from '../repositories/rooming-lists.repository';
import { RoomingListsQueryDTO } from '../dto/rooming-lists-query.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly roomingListsRepo: RoomingListsRepository) {}

  async getRoomingListBookings({ roomingListId }: { roomingListId: string }) {
    if (!roomingListId || isNaN(Number(roomingListId))) {
      throw new BadRequestException(
        'roomingListId is required and must be a number',
      );
    }

    const roomingListWithBookings =
      await this.roomingListsRepo.findaAllBookingsByRoomingListId({
        roomingListId: Number(roomingListId),
      });

    if (!roomingListWithBookings) {
      throw new BadRequestException('Rooming list not found');
    }

    return {
      roomingListId: roomingListWithBookings.roomingListId,
      bookings:
        roomingListWithBookings.roomingListBookings?.map(
          ({ booking }) => booking,
        ) || [],
    };
  }

  async getAllRoomingLists(filters: RoomingListsQueryDTO) {
    return await this.roomingListsRepo.findAllWithBookingsCountOnly(filters);
  }
}
