import React from 'react';

export default function ModuleCard({ module, onClick }) {
    return (
        <div className="module-card group" onClick={onClick}>
            <h3 className="module-title group-hover:text-blue-400 transition-colors">{module.title}</h3>
            <p className="module-desc">{module.shortDesc}</p>
            <div className="mt-4 text-blue-500 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <span>Learn more</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    );
}
