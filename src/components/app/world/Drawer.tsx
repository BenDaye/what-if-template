import {
  AppBar,
  Drawer,
  DrawerProps,
  List,
  Toolbar,
  Typography,
} from '@mui/material';

export const AppWorldDrawer = (props: DrawerProps) => {
  return (
    <Drawer {...props}>
      <AppBar color="inherit" position="static" elevation={1}>
        <Toolbar
          sx={{ flexShrink: 0, gap: 1, px: 2 }}
          variant="dense"
          disableGutters
        >
          <Typography variant="subtitle2">World Drawer</Typography>
        </Toolbar>
      </AppBar>

      <List
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          overflow: 'hidden',
          overflowY: 'auto',
        }}
      ></List>
    </Drawer>
  );
};
