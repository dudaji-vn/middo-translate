import { Typography } from '@/components/data-display';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { COMMIT_SHA, LATEST_TAG } from '@/configs/commit-data';
import { NEXT_PUBLIC_NAME, NEXT_PUBLIC_URL } from '@/configs/env.public';
import { useElectron } from '@/hooks/use-electron';
import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { useBoolean } from 'usehooks-ts';

export interface VersionModalProps {
  trigger?: React.ReactNode;
}

export const VersionModal = ({ trigger }: VersionModalProps) => {
  const { toggle, value, setTrue } = useBoolean();
  const {electron, isElectron} = useElectron();
  const { data } = useQuery({
    queryKey: ['backend-version'],
    queryFn: async () => {
      const response = await axios(`${NEXT_PUBLIC_URL}/api/version`);

      return response.data as { tag: string; commit: string };
    },
  });

  const { tag: backendTag, commit: backendCommit } = data || {
    tag: '',
    commit: '',
  };

  return (
    <>
      <button onClick={setTrue}>{trigger}</button>
      <ConfirmAlertModal
        title={`${NEXT_PUBLIC_NAME} version`}
        description={``}
        open={value}
        onOpenChange={toggle}
        actionProps={{
          className: 'hidden',
        }}
        cancelProps={{
          content: 'Close',
        }}
      >
        <Typography variant="h6">Frontend:</Typography>
        <Typography className="text-xs text-neutral-600">
          Tag: {LATEST_TAG}
        </Typography>
        <Typography className="text-xs text-neutral-600">
          Commit: {COMMIT_SHA}
        </Typography>

        <Typography variant="h6">Backend:</Typography>
        <Typography className="text-xs text-neutral-600">
          Tag: {backendTag}
        </Typography>
        <Typography className="text-xs text-neutral-600">
          Commit: {backendCommit}
        </Typography>

        {isElectron && (
          <>
            <Typography variant="h6">Desktop App:</Typography>
            <Typography className="text-xs text-neutral-600">
              Version: {electron?.getAppVersion() ? ('v' + electron?.getAppVersion()) : 'Unknown'}
            </Typography>
          </>
        )}
      </ConfirmAlertModal>
    </>
  );
};
