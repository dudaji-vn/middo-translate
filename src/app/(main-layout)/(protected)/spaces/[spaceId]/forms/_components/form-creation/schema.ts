import { z } from 'zod';

const formFieldTypeSchema = z.enum([
  'text',
  'checkbox',
  'radio',
  'date',
  'time',
]);

const formFieldSchema = z.object({
  name: z.string(),
  type: formFieldTypeSchema,
  label: z.string(),
  required: z.boolean(),
  options: z
    .array(
      z.object({
        // label: z.string().min(1, { message: 'Label is required' }),
        value: z.string().min(1, { message: 'Value is required' }),
      }),
    )
    .optional(),
});

export const createBusinessFormSchema = z.object({
  name: z
    .string()
    .max(30, 'Name is too long, max 30 characters')
    .min(1, 'Please enter a form name'),
  description: z
    .string()
    .max(100, 'Description is too long, max 100 characters')
    .optional(),
  formFields: z.array(formFieldSchema),
});
export type CreateBusinessForm = z.infer<typeof createBusinessFormSchema>;
export type FormField = z.infer<typeof formFieldSchema>;
export type FormFieldType = z.infer<typeof formFieldTypeSchema>;
