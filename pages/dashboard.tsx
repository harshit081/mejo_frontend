import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import withAuth from "./utils/withAuth";
import { DashboardNav } from "./components/DashboardNav";
import { JournalForm } from "./components/journal/JournalForm";
import { JournalEntriesList } from "./components/journal/JournalEntriesList";
import MoodHeatmap from "./components/journal/MoodHeatmap";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from 'js-cookie';
import { generateTitle } from "@/services/gemini";
import { fetchWithAuth } from '../lib/apiClient';
import DeleteConfirmationModal from './components/modals/DeleteConfirmationModal';
import { DEFAULT_MOOD, MOOD_LOOKUP, MoodOption, MoodValue } from "@/lib/mood";
import { formatDistanceToNow } from "date-fns";
import { summarizeDailyMoods } from "@/lib/journalStats";

interface JournalEntry {
    _id: string;
    content: string;
    title: string;
    createdAt: string;
    tags?: string[];
    mood?: MoodValue;
}

type MoodStat = MoodOption & { count: number };

const countWords = (text: string) => {
    const normalized = text.trim();
    if (!normalized) return 0;
    return normalized.split(/\s+/).length;
};

const calculateWritingStreak = (entries: JournalEntry[]) => {
    if (!entries.length) return 0;

    const uniqueDays = new Set(
        entries.map(entry => new Date(entry.createdAt).toDateString())
    );

    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    while (uniqueDays.has(cursor.toDateString())) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
};

