import { DropdownMenuItem } from '@/components/data-display';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link2Icon } from 'lucide-react';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
interface ActionVideoAudioSettingProps {}
const ActionShowInvitation = ({}: ActionVideoAudioSettingProps) => {
  const { t } = useTranslation('common');
  const setModal = useVideoCallStore((state) => state.setModal);

  return (
    <>
      <DropdownMenuItem
        onClick={() => setModal('show-invitation')}
        className="dark:hover:bg-neutral-800"
      >
        <Link2Icon />
        <span className="ml-2">{t('CONVERSATION.SHOW_INVITATION_LINK')}</span>
      </DropdownMenuItem>
    </>
  );
};

export default memo(ActionShowInvitation);
