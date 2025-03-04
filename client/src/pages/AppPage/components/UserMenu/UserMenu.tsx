import { useAuth } from "@/hooks/useAuth";
import { LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Avatar, Button } from "antd";
import { IPropsUserMenu } from "./types";

const UserMenu: React.FC<IPropsUserMenu> = ({ className }) => {
  const { user } = useAuth();

  const renderAuthenticatedView = () => <Avatar size="large" icon={<UserOutlined />} src="avatar.jpg" className="cursor-default"/>;

  const renderUnauthenticatedView = () => (
    <Link to="/signin">
      <Button type="default" className="rounded-3xl bg-white" icon={<LoginOutlined />} iconPosition="start">
        Sign in
      </Button>
    </Link>
  );

  return (
    <div className={`${className} flex cursor-pointer flex-row gap-3`}>
      {user?.user_id ? renderAuthenticatedView() : renderUnauthenticatedView()}
    </div>
  );
};

export default UserMenu;