const getMoodMeta = (mood?: MoodValue) => MOOD_LOOKUP[mood ?? DEFAULT_MOOD];

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
    const [isSavingTitle, setIsSavingTitle] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isContentEditing, setIsContentEditing] = useState(false);
    const [editedContent, setEditedContent] = useState("");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [groupedEntries, setGroupedEntries] = useState<any>({});
    const [menuOpenEntryId, setMenuOpenEntryId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
    const selectedMoodMeta = selectedEntry ? getMoodMeta(selectedEntry.mood) : null;
    const selectedEntryWordCount = selectedEntry ? countWords(selectedEntry.content) : 0;
    const selectedEntryReadMinutes = selectedEntryWordCount ? Math.max(1, Math.round(selectedEntryWordCount / 180)) : 0;
    const selectedEntryRelativeTime = selectedEntry
        ? formatDistanceToNow(new Date(selectedEntry.createdAt), { addSuffix: true })
        : "";
    const insightPillClass = "inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border border-gray-200 dark:border-gray-600";

    const entryStats = useMemo(() => {
        if (!entries.length) {
            return {
                writingStreak: 0,
                entriesThisWeek: 0,
                avgWords: 0,
                totalWords: 0,
                lastEntryDistance: "Start your first entry",
                topMoods: [] as MoodStat[]
            };
        }

        const now = new Date();
        const totalWords = entries.reduce((sum, entry) => sum + countWords(entry.content), 0);
        const entriesThisWeek = entries.filter(entry => {
            const diffMs = now.getTime() - new Date(entry.createdAt).getTime();
            return diffMs <= 6 * 24 * 60 * 60 * 1000;
        }).length;
        const writingStreak = calculateWritingStreak(entries);
        const avgWords = Math.round(totalWords / entries.length);

        const moodCounts = entries.reduce((acc, entry) => {
            const key = entry.mood ?? DEFAULT_MOOD;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as Record<MoodValue, number>);

        const topMoods: MoodStat[] = Object.entries(moodCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([key, count]) => ({
                ...MOOD_LOOKUP[key as MoodValue],
                count
            }));

        const newestEntry = entries.reduce((latest, entry) => {
            return new Date(entry.createdAt) > new Date(latest.createdAt) ? entry : latest;
        }, entries[0]);

        const lastEntryDistance = formatDistanceToNow(new Date(newestEntry.createdAt), { addSuffix: true });

        return {
            writingStreak,
            entriesThisWeek,
            avgWords,
            totalWords,
            lastEntryDistance,
            topMoods
        };
    }, [entries]);

    const dailyMoodSummary = useMemo(() => summarizeDailyMoods(entries), [entries]);

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
        if (selectedEntry?._id === entry._id) {
            setSelectedEntry(null);
        } else {
            setSelectedEntry(entry);
        }
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
            const updatedTitle = await generateTitle(selectedEntry.content, editedTitle);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usertext/${selectedEntry._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify({
                    title: updatedTitle,
                    content: selectedEntry.content,
                    tags: selectedEntry.tags || [],
                    mood: selectedEntry.mood || DEFAULT_MOOD
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
            
            setEditedTitle(updatedTitle);
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
                    tags: selectedEntry.tags || [],
                    mood: selectedEntry.mood || DEFAULT_MOOD
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

    const handleDeleteJournal = (entryId: string) => {
        setEntryToDelete(entryId);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!entryToDelete) return;
        
        try {
            const response = await fetch(`http://localhost:5000/api/usertext/${entryToDelete}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete journal entry");
            }
            
            // Remove from state
            setEntries(prevEntries => prevEntries.filter(entry => entry._id !== entryToDelete));
            
            // If the deleted entry was selected, clear selection
            if (selectedEntry?._id === entryToDelete) {
                setSelectedEntry(null);
            }
            
            // Close the menu and modal
            setMenuOpenEntryId(null);
            setIsDeleteModalOpen(false);
            setEntryToDelete(null);
        } catch (error) {
            console.error("Error deleting journal entry:", error);
            alert("Failed to delete journal entry. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-healing-50 dark:bg-gray-900">
            <DashboardNav />
            <div className="flex min-h-[calc(100vh-64px)] pt-16 relative">
                <button 
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className={`fixed z-40 p-1 rounded-r-lg bg-transparent text-healing-700 dark:text-healing-50
                        ${isSidebarCollapsed ? 'left-4 top-28 text-2xl' : 'top-28 sm:left-[100px] md:left-[28.5%] text-xl hover:bg-healing-bg'} animate-standard`}
                    aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isSidebarCollapsed ? '☰' : '<'}
                </button>
                
                <motion.div 
                    className={`fixed left-0 top-16 bottom-0 border-r border-gray-200 dark:border-gray-700 p-6 
                        overflow-y-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-30 
                        ${isSidebarCollapsed ? 'w-0 p-0 opacity-0' : 'w-[30%] sm:w-[300px] opacity-100'}`}
                    initial={false}
                    animate={{ 
                        width: isSidebarCollapsed ? 0 : '30%',
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
                            className="bg-healing-50 mt-2 dark:bg-gray-700 border border-healing-100 dark:border-gray-600 rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transform-gpu"
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
                                                className={`p-4 rounded-lg cursor-pointer transition-all duration-200 relative ${
                                                    selectedEntry?._id === entry._id
                                                    ? "bg-healing-100 dark:bg-gray-600 shadow-md border-l-4 border-healing-500 dark:border-healing-300"
                                                    : "bg-white dark:bg-gray-700 hover:shadow-md border-l-4 border-transparent hover:border-healing-300 dark:hover:border-healing-400"
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    {/* Content area - takes most space but allows clicking */}
                                                    <div 
                                                        className="flex-1 pr-8" 
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
                                                    </div>
                                                    
                                                    {/* Three-dot menu button */}
                                                    <div className="relative">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent triggering the parent's onClick
                                                                setMenuOpenEntryId(menuOpenEntryId === entry._id ? null : entry._id);
                                                            }}
                                                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                            aria-label="Journal options"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                            </svg>
                                                        </button>
                                                        
                                                        {/* Dropdown menu */}
                                                        {menuOpenEntryId === entry._id && (
                                                            <div className="absolute right-0 mt-1 py-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteJournal(entry._id);
                                                                    }}
                                                                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
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
                      marginLeft: isSidebarCollapsed ? 'auto' : '30%',
                      marginRight: isSidebarCollapsed ? 'auto' : '0',
                      width: isSidebarCollapsed ? 'clamp(300px, 95%, 1200px)' : 'auto'
                    }}
                    transition={{
                        duration: 0.3,
                        ease: "linear"
                    }}
                >
                    {!isWriting && !selectedEntry && (
                        <>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
                            <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-5 border border-white/40 dark:border-gray-700 shadow-sm">
                                <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Writing streak</p>
                                <p className="text-3xl font-bold text-healing-600 dark:text-healing-200">
                                    {entryStats.writingStreak} <span className="text-base font-medium text-gray-500 dark:text-gray-400">days</span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Last entry {entryStats.lastEntryDistance}</p>
                            </div>
                            <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-5 border border-white/40 dark:border-gray-700 shadow-sm">
                                <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">This week</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold text-healing-600 dark:text-healing-200">{entryStats.entriesThisWeek}</p>
                                    <span className="text-base text-gray-500 dark:text-gray-400">entries</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Avg {entryStats.avgWords} words / entry</p>
                            </div>
                            <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-5 border border-white/40 dark:border-gray-700 shadow-sm">
                                <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Lifetime words</p>
                                <p className="text-3xl font-bold text-healing-600 dark:text-healing-200">
                                    {entryStats.totalWords.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Across {entries.length} entries</p>
                            </div>
                            <div className="bg-white/70 dark:bg-gray-800/70 rounded-2xl p-5 border border-white/40 dark:border-gray-700 shadow-sm md:col-span-2 xl:col-span-2">
                                <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Mood highlights</p>
                                {entryStats.topMoods.length === 0 ? (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Log a few entries to see your mood trends.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {entryStats.topMoods.map((mood) => {
                                            const percentage = entries.length ? Math.round((mood.count / entries.length) * 100) : 0;
                                            return (
                                                <div key={mood.value}>
                                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                                                        <span className="font-semibold">
                                                            {mood.emoji} {mood.label}
                                                        </span>
                                                        <span>{mood.count} · {percentage}%</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-healing-400"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mb-6">
                            <MoodHeatmap summary={dailyMoodSummary} />
                        </div>
                        </>
                    )}
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
                                className="flex-1 transform-gpu"
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
                                                <button
                                                    onClick={() => setSelectedEntry(null)}
                                                    className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 ml-4"
                                                    title="Close entry view"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {selectedMoodMeta && (
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            <span className={`${selectedMoodMeta.badge} ${insightPillClass}`}>
                                                {selectedMoodMeta.emoji} {selectedMoodMeta.label}
                                            </span>
                                            <span className={`${insightPillClass} bg-white/80 dark:bg-gray-700/70 text-gray-700 dark:text-gray-200`}>
                                                📝 {selectedEntryWordCount} words
                                            </span>
                                            <span className={`${insightPillClass} bg-white/80 dark:bg-gray-700/70 text-gray-700 dark:text-gray-200`}>
                                                ⏱️ {selectedEntryReadMinutes} min read
                                            </span>
                                            <span className={`${insightPillClass} bg-white/80 dark:bg-gray-700/70 text-gray-700 dark:text-gray-200`}>
                                                ⏳ Logged {selectedEntryRelativeTime}
                                            </span>
                                        </div>
                                    )}
                                    <div className="min-h-[60vh] lg:min-h-[65vh]">
                                      {isContentEditing ? (
                                        <div className="space-y-4">
                                          <textarea
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            className="w-full min-h-[58vh] lg:min-h-[60vh] p-6 rounded-lg border border-gray-200 dark:border-gray-600 
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
                                className="flex-1 flex items-center justify-center h-[calc(50vh-120px)]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "linear"
                                }}
                            >
                                {/* <div className="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-lg" onClick={() => setIsWriting(true)}>
                                    <span className="text-5xl mb-6 block">📝</span>
                                    <p className="text-xl font-medium text-gray-700 dark:text-gray-200">Select an entry or start writing</p>
                                    <p className="text-sm mt-3 text-gray-500 dark:text-gray-400">Your thoughts matter</p>
                                </div> */}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setEntryToDelete(null);
                }}
                onConfirm={confirmDelete}
                itemName="journal entry"
            />
        </div>
    );
};

export default withAuth(Dashboard);
