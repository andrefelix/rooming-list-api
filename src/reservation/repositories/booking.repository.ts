import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookings } from '../entities/bookings.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookingsRepository {
  constructor(
    @InjectRepository(Bookings)
    private readonly repo: Repository<Bookings>,
  ) {}

  async findOneById(id: number): Promise<Bookings | null> {
    return this.repo.findOne({ where: { bookingId: id } });
  }

  async create(data: Partial<Bookings>): Promise<Bookings> {
    const entity = this.repo.create(data);

    return this.repo.save(entity);
  }
}
