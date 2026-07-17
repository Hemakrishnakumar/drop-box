import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateFolderInput } from './inputs/create-folder.input';
import { GetDirectoryInput } from './inputs/get-directory.input';
import { RenameFolderInput } from './inputs/rename-folder.input';
import { DirectoryOutput } from './outputs/directory.output';
import { FolderOutput } from './outputs/folder.output';
import { StorageService } from './services/storage.service';
import { CurrentUserId } from 'src/common/decorators/current.user-id';

@Resolver(() => FolderOutput)
export class StorageResolver {
    constructor(private readonly storageService: StorageService) {}

    @Query(() => DirectoryOutput)
    async getDirectory(
        @Args() input: GetDirectoryInput,
        @CurrentUserId() userId: string,
    ): Promise<DirectoryOutput> {
        return this.storageService.getDirectory(userId, input);
    }

    @Mutation(() => FolderOutput)
    async createFolder(
        @Args() input: CreateFolderInput,
        @CurrentUserId() userId: string,
    ): Promise<FolderOutput> {
        return this.storageService.createFolder(userId, input);
    }

    @Mutation(() => FolderOutput)
    async renameFolder(
        @Args() input: RenameFolderInput,
        @CurrentUserId() userId: string,
    ): Promise<FolderOutput> {
        return this.storageService.renameFolder(userId, input);
    }
}
