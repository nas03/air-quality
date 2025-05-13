import { getUserInfoByUserId, updateUser, updateUserPassword } from "@/api";
import { Loading } from "@/components";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
    Avatar,
    Button,
    Card,
    Divider,
    Form,
    GetProp,
    Input,
    message,
    Modal,
    Space,
    Typography,
    Upload,
    UploadProps,
} from "antd";
import { useState } from "react";

// Types
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
type EditableFieldProps = {
    label: string;
    value: string;
    name: string;
    type?: string;
    isEditing: boolean;
    onEdit: () => void;
    onCancel: () => void;
};

// Utils
const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJpgOrPng) message.error("You can only upload JPG/PNG file!");
    if (!isLt2M) message.error("Image must smaller than 2MB!");

    return isJpgOrPng && isLt2M;
};

// Components
const EditableField = ({
    label,
    value,
    name,
    type = "text",
    isEditing,
    onEdit,
    onCancel,
    submitUpdate,
}: EditableFieldProps & { submitUpdate: (name: string, value: string) => void }) => {
    const [inputValue, setInputValue] = useState(value);
    return (
        <div className="grid grid-cols-7 border-b-2 border-slate-100 pb-3 text-sm">
            <p className="col-span-2 flex flex-row items-start py-1 font-medium">{label}</p>
            <div className="col-span-4 flex flex-col justify-center gap-3">
                <input
                    name={name}
                    type={type}
                    className={cn("px-3 py-1", isEditing ? "focus:rounded-md" : "border-none outline-none")}
                    defaultValue={value}
                    disabled={!isEditing}
                    ref={(input) => isEditing && input?.focus()}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                {isEditing && (
                    <div className="flex flex-row gap-3">
                        <Button onClick={() => submitUpdate(name, inputValue)} type="primary">
                            Lưu
                        </Button>
                        <Button onClick={onCancel}>Huỷ</Button>
                    </div>
                )}
            </div>
            <p
                className={cn("flex items-center justify-center text-blue-500 hover:cursor-pointer hover:underline")}
                onClick={onEdit}>
                {!isEditing && "Chỉnh"}
            </p>
        </div>
    );
};

const AvatarUpload = ({
    imageUrl,
    loading,
    onChangeImage,
}: {
    imageUrl: string;
    loading: boolean;
    onChangeImage: UploadProps["onChange"];
}) => {
    console.log(loading);
    return (
        <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            beforeUpload={beforeUpload}
            onChange={onChangeImage}>
            <div className="relative">
                <Avatar className="h-full w-full" src={imageUrl} />
                <Avatar className="absolute inset-0 h-full w-full opacity-0 hover:opacity-70">Upload</Avatar>
            </div>
        </Upload>
    );
};

const { Title, Text } = Typography;

