import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthMessageOutput {
    @Field()
    message!: string;

    @Field()
    success!: boolean;
}
