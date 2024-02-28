import { SignInDialog } from '@/components/app/auth/SignInDialog';
import { SignUpDialog } from '@/components/app/auth/SignUpDialog';
import { NOOP, NOOPAsync } from '@/utils/noop';
import { signOut as signOutNextAuth } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { PropsWithChildren, createContext, useContext } from 'react';
import { useBoolean } from 'usehooks-ts';
import { useNotice } from '../notice';

interface AppAuthProviderProps {
  signIn: () => void;
  signUp: () => void;
  signOut: () => PromiseLike<void>;
}

const AppAuthProviderContext = createContext<AppAuthProviderProps>({
  signIn: NOOP,
  signUp: NOOP,
  signOut: NOOPAsync,
});

export const useAppAuth = () => useContext(AppAuthProviderContext);

export const AppAuthProvider = ({ children }: PropsWithChildren) => {
  const { showError, showSuccess } = useNotice();
  const { t } = useTranslation('auth');
  const signOut = async () => {
    try {
      await signOutNextAuth({ redirect: false });
      showSuccess(t('Sign Out.Succeeded'), {
        onClose: () => {
          if (typeof window !== 'undefined') window.location.reload();
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
      console.error(error);
    }
  };
  const {
    value: signInDialog,
    setFalse: closeSignInDialog,
    setTrue: openSignInDialog,
  } = useBoolean(false);
  const {
    value: signUpDialog,
    setFalse: closeSignUpDialog,
    setTrue: openSignUpDialog,
  } = useBoolean(false);

  const signIn = () => {
    closeSignUpDialog();
    openSignInDialog();
  };

  const signUp = () => {
    closeSignInDialog();
    openSignUpDialog();
  };
  return (
    <AppAuthProviderContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
      <SignInDialog
        open={signInDialog}
        onClose={() => closeSignInDialog()}
        fullWidth
        maxWidth="xs"
        disableEscapeKeyDown
      />
      <SignUpDialog
        open={signUpDialog}
        onClose={() => closeSignUpDialog()}
        fullWidth
        maxWidth="xs"
        disableEscapeKeyDown
      />
    </AppAuthProviderContext.Provider>
  );
};
