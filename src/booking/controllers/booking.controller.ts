import { Controller, Get, Query } from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { RoomingListsQueryDTO } from '../dto/rooming-lists-query.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('rooming-lists')
  getAllRoomingListsWithBookings(@Query() query: RoomingListsQueryDTO) {
    return this.bookingService.getAllRoomingListsWithBookings(query);
  }
}
