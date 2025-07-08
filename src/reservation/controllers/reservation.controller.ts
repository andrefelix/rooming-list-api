import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReservationService } from '../services/reservation.service';
import { RoomingListsQueryDTO } from '../dto/rooming-lists-query.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('rooming-list/:id/bookings')
  getRoomingListBookings(@Param('id') roomingListId: string) {
    return this.reservationService.getRoomingListBookings({
      roomingListId,
    });
  }

  @Get('rooming-lists')
  getAllRoomingLists(@Query() query: RoomingListsQueryDTO) {
    return this.reservationService.getAllRoomingLists(query);
  }
}
