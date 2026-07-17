import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FolderOutput {
    @Field(() => ID)
    id!: string;

    @Field()
    name!: string;

    @Field(() => ID)
    parentFolderId!: string;

    @Field(() => Date)
    createdAt!: Date;

    @Field(() => Date)
    updatedAt!: Date;
}
