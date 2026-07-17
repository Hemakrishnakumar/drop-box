import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class GetDirectoryInput {
    @Field(() => ID)
    @IsUUID()
    directoryId!: string;
}