const ProfileTab = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>("/avatar.jpg");
    const [editEmail, setEditEmail] = useState(false);
    const [editPhoneNumber, setEditPhoneNumber] = useState(false);
    const [editUsername, setEditUsername] = useState(false);
    const { user } = useAuth();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [form] = Form.useForm();

    const userInfoQuery = useQuery({
        queryKey: ["user", user?.user_id],
        queryFn: () => getUserInfoByUserId(user?.user_id),
    });

    const closeEdit = (name: string) => {
        if (name === "username") setEditUsername(false);
        if (name === "email") setEditEmail(false);
        if (name === "phone_number") setEditPhoneNumber(false);
    };

    const submitUpdate = async (name: string, value: string) => {
        try {
            const data = { [name]: value, user_id: user?.user_id };
            const res = await updateUser(data);
            if (res.status === "success") {
                message.success("Cập nhật thành công!");
            } else {
                message.error(res.message || "Cập nhật thất bại!");
            }
            closeEdit(name);
        } catch (error) {
            message.error("Có lỗi xảy ra khi cập nhật!");
        }
    };

    const handleChange: UploadProps["onChange"] = (info) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
        if (info.file.status === "done") {
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const handlePasswordUpdate = async () => {
        if (!oldPassword || !newPassword) {
            message.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        if (!user?.user_id) {
            message.error("Không tìm thấy thông tin người dùng");
            return;
        }
        try {
            const res = await updateUserPassword(user.user_id, oldPassword, newPassword);
            if (res.status === "success") {
                message.success("Cập nhật mật khẩu thành công!");
                setShowPasswordForm(false);
                setOldPassword("");
                setNewPassword("");
            } else {
                message.error(res.message || "Cập nhật mật khẩu thất bại!");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi cập nhật mật khẩu!");
        }
    };

    return (
        <Loading
            loading={userInfoQuery.isLoading}
            className={cn("mx-auto flex w-full max-w-2xl flex-col items-center gap-8 p-0 md:p-6")}>
            <Card className="w-full max-w-lg rounded-2xl border-[2pt] bg-white dark:bg-slate-900">
                <div className="flex flex-col items-center gap-4 py-6">
                    <div className="relative flex flex-col items-center">
                        <AvatarUpload imageUrl={imageUrl} loading={loading} onChangeImage={handleChange} />
                        <Title level={4} className="mb-0 mt-2">
                            {userInfoQuery.data?.username || "Người dùng"}
                        </Title>
                        <Text type="secondary">{userInfoQuery.data?.email}</Text>
                    </div>
                    <Divider className="my-2" />
                    <Form
                        form={form}
                        layout="vertical"
                        className="w-full"
                        initialValues={{
                            username: userInfoQuery.data?.username,
                            email: userInfoQuery.data?.email,
                            phone_number: userInfoQuery.data?.phone_number,
                        }}>
                        <Form.Item label="Tên người dùng" name="username">
                            <Space.Compact block>
                                <Input
                                    disabled={!editUsername}
                                    defaultValue={userInfoQuery.data?.username}
                                    className="rounded-l-lg"
                                />
                                {editUsername ? (
                                    <>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                const value = form.getFieldValue("username");
                                                submitUpdate("username", value);
                                            }}>
                                            Lưu
                                        </Button>
                                        <Button onClick={() => setEditUsername(false)}>Huỷ</Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setEditUsername(true)}>Chỉnh</Button>
                                )}
                            </Space.Compact>
                        </Form.Item>
                        <Form.Item label="Email" name="email">
                            <Space.Compact block>
                                <Input
                                    disabled={!editEmail}
                                    defaultValue={userInfoQuery.data?.email}
                                    className="rounded-l-lg"
                                />
                                {editEmail ? (
                                    <>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                const value = form.getFieldValue("email");
                                                submitUpdate("email", value);
                                            }}>
                                            Lưu
                                        </Button>
                                        <Button onClick={() => setEditEmail(false)}>Huỷ</Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setEditEmail(true)}>Chỉnh</Button>
                                )}
                            </Space.Compact>
                        </Form.Item>
                        <Form.Item label="Số điện thoại" name="phone_number">
                            <Space.Compact block>
                                <Input
                                    disabled={!editPhoneNumber}
                                    defaultValue={userInfoQuery.data?.phone_number}
                                    className="rounded-l-lg"
                                />
                                {editPhoneNumber ? (
                                    <>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                const value = form.getFieldValue("phone_number");
                                                submitUpdate("phone_number", value);
                                            }}>
                                            Lưu
                                        </Button>
                                        <Button onClick={() => setEditPhoneNumber(false)}>Huỷ</Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setEditPhoneNumber(true)}>Chỉnh</Button>
                                )}
                            </Space.Compact>
                        </Form.Item>
                    </Form>
                </div>
            </Card>
            <Card className="w-full max-w-lg rounded-2xl border-[2pt] bg-white dark:bg-slate-900">
                <div className="flex flex-col gap-4 py-6">
                    <Title level={5} className="mb-0">
                        Quyền riêng tư & Bảo mật
                    </Title>
                    <Divider className="my-2" />
                    <Button type="dashed" block onClick={() => setShowPasswordForm(true)}>
                        Cập nhật mật khẩu
                    </Button>
                </div>
            </Card>
            <Modal
                title="Cập nhật mật khẩu"
                open={showPasswordForm}
                onCancel={() => {
                    setShowPasswordForm(false);
                    setOldPassword("");
                    setNewPassword("");
                }}
                onOk={handlePasswordUpdate}
                okText="Lưu"
                cancelText="Huỷ"
                confirmLoading={passwordLoading}>
                <Form layout="vertical">
                    <Form.Item label="Mật khẩu cũ">
                        <Input.Password
                            placeholder="Nhập mật khẩu cũ"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label="Mật khẩu mới">
                        <Input.Password
                            placeholder="Nhập mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Loading>
    );
};

export default ProfileTab;
