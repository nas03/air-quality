import { cn } from "@/lib/utils";

const GradientBar = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={cn("flex h-40 items-center rounded-lg bg-white/70 px-5 py-3 backdrop-blur-md", className)}
      {...props}>
      <div className="h-full w-1 bg-gradient-to-b from-green-500 via-orange-500 via-red-500 via-yellow-500 to-purple-500"></div>
      <div className="ml-4 flex h-full flex-col justify-between text-xs">
        <span className="top-0">0</span>
        <span className="top-[15%]">50</span>
        <span className="top-[30%]">100</span>
        <span className="top-[45%]">150</span>
        <span className="top-[60%]">200</span>
        <span className="bottom-0">300</span>
      </div>
    </div>
  );
};

export default GradientBar;
