import { 
    Body,
    NotFoundException, 
    Controller,
    Post,
    Get,
    Param,
    Patch,
    Query, 
    Delete,
    Session,
    UseGuards
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize} from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    
    constructor(
        private userService : UsersService,
        private authService : AuthService    
    ){}

    @Post('/signup')
    async createUser(@Body() body : CreateUserDto, @Session() session: any){
       const user = await this.authService.signUp(body.email,body.password);
       session.userId = user.id;
       return user;
    }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user : User){
        // return this.userService.findOne(session.userId);
        return user;
    }

    @Post('/signout')
    signOut(@Session() session : any){
        session.userId = null;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.signIn(body.email,body.password);
        session.userId = user.id;
        return user;
    }

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
