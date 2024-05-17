import React, { use, useEffect, useMemo, useState } from 'react';
import ScriptsList from '../../../../scripts/_components/scripts-list/scripts-list';
import { useFormContext } from 'react-hook-form';
import { isEmpty } from 'lodash';
import { useGetConversationScripts } from '@/features/conversation-scripts/hooks/use-get-conversation-scripts';
import { useParams } from 'next/navigation';

const ScriptsSelection = () => {
  const { setValue, watch } = useFormContext();
  const [search, setSearch] = useState('');
  const params = useParams();
  const spaceId = params?.spaceId as string;
  const currentScript = watch('currentScript');
  const firstMessage = watch('custom.firstMessage');
  const rowSelection = useMemo(() => {
    return currentScript ? { [currentScript]: true } : {};
  }, [currentScript]);

  const { data, isLoading } = useGetConversationScripts({
    search,
    spaceId,
  });
  const onSearchChange = (search: string) => {
    setSearch(search);
  };

  const handleSelectScript = (updater: any) => {
    const updated = updater();
    if (!isEmpty(updated)) {
      setValue('currentScript', Object.keys(updated)[0]);
      setValue('custom.firstMessage', watch('currentScript'));
    }
  };
  useEffect(() => {
    if (!firstMessage && currentScript) {
      console.log('setting first message');
      setValue('custom.firstMessage', currentScript);
      return;
    }
    if (!currentScript && data?.items?.length) {
      console.log('setting current script');
      setValue('currentScript', data.items[0]._id);
    }
  }, []);

  return (
    <ScriptsList
      headerProps={{
        className: 'justify-between',
      }}
      titleProps={{
        className: 'hidden',
      }}
      tableProps={{
        tableInitialParams: {
          onRowSelectionChange: handleSelectScript,
          state: {
            rowSelection,
          },
          enableMultiRowSelection: false,
          getRowId: (row) => row._id,
        },
      }}
      enableSelectAll={false}
      enableDeletion={false}
      scripts={data?.items || []}
      search={search}
      onSearchChange={onSearchChange}
      isLoading={isLoading}
    />
  );
};

export default ScriptsSelection;
