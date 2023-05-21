import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import instance from '../../API/api';
import './FlowEditor.scss';
import { useTranslation } from 'react-i18next';
import { Divider } from '@mui/material';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export default function NodeBar({ handleNodeBarClose, addNode }) {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState([]);
  // const [borderColor, setBorderColor]

  useEffect(() => {
    instance
      .get('/library')
      .then((res) => {
        setNodes([...nodes, ...res.data]);
        console.log('ok!');
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const onDragStart = (event, node, type) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
    addNode(node);
  };

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
            <IconButton onClick={handleNodeBarClose}>
              <ChevronLeftIcon />
            </IconButton>{' '}
            Library Nodes
          </ListItem>

          {nodes.map((node) => (
            <div key={node.id}>
              <ListItem>
                <div
                  className="drag-node"
                  onDragStart={(event) =>
                    onDragStart(event, node, 'CustomType')
                  }
                  draggable
                >
                  {node.name}
                </div>
              </ListItem>
              <ListItem>
                {t('Last Edit Time:')} {node.time} {t('hours')}
              </ListItem>
            </div>
          ))}
          <Divider />
        </List>
      </Drawer>
    </Box>
  );
}
