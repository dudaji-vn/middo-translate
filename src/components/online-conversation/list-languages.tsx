import {
  CheckmarkCircle2Outline,
  CloseCircleOutline,
  Search,
} from '@easy-eva-icons/react';
import { forwardRef, useEffect, useRef, useState } from 'react';

import { Country } from '@/types/country';
import { Input } from '../input';
import { SUPPORTED_LANGUAGES } from '@/configs/default-language';
import { cn } from '@/utils/cn';

export interface ListLanguagesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  selectedCode: string;
  onSelected: (code: string) => void;
  selectedLanguages?: string[];
}

export const ListLanguages = forwardRef<HTMLDivElement, ListLanguagesProps>(
  ({ selectedCode, onSelected, selectedLanguages, ...props }, ref) => {
    const [search, setSearch] = useState('');
    const searchRef = useRef<any>(null);

    const handleSelected = (code: string) => {
      onSelected(code);
    };
    const filterLanguages = SUPPORTED_LANGUAGES.filter((language) => {
      if (search === '') return true;
      return language.name.toLowerCase().includes(search.toLowerCase());
    });

    // hide keyboard on mobile when enter on keyboard

    useEffect(() => {
      const handleEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          searchRef.current?.blur();
        }
      };
      window.addEventListener('keydown', handleEnter);
      return () => {
        window.removeEventListener('keydown', handleEnter);
      };
    }, []);

    useEffect(() => {
      document.body.style.overflow = 'hidden';
      console.log('run');
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);

    return (
      <div ref={ref} {...props} className="flex h-full flex-col">
        <div className="px-5 py-5 pt-0 md:mx-auto md:w-[480px] ">
          <Input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            leftElement={
              search === '' ? (
                <Search className="h-5 w-5" />
              ) : (
                <CloseCircleOutline
                  onClick={() => setSearch('')}
                  className="h-5 w-5"
                />
              )
            }
          />
        </div>
        <div className="mb-8 flex-1 columns-1 gap-0 overflow-y-auto md:columns-3">
          {search === '' ? (
            <>
              {SUPPORTED_LANGUAGES.map((language) => (
                <Item
                  onClick={handleSelected.bind(null, language.code)}
                  selected={selectedLanguages?.includes(language.code)}
                  key={language.code}
                  language={language}
                />
              ))}
            </>
          ) : (
            <>
              {filterLanguages.map((language) => (
                <Item
                  onClick={handleSelected.bind(null, language.code)}
                  selected={selectedLanguages?.includes(language.code)}
                  key={language.code}
                  language={language}
                />
              ))}
            </>
          )}
        </div>
      </div>
    );
  },
);
ListLanguages.displayName = 'ListLanguages';

const Title = ({ children }: { children: React.ReactNode }) => {
  return <p className="mb-3 mt-6 pl-5 text-secondary">{children}</p>;
};

const Item = ({
  language,
  selected = false,
  onClick,
  rightElement,
}: {
  language: Country;
  selected?: boolean;
  onClick?: () => void;
  rightElement?: React.ReactNode;
}) => {
  return (
    <button
      disabled={selected}
      onClick={onClick}
      key={language.code}
      className={cn(
        'flex w-full items-center px-5 py-3 active:bg-stroke md:hover:bg-background-darker',
        selected && 'bg-lighter text-primary disabled:bg-lighter',
      )}
    >
      {rightElement}
      <span className={cn(selected && 'font-semibold text-primary')}>
        {language.name}
      </span>
      {selected && <CheckmarkCircle2Outline className="ml-auto h-5 w-5 " />}
    </button>
  );
};
