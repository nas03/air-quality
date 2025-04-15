import { AlertRegistrationContext } from "@/context";
import { Checkbox, Form } from "antd";
import { useContext } from "react";
import StepControl from "./StepControl";

interface IPropsAdditionalSettings extends React.ComponentPropsWithRef<"div"> {}
const RegisterSettings: React.FC<IPropsAdditionalSettings> = () => {
    const { currentStep } = useContext(AlertRegistrationContext);
    return (
        <>
            <div className="space-y-4">
                <Form.Item initialValue={true} name="email_notification" className="mb-0" valuePropName="checked">
                    <Checkbox className="text-sm" disabled={currentStep !== 2}>
                        Nhận thông báo qua Email
                    </Checkbox>
                </Form.Item>
                <Form.Item initialValue={true} name="sms_notification" className="mb-0" valuePropName="checked">
                    <Checkbox className="text-sm" disabled={currentStep !== 2}>
                        Nhận thông báo qua SMS
                    </Checkbox>
                </Form.Item>
            </div>
            {currentStep >= 2 && <StepControl />}
        </>
    );
};
export default RegisterSettings;
