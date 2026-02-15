'use client';
import { useTranslation } from 'react-i18next';
import NavigationBack from '@/components/layout/NavigationBack';
import styled from 'styled-components';
import { DonationCard } from './components/DonationCard';
import { useSheltersResultQuery } from '@/lib/api/queries';

const AboutWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  text-align: center;
  margin-top: 56px;
  margin-bottom: 56px;
`;

export function Page() {
  const { t } = useTranslation();
  const { data } = useSheltersResultQuery();

  return (
    <>
      <NavigationBack title={t('about.title')} />

      <p>{t('about.description1')}</p>

      <AboutWrapper>
        <DonationCard
          title={
            data?.contribution != null
              ? `${data.contribution.toLocaleString('sk-SK')} €`
              : '—'
          }
          description={t('about.donation.amount')}
        />

        <DonationCard
          title={
            data?.contributors != null
              ? data.contributors.toLocaleString('sk-SK')
              : '—'
          }
          description={t('about.donation.donor')}
        />
      </AboutWrapper>
      <p>{t('about.description2')}</p>
    </>
  );
}

export default Page;
