import { BusinessForm } from '@/types/forms.type';
import React from 'react';

const FormDetail = ({
  formFields,
}: {
  formFields: BusinessForm['formFields'];
}) => {
  console.log('formFields', formFields);

  return <div>FormDetail</div>;
};

export default FormDetail;
