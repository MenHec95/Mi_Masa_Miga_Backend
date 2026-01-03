import { IsEmail, IsString, isString, IsUUID } from "class-validator"


export class CreateAuthDto {
    @IsEmail()
    email:string 
    password:string
    @IsString()
    name:string
    @IsString()
    userName:string
}

export class CreateAuthResponseDto{
@IsEmail()
email:string
@IsUUID()
userId:string
}
