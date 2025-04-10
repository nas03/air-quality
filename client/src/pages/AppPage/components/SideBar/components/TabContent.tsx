import { cn } from "@/lib/utils";

export interface IPropsTabContent {
    className?: string;
    children: React.ReactNode;
    title: string;
}
const TabContent: React.FC<IPropsTabContent> = ({ children, title, className }) => (
    <div className={cn(className, "h-[calc(100vh-10.3rem)]")}>
        <h3 className="text-lg font-bold">{title}</h3>
        {children}
    </div>
);
export default TabContent;
