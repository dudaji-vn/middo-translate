import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/feedback';
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

export const ModalForwardCall = () => {
    const {t} = useTranslation("common");
    const setModal = useVideoCallStore((state) => state.setModal);
    const modal = useVideoCallStore((state) => state.modal);
    const room = useVideoCallStore((state) => state.room);
    const participants = useParticipantVideoCallStore(state => state.participants)
    const [members, setMembers] = useState<User[]>([]);
    const [membersApi, setMembersApi] = useState<User[]>([]);
    
    useEffect(() => {
        if (!room || !room.roomId) return;
        const fetchMembersInGroup = async () => {
            const res = await getRoomService(room.roomId)
            const { data } = res;
            setMembers(data?.participants || [])
            setMembersApi(data?.participants || [])
        }
        fetchMembersInGroup();
    }, [room])
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const user = useAuthStore((state) => state.user);

    const filteredUsers = useMemo(() => {
        return members?.filter((u) => {
            if (u._id === user?._id) return false;
            if (participants.some((p) => p?.user?._id === u._id)) return false;
            return true;
        });
    }, [members, participants, user?._id]);

    const handleSelectUser = useCallback((user: User) => {
        setSelectedUsers((prev) => {
            let newSelectedUsers = [];
            const index = prev.findIndex((u) => u._id === user._id);
            if (index === -1) {
                newSelectedUsers = [...prev, user];
            } else {
                newSelectedUsers = [...prev.slice(0, index), ...prev.slice(index + 1)];
            }

            return newSelectedUsers;
        });
    }, []);
    const handleUnSelectUser = useCallback((user: User) => {
        setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id));
    }, []);

    const handleSubmit = () => { 
        socket.emit(SOCKET_CONFIG.EVENTS.CALL.INVITE_TO_CALL, {
            users: selectedUsers,
            room,
            user
        })
        setSelectedUsers([]);
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
                        <AlertDialogTitle>{t('MODAL.ADD_USER.TITLE')}</AlertDialogTitle>
                        <div className={cn(selectedUsers.length > 0 && 'border-b pb-4')}>
                            <SearchInput
                                onChange={handleChangeSearch}
                                placeholder={t('COMMON.SEARCH')}
                            />
                            <SelectedList
                                items={selectedUsers}
                                onItemClick={handleUnSelectUser}
                            />
                        </div>
                        <div className="-mx-5 max-h-[256px] overflow-y-auto pt-4">
                            <SearchList
                                items={filteredUsers ?? []}
                                onItemClick={handleSelectUser}
                                selectedItems={selectedUsers}
                                itemClassName="!px-5"
                            />
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="mr-4">{t('COMMON.CANCEL')}</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={selectedUsers.length === 0}
                            onClick={handleSubmit}
                        >
                            {t('COMMON.ADD')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
