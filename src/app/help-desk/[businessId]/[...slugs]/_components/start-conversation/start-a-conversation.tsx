'use client';

import { extensionsCustomThemeOptions } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/sections/options';
import { Button } from '@/components/actions';
import { Avatar, Typography } from '@/components/data-display';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { InputSelectLanguage } from '@/components/form/input-select-language';
import { Sheet, SheetContent, SheetTrigger } from '@/components/navigation';
import { Form } from '@/components/ui/form';
import { SUPPORTED_LANGUAGES } from '@/configs/default-language';
import { createGuestInfoSchema } from '@/configs/yup-form';
import { TBusinessExtensionData } from '@/features/chat/help-desk/api/business.service';
import { messageApi } from '@/features/chat/messages/api';
import { Room } from '@/features/chat/rooms/types';
import useClient from '@/hooks/use-client';
import { startAGuestConversation } from '@/services/extension.service';
import {
  LSK_VISITOR_DATA,
  LSK_VISITOR_ID,
  LSK_VISITOR_ROOM_ID,
} from '@/types/business.type';
import { cn } from '@/utils/cn';
import { announceToParent } from '@/utils/iframe-util';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getConnectedEdges } from 'reactflow';
import { z } from 'zod';

export type TGuestRoom = {
  clientTempId: string;
  content: string;
  contentEnglish: string;
  language: string;
  roomId: string;
  userId: string;
};
export type TStartAConversation = {
  businessId: string;
  name: string;
  language: string;
  email: string;
};

