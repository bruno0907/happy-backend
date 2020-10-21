import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm'
import OrphanageImages from './OrphanageImages'
import { hashSync } from 'bcryptjs'

@Entity('admin')
class Admin {
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
}

export default Admin