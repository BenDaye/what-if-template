import { useAppAuth } from '@/hooks';
import { Button, ButtonProps } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

type SignUpButtonProps = ButtonProps;

export const SignUpButton = (props: SignUpButtonProps) => {
  const { status } = useSession();
  const { t: tAuth } = useTranslation('auth');
  const { signUp } = useAppAuth();

  return (
    <>
      <Button
        {...props}
        disabled={props?.disabled || status === 'authenticated'}
        onClick={(ev) => {
          props.onClick?.(ev);
          signUp();
        }}
      >
        {tAuth('Sign Up._')}
      </Button>
    </>
  );
};
