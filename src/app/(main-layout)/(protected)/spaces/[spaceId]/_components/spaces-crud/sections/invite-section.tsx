import { Button } from '@/components/actions';
import { Avatar, Typography } from '@/components/data-display';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { Form, FormLabel } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Plus, Shield, UserRound } from 'lucide-react';
import React from 'react';
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
        toast.error('This user has already been invited');
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

  return (
    <Form {...formAdding}>
      <section
        {...props}
        className={cn(
          'flex h-[calc(100vh-200px)] min-h-80  max-w-6xl flex-col items-center justify-center gap-8',
          props.className,
        )}
      >
        {header ? (
          <React.Fragment>{header}</React.Fragment>
        ) : (
          <div className="flex w-full flex-col  gap-3" {...headerProps}>
            <Typography
              className="text-[32px] font-semibold leading-9 text-neutral-800"
              {...headerTitleProps}
            >
              <span className="mr-2 text-primary-500-main">Invite</span>other to
              join your space&nbsp;
              <span className="text-[24px] font-normal">(optional)</span>
            </Typography>
            <Typography
              className="flex gap-2 font-light text-neutral-600"
              {...headerDescriptionProps}
            >
              You can only invite 2 members in a Free plan account.
              <span className="font-normal text-primary-500-main">
                upgrade plan.
              </span>
            </Typography>
          </div>
        )}
        <div className="flex w-full flex-row items-start justify-between gap-3">
          <RHFInputField
            name="email"
            formLabel={t('EXTENSION.MEMBER.EMAIL')}
            formLabelProps={{
              className: 'text-neutral-600',
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
              <FormLabel className="text-neutral-600">
                {t('EXTENSION.MEMBER.ROLE')}
              </FormLabel>
              <Button
                endIcon={<ChevronDown className="h-4 w-4" />}
                shape={'square'}
                type="button"
                disabled={formAdding.formState.isSubmitting}
                color={'default'}
                size={'xs'}
                className="w-40 px-4 capitalize"
              >
                {formAdding.watch('role')
                  ? t(
                      `EXTENSION.ROLE.${formAdding.watch('role')?.toUpperCase()}`,
                    )
                  : 'Select a role'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {rolesOptions.map((option) => (
                <DropdownMenuItem
                  key={option.name}
                  onSelect={() => {
                    formAdding.setValue('role', option.name);
                  }}
                  className="flex flex-row gap-2 capitalize text-neutral-600"
                >
                  {option.icon}
                  {t(`EXTENSION.ROLE.${option.name?.toUpperCase()}`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex flex-col gap-3 py-2">
            <FormLabel className="invisible text-neutral-600">Invite</FormLabel>
            <Button
              color="secondary"
              shape="square"
              onClick={onAddUser}
              loading={formAdding.formState.isSubmitting}
              endIcon={<Plus className="mr-1 h-4 w-4" />}
              className="h-10"
              disabled={disabledInviteBtn as boolean}
            >
              {t('COMMON.ADD')}
            </Button>
          </div>
        </div>
        <div
          className="flex w-full flex-row items-center gap-3 rounded-[12px] bg-primary-100 p-3"
          {...spacePreviewProps}
        >
          <Avatar
            variant={'outline'}
            src={space?.avatar || '/avatar.svg'}
            alt="avatar"
            className="size-[88px] cursor-pointer p-0"
          />
          <div className="flex w-full flex-col gap-1">
            <Typography className="text-[18px] font-semibold text-neutral-800">
              {space?.name}
            </Typography>
            <Typography className="font-normal text-neutral-600">
              {space?.members?.length} members
            </Typography>
          </div>
        </div>
        <DataTable
          tableHeadProps={{
            className: 'bg-transparent',
          }}
          rowProps={{
            className: 'rounded-full bg-primary-100',
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
          {...tableProps}
        />
      </section>
    </Form>
  );
};

export default InviteMembers;
