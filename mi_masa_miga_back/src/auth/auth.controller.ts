import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, CreateAuthResponseDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description: 'Registra un nuevo usuario en el sistema',
  })
  @ApiBody({
    type: CreateAuthDto,
    description: 'Datos del usuario a crear',
  })
  @ApiCreatedResponse({
    description: 'Usuario creado exitosamente',
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
  })
  async create(@Body() createAuthDto: CreateAuthDto):Promise<CreateAuthResponseDto>{
    //console.log(createAuthDto);
    return await this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
