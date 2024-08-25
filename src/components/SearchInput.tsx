import React, { useRef } from 'react';
import { useState } from 'react';
import { Input } from 'antd';
import useKeypress from 'react-use-keypress';

const { Search } = Input;

interface SearchInputProps {
  isLoading: boolean;
  refetch: () => void;
  setSearch: any;
  handleSearchFocus?: () => void; // Optional prop for handling focus
}

const SearchInput: React.FC<SearchInputProps> = ({ isLoading, refetch, setSearch, handleSearchFocus }) => {
  const search_input = useRef<Input | null>(null);

  const onSearch = async (value: string) => {
    await setSearch(value);
    refetch();
  };

  useKeypress('F8', () => {
    search_input.current?.focus();
  });

  return (
    <>
      <Search
        placeholder="Appuyez sur F8 pour rechercher"
        allowClear
        loading={isLoading}
        onSearch={onSearch}
        onFocus={handleSearchFocus}
        ref={search_input}
        style={{ borderRadius: '30px' }}
      />
    </>
  );
};

export default SearchInput;
