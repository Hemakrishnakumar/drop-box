import { FileText, Folder, HardDrive, Image, MoreHorizontal, Share2, Video } from 'lucide-react';
import { useAuth } from '@/context';



const metrics = [
    {
        label: 'Total files',
        value: '12,482',
        change: '12%',
        icon: FileText,
        tone: 'bg-blue-100 text-blue-700',
    },
    {
        label: 'Folders',
        value: '842',
        change: '4%',
        icon: Folder,
        tone: 'bg-violet-100 text-violet-700',
    },
    {
        label: 'Storage used',
        value: '72.4',
        suffix: 'GB',
        change: '72%',
        icon: HardDrive,
        tone: 'bg-emerald-100 text-emerald-700',
    },
    {
        label: 'Shared items',
        value: '1,104',
        change: '24%',
        icon: Share2,
        tone: 'bg-slate-200 text-slate-700',
    },
];

const recentFiles = [
    {
        name: 'UX Guidelines v2.4',
        type: 'PDF Document',
        modified: '2 minutes ago',
        size: '4.2 MB',
        icon: FileText,
        tone: 'bg-blue-50 text-blue-600',
    },
    {
        name: 'Campaign Hero Image',
        type: 'PNG File',
        modified: '1 hour ago',
        size: '12.8 MB',
        icon: Image,
        tone: 'bg-violet-50 text-violet-600',
    },
    {
        name: 'Interview_Draft_Final',
        type: 'MP4 Video',
        modified: '3 hours ago',
        size: '245.0 MB',
        icon: Video,
        tone: 'bg-emerald-50 text-emerald-600',
        private: true,
    },
];

