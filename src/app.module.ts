import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationModule } from './reservation/reservation.module';
import { RoomingLists } from './reservation/entities/rooming-lists.entity';
import { Bookings } from './reservation/entities/bookings.entity';
import { RoomingListBookings } from './reservation/entities/rooming-list-bookings.entity';
import { SeedModule } from './seeds/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [RoomingLists, Bookings, RoomingListBookings],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    ReservationModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
