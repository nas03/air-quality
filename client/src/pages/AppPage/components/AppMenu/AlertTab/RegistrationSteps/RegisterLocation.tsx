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

  const allProvinces = useMemo(() => {
    if (!districts.length) return [];

    return [
      ...new Map(
        districts.map((d: MDistrict) => [d.province_id, { province_id: d.province_id, vn_province: d.vn_province }]),
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
  };

  const isDisabled = currentStep !== 0;

  return (
    <>
      <Form.Item className="mb-0" name="province_id" label="Tỉnh/Thành phố" rules={[{ required: true }]}>
        <Select
          placeholder="Tỉnh/Thành phố"
          disabled={isDisabled}
          value={selectedProvinceId}
          onChange={handleProvinceChange}>
          {allProvinces.map((province) => (
            <Select.Option key={province.province_id} value={province.province_id}>
              {province.vn_province}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="district_id" label="Quận/Huyện" rules={[{ required: true }]}>
        <Select placeholder="Quận/Huyện" disabled={isDisabled}>
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
