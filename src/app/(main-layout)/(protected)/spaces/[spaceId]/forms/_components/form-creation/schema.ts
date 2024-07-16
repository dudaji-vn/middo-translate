import { z } from 'zod';

export const createBusinessFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(30, 'Name is too long, max 30 characters'),
  
});
