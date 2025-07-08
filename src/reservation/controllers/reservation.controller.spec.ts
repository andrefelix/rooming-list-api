import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from '../services/reservation.service';
import { RoomingListsRepository } from '../repositories/rooming-lists.repository';
import { RoomingListsQueryDTO } from '../dto/rooming-lists-query.dto';
import { BadRequestException } from '@nestjs/common';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: {
            getRoomingListBookings: jest.fn(),
            getAllRoomingLists: jest.fn(),
            getAllRoomingListsWithBookings: jest.fn(),
          },
        },
        {
          provide: RoomingListsRepository,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get(ReservationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('rooming-list/:id/bookings', () => {
    it('should throw BadRequestException when roomingListId is invalid', async () => {
      const spy = jest.spyOn(service, 'getRoomingListBookings');
      spy.mockRejectedValue(new BadRequestException());

      const invalidRoomingListId = 'invalid';

      await expect(() =>
        controller.getRoomingListBookings(invalidRoomingListId),
      ).rejects.toThrow(BadRequestException);
      expect(spy).toHaveBeenCalled();
    });

    it('should throw BadRequestException when roomingList is not found', async () => {
      const spy = jest.spyOn(service, 'getRoomingListBookings');
      spy.mockRejectedValue(new BadRequestException());

      const roomingListIdThatDontMatch = '11';

      await expect(() =>
        controller.getRoomingListBookings(roomingListIdThatDontMatch),
      ).rejects.toThrow(BadRequestException);
      expect(spy).toHaveBeenCalled();
    });

    it('should return a empty bookings array when roomingList has no bookings', async () => {
      const spy = jest.spyOn(service, 'getRoomingListBookings');
      spy.mockResolvedValue({ roomingListId: 1, bookings: [] });

      const result = await controller.getRoomingListBookings('1');

      expect(result.roomingListId).toBe(1);
      expect(result.bookings).toEqual([]);
      expect(spy).toHaveBeenCalled();
    });

    it('should return a bookings array when roomingList has bookings', async () => {
      const spy = jest.spyOn(service, 'getRoomingListBookings');
      spy.mockResolvedValue({
        roomingListId: 2,
        bookings: [
          {
            bookingId: 5,
            eventId: 1,
            hotelId: 101,
            guestName: 'David Brown',
            guestPhoneNumber: '5678901234',
            checkInDate: '2025-09-06',
            checkOutDate: '2025-09-11',
          },
          {
            bookingId: 4,
            eventId: 1,
            hotelId: 101,
            guestName: 'Sarah Lee',
            guestPhoneNumber: '4567890123',
            checkInDate: '2025-09-05',
            checkOutDate: '2025-09-10',
          },
        ],
      });

      const result = await controller.getRoomingListBookings('2');

      expect(result.roomingListId).toBe(2);
      expect(result.bookings).toHaveLength(2);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('rooming-lists', () => {
    it('should return an empty array when no rooming lists are found', async () => {
      const spy = jest.spyOn(service, 'getAllRoomingLists');
      spy.mockResolvedValue([]);

      const result = await controller.getAllRoomingLists({});

      expect(result).toEqual([]);
      expect(spy).toHaveBeenCalled();
    });

    it('should return an empty array if no rooming lists match filters', async () => {
      const filters: RoomingListsQueryDTO = {
        rfpName: 'nonexistent',
        agreement_type: 'staff',
      };

      const spy = jest.spyOn(service, 'getAllRoomingLists');
      spy.mockResolvedValue([]);

      const result = await controller.getAllRoomingLists(filters);

      expect(result).toEqual([]);
      expect(spy).toHaveBeenCalledWith(filters);
    });

    it('should return rooming lists with their bookings count', async () => {
      const spy = jest.spyOn(service, 'getAllRoomingLists');
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

      const result = await controller.getAllRoomingLists(filters);

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

  describe('rooming-list-bookings', () => {
    it('should return an empty array when no rooming lists are found', async () => {
      const spy = jest.spyOn(service, 'getAllRoomingListsWithBookings');
      spy.mockResolvedValue([]);

      const result = await controller.getAllRoomingListsWithBookings({});

      expect(result).toEqual([]);
      expect(spy).toHaveBeenCalled();
    });

    it('should return an empty array if no rooming lists match filters', async () => {
      const filters: RoomingListsQueryDTO = {
        rfpName: 'nonexistent',
        agreement_type: 'staff',
      };

      const spy = jest.spyOn(service, 'getAllRoomingListsWithBookings');
      spy.mockResolvedValue([]);

      const result = await controller.getAllRoomingListsWithBookings(filters);

      expect(result).toEqual([]);
      expect(spy).toHaveBeenCalledWith(filters);
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

      const filters: RoomingListsQueryDTO = {
        rfpName: 'ACL',
        agreement_type: 'staff',
      };

      const result = await controller.getAllRoomingListsWithBookings(filters);

      expect(result.length).toBe(1);
      expect(result[0].roomingListId).toBe(testedRoominglistId);
      expect(result[0].roomingListBookings).toHaveLength(2);
      expect(
        result[0].roomingListBookings?.every(
          (rlb) => rlb.roomingListId === testedRoominglistId,
        ),
      ).toBeTruthy();
    });
  });
});
