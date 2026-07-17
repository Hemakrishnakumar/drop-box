import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';

@ArgsType()
export class RenameFolderInput {
    @Field(() => ID)
    @IsUUID()
    folderId!: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    @Matches(/^\S(?:.*\S)?$/, {
        message: 'Folder name cannot start or end with spaces.',
    })
    name!: string;
}
