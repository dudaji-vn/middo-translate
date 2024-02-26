import { SearchInput } from '@/components/data-entry';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/feedback';
import { Select } from '@/features/chat/rooms/components/room-select';
import { Room } from '@/features/chat/rooms/types';
import { searchApi } from '@/features/search/api';
import { User } from '@/features/users/types';
import { useSearch } from '@/hooks/use-search';
import { useId, useMemo, useState } from 'react';
import { MessageEditorTextProvider } from '../message-editor/message-editor-text-context';
import { MessageEditorToolbar } from '../message-editor/message-editor-toolbar';
import { TextInput } from '../message-editor/message-editor-text-input';
import { detectLanguage, translateText } from '@/services/languages.service';
import { useChatStore } from '@/features/chat/store';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useMutation } from '@tanstack/react-query';
import { messageApi } from '../../api';
import { Message } from '../../types';
import { useGetRoomsRecChat } from '@/features/recommendation/hooks';
import { Section } from '@/components/data-display';
import { useAuthStore } from '@/stores/auth.store';

export interface ForwardModalProps {
  onClosed?: () => void;
  message: Message;
}

export const ForwardModal = ({ message, onClosed }: ForwardModalProps) => {
  const { data, setSearchTerm } = useSearch<{
    rooms: Room[];
    users: User[];
  }>(searchApi.inboxes, 'forward');
  const { data: recData } = useGetRoomsRecChat();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { mutate } = useMutation({
    mutationFn: messageApi.forward,
    onSuccess: () => {
      onClosed?.();
    },
  });

  const setSrcLang = useChatStore((s) => s.setSrcLang);
  const srcLang = useChatStore((s) => s.srcLang);

  const items: Room[] = useMemo(() => {
    const rooms: Room[] = [];
    if (data?.users) {
      data.users.forEach((u) => {
        rooms.push({
          _id: u._id,
          name: u.name,
          avatar: u.avatar,
          isGroup: false,
          participants: [u],
          isSetName: true,
          status: 'active',
          link: '',
          admin: u,
        });
      });
    }
    if (data?.rooms) {
      rooms.push(...data.rooms);
    }
    return rooms;
  }, [data]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get('message') as string;
    let language = srcLang;
    if (content) {
      if (language === 'auto') {
        language = formData.get('detLang') as string;
        if (!language) {
          language = await detectLanguage(content);
        }
      }
      setSrcLang(language);
    }
    let contentEnglish = formData.get('messageEnglish') as string;
    if (!contentEnglish) {
      contentEnglish = await translateText(
        content,
        language,
        DEFAULT_LANGUAGES_CODE.EN,
      );
    }

    mutate({
      forwardedMessageId: message._id,
      roomIds: selectedIds,
      message: { content, contentEnglish, language },
    });
  };

  const id = useId();

  const currentUser = useAuthStore((s) => s.user);

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Forward to</AlertDialogTitle>
        </AlertDialogHeader>
        <Select onSelectChange={setSelectedIds} items={items || []}>
          <SearchInput
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for people or groups"
          />
          <Select.Listed />
          <div className="-mx-5 max-h-[200px] overflow-y-auto border-b">
            <Select.List />
            {recData && recData.length > 0 && !data && (
              <Section label="Recently" labelClassName="pl-2.5">
                {recData?.map((room) => {
                  if (!room.isGroup) {
                    let user = currentUser;
                    room.participants.forEach((u) => {
                      if (u._id !== currentUser?._id) {
                        user = u;
                      }
                    });
                    room._id = user?._id || '';
                  }
                  return <Select.Item key={room._id} item={room} />;
                })}
              </Section>
            )}
          </div>
        </Select>

        <form id={id} onSubmit={handleSubmit} className="flex flex-col gap-2">
          <MessageEditorTextProvider>
            <MessageEditorToolbar disableMedia />
            <div className="relative flex w-full items-center gap-2">
              <div className="flex-1 items-center gap-2 rounded-[1.5rem]  border border-primary bg-card p-1 px-4 shadow-sm">
                <div className="flex min-h-9 flex-1">
                  <TextInput />
                </div>
              </div>
            </div>
          </MessageEditorTextProvider>
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClosed} className="mr-4">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={selectedIds.length === 0}
            form={id}
            type="submit"
          >
            Forward
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
