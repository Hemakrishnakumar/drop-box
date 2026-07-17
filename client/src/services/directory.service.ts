import { graphqlClient } from '@/graphql/client';
import { CreateFolderDocument, GetDirectoryDocument, RenameFolderDocument } from '@/graphql/generated/graphql';



export interface DirectoryFolder {
    id: string;
    name: string;
    parentFolderId: string;
    createdAt: string;
    updatedAt: string;
}

export interface DirectoryFile {
    id: string;
    name: string;
    extension: string;
    size: string;
    mimeType: string;
    folderId: string;
    createdAt: string;
    updatedAt: string;
}

export interface DirectoryData {
    id: string;
    name: string;
    folders: DirectoryFolder[];
    files: DirectoryFile[];
}

export const directoryService = {
    async getDirectory(directoryId: string): Promise<DirectoryData> {
        const { data } = await graphqlClient.query<{ getDirectory: DirectoryData }>({
            query: GetDirectoryDocument,
            variables: { directoryId },
            fetchPolicy: 'network-only',
        });

        return data.getDirectory;
    },

    async createFolder(parentFolderId: string, name: string): Promise<DirectoryFolder> {
        const { data } = await graphqlClient.mutate<{ createFolder: DirectoryFolder }>({
            mutation: CreateFolderDocument,
            variables: { parentFolderId, name },
        });

        if (!data?.createFolder) throw new Error('Unable to create folder.');
        return data.createFolder;
    },

    async renameFolder(folderId: string, name: string): Promise<DirectoryFolder> {
        const { data } = await graphqlClient.mutate<{ renameFolder: DirectoryFolder }>({
            mutation: RenameFolderDocument,
            variables: { folderId, name },
        });

        if (!data?.renameFolder) throw new Error('Unable to rename folder.');
        return data.renameFolder;
    },
};
