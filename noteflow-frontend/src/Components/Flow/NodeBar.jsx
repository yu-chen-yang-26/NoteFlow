import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import instance from '../../API/api';
import './FlowEditor.scss';
import { useTranslation } from 'react-i18next';
import { Divider } from '@mui/material';

export default function NodeBar({ handleNodeBarClose, addNode }) {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    instance
      .get('/library')
      .then((res) => {
        setNodes(
          res.data.sort((a, b) =>
            a.updateAt < b.updateAt ? 1 : a.updateAt > b.updateAt ? -1 : 0,
          ),
        );
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
  const getTime = (time) => {
    const now = new Date();
    const timeDiff = now - time;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor(timeDiff / (1000 * 60));
    if (days >= 1) {
      return { time: days, unit: days === 1 ? 'day' : 'days' };
    } else if (hours >= 1) {
      return { time: hours, unit: hours === 1 ? 'hour' : 'hours' };
    } else {
      return { time: minutes, unit: minutes <= 1 ? 'minute' : 'minutes' };
    }
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
            {t('Library Nodes')}
          </ListItem>

          {nodes.map((node) => {
            const editTime = getTime(node.updateAt);
            return (
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
                <ListItem sx={{ justifyContent: 'center', fontSize: '12px' }}>
                  <p>
                    {t('Last Edit Time:')} {editTime.time}
                    {' ' + t(editTime.unit) + t('ago')}
                  </p>
                </ListItem>
              </div>
            );
          })}
          <Divider />
        </List>
      </Drawer>
    </Box>
  );
}
