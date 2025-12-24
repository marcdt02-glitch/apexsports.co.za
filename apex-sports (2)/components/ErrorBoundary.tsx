import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-red-900/20 border border-red-900/50 p-6 rounded-3xl max-w-md">
                        <div className="flex justify-center mb-4">
                            <div className="bg-red-900/30 p-3 rounded-full">
                                <AlertTriangle className="w-10 h-10 text-red-500" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">Something went wrong.</h2>
                        <p className="text-gray-400 mb-6 text-sm">
                            We encountered an unexpected error while loading the dashboard.
                        </p>
                        <div className="bg-black/50 p-4 rounded-xl text-left mb-6 overflow-auto max-h-32">
                            <code className="text-xs text-red-300 font-mono">
                                {this.state.error?.message}
                            </code>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
