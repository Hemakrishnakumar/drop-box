import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { DirectoryContext, useAuth } from './index';
import {
    directoryService,
    type DirectoryFile,
    type DirectoryFolder,
} from '@/services/directory.service';



export interface DirectoryContextValue {
    currentDirectoryId: string | null;
    folderList: DirectoryFolder[];
    fileList: DirectoryFile[];
    loading: boolean;
    error: string | null;
    setCurrentDirectoryId: (directoryId: string) => void;
    addFolder: (folder: DirectoryFolder) => void;
    refreshDirectory: () => Promise<void>;
}

export function DirectoryProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [currentDirectoryId, setCurrentDirectoryId] = useState<string | null>(null);
    const [folderList, setFolderList] = useState<DirectoryFolder[]>([]);
    const [fileList, setFileList] = useState<DirectoryFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setCurrentDirectoryId(user?.rootFolderId ?? null);
        if (!user) {
            setFolderList([]);
            setFileList([]);
        }
    }, [user?.rootFolderId, user]);

    const refreshDirectory = useCallback(async () => {
        if (!currentDirectoryId || !user) return;

        setLoading(true);
        setError(null);
        try {
            const directory = await directoryService.getDirectory(currentDirectoryId);
            setFolderList(directory.folders);
            setFileList(directory.files);
        } catch (err: unknown) {
            setFolderList([]);
            setFileList([]);
            setError((err as { message?: string }).message ?? 'Unable to load this directory.');
        } finally {
            setLoading(false);
        }
    }, [currentDirectoryId, user]);

    const addFolder = useCallback((folder: DirectoryFolder) => {
        setFolderList((folders) => [...folders, folder]);
    }, []);

    useEffect(() => {
        void refreshDirectory();
    }, [refreshDirectory]);

    return (
        <DirectoryContext.Provider
            value={{
                currentDirectoryId,
                folderList,
                fileList,
                loading,
                error,
                setCurrentDirectoryId,
                addFolder,
                refreshDirectory,
            }}
        >
            {children}
        </DirectoryContext.Provider>
    );
}


