import styled from '@emotion/styled';

const Titulo = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.lg};
`;

export default function App() {
  return <Titulo>UFC App funciona</Titulo>;
}