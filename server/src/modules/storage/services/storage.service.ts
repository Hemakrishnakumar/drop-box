import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { File } from '../entities/file.entity';
import { User } from '../../user/entities/user.entity';
import { Folder } from '../entities/folder.entity';
import { CreateFolderInput } from '../inputs/create-folder.input';
import { GetDirectoryInput } from '../inputs/get-directory.input';
import { DirectoryOutput } from '../outputs/directory.output';
import { FileOutput } from '../outputs/file.output';
import { FolderOutput } from '../outputs/folder.output';

@Injectable()
export class StorageService {
    constructor(
        @InjectRepository(Folder)
        private readonly folderRepository: Repository<Folder>,
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
    ) {}

    async getDirectory(userId: string, input: GetDirectoryInput): Promise<DirectoryOutput> {
        const directory = await this.folderRepository.findOne({
            where: {
                id: input.directoryId,
                owner: { id: userId },
                deletedAt: IsNull(),
            },
        });

        if (!directory) {
            throw new NotFoundException('Directory was not found.');
        }

        const [folders, files] = await Promise.all([
            this.folderRepository.find({
                where: {
                    parentFolder: { id: directory.id },
                    owner: { id: userId },
                    deletedAt: IsNull(),
                },
                order: { name: 'ASC' },
            }),
            this.fileRepository.find({
                where: {
                    folder: { id: directory.id },
                    owner: { id: userId },
                    deletedAt: IsNull(),
                },
                order: { name: 'ASC' },
            }),
        ]);

        return {
            id: directory.id,
            name: directory.name,
            folders: folders.map((folder) => this.toFolderOutput(folder, directory.id)),
            files: files.map((file) => this.toFileOutput(file, directory.id)),
        };
    }

    async createFolder(userId: string, input: CreateFolderInput): Promise<FolderOutput> {
        const name = input.name.trim();

        const parentFolder = await this.folderRepository.findOne({
            where: {
                id: input.parentFolderId,
                owner: { id: userId },
                deletedAt: IsNull(),
            },
        });

        if (!parentFolder) {
            throw new NotFoundException('Parent folder was not found.');
        }

        const duplicateFolder = await this.folderRepository.exists({
            where: {
                name,
                owner: { id: userId },
                parentFolder: { id: parentFolder.id },
            },
        });

        if (duplicateFolder) {
            throw new ConflictException('A folder with this name already exists in this folder.');
        }

        const folder = await this.folderRepository.save(
            this.folderRepository.create({
                name,
                owner: { id: userId } as User,
                parentFolder,
            }),
        );

        return this.toFolderOutput(folder, parentFolder.id);
    }

    private toFolderOutput(folder: Folder, parentFolderId: string): FolderOutput {
        return {
            id: folder.id,
            name: folder.name,
            parentFolderId,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
        };
    }

    private toFileOutput(file: File, folderId: string): FileOutput {
        return {
            id: file.id,
            name: file.name,
            extension: file.extension,
            size: String(file.size),
            mimeType: file.mimeType,
            folderId,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
        };
    }
}
