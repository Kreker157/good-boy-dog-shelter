'use client';
import { useTranslation } from 'react-i18next';
import NavigationBack from '@/components/layout/NavigationBack';
import { ContactCard } from './components/ContactCard';
import styled from 'styled-components';
import ContactBanner from './components/ContactBanner';

const ContactWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  text-align: center;
  margin-bottom: 56px;
`;

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <NavigationBack title={t('contact.title')} />
      <ContactWrapper>
        <ContactCard
          iconPath="/icons/email.svg"
          iconAlt={t('contact.card.altEmail')}
          title={t('contact.card.titleEmail')}
          description={t('contact.card.descEmail')}
          highlight={t('contact.card.highlightEmail')}
        />
        <ContactCard
          iconPath="/icons/office.svg"
          iconAlt={t('contact.card.office')}
          title={t('contact.card.titleOffice')}
          description={t('contact.card.descOffice')}
          highlight={t('contact.card.highlightOffice')}
        />
        <ContactCard
          iconPath="/icons/phone.svg"
          iconAlt={t('contact.card.phone')}
          title={t('contact.card.titlePhone')}
          description={t('contact.card.descPhone')}
          highlight={t('contact.card.highlightPhone')}
        />
      </ContactWrapper>

      <ContactBanner />
    </>
  );
}
