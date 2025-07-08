import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { RoomingListsRepository } from '../repositories/rooming-lists.repository';
import { RoomingListsQueryDTO } from '../dto/rooming-lists-query.dto';
import { BadRequestException } from '@nestjs/common';

describe('ReservationService', () => {
  let service: ReservationService;
  let roomingListsRepo: jest.Mocked<RoomingListsRepository>;

  beforeEach(async () => {
    const mockRoomingListsRepo = {
      findaAllBookingsByRoomingListId: jest.fn(),
      findAllWithBookingsCountOnly: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: RoomingListsRepository,
          useValue: mockRoomingListsRepo,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    roomingListsRepo = module.get(RoomingListsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRoomingListBookings', () => {
    it('should throw BadRequestException when roomingListId is invalid', async () => {
      const spy = jest.spyOn(service, 'getRoomingListBookings');
      spy.mockRejectedValue(new BadRequestException());

      const invalidRoomingListId = 'invalid';

      await expect(() =>
        service.getRoomingListBookings({
          roomingListId: invalidRoomingListId,
        }),
      ).rejects.toThrow(BadRequestException);
      expect(spy).toHaveBeenCalled();
    });

    it('should throw BadRequestException when roomingList is not found', async () => {
      const spy = jest.spyOn(service, 'getRoomingListBookings');
      spy.mockRejectedValue(new BadRequestException());

      const roomingListIdThatDontMatch = '11';

      await expect(() =>
        service.getRoomingListBookings({
          roomingListId: roomingListIdThatDontMatch,
        }),
      ).rejects.toThrow(BadRequestException);
      expect(spy).toHaveBeenCalled();
    });

    it('should return a empty bookings array when roomingList has no bookings', async () => {
      const spy = jest.spyOn(
        roomingListsRepo,
        'findaAllBookingsByRoomingListId',
      );

      spy.mockResolvedValue({
        roomingListId: 1,
        roomingListBookings: [],
      } as any);

      const result = await service.getRoomingListBookings({
        roomingListId: '1',
      });

      expect(result.roomingListId).toBe(1);
      expect(result.bookings).toEqual([]);
      expect(spy).toHaveBeenCalled();
    });

    it('should return a bookings array when roomingList has bookings', async () => {
      const spy = jest.spyOn(
        roomingListsRepo,
        'findaAllBookingsByRoomingListId',
      );

      spy.mockResolvedValue({
        roomingListId: 2,
        roomingListBookings: [
          {
            roomingListBookingId: 43,
            roomingList: undefined,
            booking: {
              bookingId: 5,
              eventId: 1,
              hotelId: 101,
              guestName: 'David Brown',
              guestPhoneNumber: '5678901234',
              checkInDate: '2025-09-06',
              checkOutDate: '2025-09-11',
              roomingListBookings: undefined,
            },
            roomingListId: 2,
            bookingId: 5,
          },
          {
            roomingListBookingId: 42,
            roomingList: undefined,
            booking: {
              bookingId: 4,
              eventId: 1,
              hotelId: 101,
              guestName: 'Sarah Lee',
              guestPhoneNumber: '4567890123',
              checkInDate: '2025-09-05',
              checkOutDate: '2025-09-10',
              roomingListBookings: undefined,
            },
            roomingListId: 2,
            bookingId: 4,
          },
        ],
      } as any);

      const result = await service.getRoomingListBookings({
        roomingListId: '2',
      });

      expect(result.roomingListId).toBe(2);
      expect(result.bookings).toHaveLength(2);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getAllRoomingLists', () => {
    it('should return an empty array when no rooming lists are found', async () => {
      const spy = jest.spyOn(roomingListsRepo, 'findAllWithBookingsCountOnly');
      spy.mockResolvedValue([]);

      const result = await service.getAllRoomingLists({});

      expect(result).toEqual([]);
      expect(spy).toHaveBeenCalled();
    });

    it('should return an empty array if no rooming lists match filters', async () => {
      const filters: RoomingListsQueryDTO = {
        rfpName: 'nonexistent',
        agreement_type: 'staff',
      };

      const spy = jest.spyOn(roomingListsRepo, 'findAllWithBookingsCountOnly');
      spy.mockResolvedValue([]);

      const result = await service.getAllRoomingLists(filters);

      expect(result).toEqual([]);
      expect(spy).toHaveBeenCalledWith(filters);
    });

    it('should return rooming lists with their bookings count', async () => {
      const spy = jest.spyOn(roomingListsRepo, 'findAllWithBookingsCountOnly');
      spy.mockResolvedValue([
        {
          roomingListId: 5,
          eventId: 2,
          eventName: 'Ultra Miami',
          hotelId: 101,
          rfpName: 'RLM-2025',
          cutOffDate: '2025-10-15',
          status: 'completed',
          agreement_type: 'staff',
          bookingsCount: 2,
        },
        {
          roomingListId: 8,
          eventId: 2,
          eventName: 'Ultra Miami',
          hotelId: 101,
          rfpName: 'RLM-2026',
          cutOffDate: '2026-10-25',
          status: 'received',
          agreement_type: 'staff',
          bookingsCount: 3,
        },
      ] as any[]);

      const filters: RoomingListsQueryDTO = {
        rfpName: 'RLM',
        agreement_type: 'staff',
      };

      const result = await service.getAllRoomingLists(filters);

      expect(spy).toHaveBeenCalledWith(filters);
      expect(result.length).toBe(2);
      expect(result[0].roomingListId).toBe(5);
      expect(result[0].bookingsCount).toBe(2);
      expect(result[1].roomingListId).toBe(8);
      expect(result[1].bookingsCount).toBe(3);
      expect(
        result.every(
          (roomingList) =>
            roomingList.rfpName.includes(filters.rfpName || '') &&
            roomingList.agreement_type === filters.agreement_type,
        ),
      ).toBeTruthy();
    });
  });
});
