import { Report } from 'src/reports/report.entity';
import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  insertLog() {
    console.log('Insert User Successful id = ' + this.id);
  }

  @AfterUpdate()
  updateLog() {
    console.log('Update User Successful id = ' + this.id);
  }

  @AfterRemove()
  removeLog() {
    console.log('Remove User Successful id = ' + this.id);
  }
}
