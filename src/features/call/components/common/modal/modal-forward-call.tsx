import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/feedback';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { User } from '@/features/users/types';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth.store';
import { SelectedList } from '@/features/chat/rooms/components/selected-list';
import { SearchList } from '@/features/chat/rooms/components/search-list';
import { useVideoCallStore } from '../../../store/video-call.store';
import { getRoomService } from '@/services/room.service';
import { useParticipantVideoCallStore } from '../../../store/participant.store';
import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';
import { SearchInput } from '@/components/data-entry';
import { useTranslation } from 'react-i18next';
import ParticipantInVideoCall from '@/features/call/interfaces/participant';
import { getMembers, getSpaces } from '@/services/business-space.service';
import { useBusinessNavigationData } from '@/hooks';
import { useBoolean } from 'usehooks-ts';
import { Button } from '@/components/actions';
import customToast from '@/utils/custom-toast';

export const ModalForwardCall = () => {
    const {t} = useTranslation("common");
    const setModal = useVideoCallStore((state) => state.setModal);
    const modal = useVideoCallStore((state) => state.modal);
    const setRoom = useVideoCallStore((state) => state.setRoom);
    const clearStateVideoCall = useVideoCallStore((state) => state.clearStateVideoCall);
    const room = useVideoCallStore((state) => state.room);
    const participants = useParticipantVideoCallStore(state => state.participants)
    const [members, setMembers] = useState<User[]>([]);
    const [membersApi, setMembersApi] = useState<User[]>([]);
    const {spaceId} = useBusinessNavigationData()
    const {value: isOpenConfirm, toggle: toggleOpenConfirm} = useBoolean(false);
    useEffect(() => {
        if (!room || !room.roomId) return;
        if(!spaceId) return;
        const fetchMembersInGroup = async () => {
            try {
                if(!spaceId || typeof spaceId !== 'string') return;
                const res = await getMembers(spaceId)
                const {data: members } = res;
                let membersJoined = members?.filter((m: {status: string, user: User}) => m.status == 'joined')
                setMembers(membersJoined.map((m: {status: string, user: User}) => m.user) || [])
                setMembersApi(membersJoined.map((m: {status: string, user: User}) => m.user) || [])
            } catch {
                customToast.error(t('BACKEND.MESSAGE.SOMETHING_WRONG'));
            }
            
        }
        fetchMembersInGroup();
    }, [room, spaceId])
    const [selectedUser, setSelectedUsers] = useState<User>();
    const user = useAuthStore((state) => state.user);

    const filteredUsers = useMemo(() => {
        return members?.filter((u) => {
            if (u._id === user?._id) return false;
            if (participants.some((p) => p?.user?._id === u._id)) return false;
            return true;
        });
    }, [members, participants, user?._id]);

    const handleSelectUser = useCallback((user: User) => {
        setSelectedUsers(user);
    }, []);

    const handleSubmit = () => { 
        setModal();
        if(!selectedUser) return;
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.INVITE_TO_CALL, {
            users: [selectedUser],
            call: room,
            user,
            type: 'help_desk'
        })
        setRoom();
        clearStateVideoCall();
    };
    const handleChangeSearch = (e: React.FormEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        const filteredMembers: User[] = membersApi.filter((m) => {
            if(m.email?.includes(val)) return true;
            if(m.name?.includes(val)) return true;
            return false;
        })
        setMembers(filteredMembers);
    }
    return (
        <div>
            <AlertDialog open={modal == 'forward-call'} onOpenChange={() => setModal()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('MODAL.FORWARD_CALL.TITLE')}</AlertDialogTitle>
                        <div>
                            <SearchInput
                                onChange={handleChangeSearch}
                                placeholder={t('COMMON.SEARCH')}
                            />
                        </div>
                        <div className="-mx-5 max-h-[256px] overflow-y-auto pt-4">
                            <SearchList
                                items={filteredUsers ?? []}
                                onItemClick={handleSelectUser}
                                selectedItems={selectedUser ? [selectedUser] : []}
                                itemClassName="!px-5"
                            />
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="mr-4">{t('COMMON.CANCEL')}</AlertDialogCancel>
                        <Button
                            shape={'square'}
                            size={'sm'}
                            disabled={!selectedUser}
                            onClick={toggleOpenConfirm}
                        >
                            {t('COMMON.FORWARD_CALL')}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isOpenConfirm} onOpenChange={() => toggleOpenConfirm()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('MODAL.FORWARD_CALL.TITLE')}</AlertDialogTitle>
                        <AlertDialogDescription className="mt-2 md:mt-0 dark:text-neutral-50">
                            <span dangerouslySetInnerHTML={{__html: t('MODAL.FORWARD_CALL.DESCRIPTION', {username: selectedUser?.username})}}></span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="mr-4">{t('COMMON.CANCEL')}</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={!selectedUser}
                            onClick={handleSubmit}
                        >
                            {t('COMMON.FORWARD_CALL')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
