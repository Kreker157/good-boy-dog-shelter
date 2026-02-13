import styled from 'styled-components';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 56px;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: transparent);
  color: var(--primary);
  font-size: 16px;
  width: fit-content;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  line-height: 56px;
`;

interface Props {
  title: string;
  backRoute?: string;
  backLabel?: string;
}

export default function NavigationHeader({
  title,
  backLabel,
  backRoute = '/',
}: Props) {
  const { t } = useTranslation();
  return (
    <Header>
      <BackButton href={backRoute}>
        ← {!backLabel ? t('back') : backLabel}
      </BackButton>
      <Title>{title}</Title>
    </Header>
  );
}
