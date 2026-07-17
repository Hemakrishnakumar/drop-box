import {
    Archive,
    ArrowDownAZ,
    Check,
    ChevronRight,
    Download,
    File,
    FileImage,
    FileText,
    Folder,
    Grid2X2,
    Heart,
    Home,
    List,
    MoreHorizontal,
    MoveRight,
    Music2,
    Plus,
    Search,
    Share2,
    Star,
    Trash2,
    Upload,
    Video,
    X,
} from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Modal } from '@/components/modals';
import { useAuth } from '@/context';
import { useDirectory } from '@/context/index';



type ViewMode = 'grid' | 'list';
type ItemKind = 'folder' | 'document' | 'image' | 'video' | 'audio' | 'archive';

interface FileItem {
    id: string;
    name: string;
    kind: ItemKind;
    meta: string;
    modified: string;
    created: string;
    size: string;
    visibility: 'Private' | 'Shared' | 'Public link';
    favorite?: boolean;
    shared?: boolean;
}

const rootItems: FileItem[] = [
    {
        id: 'branding',
        name: 'Branding Assets',
        kind: 'folder',
        meta: '24 items',
        modified: 'Today, 10:42 AM',
        created: 'May 12, 2024',
        size: '842 MB',
        visibility: 'Shared',
        favorite: true,
        shared: true,
    },
    {
        id: 'personal',
        name: 'Personal',
        kind: 'folder',
        meta: '12 items',
        modified: 'Yesterday',
        created: 'Jan 18, 2024',
        size: '2.4 GB',
        visibility: 'Private',
    },
    {
        id: 'projects',
        name: 'Project Atlas',
        kind: 'folder',
        meta: '38 items',
        modified: 'Jun 18, 2024',
        created: 'Mar 08, 2024',
        size: '1.8 GB',
        visibility: 'Shared',
        shared: true,
    },
    {
        id: 'guidelines',
        name: 'UX Guidelines v2.4.pdf',
        kind: 'document',
        meta: 'PDF document',
        modified: '2 minutes ago',
        created: 'Jun 20, 2024',
        size: '4.2 MB',
        visibility: 'Shared',
        favorite: true,
        shared: true,
    },
    {
        id: 'hero',
        name: 'Campaign Hero Image.png',
        kind: 'image',
        meta: 'PNG image',
        modified: '1 hour ago',
        created: 'Jun 19, 2024',
        size: '12.8 MB',
        visibility: 'Public link',
    },
    {
        id: 'interview',
        name: 'Interview Draft Final.mp4',
        kind: 'video',
        meta: 'MP4 video',
        modified: '3 hours ago',
        created: 'Jun 17, 2024',
        size: '245 MB',
        visibility: 'Private',
    },
    {
        id: 'sound',
        name: 'Product launch audio.mp3',
        kind: 'audio',
        meta: 'MP3 audio',
        modified: 'Yesterday',
        created: 'Jun 13, 2024',
        size: '8.4 MB',
        visibility: 'Private',
    },
    {
        id: 'archive',
        name: 'Research exports.zip',
        kind: 'archive',
        meta: 'ZIP archive',
        modified: 'Jun 12, 2024',
        created: 'Jun 12, 2024',
        size: '58.2 MB',
        visibility: 'Shared',
        shared: true,
    },
];

const nestedItems: Record<string, FileItem[]> = {
    personal: [
        {
            id: 'certificates',
            name: 'Certificates',
            kind: 'folder',
            meta: '8 items',
            modified: 'May 14, 2024',
            created: 'Feb 03, 2024',
            size: '18 MB',
            visibility: 'Private',
        },
        {
            id: 'resume',
            name: 'Resume 2024.pdf',
            kind: 'document',
            meta: 'PDF document',
            modified: 'May 10, 2024',
            created: 'May 10, 2024',
            size: '1.1 MB',
            visibility: 'Private',
            favorite: true,
        },
    ],
    branding: [
        {
            id: 'logos',
            name: 'Logo System',
            kind: 'folder',
            meta: '16 items',
            modified: 'Today, 10:42 AM',
            created: 'May 12, 2024',
            size: '322 MB',
            visibility: 'Shared',
            shared: true,
        },
        {
            id: 'palette',
            name: 'Brand Color Palette.png',
            kind: 'image',
            meta: 'PNG image',
            modified: 'Yesterday',
            created: 'Jun 11, 2024',
            size: '3.7 MB',
            visibility: 'Shared',
            shared: true,
        },
    ],
};

const filters = [
    'All',
    'Documents',
    'Images',
    'Videos',
    'Audio',
    'Archives',
    'Favorites',
    'Shared',
];

