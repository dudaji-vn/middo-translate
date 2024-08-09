import { Button } from '@/components/actions';
import { Avatar, Typography } from '@/components/data-display';
import { Input } from '@/components/data-entry';
import { DataTableProps } from '@/components/ui/data-table';
import { cn } from '@/utils/cn';
import { PenIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Member } from './members-columns';
import toast from 'react-hot-toast';
export const defaultTeams = ['Administrator'];

export enum EStationMemberStatus {
  Invited = 'invited',
  Joined = 'joined',
}

export type CreateTeamsProps = {
  station: {
    name?: string;
    avatar?: string;
    members: Member[];
    teams: string[];
  };
  onSetTeams?: (teams: string[]) => void;
  onAddTeam?: (team: string) => void;
  headerProps?: React.HTMLAttributes<HTMLDivElement>;
  stationPreviewProps?: React.HTMLAttributes<HTMLDivElement>;
  header?: React.ReactNode;
  tableProps?: DataTableProps<Member, any>;
  headerTitleProps?: React.HTMLAttributes<HTMLDivElement>;
  headerDescriptionProps?: React.HTMLAttributes<HTMLDivElement>;
  blackList?: string[];
  hideOwner?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;
const CreateTeams = ({
  onSetTeams,
  station,
  blackList,
  stationPreviewProps,
  tableProps,
  header,
  headerProps,
  headerTitleProps,
  hideOwner = false,
  headerDescriptionProps,
  ...props
}: CreateTeamsProps) => {
  const { t } = useTranslation('common');

  const [teams, setTeams] = React.useState<string[]>(station?.teams);
  const [currentEditing, setCurrentEditing] = React.useState<string | null>(
    null,
  );

  const handleAddTeam = (team: string) => {
    if (teams.includes(team)) {
      toast.error('Team already exists');
      return;
    }
    setTeams([...teams, team]);
  };

  const handleEditTeam = (team: string, newName: string) => {
    const newTeams = teams.map((t) => (t === team ? newName : t));
    setTeams(newTeams);
  };

  const handleRemoveTeam = (team: string) => {
    const newTeams = teams.filter((t) => t !== team);
    setTeams(newTeams);
  };

  useEffect(() => {
    onSetTeams?.(teams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams]);

  return (
    <section
      {...props}
      className={cn(
        'flex h-full min-h-80  w-full flex-1  flex-col items-center justify-center overflow-hidden max-md:px-4 md:max-w-4xl',
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
                __html: t('MODAL.CREATE_STATION.CREATE_TEAM.TITLE'),
              }}
            ></span>
          </Typography>
          <Typography
            className="flex gap-2 font-light text-neutral-600 dark:text-neutral-100"
            {...headerDescriptionProps}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: t('MODAL.CREATE_STATION.CREATE_TEAM.DESCRIPTION'),
              }}
            />
          </Typography>
        </div>
      )}
      <div
        className="mb-5 mt-8 flex w-full flex-row items-center gap-3 rounded-[12px] bg-primary-100 p-3 dark:bg-background"
        {...stationPreviewProps}
      >
        <Avatar
          variant={'outline'}
          src={station?.avatar || '/avatar.svg'}
          alt="avatar"
          className="size-[88px] cursor-pointer p-0"
        />
        <div className="flex w-full flex-col gap-1">
          <Typography className="text-[18px] font-semibold text-neutral-800 dark:text-neutral-50">
            {station?.name}
          </Typography>
          <Typography className="font-normal text-neutral-600 dark:text-neutral-50">
            {station?.teams?.length || 0} teams
          </Typography>
        </div>
      </div>
      <div className="w-full flex-1 flex-col items-start justify-start overflow-y-auto">
        <Typography variant="bodySmall">Team list</Typography>
        <div className="mt-2 flex flex-col gap-2">
          {teams.map((team) => {
            const isEditing = currentEditing === team;
            if (isEditing) {
              return (
                <TeamItemEditor
                  key={team}
                  name={team}
                  onSave={(newName) => {
                    handleEditTeam(team, newName);
                    setCurrentEditing(null);
                  }}
                  onCancel={() => setCurrentEditing(null)}
                />
              );
            }
            return (
              <TeamItem
                onEdit={() => setCurrentEditing(team)}
                onRemove={() => handleRemoveTeam(team)}
                actionDisabled={defaultTeams.includes(team)}
                key={team}
                name={team}
              />
            );
          })}
        </div>
        <AddNewTeam onAddTeam={(team) => handleAddTeam(team)} />
      </div>
    </section>
  );
};

const TeamItem = ({
  name,
  actionDisabled,
  onEdit,
  onRemove,
}: {
  name: string;
  actionDisabled?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex-1 rounded-xl bg-primary-100 p-3 px-4">
        <Typography>{name}</Typography>
      </div>

      <div className="flex gap-1">
        <Button.Icon
          onClick={onEdit}
          disabled={actionDisabled}
          color="default"
          variant="ghost"
          size="xs"
        >
          <PenIcon />
        </Button.Icon>
        <Button.Icon
          onClick={onRemove}
          disabled={actionDisabled}
          color="error"
          variant="ghost"
          size="xs"
        >
          <Trash2Icon />
        </Button.Icon>
      </div>
    </div>
  );
};

const TeamItemEditor = ({
  name,
  onSave,
  onCancel,
}: {
  name: string;
  onSave?: (value: string) => void;
  onCancel?: () => void;
}) => {
  const [value, setValue] = React.useState(name);
  return (
    <div className="flex items-center gap-1">
      <Input
        onKeyDown={(e) => {
          switch (e.key) {
            case 'Escape':
              onCancel?.();
              break;
            case 'Enter':
              onSave?.(value);
              break;
          }
        }}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
        wrapperProps={{ className: 'flex-1' }}
        className="w-full "
        placeholder="Enter team name here"
        value={value}
      />

      <Button
        disabled={!value}
        onClick={() => onSave?.(value)}
        shape="square"
        size="md"
      >
        Save
      </Button>
      <Button onClick={onCancel} shape="square" color="default" size="md">
        Cancel
      </Button>
    </div>
  );
};

const AddNewTeam = ({ onAddTeam }: { onAddTeam: (team: string) => void }) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const handleAddTeam = (team: string) => {
    onAddTeam(team);
    setIsAdding(false);
  };
  return (
    <React.Fragment>
      {isAdding ? (
        <div className="mt-2">
          <TeamItemEditor
            name=""
            onSave={handleAddTeam}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      ) : (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => setIsAdding(true)}
            color="secondary"
            size="sm"
            shape="square"
            startIcon={<PlusIcon />}
          >
            Add new team
          </Button>
        </div>
      )}
    </React.Fragment>
  );
};

export default CreateTeams;
