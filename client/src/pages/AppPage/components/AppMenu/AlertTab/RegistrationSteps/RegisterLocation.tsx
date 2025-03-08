import { AlertRegistrationContext } from "@/context";
import useGetAllDistricts from "@/hooks/useGetAllDistricts";
import { MDistrict } from "@/types/db";
import { Form, Select } from "antd";
import { useContext, useEffect, useState } from "react";
interface IPropsVerifyLocationForm extends React.ComponentPropsWithRef<"div"> {}
const RegisterLocation: React.FC<IPropsVerifyLocationForm> = () => {
  const district = useGetAllDistricts();
  const [allDistricts, setAllDistricts] = useState<MDistrict[]>([]);
  const [allProvinces, setAllProvinces] = useState<Pick<MDistrict, "province_id" | "vn_province">[]>([]);
  const { currentStep } = useContext(AlertRegistrationContext);
  useEffect(() => {
    if (!district.data.length) return;
    setAllDistricts(district.data);
    const allProvincesData = [
      ...new Map(
        district.data.map((d: MDistrict) => [
          d.province_id,
          { province_id: d.province_id, vn_province: d.vn_province },
        ]),
      ).values(),
    ];

    setAllProvinces(allProvincesData);
  }, [district.data]);

  return (
    <>
      <Form.Item name="district_id" label="Quận/Huyện" rules={[{ required: true }]}>
        <Select placeholder="Quận/Huyện" disabled={currentStep !== 0}>
          {allDistricts.map((el) => (
            <Select.Option key={el.district_id} value={el.district_id}>
              {el.vn_district}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item className="mb-0" name="province_id" label="Tỉnh/Thành phố" rules={[{ required: true }]}>
        <Select placeholder="Tỉnh/Thành phố" disabled={currentStep !== 0}>
          {allProvinces.map((el) => (
            <Select.Option key={el.province_id} value={el.province_id}>
              {el.vn_province}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

export default RegisterLocation;