export default function Dashboard() {
    const { user } = useAuth();
    const name = user?.firstName || 'there';

    return (
        <div className="w-full space-y-6 px-4 pb-6 pt-20 sm:px-6 lg:px-6 lg:pb-8 lg:pt-28">
            <section>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0061ff]">
                    Dashboard overview
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#0b1c30] sm:text-3xl">
                    Good to see you, {name}.
                </h1>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map(({ label, value, suffix, change, icon: Icon, tone }) => (
                    <article
                        key={label}
                        className="rounded-[28px] border border-white/80 bg-white/70 p-5 shadow-[0_10px_25px_rgba(23,60,120,0.05)] transition hover:-translate-y-1 hover:bg-white"
                    >
                        <div className="mb-5 flex items-start justify-between">
                            <span className={`rounded-2xl p-3 ${tone}`}>
                                <Icon className="h-5 w-5" />
                            </span>
                            <span
                                className={`rounded-lg px-2 py-1 text-xs font-semibold ${label === 'Storage used' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}
                            >
                                {label === 'Storage used' ? change : `↑ ${change}`}
                            </span>
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {label}
                        </p>
                        <p className="mt-1 text-3xl font-bold tracking-tight">
                            {value}{' '}
                            {suffix && <span className="text-base text-slate-500">{suffix}</span>}
                        </p>
                    </article>
                ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-5">
                <article className="overflow-hidden rounded-[32px] border border-white/80 bg-white/70 p-4 shadow-sm sm:p-6 xl:col-span-3">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight">Recent files</h2>
                        <button
                            type="button"
                            className="text-sm font-bold text-[#004bca] hover:underline"
                        >
                            View all
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-left">
                            <thead className="border-b border-slate-100 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                                <tr>
                                    <th className="px-2 py-3">Name</th>
                                    <th className="px-2 py-3">Modified</th>
                                    <th className="px-2 py-3">Size</th>
                                    <th className="px-2 py-3">Collaborators</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {recentFiles.map(
                                    ({
                                        name: fileName,
                                        type,
                                        modified,
                                        size,
                                        icon: Icon,
                                        tone,
                                        private: isPrivate,
                                    }) => (
                                        <tr
                                            key={fileName}
                                            className="border-b border-slate-100 last:border-0 hover:bg-blue-50/50"
                                        >
                                            <td className="px-2 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`rounded-xl p-2.5 ${tone}`}>
                                                        <Icon className="h-5 w-5" />
                                                    </span>
                                                    <span>
                                                        <strong className="block text-sm">
                                                            {fileName}
                                                        </strong>
                                                        <small className="text-slate-500">
                                                            {type}
                                                        </small>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-2 py-4 text-sm text-slate-500">
                                                {modified}
                                            </td>
                                            <td className="px-2 py-4 font-mono text-xs text-slate-500">
                                                {size}
                                            </td>
                                            <td className="px-2 py-4">
                                                {isPrivate ? (
                                                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-800">
                                                        PRIVATE
                                                    </span>
                                                ) : (
                                                    <div className="flex -space-x-2">
                                                        <span className="h-7 w-7 rounded-full border-2 border-white bg-blue-200" />
                                                        <span className="h-7 w-7 rounded-full border-2 border-white bg-violet-200" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-2 py-4">
                                                <button
                                                    type="button"
                                                    aria-label={`More options for ${fileName}`}
                                                    className="rounded-full p-2 hover:bg-white"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                </article>

                <div className="flex flex-col gap-6 xl:col-span-2">
                    <article className="overflow-hidden rounded-[32px] border border-white/80 bg-white/75 p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-tight">Storage overview</h2>
                            <button
                                type="button"
                                aria-label="More storage options"
                                className="rounded-full p-2 hover:bg-white"
                            >
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#073f9e] via-[#0052dc] to-[#287dff] p-4 text-white shadow-lg shadow-blue-500/20">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-blue-100">
                                        Used storage
                                    </p>
                                    <p className="mt-1 text-3xl font-bold tracking-tight">
                                        72.4{' '}
                                        <span className="text-base font-medium text-blue-100">
                                            GB
                                        </span>
                                    </p>
                                </div>
                                <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
                                    72% used
                                </span>
                            </div>
                            <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-white/25">
                                <span className="w-[28%] bg-white" />
                                <span className="w-[32%] bg-[#b9d4ff]" />
                                <span className="w-[12%] bg-[#77aafc]" />
                            </div>
                            <p className="mt-2 text-xs text-blue-100">
                                27.6 GB available of 100 GB
                            </p>
                        </div>
                        {[
                            ['Documents', '28.4 GB', 'bg-[#0061ff]'],
                            ['Images & video', '32.1 GB', 'bg-[#8b5cf6]'],
                            ['Other files', '11.9 GB', 'bg-[#14b87a]'],
                        ].map(([type, amount, tone]) => (
                            <div key={type} className="mt-3 flex items-center gap-3">
                                <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
                                <div className="flex flex-1 justify-between text-sm text-slate-600">
                                    <span>{type}</span>
                                    <span className="font-mono text-xs text-slate-500">
                                        {amount}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </article>
                    <article className="rounded-[32px] border border-white/80 bg-white/60 p-6 shadow-sm">
                        <h2 className="mb-6 text-xl font-bold tracking-tight">Recent activity</h2>
                        <div className="space-y-5 border-l-2 border-slate-200 pl-5">
                            {[
                                [
                                    '10:42 AM',
                                    'You uploaded ',
                                    '8 files',
                                    ' to “Project Atlas”',
                                    'bg-[#0061ff]',
                                ],
                                [
                                    'Yesterday',
                                    '',
                                    'Sarah',
                                    ' invited you to a shared folder',
                                    'bg-[#712ae2]',
                                ],
                                ['Oct 24', 'Storage limit alert: ', '72% used', '', 'bg-[#006443]'],
                            ].map(([time, before, bold, after, tone]) => (
                                <div key={time} className="relative">
                                    <span
                                        className={`absolute -left-[30px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-white ${tone}`}
                                    />
                                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        {time}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {before}
                                        <strong className="text-slate-800">{bold}</strong>
                                        {after}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
}
