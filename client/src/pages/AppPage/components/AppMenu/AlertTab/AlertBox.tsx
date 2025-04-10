import { AlertContent } from "./types";

const AlertBox = ({ alerts }: { alerts: AlertContent[] }) => {
    return (
        <>
            {alerts.length ? (
                alerts.map((el, index) => (
                    <div key={index} className="relative mx-auto mb-6 flex w-full max-w-full md:pt-[unset]">
                        <div className="me-4 mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                        <div className="flex flex-row items-center gap-4 border-b-[1px] border-slate-200">
                            <div className="mb-1 grow text-justify font-medium text-zinc-950 dark:text-white">
                                <strong>Air Quality Index:</strong> {el.aqi_index} <br />
                                {el.recommendation}
                            </div>

                            <div className="flex w-[80px] flex-none items-center justify-end font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                                {el.timestamp}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex h-full w-full items-center justify-center py-10">
                    <p className="text-center font-medium text-zinc-500 dark:text-zinc-400">No alerts yet</p>
                </div>
            )}
        </>
    );
};

export default AlertBox;
