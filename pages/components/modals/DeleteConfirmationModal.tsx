import { motion, AnimatePresence } from "framer-motion";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  itemName = "journal entry"
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "linear" }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "linear" }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl transform-gpu"
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              transition={{ duration: 0.3, ease: "linear" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <span className="text-3xl text-red-500 dark:text-red-400">🗑️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
                Delete {itemName}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
                Are you sure you want to delete this {itemName}? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;