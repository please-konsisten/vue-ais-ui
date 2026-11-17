import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.union([
    z.email('Format email tidak valid'),
    z
      .string()
      .min(3, 'Username minimal 3 karakter')
      .max(20, 'Username maksimal 20 karakter')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore'),
  ]),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export type LoginInput = z.infer<typeof loginSchema>;
