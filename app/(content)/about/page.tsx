'use client';
import { useTranslation } from 'react-i18next';
import NavigationBack from '@/components/layout/NavigationBack';
import styled from 'styled-components';
import { DonationCard } from './components/DonationCard';

const AboutWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  text-align: center;
  margin-bottom: 56px;
`;

export function Page() {
  const { t } = useTranslation();

  return (
    <>
      <NavigationBack title={t('about.title')} />

      <AboutWrapper>
        <DonationCard
          title={''} //TODO change for API data
          description={t('about.donation.amount')}
        />

        <DonationCard
          title={''} //TODO change for API data
          description={t('about.donation.donor')}
        />
      </AboutWrapper>
      <p>{t('about.description1')}</p>
      <p>{t('about.description2')}</p>
    </>
  );
}
