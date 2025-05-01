import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import withAuth from "./utils/withAuth";
import { DashboardNav } from "./components/DashboardNav";
import { JournalForm } from "./components/journal/JournalForm";
import { JournalEntriesList } from "./components/journal/JournalEntriesList";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from 'js-cookie';
import { generateTitle } from "@/services/gemini";
import { fetchWithAuth } from '../lib/apiClient';

interface JournalEntry {
    _id: string;
    content: string;
    title: string;
    createdAt: string;
    tags?: string[];
}

// Helper function to group entries by time period
const groupEntriesByTimePeriod = (entries: JournalEntry[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);
    
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    return entries.reduce((groups, entry) => {
        const entryDate = new Date(entry.createdAt);
        
        if (entryDate >= today) {
            groups.today.push(entry);
        } else if (entryDate >= yesterday) {
            groups.yesterday.push(entry);
        } else if (entryDate >= thisWeekStart) {
            groups.thisWeek.push(entry);
        } else if (entryDate >= lastWeekStart) {
            groups.lastWeek.push(entry);
        } else if (entryDate >= thisMonthStart) {
            groups.thisMonth.push(entry);
        } else if (entryDate >= lastMonthStart) {
            groups.lastMonth.push(entry);
        } else {
            groups.older.push(entry);
        }
        
        return groups;
    }, {
        today: [] as JournalEntry[],
        yesterday: [] as JournalEntry[],
        thisWeek: [] as JournalEntry[],
        lastWeek: [] as JournalEntry[],
        thisMonth: [] as JournalEntry[],
        lastMonth: [] as JournalEntry[],
        older: [] as JournalEntry[]
    });
};

