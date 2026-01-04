import { Star } from "lucide-react";

export function GithubStar() {
    return (
        <a
            href="https://github.com/SystemVll/readme-animated-sweetbanner"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 dark:bg-zinc-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group border border-zinc-700"
        >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 group-hover:animate-pulse" />
            <span className="text-sm font-medium">Star on GitHub</span>
        </a>
    );
}

