import { MDistrict } from "@/types/db";
import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, AutoCompleteProps } from "antd";
import { useState } from "react";

interface IPropsSearchBar {
  className?: string;
  districts: MDistrict[];
  setTargetDistrict: (value: string) => void;
}

const SearchBar: React.FC<IPropsSearchBar> = ({ className, districts, setTargetDistrict }) => {
  const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);

  const formatDistrictLabel = (district: MDistrict) =>
    `${district.vn_type} ${district.vn_district}, ${district.vn_province}`;

  const handleSearch = (value: string) => {
    const filteredDistricts = districts
      .filter((district) => district.vn_district.includes(value.toString()))
      .map((district) => ({
        label: formatDistrictLabel(district),
        value: formatDistrictLabel(district),
      }));
    setOptions(filteredDistricts);
  };

  const parseDistrictValue = (value: string) => {
    const [districtPart, provincePart] = value.split(",");
    const province = provincePart.trim();

    const isSimpleType = districtPart.includes("Huyện") || districtPart.includes("Quận");
    const parts = districtPart.split(" ");

    const type = isSimpleType ? parts[0] : parts.slice(0, 2).join(" ");
    const district = isSimpleType ? parts.slice(1).join(" ") : parts.slice(2).join(" ");

    return { district, province, type };
  };

  const handleSelect = (value: string) => {
    const { district, province, type } = parseDistrictValue(value);

    const targetDistrict = districts.find(
      (el) => el.vn_district === district && el.vn_province === province && el.vn_type === type,
    );

    setTargetDistrict(targetDistrict?.district_id || "");
  };

  return (
    <div className={`${className} flex h-12 max-w-full flex-row gap-3 rounded-md bg-white px-2 py-2`}>
      <SearchOutlined className="h-full shrink-0 cursor-pointer rounded-md px-2 py-2 hover:bg-blue-100" />
      <AutoComplete
        className="h-full min-w-[6rem] flex-1 rounded-md p-0"
        onSearch={handleSearch}
        variant="borderless"
        placeholder="Search..."
        options={options}
        aria-autocomplete="list"
        onSelect={handleSelect}
      />
    </div>
  );
};

export default SearchBar;
