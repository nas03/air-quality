import { getUserInfoByUserId, updateUser, updateUserPassword } from "@/api";
import { Loading } from "@/components";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Button, Divider, GetProp, Input, message, Upload, UploadProps } from "antd";
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
        <Loading loading={userInfoQuery.isLoading} className={cn("flex flex-col gap-5 overflow-y-auto pl-6 pr-3")}>
            <div>
                <div className="flex justify-center">
                    <AvatarUpload imageUrl={imageUrl} loading={loading} onChangeImage={handleChange} />
                </div>
            </div>

            <div className="grid gap-3">
                <EditableField
                    label="Tên người dùng"
                    value={userInfoQuery.data?.username || ""}
                    name="username"
                    isEditing={editUsername}
                    onEdit={() => setEditUsername(true)}
                    onCancel={() => setEditUsername(false)}
                    submitUpdate={submitUpdate}
                />
                <EditableField
                    label="Email"
                    value={userInfoQuery.data?.email || ""}
                    name="email"
                    type="email"
                    isEditing={editEmail}
                    onEdit={() => setEditEmail(true)}
                    onCancel={() => setEditEmail(false)}
                    submitUpdate={submitUpdate}
                />
                <EditableField
                    label="Số điện thoại"
                    value={userInfoQuery.data?.phone_number || ""}
                    name="phone_number"
                    type="tel"
                    isEditing={editPhoneNumber}
                    onEdit={() => setEditPhoneNumber(true)}
                    onCancel={() => setEditPhoneNumber(false)}
                    submitUpdate={submitUpdate}
                />
            </div>

            <div>
                <h3 className="text-xl font-semibold">Quyền riêng tư & Bảo mật</h3>
                <Divider className="mt-3" />
                <Button onClick={() => setShowPasswordForm((v) => !v)}>Cập nhật mật khẩu</Button>
                {showPasswordForm && (
                    <div className="mt-4 flex max-w-xs flex-col gap-3">
                        <Input.Password
                            placeholder="Mật khẩu cũ"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <Input.Password
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <Button type="primary" loading={passwordLoading} onClick={handlePasswordUpdate}>
                                Lưu
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowPasswordForm(false);
                                    setOldPassword("");
                                    setNewPassword("");
                                }}>
                                Hủy
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Loading>
    );
};

export default ProfileTab;
