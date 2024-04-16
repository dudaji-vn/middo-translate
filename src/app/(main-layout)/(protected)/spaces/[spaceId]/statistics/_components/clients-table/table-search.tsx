'use client'

import { Input, InputProps } from '@/components/data-entry'
import React, { useEffect } from 'react'
import { useDebounce } from 'usehooks-ts';

const DEBOUNCED_TIME = 300;
const TableSearch = ({ onSearch, search, ...props }: InputProps & {
    onSearch: (text: string) => void
    search: string
}) => {
    const [searchValue, setSearchValue] = React.useState(search || '');
    const debouncedSearch = useDebounce(searchValue, DEBOUNCED_TIME);


    useEffect(() => {
        onSearch(debouncedSearch)
    }, [debouncedSearch]);

    return (
        <Input  placeholder='Search' value={searchValue} onChange={(e) => {
            setSearchValue(e.target.value);
        }} {...props} />
    )
}

export default TableSearch