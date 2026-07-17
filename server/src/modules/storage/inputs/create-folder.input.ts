import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';

@ArgsType()
export class CreateFolderInput {
    @Field(() => ID)
    @IsUUID()
    parentFolderId!: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(1)
    @Matches(/^\S(?:.*\S)?$/, {
        message: 'Folder name cannot start or end with spaces.',
    })
    name!: string;
}
