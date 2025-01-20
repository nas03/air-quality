import { useAuth } from "@/components/Authentication/AuthenticationProvider";
import { IPropsAuthentication } from "@/components/Authentication/types";
import { LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Avatar, Button } from "antd";

const Authentication: React.FC<IPropsAuthentication> = (props) => {
  const auth = useAuth();
  const btns = [
    {
      label: "Sign in",
      url: "/signin",
    },
  ];
  return (
    <>
      <div className={`${props.className} flex flex-row gap-3`}>
        {auth.user?.user_id ? (
          <Avatar size={'default'} icon={<UserOutlined />} />
        ) : (
          btns.map((btn) => (
            <Link key={btn.url} to={btn.url}>
              <Button type="default" className="rounded-3xl bg-white" icon={<LoginOutlined />} iconPosition={"start"}>
                {btn.label}
              </Button>
            </Link>
          ))
        )}
      </div>
    </>
  );
};

export default Authentication;
