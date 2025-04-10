interface IPropsSettingsTab extends React.ComponentPropsWithoutRef<"div"> {}
import { cn } from "@/lib/utils";
import { Checkbox } from "antd";
const SettingsTab: React.FC<IPropsSettingsTab> = ({ className }) => {
    return (
        <>
            <div className={cn("flex flex-col gap-5", className)}>
                <Checkbox onChange={(e) => console.log(e)}>
                    <p className="line-clamp-2 text-base">Send me email notifications about alerts and updates</p>
                </Checkbox>
                <Checkbox onChange={(e) => console.log(e)}>
                    <p className="line-clamp-2 text-base">Send me SMS notifications for critical alerts</p>
                </Checkbox>
            </div>
        </>
    );
};
export default SettingsTab;
