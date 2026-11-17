import styled from '@emotion/styled';

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const Input = styled.input<{ $invalid?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ theme, $invalid }) =>
      $invalid ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 1rem;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 0;
  }
`;

export const FieldError = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.85rem;
`;

export const FormError = styled.div`
  background: #fef2f2;
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 0.9rem;
`;

type Variante = 'primary' | 'secondary' | 'danger';

export const Button = styled.button<{ $variant?: Variante }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textOnDark};
  background: ${({ theme, $variant = 'primary' }) =>
    $variant === 'danger'
      ? theme.colors.danger
      : $variant === 'secondary'
        ? theme.colors.secondary
        : theme.colors.primary};

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;