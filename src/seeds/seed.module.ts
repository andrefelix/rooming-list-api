import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { RoomingListBookings } from 'src/reservation/entities/rooming-list-bookings.entity';
import { RoomingLists } from 'src/reservation/entities/rooming-lists.entity';
import { Bookings } from 'src/reservation/entities/bookings.entity';
import { RoomingListsRepository } from 'src/reservation/repositories/rooming-lists.repository';
import { BookingsRepository } from 'src/reservation/repositories/booking.repository';
import { RoomingListBookingsRepository } from 'src/reservation/repositories/rooming-list-bookings.repository';

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
