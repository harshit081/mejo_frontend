import { motion } from "framer-motion";
import { useState } from "react";
import { generateTitle } from "../../../services/gemini";
import Cookies from 'js-cookie';

interface JournalFormProps {
    onEntryAdded: () => void;
    onCancel: () => void;
}

export const JournalForm: React.FC<JournalFormProps> = ({ onEntryAdded, onCancel }) => {
    const [journalText, setJournalText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Generate title first
            const generatedTitle = await generateTitle(journalText);
            
            // Save entry with generated title
            const response = await fetch("http://localhost:5000/api/usertext", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("token")}`
                },
                body: JSON.stringify({
                    content: journalText,
                    title: generatedTitle,
                    tags: ["journal"]
                })
            });

            if (!response.ok) throw new Error("Failed to save journal");
            
            setJournalText("");
            onEntryAdded();
        } catch (error) {
            console.error("Error saving journal:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-healing-600">Write Your Journal</h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <span className="text-2xl">×</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <textarea
                        value={journalText}
                        onChange={(e) => setJournalText(e.target.value)}
                        placeholder="What's on your mind today?"
                        rows={12}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-healing-300 focus:border-healing-500"
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
                            {loading ? "Saving..." : "Save Entry"}
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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