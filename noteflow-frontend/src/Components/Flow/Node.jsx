import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeToolbar, NodeResizer } from 'reactflow';
import Button from 'react-bootstrap/Button';
import './FlowEditor.scss';
import { MenuList, MenuItem, ListItemText, Input, Paper } from '@mui/material';
// import styled from "styled-components";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useParams } from '../../hooks/useParams';

const defaultTypeStyle = {
  // border: '0px',
  borderColor: 'transparent',
  borderRadius: 40,
  textAlign: 'center',
  // marginLeft: ,
  justifyContent: 'center',
  height: 50,
  width: 150,
  paddingLeft: 2,
  color: 'red',
  '& input.Mui-disabled': {
    WebkitTextFillColor: 'black',
  },
  // "&$focused": {
  //   borderColor: "transparent",
  // },
};

const CustomNode = ({ id, data }) => {
  const [isVisible, setVisible] = useState(false);
  const [isInputDisable, setIsInputDisable] = useState(true);
  const [isResizable, setIsResizable] = useState(false);
  const [label, setLabel] = useState(data.label);
  const { nodeMenuOpen, setNodeMenuOpen } = useParams();

  const onContextMenu = (event) => {
    event.preventDefault();
    setVisible(true);
    setNodeMenuOpen(id);
  };

  const handleStopTyping = (event) => {
    if (event.keyCode == 13) {
      setIsInputDisable(true);
    }
  };
  const handleCloseMenu = () => {
    setNodeMenuOpen(null);
  };

  return (
    <div id={id} onContextMenu={onContextMenu}>
      <NodeResizer
        minHeight={50}
        minWidth={150}
        handleStyle={{ padding: '3px' }}
        lineStyle={{ border: '1px solid', borderColor: '#1e88e5' }}
        isVisible={isResizable}
      />
      <NodeToolbar
        isVisible={nodeMenuOpen == id}
        position={data.toolbarPosition}
      >
        <ClickAwayListener onClickAway={handleCloseMenu}>
          <Paper>
            <MenuList>
              <MenuItem onClick={() => setIsResizable(!isResizable)}>
                <ListItemText>
                  {isResizable ? 'Complete' : 'Resize'}
                </ListItemText>
              </MenuItem>
              <MenuItem
                onClick={(event) => {
                  data.onLabelChange(id, event);
                  setIsInputDisable(false);
                  setNodeMenuOpen(null);
                }}
              >
                <ListItemText>Rename</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => data.openStyleBar(id)}>
                <ListItemText>ChangeStyle</ListItemText>
              </MenuItem>
              {/* <MenuItem onClick={() => setVisible(setNodeMenuOpen(null))}>
                <ListItemText>CloseMenu</ListItemText>
              </MenuItem> */}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </NodeToolbar>
      {/* <ClickAwayListener onClickAway={handleCloseMenu}> */}
      <Input
        sx={defaultTypeStyle}
        value={label}
        onChange={(event) => {
          setLabel(event.target.value);
          data.label = event.target.value;
          data.editLabel(id, event.target.value);
        }}
        disabled={isInputDisable}
        onKeyDown={() => handleStopTyping(event)}
      />
      {/* </ClickAwayListener> */}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(CustomNode);
