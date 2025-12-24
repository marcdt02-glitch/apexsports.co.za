import React from 'react';

const Loading: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-bold text-white animate-pulse">{message}</h2>
        </div>
    );
};

export default Loading;
