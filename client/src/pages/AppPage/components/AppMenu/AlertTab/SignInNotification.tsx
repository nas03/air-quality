import { Link } from "@tanstack/react-router";

const SignInNotification = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 py-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-zinc-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 15v2m0 0v2m0-2h2m-2 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-center font-medium text-zinc-500 dark:text-zinc-400">
        You need to sign in to view your alerts
      </p>
      <Link to="/signin">
        <button className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Sign In
        </button>
      </Link>
    </div>
  );
};
export default SignInNotification;
