import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from '../services/booking.service';
import { RoomingListsRepository } from '../repositories/rooming-lists.repository';

describe('BookingController', () => {
  let controller: BookingController;
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: {
            getAllRoomingListsWithBookings: jest.fn(),
          },
        },
        {
          provide: RoomingListsRepository,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
    service = module.get(BookingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('rooming-lists', () => {
    it('should return an empty array when no rooming lists are found', async () => {
      const spy = jest.spyOn(service, 'getAllRoomingListsWithBookings');
      spy.mockResolvedValue([]);

      const result = await controller.getAllRoomingListsWithBookings();

      expect(result).toEqual([]);
      expect(spy).toHaveBeenCalled();
    });

    it('should return rooming lists with their bookings', async () => {
      const testedRoominglistId = 999;
      const spy = jest.spyOn(service, 'getAllRoomingListsWithBookings');
      spy.mockResolvedValue([
        {
          roomingListId: testedRoominglistId,
          eventId: 1,
          eventName: 'Rolling Loud',
          hotelId: 101,
          rfpName: 'ACL-2025',
          cutOffDate: '2025-09-30',
          status: 'completed',
          agreement_type: 'leisure',
          roomingListBookings: [
            {
              roomingListBookingId: 47,
              booking: {
                bookingId: 2,
                eventId: 1,
                hotelId: 101,
                guestName: 'Alice Smith',
                guestPhoneNumber: '2345678901',
                checkInDate: '2025-09-02',
                checkOutDate: '2025-09-06',
              },
              roomingListId: testedRoominglistId,
              bookingId: 2,
            },
            {
              roomingListBookingId: 41,
              booking: {
                bookingId: 3,
                eventId: 1,
                hotelId: 101,
                guestName: 'Bob Johnson',
                guestPhoneNumber: '3456789012',
                checkInDate: '2025-09-03',
                checkOutDate: '2025-09-07',
              },
              roomingListId: testedRoominglistId,
              bookingId: 3,
            },
          ],
        },
      ] as any[]);

      const result = await controller.getAllRoomingListsWithBookings();

      expect(result.length).toBe(1);
      expect(result[0].roomingListId).toBe(testedRoominglistId);
      expect(result[0].roomingListBookings).toHaveLength(2);
      expect(
        result[0].roomingListBookings.every(
          (rlb) => rlb.roomingListId === testedRoominglistId,
        ),
      ).toBeTruthy();
    });
  });
});
