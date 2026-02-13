import styled from 'styled-components';

interface Props {
  title: string;
  description: string;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-between: center;
  gap: 20px;
`;

const Title = styled.h5`
  font-size: 60px;
  line-height: 72px;
  font-weight: 600;
`;

const Description = styled.p`
  font-weight: 500;
`;

export const DonationCard = ({ title, description }: Props) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Wrapper>
  );
};
