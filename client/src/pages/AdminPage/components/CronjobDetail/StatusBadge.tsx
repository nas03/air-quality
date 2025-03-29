import { FiCheck, FiX } from "react-icons/fi";

interface StatusBadgeProps {
  label: string;
  status: number;
}

const StatusBadge = ({ label, status }: StatusBadgeProps) => {
  const isSuccess = status === 1;
  return (
    <div
      className={`flex items-center space-x-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
        isSuccess
          ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 shadow-sm shadow-green-100"
          : "bg-gradient-to-r from-red-50 to-red-100 text-red-700 shadow-sm shadow-red-100"
      }`}>
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full ${
          isSuccess ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
        }`}>
        {isSuccess ? <FiCheck className="h-3.5 w-3.5" /> : <FiX className="h-3.5 w-3.5" />}
      </span>
      <span>{label}</span>
    </div>
  );
};

export default StatusBadge;
