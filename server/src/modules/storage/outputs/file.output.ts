import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FileOutput {
    @Field(() => ID)
    id!: string;

    @Field()
    name!: string;

    @Field()
    extension!: string;

    @Field()
    size!: string;

    @Field()
    mimeType!: string;

    @Field(() => ID)
    folderId!: string;

    @Field(() => Date)
    createdAt!: Date;

    @Field(() => Date)
    updatedAt!: Date;
}
