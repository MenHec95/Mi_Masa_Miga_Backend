import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto, CreateAuthResponseDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';





@Injectable()
export class AuthService {
 constructor(
    
    private readonly prisma: PrismaService
  ) {}

  async create(createAuthDto: CreateAuthDto):Promise<CreateAuthResponseDto> {
    
    console.log(createAuthDto);
    try {
    
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS||"10");
    const hashedPassword = await bcrypt.hash(createAuthDto.password, saltRounds);

    const newUser = await this.prisma.user.create({
      data: {
        email: createAuthDto.email,
        password: hashedPassword,
        name: createAuthDto.name,
        user_name: createAuthDto.userName,
        updateAt: new Date(),
      },
    });

    return {userName:newUser.user_name};
  } catch (error) {if (error instanceof BadRequestException) {
      throw error;
    }
    throw new BadRequestException('Error al crear usuario: ' + error.message);
  }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
