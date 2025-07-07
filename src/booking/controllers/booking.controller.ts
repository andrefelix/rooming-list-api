import { Controller, Get } from '@nestjs/common';
import { BookingService } from '../services/booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('rooming-lists')
  getAllRoomingListsWithBookings() {
    return this.bookingService.getAllRoomingListsWithBookings();
  }
}
