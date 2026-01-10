import { Film } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="relative">
                {/* Pulsing Background */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />

                {/* Icon with animation */}
                <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-primary-dark 
                    rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/50
                    animate-bounce">
                    <Film size={40} className="text-white" />
                </div>
            </div>

            <p className="mt-8 text-gray-400 text-lg font-medium animate-pulse">
                Loading dramas...
            </p>

            {/* Loading dots */}
            <div className="flex gap-2 mt-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
}
