import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import instance from '../../API/api';
import './FlowEditor.scss';
import { useTranslation } from 'react-i18next';
import { Divider } from '@mui/material';

export default function NodeBar({ handleNodeBarClose, setDragNode }) {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState([]);

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
    setDragNode(node);
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
        <List>
          <ListItem sx={{ fontSize: '20px', marginBottom: '10px' }}>
            <IconButton onClick={handleNodeBarClose}>
              <ChevronLeftIcon />
            </IconButton>{' '}
            Library Nodes
          </ListItem>

          {nodes.map((node) => (
            <div className="nodebar-item" key={node.id}>
              <ListItem sx={{ justifyContent: 'center' }}>
                <div
                  className="drag-node"
                  onDragStart={(event) =>
                    onDragStart(event, node, 'CustomType')
                  }
                  draggable
                >
                  <p>{node.name}</p>
                </div>
              </ListItem>
              <ListItem sx={{ justifyContent: 'center' }}>
                <p>
                  {t('Last Edit Time:')} {node.time} {t('hours')}
                </p>
              </ListItem>
            </div>
          ))}
          <Divider />
        </List>
      </Drawer>
    </Box>
  );
}
