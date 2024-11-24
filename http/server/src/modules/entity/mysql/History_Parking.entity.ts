import { Column, Entity, Generated, ManyToOne, PrimaryColumn } from 'typeorm';
import { ParkingEntity } from './Parking.entity';

@Entity()
export class HistoryParkingEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  history_parking_id: string;

  @Column({
    type: 'boolean',
    nullable: false,
    unique: false,
    default: () => false,
  })
  full: boolean;

  @Column({
    type: 'timestamp',
    nullable: false,
    unique: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

  @ManyToOne(
    () => ParkingEntity,
    (history_parking) => history_parking.history_parking,
    // {
    //   onDelete: 'CASCADE',
    // },
  )
  parking: ParkingEntity;
}
