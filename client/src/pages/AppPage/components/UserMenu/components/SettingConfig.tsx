import { Checkbox } from "antd";

const SettingConfig = () => {
  return (
    <>
      <h3 className="mb-5 text-center text-lg font-semibold">Notifications Settings</h3>
      <div className="flex flex-col gap-5">
        <Checkbox onChange={(e) => console.log(e)}>Send me email notifications about alerts and updates</Checkbox>
        <Checkbox onChange={(e) => console.log(e)}>Send me SMS notifications for critical alerts</Checkbox>
      </div>
    </>
  );
};

export default SettingConfig;
