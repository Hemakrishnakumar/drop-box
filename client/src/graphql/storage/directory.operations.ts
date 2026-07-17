import { gql } from "@apollo/client";



export const GET_DIRECTORY = gql`
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

export const CREATE_FOLDER = gql`
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

export const RENAME_FOLDER = gql`
    mutation RenameFolder($folderId: ID!, $name: String!) {
        renameFolder(folderId: $folderId, name: $name) {
            id
            name
            parentFolderId
            createdAt
            updatedAt
        }
    }
`;