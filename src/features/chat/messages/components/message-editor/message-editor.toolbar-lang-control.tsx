import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/data-entry';
import { getCountryCode, getCountryNameByCode } from '@/utils/language-fn';

import { CircleFlag } from 'react-circle-flags';
import { Globe2Icon } from 'lucide-react';
import { useChatStore } from '@/features/chat/store';
import { useMessageEditorText } from './message-editor.text-context';

export interface MessageEditorToolbarLangControlProps {}

export const MessageEditorToolbarLangControl = (
  props: MessageEditorToolbarLangControlProps,
) => {
  const { userLanguage } = useMessageEditorText();
  const { setSrcLang, detLang, srcLang } = useChatStore((s) => s);
  return (
    <div>
      <Select
        name="srcLang"
        value={srcLang}
        onValueChange={(value) => {
          setSrcLang(value || 'auto');
        }}
      >
        <SelectTrigger className="mr-5 w-[180px] rounded-xl bg-neutral-50 shadow-none">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">
            <Globe2Icon className="mr-2 inline-block h-5 w-5 text-primary" />
            Detection
          </SelectItem>
          <SelectItem value={userLanguage}>
            <CircleFlag
              countryCode={getCountryCode(userLanguage) ?? 'gb'}
              height="20"
              width="20"
              className="mr-2 inline-block"
            />
            <span>{getCountryNameByCode(userLanguage)}</span>
          </SelectItem>
          {detLang && detLang !== userLanguage && (
            <SelectItem value={detLang}>
              <CircleFlag
                countryCode={getCountryCode(detLang) ?? 'gb'}
                height="20"
                width="20"
                className="mr-2 inline-block"
              />
              <span>{getCountryNameByCode(detLang)}</span>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      <input type="hidden" name="detLang" value={detLang} />
    </div>
  );
};
