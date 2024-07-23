import { BusinessForm } from '@/types/forms.type';
import React from 'react';

const Submissions = ({
  submissions,
}: {
  submissions: BusinessForm['submissions'];
}) => {
  console.log('submissions:>>', submissions);

  return <div>Submissions LIST</div>;
};

export default Submissions;