const Dashboard = () => {
    const router = useRouter();
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isWriting, setIsWriting] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
    const [isSavingTitle, setIsSavingTitle] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isContentEditing, setIsContentEditing] = useState(false);
    const [editedContent, setEditedContent] = useState("");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [groupedEntries, setGroupedEntries] = useState<any>({});

    // Add media query effect to collapse sidebar on small screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarCollapsed(true);
            }
        };
        
        // Initial check
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Group entries whenever they change
    useEffect(() => {
        setGroupedEntries(groupEntriesByTimePeriod(entries));
    }, [entries]);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const response = await fetchWithAuth(
                "http://localhost:5000/api/usertext",
                {},
                router
            );
            if (!response.ok) throw new Error("Failed to fetch entries");
            const data = await response.json();
            setEntries(data);
        } catch (error) {
            console.error("Error fetching entries:", error);
            if (error instanceof Error && error.message === 'Session expired') {
                return;
            }
        }
    };

    const handleEntryClick = (entry: JournalEntry) => {
        setSelectedEntry(entry);
        setIsWriting(false);
    };

    const handleEditClick = () => {
        if (!selectedEntry) return;
        setIsWriting(true);
        setIsEditing(true);
    };

    const handleTitleEdit = async () => {
        if (!selectedEntry) return;

        try {
            setIsSavingTitle(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usertext/${selectedEntry._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify({
                    title: editedTitle,
                    content: selectedEntry.content,
                    tags: selectedEntry.tags || []
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update title');
            }

            const updatedEntry = await response.json();
            
            setSelectedEntry(updatedEntry);
            setEntries(prevEntries => 
                prevEntries.map(entry => 
                    entry._id === selectedEntry._id ? updatedEntry : entry
                )
            );
            
            setIsEditingTitle(false);
        } catch (error) {
            console.error("Error updating title:", error);
            alert("Failed to update title. Please try again.");
        } finally {
            setIsSavingTitle(false);
        }
    };

    const handleTitleBlur = (event: React.FocusEvent) => {
        const relatedTarget = event.relatedTarget as HTMLElement;
        const isEditingButton = relatedTarget?.getAttribute('data-title-edit');
        
        if (!isEditingButton) {
            handleTitleEdit();
        }
    };

    const handleGenerateTitle = async () => {
        if (!selectedEntry) return;
        
        try {
            setIsGeneratingTitle(true);
            const generatedTitle = await generateTitle(selectedEntry.content);
            setEditedTitle(generatedTitle);
        } catch (error) {
            console.error('Error generating title:', error);
            alert('Failed to generate title. Please try again.');
        } finally {
            setIsGeneratingTitle(false);
        }
    };

    const handleContentEdit = async () => {
        if (!selectedEntry) return;
        
        try {
            const response = await fetch(`http://localhost:5000/api/usertext/${selectedEntry._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify({
                    title: selectedEntry.title,
                    content: editedContent,
                    tags: selectedEntry.tags || []
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update content");
            }

            const updatedEntry = await response.json();
            
            setSelectedEntry(updatedEntry);
            setEntries(prevEntries => 
                prevEntries.map(entry => 
                    entry._id === selectedEntry._id ? updatedEntry : entry
                )
            );
            
            setIsContentEditing(false);
        } catch (error) {
            console.error("Error updating journal content:", error);
            alert("Failed to update journal. Please try again.");
        }
    };

    const startContentEditing = () => {
        if (!selectedEntry) return;
        setEditedContent(selectedEntry.content);
        setIsContentEditing(true);
    };

    return (
        <div className="min-h-screen bg-healing-50 dark:bg-gray-900">
            <DashboardNav />
            <div className="flex min-h-[calc(100vh-64px)] pt-16 relative">
                <button 
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className={`fixed z-40 p-1 rounded-r-lg bg-transparent text-healing-700 dark:text-healing-50
                        ${isSidebarCollapsed ? 'left-4 top-28 text-2xl' : 'top-28 sm:left-[100px] md:left-[33%] text-xl hover:bg-healing-bg'} animate-standard`}
                    aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isSidebarCollapsed ? '☰' : '<'}
                </button>
                
                <motion.div 
                    className={`fixed left-0 top-16 bottom-0 border-r border-gray-200 dark:border-gray-700 p-6 
                        overflow-y-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-30 
                        ${isSidebarCollapsed ? 'w-0 p-0 opacity-0' : 'w-[35%] sm:w-[300px] opacity-100'}`}
                    initial={false}
                    animate={{ 
                        width: isSidebarCollapsed ? 0 : '35%',
                        opacity: isSidebarCollapsed ? 0 : 1,
                        x: isSidebarCollapsed ? -300 : 0
                    }}
                    transition={{
                        duration: 0.3,
                        ease: "linear"
                    }}
                >
                    <div className="space-y-6">
                        <motion.div
                            className="bg-healing-50 mt-2 dark:bg-gray-700 border border-healing-100 dark:border-gray-600 rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg"
                            whileHover={{ 
                                scale: 1.02,
                                transition: { duration: 0.2, ease: "linear" }
                            }}
                            onClick={() => {
                                setIsWriting(true);
                                setSelectedEntry(null);
                                if (window.innerWidth < 768) {
                                    setIsSidebarCollapsed(true);
                                }
                            }}
                        >
                            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-100">
                                <span className="text-2xl">✍️</span>
                                <p className="text-lg font-medium">What's on your mind today?</p>
                            </div>
                        </motion.div>

                        {Object.entries(groupedEntries).map(([period, periodEntries]: [string, any]) => 
                            periodEntries.length > 0 && (
                                <div key={period} className="space-y-3">
                                    <h3 className="text-md font-medium text-gray-500 dark:text-gray-400 capitalize flex items-center">
                                        <span className="mr-2">
                                            {period === 'today' && '📅'}
                                            {period === 'yesterday' && '📆'}
                                            {period === 'thisWeek' && '🗓️'}
                                            {period === 'lastWeek' && '📊'}
                                            {period === 'thisMonth' && '📝'}
                                            {period === 'lastMonth' && '📚'}
                                            {period === 'older' && '🗄️'}
                                        </span>
                                        {period === 'thisWeek' ? 'This Week' : 
                                         period === 'lastWeek' ? 'Last Week' : 
                                         period === 'thisMonth' ? 'This Month' : 
                                         period === 'lastMonth' ? 'Last Month' : period}
                                    </h3>
                                    <div className="space-y-2">
                                        {periodEntries.map((entry: JournalEntry) => (
                                            <div
                                                key={entry._id}
                                                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                                                    selectedEntry?._id === entry._id
                                                    ? "bg-healing-100 dark:bg-gray-600 shadow-md border-l-4 border-healing-500 dark:border-healing-300"
                                                    : "bg-white dark:bg-gray-700 hover:shadow-md border-l-4 border-transparent hover:border-healing-300 dark:hover:border-healing-400"
                                                }`}
                                                onClick={() => {
                                                    handleEntryClick(entry);
                                                    if (window.innerWidth < 768) {
                                                        setIsSidebarCollapsed(true);
                                                    }
                                                }}
                                            >
                                                <h4 className="font-['Mansalva'] font-bold text-healing-600 dark:text-healing-200 mb-2">
                                                    {entry.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 font-['Mansalva']">
                                                    {entry.content}
                                                </p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(entry.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </motion.div>

                <motion.div 
                    className="flex-1 p-6 md:p-8 bg-healing-50/30 dark:bg-gray-900/90"
                    animate={{ 
                        marginLeft: isSidebarCollapsed ? '0' : '35%',
                    }}
                    transition={{
                        duration: 0.3,
                        ease: "linear"
                    }}
                >
                    <AnimatePresence mode="wait">
                        {isWriting ? (
                            <motion.div 
                                className="flex-1 flex justify-center items-center h-[calc(100vh-120px)]"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "linear"
                                }}
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-3xl">
                                    <JournalForm 
                                        onEntryAdded={() => {
                                            fetchEntries();
                                            setIsWriting(false);
                                            setIsEditing(false);
                                        }}
                                        onCancel={() => {
                                            setIsWriting(false);
                                            setIsEditing(false);
                                        }}
                                        initialEntry={isEditing ? selectedEntry || undefined : undefined}
                                        isEditing={isEditing}
                                    />
                                </div>
                            </motion.div>
                        ) : selectedEntry ? (
                            <motion.div 
                                className="flex-1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "linear"
                                }}
                            >
                                <div className={`bg-transparent dark:bg-gray-800 rounded-2xl p-8 lg:p-12 mt-3 max-w-6xl ${isSidebarCollapsed ? 'w-full mx-auto' : 'w-6xl'}`}>
                                    <div className="mb-6 flex justify-between items-center">
                                        {isEditingTitle ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={editedTitle}
                                                    onChange={(e) => setEditedTitle(e.target.value)}
                                                    className="text-2xl font-bold text-healing-600 dark:text-healing-fg px-2 py-1 border-b-2 border-healing-300 dark:border-healing-500 focus:outline-none font-['Mansalva'] bg-transparent"
                                                    autoFocus
                                                    onBlur={handleTitleBlur}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleTitleEdit()}
                                                />
                                                <button
                                                    onClick={handleGenerateTitle}
                                                    className="p-1 rounded-md bg-transparent text-healing-700 dark:text-healing-50 flex items-center gap-1 hover:bg-healing-200 dark:hover:bg-healing-900 transition-colors"
                                                    disabled={isGeneratingTitle}
                                                    data-title-edit="true"
                                                >
                                                    {isGeneratingTitle ? (
                                                        <div className="flex items-center">
                                                            <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span>✨</span> 
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={handleTitleEdit}
                                                    className="p-1 text-healing-600 dark:text-healing-fg hover:text-healing-800 dark:hover:text-healing-200 transition-colors dark:hover:bg-healing-900 hover:bg-healing-200"
                                                    data-title-edit="true"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditingTitle(false);
                                                        setEditedTitle(selectedEntry?.title || "");
                                                    }}
                                                    className="p-1 text-red-500 dark:text-red-300 hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
                                                    data-title-edit="true"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <h2 className="text-2xl font-bold text-healing-600 dark:text-healing-fg font-['Mansalva']">
                                                        {selectedEntry.title}
                                                    </h2>
                                                    <button
                                                        onClick={() => {
                                                            setEditedTitle(selectedEntry.title);
                                                            setIsEditingTitle(true);
                                                        }}
                                                        className="p-1 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white opacity-20 hover:opacity-100 transition-all duration-200"
                                                    >
                                                        ✏️
                                                    </button>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-['Mansalva']">
                                                        {new Date(selectedEntry.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-h-[60vh] lg:min-h-[65vh]">
                                      {isContentEditing ? (
                                        <div className="space-y-4">
                                          <textarea
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            className="w-full min-h-[60vh] lg:min-h-[65vh] p-6 rounded-lg border border-gray-200 dark:border-gray-600 
                                              bg-white/90 dark:bg-gray-700/90 text-gray-700 dark:text-gray-200 
                                              font-['Mansalva'] text-lg focus:outline-none focus:ring-2 focus:ring-healing-300"
                                            style={{ lineHeight: '1.8' }}
                                          />
                                          <div className="flex gap-3 justify-end mt-6">
                                            <button
                                              onClick={handleContentEdit}
                                              className="px-5 py-2 rounded-lg bg-healing-500 text-white hover:bg-healing-600 transition-colors"
                                            >
                                              Save Changes
                                            </button>
                                            <button
                                              onClick={() => setIsContentEditing(false)}
                                              className="px-5 py-2 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 
                                                hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="relative group px-4 lg:px-8">
                                          <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap font-['Mansalva'] text-lg" 
                                             style={{ lineHeight: '1.8' }}>
                                            {selectedEntry.content}
                                          </p>
                                          <button
                                            onClick={startContentEditing}
                                            className="absolute top-2 right-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded-full 
                                              opacity-0 group-hover:opacity-100 hover:bg-white dark:hover:bg-gray-700 animate-standard"
                                          >
                                            ✏️
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                className="flex-1 flex items-center justify-center h-[calc(100vh-120px)]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "linear"
                                }}
                            >
                                <div className="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-lg" onClick={() => setIsWriting(true)}>
                                    <span className="text-5xl mb-6 block">📝</span>
                                    <p className="text-xl font-medium text-gray-700 dark:text-gray-200">Select an entry or start writing</p>
                                    <p className="text-sm mt-3 text-gray-500 dark:text-gray-400">Your thoughts matter</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default withAuth(Dashboard);
