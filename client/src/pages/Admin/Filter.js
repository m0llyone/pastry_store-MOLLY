import React, { useState } from 'react';
import { TextInput, TopToolbar, CreateButton, ExportButton, useListContext } from 'react-admin';

export const FilterComponent = (props) => {
  const { setFilters } = useListContext();
  const [search, setSearch] = useState('');

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    setFilters({ q: value }, []);
  };

  return (
    <TopToolbar>
      <TextInput label="Поиск" source="q" alwaysOn value={search} onChange={handleSearchChange} />
      <CreateButton />
      <ExportButton />
    </TopToolbar>
  );
};
