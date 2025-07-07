import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { RoomingListBookings } from 'src/booking/entities/rooming-list-bookings.entity';
import { RoomingLists } from 'src/booking/entities/rooming-lists.entity';
import { Bookings } from 'src/booking/entities/bookings.entity';
import { RoomingListsRepository } from 'src/booking/repositories/rooming-lists.repository';
import { BookingsRepository } from 'src/booking/repositories/booking.repository';
import { RoomingListBookingsRepository } from 'src/booking/repositories/rooming-list-bookings.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomingListBookings, RoomingLists, Bookings]),
  ],
  providers: [
    SeedService,
    RoomingListsRepository,
    BookingsRepository,
    RoomingListBookingsRepository,
  ],
})
export class SeedModule {}
