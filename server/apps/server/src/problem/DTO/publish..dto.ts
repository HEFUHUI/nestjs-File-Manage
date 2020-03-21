import { IsNotEmpty } from "class-validator"

export class PublishDto {
    @IsNotEmpty()
    body: string
    @IsNotEmpty()
    ex_img: string
}