import { AlertRegistrationContext } from "@/context";
import useGetAllDistricts from "@/hooks/useGetAllDistricts";
import { MDistrict } from "@/types/db";
import { Form, Select } from "antd";
import { useContext, useEffect, useMemo, useState } from "react";
import { RegistrationDataType } from "../types";

interface IPropsVerifyLocationForm extends React.ComponentPropsWithRef<"div"> {
    registrationData: RegistrationDataType | null;
}

const RegisterLocation: React.FC<IPropsVerifyLocationForm> = ({ registrationData }) => {
    const { data: districts = [] } = useGetAllDistricts();
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | undefined>();
    const { currentStep } = useContext(AlertRegistrationContext);
    const [form] = Form.useForm(); // Get form instance

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
        form.setFieldsValue({ district_id: undefined }); // Reset district field
    };

    const isDisabled = currentStep !== 0;

    // Helper function for Select search
    const filterOption = (input: string, option?: { children: React.ReactNode }) =>
        (option?.children ?? "").toString().toLowerCase().includes(input.toLowerCase());

    return (
        <>
            <Form.Item name="province_id" label="Tỉnh/Thành phố" rules={[{ required: true }]}>
                <Select
                    placeholder="Tỉnh/Thành phố"
                    disabled={isDisabled}
                    onChange={handleProvinceChange}
                    showSearch
                    filterOption={filterOption}>
                    {allProvinces.map((province) => (
                        <Select.Option key={province.province_id} value={province.province_id}>
                            {province.vn_province}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item name="district_id" label="Quận/Huyện" rules={[{ required: true }]}>
                <Select
                    placeholder="Quận/Huyện"
                    disabled={isDisabled || !selectedProvinceId}
                    showSearch
                    filterOption={filterOption}>
                    {filteredDistricts.map((district) => (
                        <Select.Option key={district.district_id} value={district.district_id}>
                            {district.vn_district}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </>
    );
};

export default RegisterLocation;
