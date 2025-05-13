import { AlertRegistrationContext } from "@/context";
import useGetAllDistricts from "@/hooks/useGetAllDistricts";
import { MDistrict } from "@/types/db";
import { Form, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useContext, useEffect, useMemo, useState } from "react";
import { RegistrationDataType } from "../types";

interface IPropsVerifyLocationForm extends React.ComponentPropsWithRef<"div"> {
    registrationData: RegistrationDataType | null;
    setRegistrationData: React.Dispatch<React.SetStateAction<RegistrationDataType | null>>;
}

const RegisterLocation: React.FC<IPropsVerifyLocationForm> = ({ registrationData, setRegistrationData }) => {
    const { data: districts = [] } = useGetAllDistricts();
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | undefined>();
    const { currentStep } = useContext(AlertRegistrationContext);
    const [form] = useForm();
    const allProvinces = useMemo(() => {
        if (!districts.length) return [];

        return [
            ...new Map(
                districts.map((d: MDistrict) => [
                    d.province_id,
                    { province_id: d.province_id, vn_province: d.vn_province },
                ]),
            ).values(),
        ];
    }, [districts]);

    useEffect(() => {
        if (registrationData) {
            setSelectedProvinceId(registrationData.province_id);
        }
    }, [registrationData]);

    const filteredDistricts = useMemo(() => {
        if (!selectedProvinceId) return districts;
        return districts.filter((el) => el.province_id === selectedProvinceId);
    }, [districts, selectedProvinceId]);

    const handleProvinceChange = (provinceId: string) => {
        setSelectedProvinceId(provinceId);
        form?.setFieldValue("province_id", provinceId); // Reset district field
        setRegistrationData((prev) => ({
            step: 0,
            district_id: prev?.district_id ? prev.district_id : "",
            province_id: provinceId,
        }));
    };

    const handleDistrictChange = (district_id: string) => {
        form?.setFieldValue("district_id", district_id); // Reset district field
        setRegistrationData((prev) => ({
            step: 0,
            province_id: prev?.province_id ? prev.province_id : "",
            district_id: district_id,
        }));
    };
    const isDisabled = currentStep !== 0;

    const filterOption = (input: string, option?: { children: React.ReactNode }) =>
        (option?.children ?? "").toString().toLowerCase().includes(input.toLowerCase());

    return (
        <>
            <Form.Item name="province_id" label="Tỉnh/Thành phố" rules={[{ required: true }]} className="mb-4">
                <Select
                    placeholder="Tỉnh/Thành phố"
                    disabled={isDisabled}
                    onChange={handleProvinceChange}
                    showSearch
                    filterOption={filterOption}
                    className="h-11 rounded-lg text-base">
                    {allProvinces.map((province) => (
                        <Select.Option key={province.province_id} value={province.province_id}>
                            {province.vn_province}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            {/* <div className="mt-1 text-xs text-gray-400">Chọn tỉnh/thành phố bạn muốn nhận cảnh báo.</div> */}

            <Form.Item name="district_id" label="Quận/Huyện" rules={[{ required: true }]} className="mb-2">
                <Select
                    placeholder="Quận/Huyện"
                    disabled={isDisabled || !selectedProvinceId}
                    showSearch
                    onSelect={handleDistrictChange}
                    filterOption={filterOption}
                    className="h-11 rounded-lg text-base">
                    {filteredDistricts.map((district) => (
                        <Select.Option key={district.district_id} value={district.district_id}>
                            {district.vn_district}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            {/* <div className="mt-1 text-xs text-gray-400">Chọn quận/huyện tương ứng.</div> */}
        </>
    );
};

export default RegisterLocation;
