import { IPropsAuthentication } from "@/components/Authentication/types";
import { LoginOutlined } from "@ant-design/icons";
import { Button } from "antd";

const Authentication: React.FC<IPropsAuthentication> = (props) => {
  const btns = [
    {
      label: "Sign in",
      url: "/signin",
    },
  ];
  return (
    <>
      <div className={`${props.className} flex flex-row gap-3`}>
        {btns.map((btn) => (
          <Button
            type="primary"
            onClick={() => (window.location.href = btn.url)}
            icon={<LoginOutlined />}
            iconPosition={"start"}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </>
  );
};

export default Authentication;
