import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import InventoryChatbot from './InventoryChatbot';

export default function InventoryLayout({ children }) {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(
        window.innerWidth >= 768
    );

    useEffect(() => {
        const handleResize = () => {
            setIsSidebarExpanded(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarExpanded((prev) => !prev);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#0a0f1a]">
            <Sidebar
                isExpanded={isSidebarExpanded}
                toggleSidebar={toggleSidebar}
            />
            <main
                className={`flex-1 flex flex-col min-h-screen overflow-x-hidden p-6 bg-[#f8f7fc] dark:bg-[#0f0b1f] transition-all duration-300 ease-in-out ${
                    !isSidebarExpanded
                        ? 'ml-0 w-full md:ml-[72px] md:w-[calc(100%-72px)]'
                        : 'ml-[72px] w-[calc(100%-72px)] md:ml-[250px] md:w-[calc(100%-250px)]'
                }`}
            >
                {children}
            </main>
            <InventoryChatbot />
        </div>
    );
}
