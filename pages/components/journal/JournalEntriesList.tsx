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

export const JournalEntriesList = ({ 
  entries, 
  onEntryClick, 
  selectedEntryId 
}: JournalEntriesListProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">Your Entries</h3>
      {entries.length === 0 ? (
        <div className="text-center py-4 bg-white dark:bg-gray-700 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-300">No entries yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[calc(100vh-260px)] overflow-y-auto pr-2">
          {entries.map((entry) => (
            <div
              key={entry._id}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedEntryId === entry._id
                  ? "bg-healing-100 dark:bg-gray-600 shadow-md border-l-4 border-healing-500 dark:border-healing-300"
                  : "bg-white dark:bg-gray-700 hover:shadow-md border-l-4 border-transparent hover:border-healing-300 dark:hover:border-healing-400"
              }`}
              onClick={() => onEntryClick(entry)}
            >
              <h4 className="font-['Mansalva'] font-medium text-gray-800 dark:text-gray-100 mb-2">
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
      )}
    </div>
  );
};
