import { useNotice } from '@/hooks';
import { SignInSchema, signInSchema } from '@/server/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  AppBar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { Controller, useForm } from 'react-hook-form';
import { useBoolean } from 'usehooks-ts';
import { SignUpButton } from './SignUpButton';

type SignInDialogProps = DialogProps;

export const SignInDialog = (props: SignInDialogProps) => {
  const { showError, showSuccess } = useNotice();
  const { status } = useSession();
  const { t: tAuth } = useTranslation('auth');
  const { handleSubmit, control, reset } = useForm<SignInSchema>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(signInSchema),
  });
  const { value: showPassword, toggle: toggleShowPassword } = useBoolean(false);
  const onSubmit = async (data: SignInSchema) => {
    try {
      const result = await signIn('credentials-user', {
        ...data,
        redirect: false,
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      showSuccess(tAuth('Sign In.Succeeded'), {
        onClose: () => {
          if (typeof window !== 'undefined') window.location.reload();
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        showError(tAuth(error.message));
      }
      console.error(error);
    } finally {
      reset();
    }
  };

  return (
    <>
      <Dialog
        {...props}
        onClose={(ev, reason) => {
          reset();
          props?.onClose?.(ev, reason);
        }}
      >
        <AppBar position="static" enableColorOnDark elevation={0}>
          <Toolbar variant="dense" sx={{ gap: 1 }}>
            <Typography variant="subtitle1" color="text.primary">
              {tAuth('Sign In._')}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              edge="end"
              onClick={() => {
                reset();
                props?.onClose?.({}, 'backdropClick');
              }}
              disabled={status === 'loading'}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent dividers>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                variant="filled"
                value={value}
                onChange={onChange}
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
                margin="normal"
                label={tAuth('Account')}
                placeholder={tAuth('Account')}
                autoFocus
                required
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                value={value}
                variant="filled"
                onChange={onChange}
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                label={tAuth('Password')}
                placeholder={tAuth('Password')}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="Toggle Password visibility"
                      onClick={toggleShowPassword}
                      onMouseDown={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <Visibility color="primary" />
                      ) : (
                        <VisibilityOff color="inherit" />
                      )}
                    </IconButton>
                  ),
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ gap: 1 }}>
          <SignUpButton color="info" onClick={() => reset()} />
          <Box sx={{ flexGrow: 1 }}></Box>
          <LoadingButton
            loading={status === 'loading'}
            disabled={status === 'loading'}
            onClick={() => handleSubmit(onSubmit)()}
          >
            {tAuth('Sign In._')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
