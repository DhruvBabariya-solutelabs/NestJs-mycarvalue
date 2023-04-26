import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt, } from "crypto";
import { promisify } from "util";

const scrypt  = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService){}

    async signUp(email : string,password : string){
        // check email is in already use or not
        const users = await this.usersService.find(email);
        if(users.length){
            throw new BadRequestException('Email is already in use');
        }

        // Hash the user Password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Hash salt and password together
        const hashPassword = (await scrypt(password,salt,32)) as Buffer;

        const result = salt+'.'+hashPassword.toString('hex');

        // Create a new User And Save it
        const user = await this.usersService.create(email,result);

        // return the user
        return user;
    }

    async signIn(email : string, password : string){
        const [user] = await this.usersService.find(email);
        if(!user){
            throw new NotFoundException("User Not Found");
        }
        const [salt,hash] = user.password.split('.');
        const hashPassword = (await scrypt(password,salt,32)) as Buffer;

        if (hash !== hashPassword.toString('hex')){
            throw new BadRequestException("Bad Password");
        }
        
        return user;
    }

}