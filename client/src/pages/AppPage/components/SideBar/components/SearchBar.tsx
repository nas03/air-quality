import { GeoContext } from "@/context";
import { cn } from "@/lib/utils";
import { MDistrict } from "@/types/db";
import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, AutoCompleteProps } from "antd";
import { useContext, useEffect, useState } from "react";

interface IPropsSearchBar {
  className?: string;
  districts: MDistrict[];
  setTargetDistrict: (value: string) => void;
}

const SearchBar: React.FC<IPropsSearchBar> = ({ className, districts, setTargetDistrict }) => {
  const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);
  const geoContext = useContext(GeoContext);
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
    const segments = value.split(",");
    if (segments.length !== 2) return { district: "", province: "", type: "" };

    const [districtPart, provincePart] = segments;
    const province = provincePart.trim();

    const isSimpleType = districtPart.includes("Huyện") || districtPart.includes("Quận");
    const parts = districtPart.split(" ");

    const type = isSimpleType ? parts[0] : parts.slice(0, 2).join(" ");
    const district = isSimpleType ? parts.slice(1).join(" ") : parts.slice(2).join(" ");

    return { district, province, type };
  };

  const handleSelect = (value: string) => {
    const { district, province, type } = parseDistrictValue(value);
    if (!district || !province || !type) return;
    const targetDistrict = districts.find(
      (el) => el.vn_district === district && el.vn_province === province && el.vn_type === type,
    );

    setTargetDistrict(targetDistrict?.district_id || "");
  };

  useEffect(() => {
    if (geoContext.location) handleSelect(geoContext.location);
  }, [geoContext.location]);
  return (
    <div className={cn(
      "flex h-12 max-w-full flex-row gap-3 rounded-md bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-700 px-2 py-2",
      className
    )}>
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
        <SearchOutlined className="h-5 w-5" />
      </div>
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
