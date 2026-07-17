import { gql } from '@apollo/client';
import { graphqlClient } from '@/graphql/client';



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

const GET_DIRECTORY = gql`
    query GetDirectory($directoryId: ID!) {
        getDirectory(directoryId: $directoryId) {
            id
            name
            folders {
                id
                name
                parentFolderId
                createdAt
                updatedAt
            }
            files {
                id
                name
                extension
                size
                mimeType
                folderId
                createdAt
                updatedAt
            }
        }
    }
`;

const CREATE_FOLDER = gql`
    mutation CreateFolder($parentFolderId: ID!, $name: String!) {
        createFolder(parentFolderId: $parentFolderId, name: $name) {
            id
            name
            parentFolderId
            createdAt
            updatedAt
        }
    }
`;

export const directoryService = {
    async getDirectory(directoryId: string): Promise<DirectoryData> {
        const { data } = await graphqlClient.query<{ getDirectory: DirectoryData }>({
            query: GET_DIRECTORY,
            variables: { directoryId },
            fetchPolicy: 'network-only',
        });

        return data.getDirectory;
    },

    async createFolder(parentFolderId: string, name: string): Promise<DirectoryFolder> {
        const { data } = await graphqlClient.mutate<{ createFolder: DirectoryFolder }>({
            mutation: CREATE_FOLDER,
            variables: { parentFolderId, name },
        });

        if (!data?.createFolder) throw new Error('Unable to create folder.');
        return data.createFolder;
    },
};
