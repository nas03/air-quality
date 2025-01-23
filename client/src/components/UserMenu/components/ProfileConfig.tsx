import { EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Divider, GetProp, Input, message, Typography, Upload, UploadProps } from "antd";
import { useState } from "react";
const { Text } = Typography;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};
const ProfileConfig = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("/avatar.jpg");
  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 overflow-y-auto">
        <div className="">
          <h3 className="text-xl font-semibold">Profile</h3>
          <Divider className="mt-3" />
          <div className="flex justify-center">
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              <div className="relative">
                <Avatar className="h-full w-full" src={imageUrl} />
                <Avatar className="absolute inset-0 h-full w-full opacity-0 hover:opacity-70">Upload</Avatar>
              </div>
            </Upload>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="grid grid-cols-5">
            <p className="col-span-2 flex items-center font-medium">Username</p>
            <Input disabled name="username" className="col-span-3" value={"sonanhnguyen003"} />
          </div>
          <div className="grid grid-cols-5">
            <p className="col-span-2 flex items-center font-medium">Email</p>
            <Input
              name="email"
              type="email"
              className="col-span-3"
              defaultValue={"sonanhnguyen003@gmail.com"}
              addonAfter={<EditOutlined />}
            />
          </div>
          <div className="grid grid-cols-5">
            <p className="col-span-2 flex items-center font-medium">Phone Number</p>
            <Input
              name="phone_number"
              type="tel"
              className="col-span-3"
              defaultValue={"0916308089"}
              addonAfter={<EditOutlined />}
            />
          </div>
        </div>
        <div className="">
          <h3 className="text-xl font-semibold">Security</h3>
          <Divider className="mt-3" />
          <Button>Update Password</Button>
        </div>
      </div>
    </>
  );
};

export default ProfileConfig;
