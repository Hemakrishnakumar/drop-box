export function getFolderNameError(name: string, originalName?: string) {
    const trimmedName = name.trim();

    if (!trimmedName) {
        return 'Folder name is required.';
    }

    if (name !== trimmedName) {
        return 'Folder name cannot start or end with spaces.';
    }

    if (originalName !== undefined && trimmedName === originalName.trim()) {
        return 'Folder name has not changed.';
    }

    return undefined;
}
