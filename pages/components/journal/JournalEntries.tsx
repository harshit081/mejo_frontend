import { motion } from "framer-motion";
import { format } from "date-fns";

interface JournalEntry {
    id: string;
    content: string;
    title: string;
    createdAt: string;
}

interface JournalEntriesProps {
    entries: JournalEntry[];
}

export const JournalEntries: React.FC<JournalEntriesProps> = ({ entries }) => {
    return (
        <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className="text-2xl font-bold text-healing-600 mb-6 font-['Mansalva']">Past Entries</h2>
            <div className="space-y-4">
                {entries.length === 0 ? (
                    <p className="text-gray-500 text-center py-8 font-['Mansalva']">
                        No journal entries yet. Start writing to see them here!
                    </p>
                ) : (
                    entries.map((entry) => (
                        <JournalEntry key={entry.id} entry={entry} />
                    ))
                )}
            </div>
        </motion.div>
    );
};

const JournalEntry: React.FC<{ entry: JournalEntry }> = ({ entry }) => {
    return (
        <motion.div
            className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
            whileHover={{ x: 4, scale: 1.01 }}
        >
            <div className="space-y-3">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-healing-600 font-['Mansalva']">
                        {entry.title}
                    </h3>
                    <span className="text-sm text-gray-500 font-['Mansalva']">
                        {format(new Date(entry.createdAt), "MMM d, h:mm a")}
                    </span>
                </div>
                <p className="text-gray-600 line-clamp-2 font-['Mansalva']">
                    {entry.content}
                </p>
            </div>
        </motion.div>
    );
};