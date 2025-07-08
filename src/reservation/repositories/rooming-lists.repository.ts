import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomingLists } from '../entities/rooming-lists.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class RoomingListsRepository {
  constructor(
    @InjectRepository(RoomingLists)
    private readonly repo: Repository<RoomingLists>,
  ) {}

  async findaAllBookingsByRoomingListId({
    roomingListId,
  }: {
    roomingListId: number;
  }): Promise<null | RoomingLists> {
    return this.repo.findOne({
      where: { roomingListId },
      select: { roomingListId: true },
      relations: {
        roomingListBookings: {
          booking: true,
        },
      },
    });
  }

  async findAllWithBookingsCountOnly(filters: {
    rfpName?: string;
    agreement_type?: string;
  }): Promise<RoomingLists[]> {
    const query = this.repo
      .createQueryBuilder('roomingList')
      .loadRelationCountAndMap(
        'roomingList.bookingsCount',
        'roomingList.roomingListBookings',
      );

    if (filters.rfpName) {
      query.andWhere('roomingList.rfpName ILIKE :rfpName', {
        rfpName: `%${filters.rfpName}%`,
      });
    }

    if (filters.agreement_type) {
      query.andWhere('roomingList.agreement_type = :agreement_type', {
        agreement_type: filters.agreement_type,
      });
    }

    return query.getMany();
  }

  async findAllWithBookings(filters: {
    rfpName?: string;
    agreement_type?: string;
  }): Promise<RoomingLists[]> {
    return this.repo.find({
      where: {
        ...(filters.rfpName ? { rfpName: ILike(`%${filters.rfpName}%`) } : {}),
        ...(filters.agreement_type
          ? { agreement_type: filters.agreement_type }
          : {}),
      },
      relations: {
        roomingListBookings: {
          booking: true,
        },
      },
    });
  }

  async findOneById(id: number): Promise<RoomingLists | null> {
    return this.repo.findOne({ where: { roomingListId: id } });
  }

  async create(data: Partial<RoomingLists>): Promise<RoomingLists> {
    const entity = this.repo.create(data);

    return this.repo.save(entity);
  }
}
