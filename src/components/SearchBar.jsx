import { useState } from "react";
import { BiSearch } from "react-icons/bi";

import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="Search for a meal"
        className="search-bar"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button className="searchbar-button" onClick={handleSearch}>
        <BiSearch className="search-icon" color="white" />
      </button>
    </div>
  );
};

export default SearchBar;
