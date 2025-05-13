import { AlertRegistrationContext } from "@/context";
import { MailOutlined } from "@ant-design/icons";
import { Form, Switch } from "antd";
import { useContext } from "react";
import StepControl from "./StepControl";

interface IPropsAdditionalSettings extends React.ComponentPropsWithRef<"div"> {
    registrationData: any;
}
const RegisterSettings: React.FC<IPropsAdditionalSettings> = ({ registrationData }) => {
    const { currentStep } = useContext(AlertRegistrationContext);
    return (
        <>
            <div className="mt-5 space-y-6">
                <div className="flex items-center gap-3">
                    <MailOutlined className="text-lg text-blue-500" />
                    <span className="flex-1 text-sm 2xl:text-base">Nhận thông báo qua Email</span>
                    <Form.Item initialValue={true} name="email_notification" className="mb-0" valuePropName="checked">
                        <Switch disabled={currentStep !== 1} />
                    </Form.Item>
                </div>

                {/* Uncomment below if SMS is to be shown */}
                {/* <Form.Item initialValue={true} name="sms_notification" className="mb-0" valuePropName="checked">
                    <div className="flex items-center gap-3">
                        <MessageOutlined className="text-green-500 text-lg" />
                        <span className="flex-1 text-base">Nhận thông báo qua SMS</span>
                        <Switch disabled={currentStep !== 1} />
                    </div>
                    <div className="text-xs text-gray-400 ml-8 mt-1">Nhận thông báo về chất lượng không khí qua tin nhắn SMS.</div>
                </Form.Item> */}
            </div>
            {currentStep >= 1 && <StepControl registrationData={registrationData} />}
        </>
    );
};
export default RegisterSettings;
