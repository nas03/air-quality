interface TableStatusBadgeProps {
  status: number;
}
const TableStatusBadge = ({ status }: TableStatusBadgeProps) => {
  const isSuccess = status === 1;
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${
        isSuccess
          ? "bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20"
          : "bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20"
      }`}>
      <span className={`mr-1 h-1.5 w-1.5 rounded-full ${isSuccess ? "bg-green-600" : "bg-red-600"}`}></span>
      {isSuccess ? "COMPLETED" : "FAILED"}
    </span>
  );
};

export default TableStatusBadge;
