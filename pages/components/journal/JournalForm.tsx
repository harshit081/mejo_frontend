import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { generateTitle } from "../../../services/gemini";
import Cookies from 'js-cookie';
import { DEFAULT_MOOD, MOOD_OPTIONS, MoodValue } from "@/lib/mood";

interface JournalFormProps {
    onEntryAdded: () => void;
    onCancel: () => void;
    initialEntry?: {
        _id: string;
        content: string;
        title: string;
        tags?: string[];
        mood?: MoodValue;
    };
    isEditing?: boolean;
}

export const JournalForm: React.FC<JournalFormProps> = ({ 
    onEntryAdded, 
    onCancel, 
    initialEntry = null, 
    isEditing = false 
}) => {
    const [journalText, setJournalText] = useState("");
    const [journalTitle, setJournalTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedMood, setSelectedMood] = useState(DEFAULT_MOOD);
    
    // Set initial content if editing
    useEffect(() => {
        if (initialEntry) {
            setJournalText(initialEntry.content);
            setJournalTitle(initialEntry.title);
            setSelectedMood(initialEntry.mood || DEFAULT_MOOD);
        } else {
            setJournalText("");
            setJournalTitle("");
            setSelectedMood(DEFAULT_MOOD);
        }
    }, [initialEntry]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const resolvedTitle = await generateTitle(journalText, journalTitle);

            if (isEditing && initialEntry) {
                // Update existing entry
                const response = await fetch(`http://localhost:5000/api/usertext/${initialEntry._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${Cookies.get("token")}`
                    },
                    body: JSON.stringify({
                        content: journalText,
                        title: resolvedTitle,
                        tags: initialEntry.tags || ["journal"],
                        mood: selectedMood
                    })
                });

                if (!response.ok) throw new Error("Failed to update journal");
            } else {
                // Create new entry
                const response = await fetch("http://localhost:5000/api/usertext", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${Cookies.get("token")}`
                    },
                    body: JSON.stringify({
                        content: journalText,
                        title: resolvedTitle,
                        tags: ["journal"],
                        mood: selectedMood
                    })
                });

                if (!response.ok) throw new Error("Failed to save journal");
            }
            
            setJournalText("");
            setJournalTitle("");
            onEntryAdded();
        } catch (error) {
            console.error("Error with journal entry:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto h-auto">
            <div className="bg-transparent p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-healing-600 dark:text-healing-fg">
                        {isEditing ? "Edit Your Journal" : "Write Your Journal"}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
                    >
                        <span className="text-2xl">×</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        value={journalTitle}
                        onChange={(e) => setJournalTitle(e.target.value)}
                        placeholder="Add a title (optional)"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                        focus:ring-2 focus:ring-healing-300 focus:border-healing-500"
                        disabled={loading}
                    />
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                            How are you feeling?
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {MOOD_OPTIONS.map((option) => {
                                const isActive = selectedMood === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={`flex flex-col items-center justify-center rounded-xl border px-3 py-3 text-sm font-medium transition-all duration-150 hover:scale-[1.02] ${option.accent} ${isActive ? 'ring-2 ring-offset-2 ring-healing-400 dark:ring-offset-gray-800' : 'opacity-80'}`}
                                        onClick={() => setSelectedMood(option.value)}
                                        aria-pressed={isActive}
                                    >
                                        <span className="text-2xl mb-1">{option.emoji}</span>
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <textarea
                        value={journalText}
                        onChange={(e) => setJournalText(e.target.value)}
                        placeholder="What's on your mind today?"
                        rows={12}
                        className="w-full h-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 
                        bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
                        focus:ring-2 focus:ring-healing-300 focus:border-healing-500"
                        disabled={loading}
                        required
                    />
                    <div className="flex gap-4">
                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-healing-500 text-white rounded-lg font-medium hover:bg-healing-600 transition-colors disabled:bg-gray-400"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? "Saving..." : isEditing ? "Update Entry" : "Save Entry"}
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancel
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};