function iconFor(kind: ItemKind, className = 'h-5 w-5') {
    const icons = {
        folder: Folder,
        document: FileText,
        image: FileImage,
        video: Video,
        audio: Music2,
        archive: Archive,
    };
    const Icon = icons[kind] ?? File;
    return <Icon className={className} />;
}

function visibilityStyle(visibility: FileItem['visibility']) {
    return visibility === 'Shared'
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
        : visibility === 'Public link'
            ? 'bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
}

export default function Files() {
    const { user } = useAuth();
    const {
        currentDirectoryId,
        folderList,
        fileList,
        loading,
        error,
        setCurrentDirectoryId,
        addFolder,
    } = useDirectory();
    const [view, setView] = useState<ViewMode>('grid');
    const [activeFilter, setActiveFilter] = useState('All');
    const [folderPath, setFolderPath] = useState<{ id: string; name: string }[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [preview, setPreview] = useState<FileItem | null>(null);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [itemsByFolder, setItemsByFolder] = useState<Record<string, FileItem[]>>(() => ({
        root: rootItems,
        ...nestedItems,
    }));
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [folderName, setFolderName] = useState('New Folder');
    const [hasSubmittedFolderName, setHasSubmittedFolderName] = useState(false);

    const currentFolderId = currentDirectoryId ?? user?.rootFolderId ?? 'root';
    const trimmedFolderName = folderName.trim();
    const folderNameError =
        trimmedFolderName.length === 0
            ? 'Folder name is required.'
            : folderName !== trimmedFolderName
                ? 'Folder name cannot start or end with spaces.'
                : undefined;

    const currentItems = useMemo(() => {
        if (!currentDirectoryId) return itemsByFolder[currentFolderId] ?? [];

        const folders: FileItem[] = folderList.map((folder) => ({
            id: folder.id,
            name: folder.name,
            kind: 'folder',
            meta: 'Folder',
            modified: new Date(folder.updatedAt).toLocaleDateString(),
            created: new Date(folder.createdAt).toLocaleDateString(),
            size: '—',
            visibility: 'Private',
        }));
        const files: FileItem[] = fileList.map((file) => ({
            id: file.id,
            name: file.name,
            kind: file.mimeType.startsWith('image/')
                ? 'image'
                : file.mimeType.startsWith('video/')
                    ? 'video'
                    : file.mimeType.startsWith('audio/')
                        ? 'audio'
                        : file.extension.toLowerCase() === 'zip'
                            ? 'archive'
                            : 'document',
            meta: file.mimeType,
            modified: new Date(file.updatedAt).toLocaleDateString(),
            created: new Date(file.createdAt).toLocaleDateString(),
            size: `${file.size} B`,
            visibility: 'Private',
        }));

        return [...folders, ...files];
    }, [currentDirectoryId, currentFolderId, fileList, folderList, itemsByFolder]);
    const visibleItems = useMemo(
        () =>
            currentItems.filter((item) => {
                const filterMatches =
                    activeFilter === 'All' ||
                    (activeFilter === 'Favorites'
                        ? item.favorite
                        : activeFilter === 'Shared'
                            ? item.shared
                            : `${item.kind}s`.startsWith(
                                activeFilter
                                    .toLowerCase()
                                    .replace('documents', 'document')
                                    .replace('images', 'image')
                                    .replace('videos', 'video')
                                    .replace('archives', 'archive'),
                            ));
                return filterMatches && item.name.toLowerCase().includes(query.toLowerCase());
            }),
        [activeFilter, currentItems, query],
    );

    const openFolder = (item: FileItem) => {
        if (item.kind !== 'folder') return setPreview(item);
        setFolderPath((path) => [...path, { id: item.id, name: item.name }]);
        setCurrentDirectoryId(item.id);
        setSelected([]);
    };
    const toggleSelection = (id: string) =>
        setSelected((items) =>
            items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
        );
    const openCreateFolderModal = () => {
        setFolderName('New Folder');
        setHasSubmittedFolderName(false);
        setIsCreateFolderOpen(true);
    };
    const closeCreateFolderModal = () => setIsCreateFolderOpen(false);
    const createFolder = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setHasSubmittedFolderName(true);
        if (folderNameError) return;

        const folder: FileItem = {
            id: `folder-${Date.now()}`,
            name: trimmedFolderName,
            kind: 'folder',
            meta: '0 items',
            modified: 'Just now',
            created: 'Today',
            size: '0 B',
            visibility: 'Private',
        };

        addFolder({
            id: folder.id,
            name: folder.name,
            parentFolderId: currentDirectoryId ?? '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        setItemsByFolder((items) => ({
            ...items,
            [currentFolderId]: [...(items[currentFolderId] ?? []), folder],
        }));
        closeCreateFolderModal();
    };

    return (
        <div className="flex h-screen flex-col overflow-hidden px-4 pb-5 pt-20 sm:px-6 lg:px-6 lg:pb-6 lg:pt-28">
            <section className="mb-5 flex shrink-0 flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="mt-1 text-3xl font-bold tracking-[-0.03em]">My Files</h1>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0061ff] to-[#3b82f6] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20"
                    >
                        <Upload className="h-4 w-4" />
                        Upload
                    </button>
                    <button
                        type="button"
                        onClick={openCreateFolderModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                        <Plus className="h-4 w-4" />
                        New folder
                    </button>
                </div>
            </section>

            <section className="mb-4 shrink-0 rounded-[24px] border border-white/80 bg-white/70 px-5 py-3 shadow-sm">
                <div className="flex flex-wrap items-center gap-1 text-sm">
                    <button
                        type="button"
                        onClick={() => {
                            setFolderPath([]);
                            if (user?.rootFolderId) setCurrentDirectoryId(user.rootFolderId);
                        }}
                        className="rounded-lg p-1.5 text-[#0052dc] transition hover:bg-blue-50"
                    >
                        <Home className="h-4 w-4" />
                    </button>
                    {folderPath.map((crumb, index) => (
                        <span key={crumb.id} className="flex items-center gap-1">
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <button
                                type="button"
                                onClick={() => {
                                    const nextPath = folderPath.slice(0, index + 1);
                                    setFolderPath(nextPath);
                                    setCurrentDirectoryId(
                                        nextPath.at(-1)?.id ?? user?.rootFolderId ?? '',
                                    );
                                }}
                                className={`rounded-md px-1.5 py-1 transition hover:bg-blue-50 ${index === folderPath.length - 1 ? 'font-semibold text-[#004bca]' : 'text-slate-600'}`}
                            >
                                {crumb.name}
                            </button>
                        </span>
                    ))}
                </div>
                <div className="mt-2 flex gap-4 text-xs font-medium text-slate-500">
                    <span>
                        <strong className="text-slate-800">
                            {visibleItems.filter((item) => item.kind !== 'folder').length}
                        </strong>{' '}
                        Files
                    </span>
                    <span>
                        <strong className="text-slate-800">
                            {visibleItems.filter((item) => item.kind === 'folder').length}
                        </strong>{' '}
                        Folders
                    </span>
                    <span>
                        <strong className="text-slate-800">2.4 GB</strong>
                    </span>
                </div>
            </section>

            <section className="mb-4 flex shrink-0 flex-wrap items-center gap-3">
                <div className="relative min-w-[220px] flex-1 lg:max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white/80 pl-10 pr-3 text-sm outline-none ring-[#0061ff]/30 placeholder:text-slate-400 focus:ring-2"
                        placeholder="Search inside this folder..."
                    />
                </div>
                <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-white/65 p-1">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => setActiveFilter(filter)}
                            className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${activeFilter === filter ? 'bg-[#004bca] text-white shadow-sm' : 'text-slate-500 hover:bg-white hover:text-[#004bca]'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <button
                        type="button"
                        className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 md:flex"
                    >
                        <ArrowDownAZ className="h-4 w-4" />
                        Modified
                    </button>
                    <div className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
                        <button
                            type="button"
                            aria-label="Grid view"
                            onClick={() => setView('grid')}
                            className={`rounded-lg p-2 transition ${view === 'grid' ? 'bg-[#004bca] text-white' : 'text-slate-500'}`}
                        >
                            <Grid2X2 className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            aria-label="List view"
                            onClick={() => setView('list')}
                            className={`rounded-lg p-2 transition ${view === 'list' ? 'bg-[#004bca] text-white' : 'text-slate-500'}`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </section>

            <section className="min-h-0 flex-1 overflow-hidden rounded-[28px] border border-white/80 bg-white/55 p-3 shadow-sm sm:p-4">
                {error && (
                    <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                        {error}
                    </div>
                )}
                {loading && (
                    <div className="mb-3 rounded-xl bg-slate-100/80 px-4 py-3 text-sm text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                        Loading directory...
                    </div>
                )}
                {visibleItems.length === 0 ? (
                    <div className="grid h-full min-h-64 place-items-center text-center">
                        <div>
                            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-100 text-[#0061ff]">
                                <Folder className="h-8 w-8" />
                            </div>
                            <h2 className="mt-4 text-lg font-bold">This folder is empty.</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Upload files or create a new folder to get started.
                            </p>
                            <div className="mt-4 flex justify-center gap-2">
                                <button
                                    type="button"
                                    className="rounded-xl bg-[#004bca] px-4 py-2 text-sm font-bold text-white"
                                >
                                    Upload files
                                </button>
                                <button
                                    type="button"
                                    onClick={openCreateFolderModal}
                                    className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200"
                                >
                                    Create folder
                                </button>
                            </div>
                        </div>
                    </div>
                ) : view === 'grid' ? (
                    <div className="h-full overflow-y-auto">
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {visibleItems.map((item) => (
                                <article
                                    key={item.id}
                                    onDoubleClick={() => openFolder(item)}
                                    className={`group relative cursor-pointer rounded-[22px] border p-4 transition duration-200 hover:-translate-y-1 hover:shadow-lg ${selected.includes(item.id) ? 'border-[#0061ff] bg-blue-50/70 ring-2 ring-blue-200' : 'border-white bg-white/90 hover:border-blue-100'}`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleSelection(item.id)}
                                        className={`absolute left-3 top-3 grid h-5 w-5 place-items-center rounded-md border transition ${selected.includes(item.id) ? 'border-[#0061ff] bg-[#0061ff] text-white' : 'border-slate-300 bg-white text-transparent group-hover:text-slate-300'}`}
                                    >
                                        <Check className="h-3.5 w-3.5" />
                                    </button>
                                    <div
                                        className={`grid h-24 place-items-center rounded-2xl ${item.kind === 'folder' ? 'bg-blue-50 text-[#0061ff] dark:bg-[#10264b] dark:text-blue-400' : item.kind === 'image' ? 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
                                    >
                                        {iconFor(item.kind, 'h-10 w-10')}
                                    </div>
                                    <div className="mt-3 flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h3 className="truncate text-sm font-bold">
                                                {item.name}
                                            </h3>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {item.meta} · {item.modified}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setMenuOpen(menuOpen === item.id ? null : item.id);
                                            }}
                                            className="rounded-lg p-1.5 text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span
                                            className={`rounded-full px-2 py-1 text-[10px] font-bold ${visibilityStyle(item.visibility)}`}
                                        >
                                            {item.visibility}
                                        </span>
                                        {item.favorite && (
                                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        )}
                                    </div>
                                    {menuOpen === item.id && (
                                        <ActionMenu onPreview={() => setPreview(item)} />
                                    )}
                                </article>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-full overflow-auto">
                        <div className="min-w-[780px]">
                            <div className="sticky top-0 z-20 grid grid-cols-[32px_minmax(220px,2fr)_0.8fr_0.9fr_0.9fr_0.7fr_0.7fr_32px] items-center border-b border-slate-200 bg-[#f8f9ff] px-2 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 shadow-sm">
                                <span />
                                <span>Name</span>
                                <span>Type</span>
                                <span>Created</span>
                                <span>Modified</span>
                                <span>Size</span>
                                <span>Visibility</span>
                                <span />
                            </div>
                            {visibleItems.map((item) => (
                                <div
                                    key={item.id}
                                    onDoubleClick={() => openFolder(item)}
                                    className={`group grid grid-cols-[32px_minmax(220px,2fr)_0.8fr_0.9fr_0.9fr_0.7fr_0.7fr_32px] items-center border-b border-slate-100 px-2 py-3 text-sm transition hover:bg-blue-50/60 ${selected.includes(item.id) ? 'bg-blue-50' : ''}`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleSelection(item.id)}
                                        className={`grid h-5 w-5 place-items-center rounded-md border ${selected.includes(item.id) ? 'border-[#0061ff] bg-[#0061ff] text-white' : 'border-slate-300 bg-white text-transparent'}`}
                                    >
                                        <Check className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openFolder(item)}
                                        className="flex min-w-0 items-center gap-3 text-left"
                                    >
                                        <span
                                            className={`rounded-xl p-2 ${item.kind === 'folder' ? 'bg-blue-50 text-[#0061ff] dark:bg-[#10264b] dark:text-blue-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
                                        >
                                            {iconFor(item.kind)}
                                        </span>
                                        <span className="truncate font-semibold">{item.name}</span>
                                    </button>
                                    <span className="text-xs text-slate-500">{item.meta}</span>
                                    <span className="text-xs text-slate-500">{item.created}</span>
                                    <span className="text-xs text-slate-500">{item.modified}</span>
                                    <span className="font-mono text-xs text-slate-500">
                                        {item.size}
                                    </span>
                                    <span>
                                        <span
                                            className={`rounded-full px-2 py-1 text-[10px] font-bold ${visibilityStyle(item.visibility)}`}
                                        >
                                            {item.visibility}
                                        </span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMenuOpen(menuOpen === item.id ? null : item.id)
                                        }
                                        className="relative rounded-lg p-1.5 text-slate-400 hover:bg-white"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                        {menuOpen === item.id && (
                                            <ActionMenu onPreview={() => setPreview(item)} />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {selected.length > 0 && (
                <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-2xl bg-[#0b1c30] p-2 text-white shadow-2xl shadow-slate-900/25 animate-in slide-in-from-bottom-4">
                    <span className="px-3 text-sm font-semibold">{selected.length} selected</span>
                    {[
                        [Download, 'Download'],
                        [MoveRight, 'Move'],
                        [Share2, 'Share'],
                        [Heart, 'Favorite'],
                        [Trash2, 'Delete'],
                    ].map(([Icon, label]) => {
                        const ActionIcon = Icon as typeof Download;
                        return (
                            <button
                                key={label as string}
                                type="button"
                                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition hover:bg-white/10"
                            >
                                <ActionIcon className="h-4 w-4" />
                                {label as string}
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={() => setSelected([])}
                        className="rounded-xl p-2 hover:bg-white/10"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
            <Modal
                isOpen={isCreateFolderOpen}
                onClose={closeCreateFolderModal}
                title="Create folder"
                description="Choose a name for your new folder."
                size="sm"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={closeCreateFolderModal}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="create-folder-form"
                            disabled={Boolean(folderNameError)}
                            className="w-full rounded-xl bg-[#004bca] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#003ea8] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:bg-[#1b447d] dark:hover:bg-[#24518e]"
                        >
                            Create folder
                        </button>
                    </>
                }
            >
                <form id="create-folder-form" onSubmit={createFolder}>
                    <label
                        htmlFor="folder-name"
                        className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
                    >
                        Folder name
                    </label>
                    <input
                        id="folder-name"
                        value={folderName}
                        onChange={(event) => setFolderName(event.target.value)}
                        onBlur={() => setHasSubmittedFolderName(true)}
                        autoFocus
                        aria-invalid={Boolean(hasSubmittedFolderName && folderNameError)}
                        aria-describedby={
                            hasSubmittedFolderName && folderNameError
                                ? 'folder-name-error'
                                : undefined
                        }
                        className={`mt-2 h-11 w-full rounded-xl border bg-white px-3 text-sm font-medium text-slate-800 outline-none ring-[#0061ff]/25 transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-900 dark:text-slate-200 ${hasSubmittedFolderName && folderNameError ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`}
                    />
                    {hasSubmittedFolderName && folderNameError && (
                        <p
                            id="folder-name-error"
                            className="mt-2 text-xs font-medium text-red-600 dark:text-red-400"
                        >
                            {folderNameError}
                        </p>
                    )}
                </form>
            </Modal>
            {preview && <PreviewModal item={preview} onClose={() => setPreview(null)} />}
        </div>
    );
}

function ActionMenu({ onPreview }: { onPreview: () => void }) {
    return (
        <div className="absolute right-3 top-12 z-20 w-36 rounded-xl border border-slate-100 bg-white p-1.5 text-left text-xs font-medium text-slate-700 shadow-xl">
            <button
                type="button"
                className="block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-50"
            >
                Open
            </button>
            <button
                type="button"
                onClick={onPreview}
                className="block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-50"
            >
                Preview
            </button>
            <button
                type="button"
                className="block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-50"
            >
                Rename
            </button>
            <button
                type="button"
                className="block w-full rounded-lg px-3 py-2 text-left hover:bg-slate-50"
            >
                Copy link
            </button>
            <button
                type="button"
                className="block w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50"
            >
                Delete
            </button>
        </div>
    );
}

function PreviewModal({ item, onClose }: { item: FileItem; onClose: () => void }) {
    return (
        <Modal
            isOpen
            onClose={onClose}
            title={item.name}
            description={`${item.meta} · ${item.size}`}
            size="lg"
            bodyClassName="grid min-h-64 place-items-center bg-slate-50 p-8 text-center dark:bg-[#0d1626]"
        >
            <span className="rounded-3xl bg-white p-7 text-[#0061ff] shadow-sm dark:bg-slate-800 dark:text-blue-400">
                {iconFor(item.kind, 'h-16 w-16')}
            </span>
            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                Preview placeholder for this {item.meta.toLowerCase()}.
            </p>
        </Modal>
    );
}
