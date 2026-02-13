'use client';
import { useEffect, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import i18n from './config';

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--background);
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid var(--border);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 16px;
  color: var(secondary-text);
  font-size: 14px;
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkInitialization = () => {
      if (i18n.isInitialized) {
        setIsReady(true);
      } else {
        i18n.on('initialized', () => {
          setIsReady(true);
        });
      }
    };

    checkInitialization();

    return () => {
      i18n.off('initialized');
    };
  }, []);

  if (!isReady) {
    return (
      <LoaderWrapper>
        <LoaderContainer>
          <Spinner />
          <LoadingText>{t('loading')}</LoadingText>
        </LoaderContainer>
      </LoaderWrapper>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
