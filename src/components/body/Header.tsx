import React, { useState } from "react";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { TbFilterSearch } from "react-icons/tb";
import { IoAdd } from "react-icons/io5";
import { Input, Space } from "antd";
import { useDispatch } from "react-redux";
import { setSearchValue } from "../../redux/features/api/searchSlice";

const { Search } = Input;

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState<string>("");

  // Arama geçerlilik kontrolü
  const isValidSearch = (value: string): boolean => value.length >= 3 && value.length <= 20; 
  // Değer değişim işleyici
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) setInputValue(value);
  };

  // Enter veya buton tıklamasında çalışacak işlev
  const handleSearchSubmit = (value: string) => {
    if (isValidSearch(value)) {
      dispatch(setSearchValue(value));
    } else {
      dispatch(setSearchValue(""));
    }
  };

  return (
    <div className="flex justify-between px-5 bg-[#fff] shadow-sm items-center border w-auto py-4 rounded-md">
      {/* Arama Alanı */}
      <Space direction="vertical">
        <Search
          placeholder="Search..."
          enterButton
          value={inputValue}
          onChange={handleSearchChange}
          onSearch={handleSearchSubmit}
        />
      </Space>

      {/* İkonlar */}
      <div className="flex gap-5">
        <MdOutlineDashboardCustomize size={20} color="gray" />
        <TbFilterSearch size={20} color="gray" />
        <IoAdd size={20} color="gray" />
      </div>
    </div>
  );
};

export default Header;
