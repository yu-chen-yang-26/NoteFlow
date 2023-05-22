import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useParams } from '../../hooks/useParams';
import './FlowEditor.scss';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export default function StyleBar({
  nodeId,
  nodeChangeColor,
  nodeBorderChangeColor,
  nodeBorderChangeStoke,
  handleStyleBarClose,
  // nodeBorder,
}) {
  // const [open, setOpen] = useState(isOpen);
  const [border, setBorder] = useState(2);
  const { nodeStyleMenuOpen, setNodeStyleMenuOpen } = useParams();

  return (
    <Box className="bar">
      <Drawer
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
          },
        }}
        variant="persistent"
        anchor="right"
        open={true}
      >
        {/* <DrawerHeader></DrawerHeader> */}
        <List>
          <ListItem sx={{ fontSize: '20px', marginBottom: '10px' }}>
            <IconButton onClick={handleStyleBarClose}>
              <ChevronLeftIcon />
            </IconButton>
            {/* {nodeId} */}
          </ListItem>
          <ListItem sx={{ fontSize: '20px', marginBottom: '10px' }}>
            Border Style
          </ListItem>
          <Grid container spacing={2}>
            <Grid sx={{ justifyContent: 'flex-start' }} item xs={6}>
              <p>Color</p>
            </Grid>
            <Grid item xs={6}>
              <input
                type="color"
                onChange={(event) => nodeBorderChangeColor(nodeId, event)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid sx={{ justifyContent: 'flex-start' }} item xs={6}>
              <p>Width</p>
            </Grid>
            <Grid item xs={6}>
              <Select
                onChange={(event) => {
                  setBorder(event.target.value);
                  nodeBorderChangeStoke(nodeId, event);
                }}
                value={border}
                sx={{ height: '25px', width: '50px' }}
              >
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Divider variant="middle" />
          <ListItem sx={{ fontSize: '20px', marginBottom: '10px' }}>
            Node Color
          </ListItem>
          <Grid container spacing={2}>
            <Grid sx={{ justifyContent: 'flex-start' }} item xs={6}>
              <p>Color</p>
            </Grid>
            <Grid item xs={6}>
              <input
                type="color"
                onChange={(event) => nodeChangeColor(nodeId, event)}
                // onChange={data.onChange}
                // defaultValue={data.color}
              />
            </Grid>
          </Grid>
        </List>
      </Drawer>
    </Box>
  );
}
