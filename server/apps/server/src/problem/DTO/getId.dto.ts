import { IsNotEmpty } from "class-validator";

export class getId{
    @IsNotEmpty()
    id:string
}