import { Body,
        NotFoundException, 
        Controller,
        Post,
        Get,
        Param,
        Patch,
        Query, 
        Delete
     } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize} from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
export class UsersController {
    
    constructor(private userService : UsersService){}

    @Post('/signup')
    createUser(@Body() body : CreateUserDto){
       return this.userService.create(body.email,body.password);
    }

    @Serialize(UserDto)
    @Get('/:id')
    findUser(@Param('id') id : string){
        const user = this.userService.findOne(parseInt(id));
        if(!user){
            throw new NotFoundException("User Not Found");
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email : string){
        return this.userService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id : string){
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id : string, @Body() body: UpdateUserDto){
        return this.userService.update(parseInt(id),body);
    }
}
