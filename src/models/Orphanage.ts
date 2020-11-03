import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm'
import OrphanageImages from './OrphanageImages'
import { hashSync } from 'bcryptjs'

@Entity('orphanages')
class Orphanage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
  
  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword(){
    this.password = hashSync(this.password, 8)
  }

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  about: string;

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

  @OneToMany(() => OrphanageImages, image => image.orphanage, {
    cascade: ["insert", "update", "remove"], 
  })
  @JoinColumn({ name: 'orphanage_id'})
  images: OrphanageImages[];
}

export default Orphanage