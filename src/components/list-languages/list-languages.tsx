import {
  CheckmarkCircle2Outline,
  CloseCircleOutline,
  Globe2Outline,
  Search,
} from '@easy-eva-icons/react';
import { addRecentlyUsed, getRecentlyUsed } from '@/utils/local-storage';
import { forwardRef, useEffect, useRef, useState } from 'react';

import { Country } from '@/types/country';
import { Input } from '../input';
import { cn } from '@/utils/cn';
import { supportedLanguages } from '@/configs/default-language';

export interface ListLanguagesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  selectedCode: string;
  onSelected: (code: string) => void;
  allowDetect?: boolean;
}

export const ListLanguages = forwardRef<HTMLDivElement, ListLanguagesProps>(
  ({ selectedCode, onSelected, allowDetect, ...props }, ref) => {
    const [search, setSearch] = useState('');
    const searchRef = useRef<any>(null);

    const [recentlyUsed, setRecentlyUsed] = useState<string[]>(
      getRecentlyUsed(),
    );
    const handleSelected = (code: string) => {
      const newRecentlyUsed = addRecentlyUsed(code);
      setRecentlyUsed(newRecentlyUsed);
      onSelected(code);
    };
    const filterLanguages = supportedLanguages.filter((language) => {
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

    return (
      <div ref={ref} {...props} className="flex h-full flex-col pb-5">
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
        <div className="mb-16 flex-1 columns-1 gap-0 overflow-y-auto px-[5vw] md:columns-3">
          {search === '' ? (
            <>
              {allowDetect && (
                <Item
                  selected={selectedCode === 'auto'}
                  rightElement={<Globe2Outline className="mr-2 h-5 w-5" />}
                  language={{
                    code: 'auto',
                    name: 'Language detect',
                  }}
                  onClick={onSelected.bind(null, 'auto')}
                />
              )}

              <Title>Recently used</Title>

              {recentlyUsed.length > 0 && (
                <>
                  {recentlyUsed.map((code) => {
                    const language = supportedLanguages.find(
                      (item) => item.code === code,
                    );
                    return (
                      language && (
                        <Item
                          onClick={() => {
                            onSelected(code);
                            handleSelected(code);
                          }}
                          selected={code === selectedCode}
                          key={code}
                          language={language}
                        />
                      )
                    );
                  })}
                </>
              )}
              <Title>All languages</Title>
              {supportedLanguages.map((language) => (
                <Item
                  onClick={handleSelected.bind(null, language.code)}
                  selected={language.code === selectedCode}
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
                  selected={language.code === selectedCode}
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

const Section = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="mb-8">
      {title && <p className="mb-3 pl-[5vw] text-secondary">{title}</p>}
      <div>{children}</div>
    </div>
  );
};
