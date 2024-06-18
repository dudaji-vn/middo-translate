import { Button } from '@/components/actions';
import { Avatar, Typography } from '@/components/data-display';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { Form, FormLabel } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Plus, Shield, UserRound } from 'lucide-react';
import React, { useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DataTable, DataTableProps } from '@/components/ui/data-table';
import { Member, makeMembersColumns } from './members-columns';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth.store';
import { isEmpty } from 'lodash';
import { ESPaceRoles } from '../../../settings/_components/space-setting/setting-items';
import { useTranslation } from 'react-i18next';
import customToast from '@/utils/custom-toast';

export enum ESPaceMemberStatus {
  Invited = 'invited',
  Joined = 'joined',
}

const items: Array<{
  name: 'admin' | 'member';
  icon: React.ReactNode;
}> = [
  {
    name: ESPaceRoles.Admin,
    icon: <Shield size={16} />,
  },
  {
    name: ESPaceRoles.Member,
    icon: <UserRound size={16} />,
  },
];

export type InviteMembersProps = {
  space: {
    name?: string;
    avatar?: string;
    members: Member[];
  };
  setMembers: (members: Member[]) => void;
  onAddMember?: (member: Member) => void;
  headerProps?: React.HTMLAttributes<HTMLDivElement>;
  spacePreviewProps?: React.HTMLAttributes<HTMLDivElement>;
  header?: React.ReactNode;
  tableProps?: DataTableProps<Member, any>;
  headerTitleProps?: React.HTMLAttributes<HTMLDivElement>;
  headerDescriptionProps?: React.HTMLAttributes<HTMLDivElement>;
  blackList?: string[];
  hideOwner?: boolean;
  allowedRoles?: ESPaceRoles[];
} & React.HTMLAttributes<HTMLDivElement>;

