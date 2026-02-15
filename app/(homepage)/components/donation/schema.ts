import { z } from 'zod';

export const donationSchema = z
  .object({
    donationType: z.enum(['foundation', 'shelter']),
    shelterId: z.string().nullable().optional(),
    amount: z.number().positive('errors.amountPositive'),
    firstName: z
      .string()
      .trim()
      .min(2, 'errors.firstNameMin')
      .max(20, 'errors.firstNameMax')
      .optional()
      .or(z.literal('')),
    lastName: z
      .string()
      .trim()
      .min(2, 'errors.lastNameMin')
      .max(30, 'errors.lastNameMax'),
    email: z.email('errors.emailInvalid').trim(),
    phoneCountry: z.enum(['+421', '+420']),
    phoneNumber: z
      .string()
      .trim()
      .min(6, 'errors.phoneInvalid')
      .max(20, 'errors.phoneInvalid')
      .regex(/^[0-9 ]+$/, 'errors.phoneDigitsOnly'),

    gdprConsent: z.boolean().refine((v) => v === true, {
      message: 'errors.gdprRequired',
    }),
  })
  .superRefine((val, ctx) => {
    if (val.donationType === 'shelter' && !val.shelterId) {
      ctx.addIssue({
        code: 'custom',
        path: ['shelterId'],
        message: 'errors.pickShelter',
      });
    }
  });

export type DonationFormValues = z.infer<typeof donationSchema>;
