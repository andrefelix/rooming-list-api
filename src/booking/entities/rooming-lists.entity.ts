import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { RoomingListBookings } from './rooming-list-bookings.entity';

@Entity()
export class RoomingLists {
  @PrimaryColumn()
  roomingListId: number;

  @Column({ type: 'int' })
  eventId: number;

  @Column({ type: 'varchar' })
  eventName: string;

  @Column({ type: 'int' })
  hotelId: number;

  @Column({ type: 'varchar' })
  rfpName: string;

  @Column({ type: 'date' })
  cutOffDate: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'enum', enum: ['leisure', 'staff', 'artist'] })
  agreement_type: string;

  @OneToMany(() => RoomingListBookings, (rlb) => rlb.roomingList)
  roomingListBookings: RoomingListBookings[];
}
