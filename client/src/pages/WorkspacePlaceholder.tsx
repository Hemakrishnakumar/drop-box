import { Link } from 'react-router-dom';
import { Cloud } from 'lucide-react';



interface WorkspacePlaceholderProps {
    title: string;
    description: string;
}

export default function WorkspacePlaceholder({ title, description }: WorkspacePlaceholderProps) {
    return (
        <main className="grid min-h-screen place-items-center px-6 pb-6 pt-20 text-[#0b1c30] lg:pb-8 lg:pt-28">
            <section className="w-full max-w-lg rounded-[32px] border border-white bg-white/80 p-8 text-center shadow-[0_16px_45px_rgba(43,85,155,0.12)]">
                <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-[#0052dc]">
                    <Cloud className="h-7 w-7" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0061ff]">
                    Nexus Cloud
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
                <p className="mt-3 text-slate-600">{description}</p>
                <Link
                    to="/"
                    className="mt-6 inline-flex rounded-xl bg-[#004bca] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-[#003ea8]"
                >
                    Back to dashboard
                </Link>
            </section>
        </main>
    );
}
