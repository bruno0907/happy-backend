import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, } from 'typeorm'
import OrphanageImages from './OrphanageImages'


@Entity('orphanages')
class Orphanage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;  

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  about: string;

  @Column()
  email: string;

  @Column()
  whatsapp: number;

  @Column()
  instructions: string;

  @Column()
  opening_hours: string;

  @Column()
  open_on_weekends: boolean;

  @Column()
  approved: boolean;

  @Column()
  token: string;

  @OneToMany(() => OrphanageImages, image => image.orphanage, {
    cascade: ["insert", "update", "remove"], 
  })
  @JoinColumn({ name: 'orphanage_id'})
  images: OrphanageImages[];
}

export default Orphanage