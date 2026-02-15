'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--border);
  padding-top: 24px;
  margin-top: 48px;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const Content = styled.div`
  display: flex;
  gap: 32px;
  font-weight: 400;
  color: var(--text-secondary);
`;

const Socials = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  a {
    height: 16px;
  }
`;

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Image
        alt="logo"
        src="/logo/logo.svg"
        width={0}
        height={0}
        objectFit="cover"
        style={{ width: '124px', height: '32px' }}
      ></Image>
      <ContentWrapper>
        <Socials>
          <Link
            href={'https://www.facebook.com/GoodRequestCom/?locale=sk_SK'}
            target="_blank"
          >
            <Image
              width={16}
              height={16}
              alt="facebook"
              src="/socials/facebook.svg"
            />
          </Link>
          <Link href={'https://www.instagram.com/goodrequest/'} target="_blank">
            <Image
              width={16}
              height={16}
              alt="instagram"
              src="/socials/instagram.svg"
            />
          </Link>
        </Socials>
        <Content>
          <Link href={'/contact'}>{t('footer.contact')}</Link>{' '}
          <Link href={'/about'}>{t('footer.about')}</Link>
        </Content>
      </ContentWrapper>
    </Wrapper>
  );
};
