import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { RoomingListBookings } from './rooming-list-bookings.entity';

@Entity()
export class Bookings {
  @PrimaryColumn()
  bookingId: number;

  @Column({ type: 'int' })
  eventId: number;

  @Column({ type: 'int' })
  hotelId: number;

  @Column({ type: 'varchar' })
  guestName: string;

  @Column({ type: 'varchar' })
  guestPhoneNumber: string;

  @Column({ type: 'date' })
  checkInDate: string;

  @Column({ type: 'date' })
  checkOutDate: string;

  @OneToMany(() => RoomingListBookings, (rlb) => rlb.booking)
  roomingListBookings: RoomingListBookings[];
}
