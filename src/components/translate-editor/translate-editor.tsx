'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export interface TranslateEditorProps {}

export const TranslateEditor = (props: TranslateEditorProps) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();
	const handleInput = useDebouncedCallback((term) => {
		const params = new URLSearchParams(searchParams);
		if (term) {
			params.set('query', term);
		} else {
			params.delete('query');
		}
		replace(`${pathname}?${params.toString()}`);
	}, 300);
	return (
		<div>
			<input
				onChange={(e) => handleInput(e.target.value)}
				className="bg-gray-100 border-2 border-gray-300 focus:outline-none focus:border-blue-500 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
				type="text"
				placeholder="hello"
			/>
		</div>
	);
};
