import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomingLists } from '../entities/rooming-lists.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomingListsRepository {
  constructor(
    @InjectRepository(RoomingLists)
    private readonly repo: Repository<RoomingLists>,
  ) {}

  async findOneById(id: number): Promise<RoomingLists | null> {
    return this.repo.findOne({ where: { roomingListId: id } });
  }

  async create(data: Partial<RoomingLists>): Promise<RoomingLists> {
    const entity = this.repo.create(data);

    return this.repo.save(entity);
  }
}
