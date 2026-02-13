import Image from 'next/image';
import styled from 'styled-components';

interface Props {
  iconPath: string;
  iconAlt: string;
  title: string;
  description: string;
  highlight: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  line-height: 32px;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
`;

const Highlight = styled.p`
  font-size: 16px;
  line-height: 24px;
  color: var(--primary);
`;

export const ContactCard = ({
  iconPath,
  iconAlt,
  title,
  description,
  highlight,
}: Props) => {
  return (
    <Wrapper>
      <Image
        src={iconPath}
        alt={iconAlt}
        width={48}
        height={48}
        style={{ margin: '0 auto' }}
      />
      <Title>{title}</Title>
      <Description>{description}</Description>
      <Highlight>{highlight}</Highlight>
    </Wrapper>
  );
};
