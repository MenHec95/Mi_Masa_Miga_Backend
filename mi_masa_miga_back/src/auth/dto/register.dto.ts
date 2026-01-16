import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'juan@example.com' })
    @IsEmail({}, { message: 'El email debe ser válido' })
    email: string;

    @ApiProperty({ example: 'Password123!' })
    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
    })
    password: string;

    @ApiProperty({ example: 'Juan Pérez' })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @ApiProperty({ example: 'juanperez' })
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: 'El nombre de usuario solo puede contener letras, números y guiones bajos',
    })
    userName: string;
}
