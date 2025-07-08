import { Controller, Get, Query } from '@nestjs/common';
import { ReservationService } from '../services/reservation.service';
import { RoomingListsQueryDTO } from '../dto/rooming-lists-query.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('rooming-lists')
  getAllRoomingListsWithBookings(@Query() query: RoomingListsQueryDTO) {
    return this.reservationService.getAllRoomingListsWithBookings(query);
  }
}
