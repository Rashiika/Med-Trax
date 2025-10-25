import { CheckCircle, XCircle } from 'lucide-react';

export const PasswordRuleLine = ({ isValid, text }) => {
    const icon = isValid ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-500" />;
    const textColor = isValid ? "text-green-700" : "text-gray-500";
    
    return (
        <div className="flex items-center space-x-2">
            {icon}
            <span className={textColor}>{text}</span>
        </div>
    );
};