const TOAST_DURATION = 2000;
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export const Toast = ({ id, message, type, onClose }) => {
    const baseClasses = "flex items-center w-full max-w-xs p-4 my-2 text-gray-500 bg-white rounded-xl shadow-xl dark:text-gray-400 dark:bg-gray-800 transition-all duration-300 transform border";
    let icon, colorClass, title, borderColor;

    switch (type) {
        case 'success':
            icon = <CheckCircle className="w-5 h-5" />;
            colorClass = "text-green-500";
            title = "Success";
            borderColor = "border-green-300";
            break;
        case 'error':
            icon = <XCircle className="w-5 h-5" />;
            colorClass = "text-red-500";
            title = "Error";
            borderColor = "border-red-300";
            break;
        case 'warning':
        default:
            icon = <AlertTriangle className="w-5 h-5" />;
            colorClass = "text-yellow-500";
            title = "Warning";
            borderColor = "border-yellow-300";
            break;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, TOAST_DURATION);

        return () => clearTimeout(timer);
    }, [id, onClose]);

    return (
        <div className={`${baseClasses} ${borderColor} ${colorClass} translate-x-0 opacity-100`} role="alert">
            <div className={`inline-flex flex-shrink-0 justify-center items-center w-8 h-8 rounded-full ${colorClass} bg-opacity-10 mr-3`}>
                {icon}
            </div>
            <div className="text-sm font-normal flex-grow">
                <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
                <p className="text-gray-700 dark:text-gray-300">{message}</p>
            </div>
            <button
                type="button"
                className={`ml-4 -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700`}
                onClick={() => onClose(id)}
                aria-label="Close"
            >
                <span className="sr-only">Close</span>
                <XCircle className="w-5 h-5" />
            </button>
        </div>
    );
};

export const ToastContainer = ({ toasts, onClose }) => {
    return (
        <div className="fixed top-4 right-4 z-50 pointer-events-none">
            {toasts.map(toast => (
                // Add pointer-events-auto back to the individual toast for clicking the close button
                <div key={toast.id} className="pointer-events-auto">
                    <Toast {...toast} onClose={onClose} />
                </div>
            ))}
        </div>
    );
};
