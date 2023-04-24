import { Console, log } from 'console';
import {AfterInsert, AfterUpdate, AfterRemove, Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Exclude } from 'class-transformer';

@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email : string;

    @Column()
    @Exclude()
    password : string;

    @AfterInsert()
    insertLog(){
        console.log("Insert User Successful id = "+this.id);
    }

    @AfterUpdate()
    updateLog(){
        console.log("Update User Successful id = "+this.id);
    }

    @AfterRemove()
    removeLog(){
        console.log("Remove User Successful id = "+this.id);
        
    }
    
}