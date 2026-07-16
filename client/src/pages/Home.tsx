import {
    Bell,
    Cloud,
    FolderOpen,
    Grid2X2,
    History,
    LayoutDashboard,    
    Search,
    Settings,
    Star,
    Trash2,
    Users,
    Zap,
} from 'lucide-react';
import { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/context';



const navigationItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'My Files', icon: FolderOpen, path: '/files' },
    { label: 'Shared with me', icon: Users, path: '/shared' },
    { label: 'Favorites', icon: Star, path: '/favorites' },
    { label: 'Recent', icon: History, path: '/recent' },
    { label: 'Trash', icon: Trash2, path: '/trash' },
];

function initials(firstName?: string, lastName?: string) {
    return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'NC';
}

export default function Home() {
    const { user } = useAuth();
    const usedStorage = Number(user?.storageUsed ?? 0);
    const storageLabel =
        usedStorage > 0 ? `${(usedStorage / 1_000_000_000).toFixed(1)} GB` : '72.4 GB';

    useEffect(() => {
        const root = document.getElementById('root');
        root?.classList.add('home-page-root');
        return () => root?.classList.remove('home-page-root');
    }, []);

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#f8f9ff] font-sans text-[#0b1c30]">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_10%_90%,rgba(0,97,255,0.13),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(138,76,252,0.1),transparent_26%)]" />

            <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-white/70 bg-white/65 p-4 shadow-[8px_0_30px_rgba(32,65,120,0.04)] backdrop-blur-2xl lg:flex">
                <div className="mb-8 flex items-center gap-3 px-2 pt-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0061ff] to-[#004bca] text-white shadow-lg shadow-blue-500/25">
                        <Cloud className="h-6 w-6" fill="currentColor" />
                    </div>
                    <div>
                        <p className="text-xl font-bold tracking-tight text-[#004bca]">
                            Nexus Cloud
                        </p>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Premium storage
                        </p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {navigationItems.map(({ label, icon: Icon, path }) => (
                        <NavLink
                            key={label}
                            to={path}
                            end={path === '/'}
                            className={({ isActive }) =>
                                `flex w-full items-center gap-3 rounded-full px-4 py-3 text-left text-sm font-medium transition ${isActive ? 'bg-gradient-to-r from-[#004bca] to-[#8a4cfc] text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-white hover:text-[#004bca]'}`
                            }
                        >
                            <Icon className="h-5 w-5" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-8 border-t border-slate-200/70 pt-5">
                    <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Settings
                    </p>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm transition ${isActive ? 'bg-gradient-to-r from-[#004bca] to-[#8a4cfc] font-medium text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-white hover:text-[#004bca]'}`
                        }
                    >
                        <Settings className="h-5 w-5" /> Settings
                    </NavLink>
                </div>

                <div className="mt-auto rounded-[28px] border border-white bg-[#eff4ff]/90 p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[conic-gradient(#0061ff_0_72%,#d3e4fe_72%_100%)]">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eff4ff] text-[10px] font-bold">
                                72%
                            </div>
                        </div>
                        <Zap className="h-5 w-5 text-[#004bca]" />
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Cloud capacity
                    </p>
                    <p className="mt-1 text-sm font-bold">
                        {storageLabel} <span className="font-normal text-slate-500">of 100 GB</span>
                    </p>
                    <button
                        type="button"
                        className="mt-4 w-full rounded-full bg-[#004bca] py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#003ea8]"
                    >
                        Upgrade plan
                    </button>
                </div>
            </aside>

            <main className="relative min-h-screen min-w-0 lg:ml-72">
                <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/50 bg-[#f8f9ff]/90 px-4 backdrop-blur-xl sm:px-6 lg:left-72 lg:h-20 lg:px-6">
                    <div className="relative hidden max-w-xl flex-1 sm:block">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            aria-label="Search files"
                            className="h-11 w-full rounded-full border-0 bg-[#e5eeff]/75 py-2 pl-12 pr-14 text-sm outline-none ring-[#0061ff]/30 placeholder:text-slate-400 focus:ring-2"
                            placeholder="Search files, folders, or settings..."
                        />
                        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-500">
                            ⌘ K
                        </kbd>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-auto">                        
                        <button
                            type="button"
                            aria-label="Notifications"
                            className="relative rounded-full p-2.5 text-slate-600 transition hover:bg-white"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#f8f9ff]" />
                        </button>
                        <button
                            type="button"
                            aria-label="Apps"
                            className="rounded-full p-2.5 text-slate-600 transition hover:bg-white"
                        >
                            <Grid2X2 className="h-5 w-5" />
                        </button>
                        <div className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#004bca] to-[#8a4cfc] p-0.5">
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-xs font-bold text-[#004bca]">
                                {initials(user?.firstName, user?.lastName)}
                            </div>
                        </div>
                    </div>
                </header>
                <Outlet />
            </main>
        </div>
    );
}
