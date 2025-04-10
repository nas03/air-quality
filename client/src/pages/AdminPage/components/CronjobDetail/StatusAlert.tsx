import { FiAlertCircle, FiCheck } from "react-icons/fi";

interface StatusAlertProps {
    type: "success" | "error";
    title: string;
    message?: string;
}

const StatusAlert = ({ type, title, message }: StatusAlertProps) => {
    const isSuccess = type === "success";

    return (
        <div
            className={`animate-fadeIn mb-4 w-full overflow-hidden rounded-md border ${
                isSuccess
                    ? "border-green-200 bg-gradient-to-r from-green-50 to-green-100 text-green-700"
                    : "border-red-200 bg-gradient-to-r from-red-50 to-red-100 text-red-700"
            } p-3 shadow-inner`}>
            <div className="flex items-center">
                <div
                    className={`mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                        isSuccess ? "bg-green-200" : "bg-red-200"
                    }`}>
                    {isSuccess ? <FiCheck className="h-5 w-5" /> : <FiAlertCircle className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="break-words font-medium">{title}</p>
                    {message && <p className="break-words text-xs opacity-80">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default StatusAlert;
