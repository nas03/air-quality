import { SearchOutlined } from "@ant-design/icons";

interface IPropsSearchBar {
  className?: string;
}
const SearchBar: React.FC<IPropsSearchBar> = (props) => {
  return (
    <div
      className={`${props.className} flex max-w-full flex-row gap-3 rounded-md bg-white px-2 py-2`}
    >
      <SearchOutlined className="shrink-0 rounded-md px-2 py-2 hover:bg-blue-100" />
      <input
        type="text"
        placeholder="Search ..."
        className="min-w-[6rem] flex-1 rounded-md px-3 focus:outline-none"
      />
    </div>
  );
};
export default SearchBar;
