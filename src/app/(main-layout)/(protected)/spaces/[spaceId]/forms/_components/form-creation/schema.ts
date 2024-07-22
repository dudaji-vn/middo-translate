import { z } from 'zod';

const dataTypes = z.enum(['text', 'long-text', 'date', 'time']);
const formFieldTypeSchema = z.enum(['input', 'checkbox', 'radio']);

const formFieldSchema = z
  .object({
    _id: z.string().optional(),
    id: z.string().optional(),
    name: z.string().min(1, { message: 'Data-Name is required' }),
    dataType: dataTypes,
    type: formFieldTypeSchema,
    label: z.string().min(1, { message: 'Label is required' }),
    required: z.boolean().default(false),
    options: z.array(
      z.object({
        media: z.any().optional(),
        value: z.string().min(1, { message: 'Option content is required' }),
        type: z.enum(['default', 'other']).optional(),
      }),
    ),
  })
  .refine(
    (field) => {
      if (
        (field.type === 'checkbox' || field.type === 'radio') &&
        field.options.length < 1
      ) {
        return false;
      }
      return true;
    },
    {
      path: ['options'],
      message: 'At least 1 options are required',
    },
  );

const customizeFormSchema = z.object({
  theme: z.string().optional(),
  background: z.string().optional(),
  layout: z.enum(['single', 'multiple']),
});
const checkDuplicateFieldNames = (fields: FormField[]) => {
  const names = fields.map((field) => field.name);
  return new Set(names).size === names.length;
};

export const createBusinessFormSchema = z.object({
  name: z
    .string()
    .max(30, 'Name is too long, max 30 characters')
    .min(1, 'Please enter a form name'),
  description: z
    .string()
    .max(50, 'Description is too long, max 50 characters')
    .optional(),
  formFields: z.array(formFieldSchema).superRefine((fields, ctx) => {
    const pass = checkDuplicateFieldNames(fields);
    if (!pass) {
      const indexDuplicate = fields.findLastIndex((field, index) =>
        fields.findIndex((f, i) => f.name === field.name && i !== index),
      );
      ctx.addIssue({
        message: `Field name ${fields[indexDuplicate].name} is already used`,
        code: z.ZodIssueCode.unrecognized_keys,
        path: [indexDuplicate, 'name'],
        keys: [String(indexDuplicate), 'name'],
      });
      return true;
    }
    return false;
  }),
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
