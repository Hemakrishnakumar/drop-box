import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoggedInUserOutput {
    @Field()
    email!: string;

    @Field()
    firstName!: string;

    @Field()
    lastName!: string;

    @Field({ nullable: true })
    photo?: string;

    // PostgreSQL bigint values are represented as strings to preserve precision.
    @Field()
    storageUsed!: string;

    @Field()
    rootFolderId!: string;
}

@ObjectType()
export class LoginOutput {
    @Field()
    success!: boolean;

    @Field(() => LoggedInUserOutput)
    user!: LoggedInUserOutput;
}
