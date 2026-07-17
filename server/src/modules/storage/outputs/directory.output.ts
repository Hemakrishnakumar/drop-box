import { Field, ID, ObjectType } from '@nestjs/graphql';
import { FileOutput } from './file.output';
import { FolderOutput } from './folder.output';

@ObjectType()
export class DirectoryOutput {
    @Field(() => ID)
    id!: string;

    @Field()
    name!: string;

    @Field(() => [FolderOutput])
    folders!: FolderOutput[];

    @Field(() => [FileOutput])
    files!: FileOutput[];
}
