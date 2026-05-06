import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Nombre demasiado corto').max(100),
  email: z.string().trim().email('Email no válido').max(200),
  company: z.string().trim().max(120).optional().default(''),
  phone: z.string().trim().max(40).optional().default(''),
  pillar: z.enum(['centralita', 'agents', 'crm', 'general', 'partner']).default('general'),
  message: z.string().trim().min(10, 'Cuéntanos un poco más').max(2000),
  consent: z.literal(true, { message: 'Acepta la política para continuar' }),
  turnstileToken: z.string().min(1, 'Verificación anti-spam pendiente'),
  honeypot: z.string().max(0, 'spam'),
});

export type ContactInput = z.infer<typeof contactSchema>;
