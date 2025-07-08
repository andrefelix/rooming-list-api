import { Module } from '@nestjs/common';
import { ReservationService } from './services/reservation.service';
import { ReservationController } from './controllers/reservation.controller';
import { RoomingListsRepository } from './repositories/rooming-lists.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomingLists } from './entities/rooming-lists.entity';
import { Bookings } from './entities/bookings.entity';
import { RoomingListBookings } from './entities/rooming-list-bookings.entity';
import { BookingsRepository } from './repositories/booking.repository';
import { RoomingListBookingsRepository } from './repositories/rooming-list-bookings.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomingLists, Bookings, RoomingListBookings]),
  ],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    RoomingListsRepository,
    BookingsRepository,
    RoomingListBookingsRepository,
  ],
})
export class ReservationModule {}