const StartAConversation = ({
  extensionData,
  isAfterDoneAConversation,
  fromDomain,
  visitorData,
}: {
  isAfterDoneAConversation?: boolean;
  fromDomain?: string;
  extensionData: TBusinessExtensionData;
  visitorData?: any;
}) => {
  const router = useRouter();
  const isClient = useClient();
  const { user: owner, space } = extensionData || {};
  const theme =
    extensionsCustomThemeOptions.find(
      (item) =>
        item.name === extensionData.color || item.hex === extensionData.color,
    ) || extensionsCustomThemeOptions[0];
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const showForm = () => {
    announceToParent({
      type: 'show-form',
    });
    setOpen(true);
  };
  const hideForm = () => {
    announceToParent({
      type: 'hide-form',
    });
    setOpen(false);
  };
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      language: '',
    },
    resolver: zodResolver(createGuestInfoSchema),
  });
  const {
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = methods;
  const chatFlow = extensionData.chatFlow;
  const appendFirstMessageFromChatFlow = async (
    roomId: Room['_id'],
    language: string,
  ) => {
    if (!chatFlow) return;
    const { nodes, edges } = chatFlow;
    const rootNode = nodes.find((node) => node.type === 'root');
    if (!rootNode) return;

    const rootEdges = getConnectedEdges([rootNode], edges)[0] || {};
    const rootChild = nodes.find((node) => node.id === rootEdges.target);
    if (!rootChild) return;
    const childrenActions = nodes.filter(
      (node) =>
        node.parentNode === rootChild.id || node.parentId === rootChild.id,
    );
    const messType = rootChild.type === 'form' ? 'flow-form' : 'flow-actions';
    const payload = {
      content: rootChild.data?.content,
      roomId,
      type: messType,
      language: language,
      mentions: [],
      actions: childrenActions,
      userId: owner?._id,
      formId: rootChild?.form,
    };

    await messageApi.sendAnonymousMessage({
      ...payload,
      senderType: 'bot',
      clientTempId: new Date().toISOString(),
    });
  };
  const addDetectVisitorLanguage = () => {
    // const visitorCountry = visitorData;
    const browserLanguage = navigator.language;
    let language = SUPPORTED_LANGUAGES.find((item) =>
      browserLanguage.includes(item.code),
    );
    if (language?.code) setValue('language', language.code);
  };
  useEffect(() => {
    announceToParent({
      type: 'update-primary-color',
      payload: { themeColor: theme.name },
    });
    const visitorId = localStorage.getItem(LSK_VISITOR_ID);
    const visitorRoomId = localStorage.getItem(LSK_VISITOR_ROOM_ID);
    localStorage.setItem(LSK_VISITOR_DATA, JSON.stringify(visitorData));
    addDetectVisitorLanguage();
    if (visitorId && visitorRoomId) {
      announceToParent({ type: 'room-found' });
      router.push(
        `/help-desk/${extensionData._id}/${visitorRoomId}/${visitorId}?themeColor=${theme.name}&originReferer=${fromDomain}`,
      );
    }
  }, []);

  if (!isClient) return null;
  const submitStartAChat = async (
    values: z.infer<typeof createGuestInfoSchema>,
  ) => {
    try {
      setLoading(true);
      await startAGuestConversation({
        businessId: extensionData._id,
        fromDomain,
        ...values,
      }).then(async (res) => {
        const roomId = res.data.roomId;
        const user = res.data.user;
        announceToParent({ type: 'room-found' });
        localStorage.setItem(LSK_VISITOR_ROOM_ID, roomId);
        localStorage.setItem(LSK_VISITOR_ID, user._id);
        await appendFirstMessageFromChatFlow(roomId, values.language);

        router.push(
          `/help-desk/${extensionData._id}/${roomId}/${user._id}?themeColor=${theme.name}&originReferer=${fromDomain}`,
        );
      });
    } catch (error) {
      console.error('Error in create a guest conversation', error);
    }
  };
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col justify-between',
        isAfterDoneAConversation ? 'my-auto max-h-60' : 'container-height pb-5',
      )}
    >
      {isAfterDoneAConversation ? (
        <div className="m-auto flex max-w-screen-md flex-col items-center gap-4  px-4 py-3 ">
          <Typography variant={'h4'} className="text-lg">
            Thank you!
          </Typography>
          <Typography>
            Conversation end. <br /> Your rating has been sent successfully.
          </Typography>
        </div>
      ) : (
        <div className="flex size-full flex-col justify-stretch gap-2 pt-4">
          <div className="relative  flex aspect-square h-fit max-h-[100px] w-full  flex-none flex-row items-center  gap-2 overflow-hidden px-3">
            <Avatar
              variant={'outline'}
              src={space?.avatar ?? '/avatar.svg'}
              alt={'avatar-sender'}
              className="size-24  border border-neutral-50 p-1"
            />
            <div className="flex h-fit w-full flex-col gap-1">
              <p className="max-h-fit text-base font-normal text-neutral-600">
                Conversation with
              </p>
              <p className="max-h-fit text-[24px] font-semibold text-neutral-800">
                {space?.name}
              </p>
            </div>
          </div>
        </div>
      )}
      <Sheet
        open={open}
        onOpenChange={(open) => {
          open ? showForm() : hideForm();
        }}
      >
        <SheetContent
          side="bottom"
          className={
            open ? 'w-full  bg-white shadow-sm max-md:rounded-t-2xl' : 'hidden'
          }
        >
          <Form {...methods}>
            <form
              onSubmit={handleSubmit(submitStartAChat)}
              className="mx-auto flex max-w-md flex-col justify-center space-y-4"
            >
              <Typography className="w-full text-center text-2xl font-semibold leading-7 tracking-normal text-neutral-600">
                Guest sign in
              </Typography>
              <RHFInputField
                name="name"
                formLabel="Name"
                formLabelProps={{ className: 'pl-0' }}
                inputProps={{
                  placeholder: 'Enter your name',
                }}
              />
              <RHFInputField
                name="email"
                formLabel="Email"
                formLabelProps={{ className: 'pl-0' }}
                inputProps={{
                  placeholder: 'Enter your email',
                }}
              />
              <InputSelectLanguage
                className="mt-5 rounded-md"
                field="language"
                setValue={setValue}
                defaultValue={watch('language')}
                errors={errors.language}
                trigger={trigger}
                labelProps={{ className: 'ml-0 mb-2' }}
              />
              <Button
                variant={'default'}
                type={'submit'}
                shape={'square'}
                disabled={isSubmitting}
                color={'primary'}
                loading={isSubmitting || loading}
                className="h-11  w-full "
                style={{ backgroundColor: theme.hex }}
              >
                Start Conversation
              </Button>
            </form>
          </Form>
        </SheetContent>
        <SheetTrigger className="w-full p-5 pt-3">
          <Button
            className="mx-auto  w-full px-7 py-4"
            variant={'default'}
            color={'primary'}
            shape={'square'}
            type={'button'}
            onClick={showForm}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isAfterDoneAConversation
              ? 'Click to start a new conversation!'
              : 'Click to start a conversation'}
          </Button>
        </SheetTrigger>
      </Sheet>
    </div>
  );
};

export default StartAConversation;
