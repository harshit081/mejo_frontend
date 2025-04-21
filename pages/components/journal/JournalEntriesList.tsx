import { motion } from "framer-motion";
import { format } from "date-fns";

interface JournalEntry {
    _id: string;
    content: string;
    title: string;
    createdAt: string;
    tags?: string[];
}

interface JournalEntriesListProps {
    entries: JournalEntry[];
    onEntryClick: (entry: JournalEntry) => void;
    selectedEntryId?: string;
}

export const JournalEntriesList: React.FC<JournalEntriesListProps> = ({
    entries,
    onEntryClick,
    selectedEntryId
}) => {
    return (
        <div className="space-y-2 p-2"> {/* Changed from space-y-4 to space-y-2 */}
            {entries && entries.length > 0 ? (
                entries.map((entry) => (
                    <motion.div
                        key={entry._id}
                        className={`p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer
                            ${selectedEntryId === entry._id ? 'border border-healing-500 bg-healing-50/30' : ''}`}
                        whileHover={{ x: 4, scale: 1.01 }}
                        onClick={() => onEntryClick(entry)}
                    >
                        <div className="space-y-1"> {/* Changed from space-y-3 to space-y-1 */}
                            <div className="flex justify-between items-start">
                                <h3 className="text-base font-medium text-healing-600 font-['Mansalva'] line-clamp-1"> {/* Changed from text-lg to text-base */}
                                    {entry.title || 'Untitled Entry'}
                                </h3>
                                <span className="text-xs text-gray-500 font-['Mansalva'] ml-2 shrink-0"> {/* Changed from text-sm to text-xs */}
                                    {format(new Date(entry.createdAt), "MMM d, h:mm a")}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-1 font-['Mansalva']"> {/* Changed from text-sm and line-clamp-2 to text-xs and line-clamp-1 */}
                                {entry.content}
                            </p>
                        </div>
                    </motion.div>
                ))
            ) : (
                <div className="text-center text-gray-500 py-6 font-['Mansalva']"> {/* Changed py-8 to py-6 */}
                    No journal entries yet
                </div>
            )}
        </div>
    );
};
