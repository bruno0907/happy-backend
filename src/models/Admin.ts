import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm'
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

  @Column()
  isAdmin: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword(){
    this.password = hashSync(this.password, 8)
  }
}

export default Admin