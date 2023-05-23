import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
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
import './FlowEditor.scss';

export default function StyleBar({
  nodeId,
  nodeChangeStyle,
  handleStyleBarClose,
}) {
  const [border, setBorder] = useState(2);

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
                onChange={(event) => {
                  console.log(nodeId);
                  nodeChangeStyle(nodeId, event, 'color');
                }}
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
                  nodeChangeStyle(nodeId, event, 'stroke');
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
                onChange={(event) =>
                  nodeChangeStyle(nodeId, event, 'background')
                }
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
