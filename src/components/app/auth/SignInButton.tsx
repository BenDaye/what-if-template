import { useAppAuth } from '@/hooks';
import { Button, ButtonProps } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

type SignInButtonProps = ButtonProps;

export const SignInButton = (props: SignInButtonProps) => {
  const { status } = useSession();
  const { t: tAuth } = useTranslation('auth');
  const { signIn } = useAppAuth();

  return (
    <>
      <Button
        {...props}
        disabled={props?.disabled || status === 'authenticated'}
        onClick={(ev) => {
          props.onClick?.(ev);
          signIn();
        }}
      >
        {tAuth('Sign In._')}
      </Button>
    </>
  );
};
