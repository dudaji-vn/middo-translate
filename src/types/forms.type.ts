import { User } from '@/features/users/types';
import { BaseEntity } from '.';

export const ROWS_PER_PAGE_OPTIONS = [5, 25, 75, 100];
export const DEFAULT_FORMS_PAGINATION = {
  limit: ROWS_PER_PAGE_OPTIONS[1],
  currentPage: 1,
  search: '',
};

export type FormField = {
  formId?: string;
  _id: string;
  name: string;
  label: string;
  helpText: string;
  type: 'text' | 'number' | 'date' | 'select' | 'radio' | 'checkbox';
  dataType: 'long text' | 'plain text' | 'string';
  required: boolean;
  options?: string[];
};
export type FormSubmission = {
  user: Partial<User>;
  answer: Record<string, string>;
};

export type BusinessForm = BaseEntity & {
  spaceId?: string;
  name: string;
  isUsing: boolean;
  lastEditedBy: Partial<User>;
  createdBy: Partial<User>;
  color: string;
  backgroundColor: string;
  submissions: FormSubmission[];
  totalSubmissions: number;
  formFields: FormField[];
};
