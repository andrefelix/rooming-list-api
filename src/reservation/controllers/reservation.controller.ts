import { Controller, Get, Query } from '@nestjs/common';
import { ReservationService } from '../services/reservation.service';
import { RoomingListsQueryDTO } from '../dto/rooming-lists-query.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('rooming-lists')
  getAllRoomingLists(@Query() query: RoomingListsQueryDTO) {
    return this.reservationService.getAllRoomingLists(query);
  }

  @Get('rooming-list-bookings')
  getAllRoomingListsWithBookings(@Query() query: RoomingListsQueryDTO) {
    return this.reservationService.getAllRoomingListsWithBookings(query);
  }
}
