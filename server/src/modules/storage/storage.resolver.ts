import { UnauthorizedException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { GraphqlContext } from 'src/common/types/common';
import { CreateFolderInput } from './inputs/create-folder.input';
import { GetDirectoryInput } from './inputs/get-directory.input';
import { DirectoryOutput } from './outputs/directory.output';
import { FolderOutput } from './outputs/folder.output';
import { StorageService } from './services/storage.service';

@Resolver(() => FolderOutput)
export class StorageResolver {
    constructor(private readonly storageService: StorageService) {}

    @Query(() => DirectoryOutput)
    async getDirectory(
        @Args() input: GetDirectoryInput,
        @Context() context: GraphqlContext,
    ): Promise<DirectoryOutput> {
        if (!context.userId) {
            throw new UnauthorizedException('Authentication is required.');
        }
        return this.storageService.getDirectory(context.userId, input);
    }

    @Mutation(() => FolderOutput)
    async createFolder(
        @Args() input: CreateFolderInput,
        @Context() context: GraphqlContext,
    ): Promise<FolderOutput> {
        if (!context.userId) {
            throw new UnauthorizedException('Authentication is required.');
        }
        return this.storageService.createFolder(context.userId, input);
    }
}
