import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomingLists } from './rooming-lists.entity';
import { Bookings } from './bookings.entity';

@Entity()
export class RoomingListBookings {
  @PrimaryGeneratedColumn()
  roomingListBookingId: number;

  @ManyToOne(
    () => RoomingLists,
    (roomingList) => roomingList.roomingListBookings,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'roomingListId' })
  roomingList: RoomingLists;

  @ManyToOne(() => Bookings, (booking) => booking.roomingListBookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bookingId' })
  booking: Bookings;

  @Column({ type: 'int' })
  roomingListId: number;

  @Column({ type: 'int' })
  bookingId: number;
}
