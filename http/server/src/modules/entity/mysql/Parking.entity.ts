import { Column, Entity, Generated, OneToMany, PrimaryColumn } from 'typeorm';
import { HistoryParkingEntity } from './History_Parking.entity';

@Entity()
export class ParkingEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  parking_id: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    default: '',
    unique: true,
    charset: 'utf8',
  })
  parking_name: string;

  @Column({
    type: 'boolean',
    nullable: false,
    unique: false,
    default: () => false,
  })
  full: boolean;

  @OneToMany(
    () => HistoryParkingEntity,
    (parking) => parking.parking,
    {
      onDelete: 'CASCADE',
    },
  )
  history_parking: HistoryParkingEntity[];
}