const InviteMembers = ({
  space,
  blackList,
  setMembers,
  spacePreviewProps,
  tableProps,
  header,
  headerProps,
  headerTitleProps,
  hideOwner = false,
  headerDescriptionProps,
  onAddMember,
  allowedRoles = [ESPaceRoles.Member],
  ...props
}: InviteMembersProps) => {
  const currentUser = useAuthStore((state) => state.user);
  const { t } = useTranslation('common');
  const addingSchema = z.object({
    email: z
      .string()
      .email({
        message: 'Invalid email address',
      })
      .min(1, {
        message: 'Email is required',
      })
      .refine(
        (value) => {
          return value !== currentUser?.email;
        },
        {
          message: 'You are already a member of this space',
        },
      )
      .refine(
        (value) => {
          if (isEmpty(blackList)) {
            return true;
          }
          return !blackList?.includes(value);
        },
        {
          message: 'This user has already been invited!',
        },
      ),
    role: z.union([
      z.literal('admin'),
      z.literal('member'),
      z.literal('owner'),
    ]),
    status: z.union([z.literal('invited'), z.literal('joined')]),
  });
  type TAddingMember = z.infer<typeof addingSchema>;
  const formAdding = useForm<TAddingMember>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      role: ESPaceRoles.Member,
      status: ESPaceMemberStatus.Invited,
    },
    resolver: zodResolver(addingSchema),
  });
  const invitedMembers = (space?.members || []) as Member[];
  const onAddUser = () => {
    if (onAddMember) {
      onAddMember(formAdding.getValues());
      formAdding.setValue('email', '');
      return;
    }
    if (setMembers) {
      const newInvitedMember = formAdding.getValues();
      if (!newInvitedMember.email || newInvitedMember.email.trim() == '') {
        return;
      }
      if (invitedMembers.find((m) => m.email === newInvitedMember.email)) {
        customToast.error('This user has already been invited');
        return;
      }
      setMembers([...invitedMembers, newInvitedMember as Member]);
    }
    formAdding.setValue('email', '');
  };
  const disabledInviteBtn =
    formAdding.formState.errors?.['email'] ||
    Boolean(
      formAdding.formState.isSubmitting ||
        invitedMembers.find(
          (e: Member) => e.email === formAdding.watch('email'),
        ) ||
        blackList?.includes(formAdding.watch('email')),
    );

  const tableRows = hideOwner
    ? invitedMembers
    : [
        ...invitedMembers,
        {
          email: currentUser?.email,
          role: ESPaceRoles.Owner,
          status: ESPaceMemberStatus.Joined,
        },
      ];

  const rolesOptions = items.filter((item) =>
    allowedRoles.includes(item.name as ESPaceRoles),
  );
  const defaultRole = useMemo(() => {
    return rolesOptions.find((role) => role.name === formAdding.watch('role'));
  }, [formAdding, rolesOptions]);

  return (
    <Form {...formAdding}>
      <section
        {...props}
        className={cn(
          'flex h-[calc(100vh-200px)]   min-h-80 w-full  max-w-6xl flex-col items-center justify-center gap-8 max-md:px-4',
          props.className,
        )}
      >
        {header ? (
          <React.Fragment>{header}</React.Fragment>
        ) : (
          <div className="flex w-full flex-col  gap-3" {...headerProps}>
            <Typography
              className="text-[32px] font-semibold leading-9 text-neutral-800 dark:text-neutral-50"
              {...headerTitleProps}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: t('MODAL.INVITE_MEMBERS.TITLE'),
                }}
              ></span>
            </Typography>
            <Typography
              className="flex gap-2 font-light text-neutral-600 dark:text-neutral-100"
              {...headerDescriptionProps}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: t('MODAL.INVITE_MEMBERS.DESCRIPTION'),
                }}
              />
            </Typography>
          </div>
        )}
        <div className="flex w-full flex-row items-start justify-between gap-3">
          <RHFInputField
            name="email"
            formLabel={t('EXTENSION.MEMBER.EMAIL')}
            formLabelProps={{
              className: 'text-neutral-600 dark:text-neutral-50',
            }}
            inputProps={{
              placeholder: 'Enter email address',
              className: 'h-10',
            }}
            formItemProps={{
              className: 'w-full',
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-col gap-3 py-2">
              <FormLabel className="text-neutral-600 dark:text-neutral-50">
                {t('EXTENSION.MEMBER.ROLE')}
              </FormLabel>
              <Button
                endIcon={<ChevronDown className="h-4 w-4" />}
                shape={'square'}
                type="button"
                disabled={formAdding.formState.isSubmitting}
                color={'default'}
                size={'xs'}
                className="w-fit  px-4 capitalize max-md:py-3 md:w-40"
              >
                {formAdding.watch('role') ? (
                  <>
                    <span className="max-sm:hidden">
                      {t(
                        `EXTENSION.ROLE.${formAdding.watch('role')?.toUpperCase()}`,
                      )}
                    </span>
                    <span className="sm:hidden">{defaultRole?.icon}</span>
                  </>
                ) : (
                  'Select a role'
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:border-neutral-800 dark:bg-neutral-900">
              {rolesOptions.map((option) => (
                <DropdownMenuItem
                  key={option.name}
                  onSelect={() => {
                    formAdding.setValue('role', option.name);
                  }}
                  className="flex flex-row gap-2 capitalize text-neutral-600 dark:text-neutral-50 dark:hover:bg-neutral-800"
                >
                  {option.icon}
                  {t(`EXTENSION.ROLE.${option.name?.toUpperCase()}`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex flex-col gap-3 py-2">
            <FormLabel className="invisible text-neutral-600 dark:text-neutral-50">
              Invite
            </FormLabel>
            <Button
              color="secondary"
              shape="square"
              onClick={onAddUser}
              loading={formAdding.formState.isSubmitting}
              endIcon={<Plus className="mr-1 h-4 w-4" />}
              className="!max-sm:w-8 h-10 min-w-28"
              disabled={disabledInviteBtn as boolean}
            >
              <span className="max-sm:hidden">{t('COMMON.ADD')}</span>
            </Button>
          </div>
        </div>
        <div
          className="flex w-full flex-row items-center gap-3 rounded-[12px] bg-primary-100 p-3 dark:bg-background"
          {...spacePreviewProps}
        >
          <Avatar
            variant={'outline'}
            src={space?.avatar || '/avatar.svg'}
            alt="avatar"
            className="size-[88px] cursor-pointer p-0"
          />
          <div className="flex w-full flex-col gap-1">
            <Typography className="text-[18px] font-semibold text-neutral-800 dark:text-neutral-50">
              {space?.name}
            </Typography>
            <Typography className="font-normal text-neutral-600 dark:text-neutral-50">
              {space?.members?.length} members
            </Typography>
          </div>
        </div>
        <DataTable
          customEmpty={t('EXTENSION.SPACE.NO_MEMBER')}
          tableHeadProps={{
            className: 'bg-transparent dark:bg-background dark:text-neutral-50',
          }}
          rowProps={{
            className:
              'rounded-full bg-primary-100 dark:bg-neutral-800 dark:text-neutral-50',
          }}
          columns={makeMembersColumns({
            t,
            onDelete: (member) => {
              setMembers(
                invitedMembers.filter((m) => m.email !== member.email),
              );
            },
          })}
          data={tableRows as Member[]}
          tableProps={{
            ...tableProps,
            className: 'max-md:h-[500px] overflow-y-auto',
          }}
        />
      </section>
    </Form>
  );
};

export default InviteMembers;
