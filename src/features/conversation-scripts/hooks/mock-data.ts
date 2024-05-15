import { ChatScript } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/scripts/_components/column-def/scripts-columns';

export const mockScriptData: ChatScript[] = [
  {
    _id: '1',
    name: 'Shoe Store',
    createdBy: {
      _id: '12',
      email: 'linh',
      name: 'Linh',
      status: 'active',
    },
    lastEditedBy: {
      _id: '11',
      email: 'hi',
      name: 'Jay',
      status: 'active',
    },
    createdAt: '2021-10-10',
    updatedAt: '2021-10-10',
    chatFlow: {
      nodes: [],
      edges: [],
    },
  },
  {
    _id: '2',
    name: 'Marketing Milk Tea',
    createdBy: {
      _id: '123',
      email: 'hoan',
      name: 'Kim Hoan',
      status: 'active',
    },
    lastEditedBy: {
      _id: '22',
      email: 'hi',
      name: 'Huyen Nguyen',
      status: 'active',
    },
    createdAt: '2021-10-10',
    updatedAt: '2021-10-10',
    chatFlow: {
      nodes: [],
      edges: [],
    },
  },
];