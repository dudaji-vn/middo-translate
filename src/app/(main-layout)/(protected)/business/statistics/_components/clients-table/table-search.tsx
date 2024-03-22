'use client'

import { Input, InputProps } from '@/components/data-entry'
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDebounce } from 'usehooks-ts';

const DEBOUNCED_TIME = 300;
const TableSearch = ({ ...props }: InputProps & {

}) => {
    const searchParams = useSearchParams()
    const type = searchParams?.get('type')
    const fromDate = searchParams?.get('fromDate') || ''
    const toDate = searchParams?.get('toDate') || ''
    const search = searchParams?.get('search') || ''
    const [searchValue, setSearchValue] = React.useState('');
    const debouncedSearch = useDebounce(searchValue, DEBOUNCED_TIME);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams({
            type: type || '',
            fromDate: fromDate || '',
            toDate: toDate || ''
        });
        if (debouncedSearch) {
            params.set('search', debouncedSearch);
        } else {
            params.delete('search');
        }
        router.push(`${pathname}?${params.toString()}`);
    }, [debouncedSearch]);

    return (
        <Input placeholder='Search' value={searchValue} onChange={(e) => {
            setSearchValue(e.target.value);
        }} {...props} />
    )
}

export default TableSearch