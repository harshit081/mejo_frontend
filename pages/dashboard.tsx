import { useState, useEffect } from "react";
import withAuth from "./utils/withAuth";
import { DashboardNav } from "./components/DashboardNav";
import { JournalForm } from "./components/journal/JournalForm";
import { JournalEntriesList } from "./components/journal/JournalEntriesList";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from 'js-cookie';
import { generateTitle } from "@/services/gemini";

interface JournalEntry {
    _id: string;
    content: string;
    title: string;
    createdAt: string;
    tags?: string[]; // Optional tags property
}

const Dashboard = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isWriting, setIsWriting] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
    const [isSavingTitle, setIsSavingTitle] = useState(false);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/usertext", {
                headers: {
                    "Authorization": `Bearer ${Cookies.get("token")}`
                }
            });
            if (!response.ok) throw new Error("Failed to fetch entries");
            const data = await response.json();
            setEntries(data);
        } catch (error) {
            console.error("Error fetching entries:", error);
        }
    };

    const handleEntryClick = (entry: JournalEntry) => {
        setSelectedEntry(entry);
        setIsWriting(false);
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
            
            // Update both states atomically
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
        // Check if the related target is one of our title editing buttons
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

    return (
        <div className="min-h-screen bg-healing-50">
            <DashboardNav />
            <div className="flex h-[calc(100vh-64px)]">
                {/* Left Sidebar */}
                <div className="w-[35%] border-r border-gray-200 p-6 overflow-y-auto">
                    <div className="space-y-6">
                        {/* Write Journal Button */}
                        <motion.div
                            className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                            whileHover={{ scale: 1.02 }}
                            onClick={() => {
                                setIsWriting(true);
                                setSelectedEntry(null);
                            }}
                        >
                            <div className="flex items-center gap-4 text-gray-600">
                                <span className="text-2xl">✍️</span>
                                <p className="text-lg">What's on your mind today?</p>
                            </div>
                        </motion.div>

                        {/* Past Entries List */}
                        <JournalEntriesList 
                            entries={entries} 
                            onEntryClick={handleEntryClick}
                            selectedEntryId={selectedEntry?._id}
                        />
                    </div>
                </div>

                {/* Right Content Area */}
                <AnimatePresence mode="wait">
                    {isWriting ? (
                        <motion.div 
                            className="flex-1 p-6 bg-healing-50/50"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <JournalForm 
                                onEntryAdded={() => {
                                    fetchEntries();
                                    setIsWriting(false);
                                }}
                                onCancel={() => setIsWriting(false)}
                            />
                        </motion.div>
                    ) : selectedEntry ? (
                        <motion.div 
                            className="flex-1 p-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <div className="mb-6 flex justify-between items-center">
                                    {isEditingTitle ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={editedTitle}
                                                onChange={(e) => setEditedTitle(e.target.value)}
                                                className="text-2xl font-bold text-healing-600 px-2 py-1 border-b-2 border-healing-300 focus:outline-none font-['Mansalva']"
                                                autoFocus
                                                onBlur={handleTitleBlur}
                                                onKeyPress={(e) => e.key === 'Enter' && handleTitleEdit()}
                                            />
                                            <motion.button
                                                type="button"
                                                data-title-edit="generate"
                                                onClick={handleGenerateTitle}
                                                disabled={isGeneratingTitle || isSavingTitle}
                                                className={`p-2 ${
                                                    isGeneratingTitle || isSavingTitle
                                                        ? 'text-gray-300' 
                                                        : 'text-gray-400 hover:text-healing-600'
                                                } transition-colors`}
                                                whileHover={isGeneratingTitle || isSavingTitle ? {} : { scale: 1.1 }}
                                                title="Generate title from content"
                                            >
                                                {isGeneratingTitle ? '⏳' : '✨'}
                                            </motion.button>
                                            <motion.button
                                                type="button"
                                                data-title-edit="save"
                                                onClick={handleTitleEdit}
                                                disabled={isSavingTitle}
                                                className="p-2 text-gray-400 hover:text-healing-600 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                ✓
                                            </motion.button>
                                            <motion.button
                                                type="button"
                                                data-title-edit="cancel"
                                                onClick={() => setIsEditingTitle(false)}
                                                className="p-2 text-gray-400 hover:text-healing-600 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                ✕
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-2xl font-bold text-healing-600 font-['Mansalva']">
                                                {selectedEntry.title}
                                            </h2>
                                            <button
                                                onClick={() => {
                                                    setEditedTitle(selectedEntry.title);
                                                    setIsEditingTitle(true);
                                                }}
                                                className="p-1 text-gray-300 hover:text-gray-600 opacity-20 hover:opacity-100 transition-all duration-200"
                                            >
                                                ✏️
                                            </button>
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-500 font-['Mansalva']">
                                        {new Date(selectedEntry.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div className="min-h-[500px]">
                                    <p className="text-gray-600 whitespace-pre-wrap font-['Mansalva'] text-lg" 
                                       style={{ lineHeight: '1.8' }}>
                                        {selectedEntry.content}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            className="flex-1 p-6 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="text-center text-gray-500">
                                <span className="text-4xl mb-4 block">📝</span>
                                <p className="text-xl">Select an entry or start writing</p>
                                <p className="text-sm mt-2">Your thoughts matter</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default withAuth(Dashboard);
