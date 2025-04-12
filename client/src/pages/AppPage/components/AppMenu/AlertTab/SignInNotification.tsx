import { Link } from "@tanstack/react-router";
import { FiAlertCircle } from "react-icons/fi";

const SignInNotification = () => {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 py-10">
            <FiAlertCircle className="h-10 w-10 text-zinc-400" />
            <p className="text-center font-medium text-zinc-500 dark:text-zinc-400">
                Bạn cần đăng nhập để xem cảnh báo
            </p>
            <Link to="/signin">
                <button className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Đăng nhập
                </button>
            </Link>
        </div>
    );
};
export default SignInNotification;
