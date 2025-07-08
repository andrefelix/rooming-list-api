import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Bookings } from 'src/reservation/entities/bookings.entity';
import { RoomingListBookings } from 'src/reservation/entities/rooming-list-bookings.entity';
import { RoomingLists } from 'src/reservation/entities/rooming-lists.entity';
import { BookingsRepository } from 'src/reservation/repositories/booking.repository';
import { RoomingListBookingsRepository } from 'src/reservation/repositories/rooming-list-bookings.repository';
import { RoomingListsRepository } from 'src/reservation/repositories/rooming-lists.repository';

@Injectable()
export class SeedService {
  private readonly logger: Logger = new Logger(SeedService.name);

  constructor(
    private readonly roomingListsRepo: RoomingListsRepository,
    private readonly bookingsRepo: BookingsRepository,
    private readonly roomingListBookingsRepo: RoomingListBookingsRepository,
  ) {}

  async run() {
    await this.seedRoomingLists();
    await this.seedBookings();
    await this.seedRoomingListBookings();

    this.logger.log('All data has been seeded.');
  }

  private async seedRoomingLists() {
    const roomingLists = this.loadJson('rooming-lists.json') as RoomingLists[];

    await Promise.all(
      roomingLists.map(async (item) => {
        const exists = await this.roomingListsRepo.findOneById(
          item.roomingListId,
        );

        if (!exists) {
          return this.roomingListsRepo.create(item);
        }
      }),
    );

    this.logger.log('RoomingLists seeded.');
  }

  private async seedBookings() {
    const bookings = this.loadJson('bookings.json') as Bookings[];

    await Promise.all(
      bookings.map(async (item) => {
        const exists = await this.bookingsRepo.findOneById(item.bookingId);

        if (!exists) {
          return this.bookingsRepo.create(item);
        }
      }),
    );

    this.logger.log('Bookings seeded.');
  }

  private async seedRoomingListBookings() {
    const roomingListBookings = this.loadJson(
      'rooming-list-bookings.json',
    ) as RoomingListBookings[];

    await Promise.all(
      roomingListBookings.map(async (item) => {
        const exists = await this.roomingListBookingsRepo.exists(
          item.roomingListId,
          item.bookingId,
        );

        if (!exists) {
          return this.roomingListBookingsRepo.create({
            roomingListId: item.roomingListId,
            bookingId: item.bookingId,
          });
        }
      }),
    );

    this.logger.log('RoomingListBookings seeded. ');
  }

  private loadJson(filename: string): any {
    const filePath = path.join(__dirname + '/json', filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    if (!fileContent) {
      return [];
    }

    return JSON.parse(fileContent);
  }
}
