import styled from 'styled-components';
import { Footer } from '@/components/layout/Footer';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
  margin: 60px 80px;
`;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Container>
        {children}
        <Footer />
      </Container>
    </>
  );
}
