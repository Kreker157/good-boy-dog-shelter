import { ContributeRequest } from '@/lib/api/api';
import { DonationFormValues } from './schema';

export function toContributeRequest(
  values: DonationFormValues,
): ContributeRequest {
  const firstName = values.firstName?.trim();
  const lastName = values.lastName.trim();
  const email = values.email.trim();

  const phoneNumber = values.phoneNumber.trim().replace(/\s+/g, ' ');
  const phone = `${values.phoneCountry} ${phoneNumber}`.trim();

  const body: ContributeRequest = {
    contributors: [
      {
        firstName: firstName ? firstName : undefined,
        lastName,
        email,
        phone,
      },
    ],
    value: values.amount,
  };

  if (values.donationType === 'shelter' && values.shelterId) {
    body.shelterID = Number(values.shelterId);
  }

  return body;
}
