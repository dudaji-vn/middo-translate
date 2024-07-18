import { z } from 'zod';

const dataTypes = z.enum(['text', 'long-text', 'date', 'time']);
const formFieldTypeSchema = z.enum(['input', 'checkbox', 'radio']);

const formFieldSchema = z.object({
  name: z.string().min(1, { message: 'Data-Name is required' }),
  dataType: dataTypes,
  type: formFieldTypeSchema,
  label: z.string().min(1, { message: 'Label is required' }),
  required: z.boolean().default(false),
  options: z
    .array(
      z.object({
        value: z.string(),
      }),
    )
    .optional(),
});

const customizeFormSchema = z.object({
  theme: z.string().optional(),
  background: z.string().optional(),
  layout: z.enum(['single', 'multiple']),
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
  thankyou: z
    .object({
      title: z.string(),
      subtitle: z.string(),
      image: z.string().optional(),
    })
    .optional(),
  customize: customizeFormSchema.optional(),
});
export type CreateBusinessForm = z.infer<typeof createBusinessFormSchema>;
export type FormField = z.infer<typeof formFieldSchema>;
export type FormFieldType = z.infer<typeof formFieldTypeSchema>;
export type FormFieldDataTypes = z.infer<typeof dataTypes>;
