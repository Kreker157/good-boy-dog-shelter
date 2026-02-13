'use client';
import styled from 'styled-components';
import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSide = styled.div`
  padding: 80px 0 80px 60px;
  background: var(--background);
`;

const ImageSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 8px 16px 56px;
`;

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <FormSide>
        {children}
        <Footer />
      </FormSide>
      <ImageSide>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          objectFit="cover"
          src="/dog-image-1.jpg"
          alt="Good boy"
          style={{ width: '100%', height: 'auto', borderRadius: '16px' }}
        />
      </ImageSide>
    </Container>
  );
}
