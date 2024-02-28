import { useAppAuth, useDarkMode } from '@/hooks';
import { Settings as SettingsIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  IconButtonProps,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMemo, useRef } from 'react';
import { useBoolean, useTernaryDarkMode } from 'usehooks-ts';
import { UpdateLocaleDialog } from '@/components/UpdateLocaleDialog';
import { AppUserUpdateProfileDialog } from '../user/UpdateProfileDialog';

type AppSettingsIconButtonProps = IconButtonProps;

export const AppSettingsIconButton = (props: AppSettingsIconButtonProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tAuth } = useTranslation('auth');
  const anchorRef = useRef<HTMLButtonElement>(null);
  const {
    value: menuVisible,
    setTrue: openMenu,
    setFalse: closeMenu,
  } = useBoolean(false);
  const {
    value: updateProfileDialogVisible,
    setTrue: openUpdateProfileDialog,
    setFalse: closeUpdateProfileDialog,
  } = useBoolean(false);
  const {
    value: updateLocaleDialogVisible,
    setTrue: openUpdateLocaleDialog,
    setFalse: closeUpdateLocaleDialog,
  } = useBoolean(false);
  const { data: session, status } = useSession();
  const unauthenticated = useMemo(
    () => status !== 'authenticated' || session.user?.role !== AuthRole.USER,
    [session, status],
  );
  const { signIn } = useAppAuth();
  const { ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode();
  return (
    <>
      <Tooltip title={tCommon('Settings')} placement="right" arrow>
        <IconButton
          {...props}
          ref={anchorRef}
          onClick={(ev) => {
            props.onClick?.(ev);
            openMenu();
          }}
        >
          {props.children ?? <SettingsIcon />}
        </IconButton>
      </Tooltip>
      {anchorRef.current && (
        <Menu
          open={menuVisible}
          anchorEl={anchorRef.current}
          onClose={() => closeMenu()}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{
            paper: {
              sx: {
                width: 320,
              },
            },
          }}
          onClick={() => closeMenu()}
        >
          <MenuItem
            sx={{ mb: 1 }}
            selected
            onClick={() => {
              if (unauthenticated) {
                signIn();
                return;
              }
              openUpdateProfileDialog();
            }}
          >
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                sx={{
                  height: 32,
                  width: 32,
                  bgcolor: unauthenticated ? undefined : 'primary.main',
                  fontSize: (theme) => theme.typography.body2.fontSize,
                  fontWeight: 700,
                }}
              >
                {session?.user?.username?.[0] ?? ''}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                unauthenticated
                  ? tAuth('Unauthenticated')
                  : session?.user?.name ?? ''
              }
              primaryTypographyProps={{
                color: unauthenticated ? 'text.disabled' : 'primary.light',
                noWrap: true,
                textOverflow: 'ellipsis',
              }}
            />
          </MenuItem>
          <ListItem
            dense
            onClick={(ev) => {
              ev.stopPropagation();
            }}
          >
            <ListItemText
              primary={tCommon('DarkMode._')}
              primaryTypographyProps={{ color: 'text.secondary' }}
            />
            <ButtonGroup
              size="small"
              onClick={(ev) => ev.stopPropagation()}
              disableElevation
            >
              <Button
                onClick={() => {
                  setTernaryDarkMode('light');
                }}
                variant={ternaryDarkMode === 'light' ? 'contained' : undefined}
              >
                {tCommon('DarkMode.Off')}
              </Button>
              <Button
                onClick={() => {
                  setTernaryDarkMode('dark');
                }}
                variant={ternaryDarkMode === 'dark' ? 'contained' : undefined}
              >
                {tCommon('DarkMode.On')}
              </Button>
              <Button
                onClick={() => {
                  setTernaryDarkMode('system');
                }}
                variant={ternaryDarkMode === 'system' ? 'contained' : undefined}
              >
                {tCommon('DarkMode.Auto')}
              </Button>
            </ButtonGroup>
          </ListItem>
          <MenuItem dense onClick={() => openUpdateLocaleDialog()}>
            <ListItemText
              primary={tCommon('Language._')}
              primaryTypographyProps={{ color: 'text.secondary' }}
            />
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                alignItems: 'center',
                flexShrink: 0,
                gap: 1,
              }}
            >
              <Typography variant="body2">
                {tCommon(`Language.${router.locale}`, {
                  defaultValue: router.locale,
                })}
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
      )}
      <AppUserUpdateProfileDialog
        open={updateProfileDialogVisible}
        onClose={() => closeUpdateProfileDialog()}
        fullWidth
        maxWidth="xs"
      />
      <UpdateLocaleDialog
        open={updateLocaleDialogVisible}
        onClose={() => closeUpdateLocaleDialog()}
        fullWidth
        maxWidth="xs"
      />
    </>
  );
};
