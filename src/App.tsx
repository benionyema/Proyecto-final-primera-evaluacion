import styled from '@emotion/styled';
import { Route, Routes } from 'react-router-dom';
import RutaPrivada from './components/RutaPrivada';
import Login from './pages/Login';
import Inicio from './pages/Inicio';
import NotFound from './pages/NotFound';

const Titulo = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.lg};
`;

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Todo lo que cuelgue de aquí exige sesión */}
      <Route element={<RutaPrivada />}>
        <Route path="/" element={<Inicio />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}