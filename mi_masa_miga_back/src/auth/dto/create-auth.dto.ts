import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  email: string


  @ApiProperty({
    description: 'Contraseña segura',
    example: 'MiClaveSegura123!',
    minLength: 8,
    maxLength: 30,
  })
  @IsString({ message: 'La contraseña debe ser texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(30, { message: 'La contraseña no puede exceder 30 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)',
  })
  password: string;

  @IsString()
  name: string;

  @IsString()
  userName: string;
}

export class CreateAuthResponseDto {
  // @IsEmail()
  // email:string
  // @IsUUID()
  // userId:string
  @IsString()
  userName: string;
}
