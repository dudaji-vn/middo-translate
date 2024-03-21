'use client'

import { Input, InputProps } from '@/components/data-entry'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDebounce } from 'usehooks-ts';

const DEBOUNCED_TIME = 500;
const TableSearch = ({ searchParams, ...props }: InputProps & {
    searchParams: {
        type: string
        fromDate: string
        toDate: string
        search: string
    }
}) => {
    const [search, setSearch] = React.useState('');
    const debouncedSearch = useDebounce(search, DEBOUNCED_TIME);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (debouncedSearch) {
            params.set('search', debouncedSearch);
        } else {
            params.delete('search');
        }
        router.push(`${pathname}?${params.toString()}`);
    }, [debouncedSearch]);

    return (
        <Input placeholder='Search' value={search} onChange={(e) => {
            setSearch(e.target.value);
        }} {...props} />
    )
}

export default TableSearch