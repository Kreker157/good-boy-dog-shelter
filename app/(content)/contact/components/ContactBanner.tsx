'use client';
import styled from 'styled-components';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  margin: 40px 80px 56px 80px;

  img {
    border-radius: 20px;
    width: 100%;
    height: 376px;
    object-fit: cover;
  }
`;

export const ContactBanner = () => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Image
        src={'/dog-image-2.jpg'}
        width={0}
        height={0}
        alt={t('contact.banner.alt')}
        sizes="100vw"
      />
    </Wrapper>
  );
};

export default ContactBanner;
