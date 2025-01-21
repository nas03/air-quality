import { MDistrict } from "@/types/db";
import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, AutoCompleteProps } from "antd";
import { useState } from "react";

interface IPropsSearchBar {
  className?: string;
  districts: MDistrict[];
  setTargetDistrict: (value: string) => void;
}
const SearchBar: React.FC<IPropsSearchBar> = (props) => {
  const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);

  const handleSearch = (value: string) => {
    const temp = props.districts
      .filter((el) => el.vn_district.includes(value.toString()))
      .map((el) => ({
        label: `${el.vn_type} ${el.vn_district}, ${el.vn_province}`,
        value: `${el.vn_type} ${el.vn_district}, ${el.vn_province}`,
      }));
    setOptions(() => temp);
  };

  const handleSelect = (value: string) => {
    let district = "";
    let type = "";
    if (value.includes("Huyện") || value.includes("Quận")) {
      const parts = value.split(",")[0].split(" ");
      type = parts[0];
      district = parts.slice(1).join(" ");
    } else {
      const parts = value.split(",")[0].split(" ");
      type = parts.slice(0, 2).join(" ");
      district = parts.slice(2).join(" ");
    }
    const province = value.split(",")[1].trim();

    const targetDistrict = props.districts.find(
      (el) => el.vn_district === district && el.vn_province === province && el.vn_type === type,
    );
    props.setTargetDistrict(targetDistrict?.district_id || "");
  };
  return (
    <div className={`${props.className} flex h-12 max-w-full flex-row gap-3 rounded-md bg-white px-2 py-2`}>
      <SearchOutlined className="h-full shrink-0 rounded-md px-2 py-2 hover:bg-blue-100" />
      <AutoComplete
        className="h-full min-w-[6rem] flex-1 rounded-md p-0"
        onSearch={handleSearch}
        variant="borderless"
        placeholder="Search..."
        options={options}
        onSelect={handleSelect}
      />
    </div>
  );
};
export default SearchBar;
