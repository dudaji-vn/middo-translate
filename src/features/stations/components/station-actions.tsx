import { DeleteStationModal } from '@/app/(main-layout)/(protected)/stations/station-crud/station-deletion';
import {
  CameraIcon,
  InfoIcon,
  LogOutIcon,
  PenIcon,
  Trash2Icon,
} from 'lucide-react';
import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { Station } from '../types/station.types';
import StationInformationModal from './station-information-modal';
import StationUpdateAvatar from './station-update-avatar-modal';
import { StationUpdateName } from './station-update-name-modal';
import { useRouter } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { StationLeaveModal } from './station-leave-modal';

export type Action = 'name' | 'avatar' | 'info' | 'delete' | 'none' | 'leave';

export type ActionItem = {
  action: Action;
  label: string;
  icon: JSX.Element;
  color?: string;
  disabled?: boolean;
  renderItem?: (params: {
    item: Omit<ActionItem, 'renderItem'> & { onAction: () => void };
    station: Station;
    setOpen: (value: boolean) => void;
  }) => JSX.Element | ReactNode;
};

type OnActionParams = {
  action: Action;
  station: Station;
};
export interface StationActionsContextProps {
  onAction: (params: OnActionParams) => void;
  actionItems: ActionItem[];
}
const StationActionsContext = createContext<
  StationActionsContextProps | undefined
>(undefined);
export const useStationActions = () => {
  const context = useContext(StationActionsContext);
  if (context === undefined) {
    throw new Error('useStationActions must be used within a Station');
  }
  return context;
};
export const StationActions = ({ children }: { children: React.ReactNode }) => {
  const [station, setStation] = useState<Station | null>(null);
  const router = useRouter();
  const [action, setAction] = useState<Action>('none');
  const onAction = ({ action, station }: OnActionParams) => {
    switch (action) {
      default:
        setAction(action);
        setStation(station);
        break;
    }
  };
  const reset = () => {
    setAction('none');
    setStation(null);
  };

  const Modal = useMemo(() => {
    if (!station) return null;
    switch (action) {
      case 'name':
        return <StationUpdateName station={station} onClosed={reset} />;
      case 'avatar':
        return <StationUpdateAvatar station={station} onClosed={reset} />;
      case 'info':
        return <StationInformationModal station={station} onClosed={reset} />;
      case 'leave':
        return <StationLeaveModal onClosed={reset} stationId={station._id} />;
      case 'delete':
        return (
          <DeleteStationModal
            onDeleted={() => router.replace(ROUTE_NAMES.STATIONS)}
            onclose={reset}
            open={true}
            station={station}
          />
        );

      default:
        return null;
    }
  }, [action, station]);

  const actionItems: ActionItem[] = useMemo(() => {
    return [
      {
        action: 'name',
        label: 'COMMON.CHANGE_NAME',
        icon: <PenIcon />,
      },

      {
        action: 'avatar',
        label: 'COMMON.CHANGE_AVATAR',
        icon: <CameraIcon />,
      },

      {
        action: 'info',
        label: 'COMMON.INFORMATION',
        icon: <InfoIcon />,
      },
      {
        action: 'leave',
        label: 'CONVERSATION.LEAVE_STATION',
        icon: <LogOutIcon />,
        color: 'error',
      },
      {
        action: 'delete',
        label: 'COMMON.DELETE_STATION',
        icon: <Trash2Icon />,
        color: 'error',
      },
    ] as ActionItem[];
  }, []);

  return (
    <StationActionsContext.Provider
      value={{
        onAction,
        actionItems,
      }}
    >
      {children}
      {Modal}
    </StationActionsContext.Provider>
  );
};
