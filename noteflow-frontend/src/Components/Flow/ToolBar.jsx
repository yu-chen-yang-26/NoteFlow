import React, { useState, useRef, useEffect } from 'react';
import './FlowEditor.scss';
import Button from '@mui/material/Button';
import './ToolBar.scss';
import {
  BsDot,
  BsBookmarkHeart,
  BsNodePlus,
  BsShare,
  BsPalette,
} from 'react-icons/bs';
import { BiFirstPage, BiCross } from 'react-icons/bi';
import { AiOutlineBorderlessTable } from 'react-icons/ai';
// import { MdOutlineLibraryBooks } from 'react-icons/md';
import { Menu, MenuItem } from '@mui/material';
import Colabs from './Colabs';

export default function ToolBar({
  setTitle,
  addNode,
  title,
  changeBackground,
  onSave,
  flowWebSocket,
  flowId,
  subRef,
  isEdit,
  rfInstance,
  handleNodeBarOpen,
}) {
  const [show, setShow] = useState(false);
  const inputRef = useRef(null);
  const [isFocus, setIsFocus] = useState(false);
  // const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    function checkFocus() {
      if (document.activeElement === inputRef.current) {
        setIsFocus(true);
      } else {
        setIsFocus(false);
      }
    }
    document.addEventListener('click', checkFocus);
    return () => {
      document.removeEventListener('click', checkFocus);
    };
  }, []);

  useEffect(() => {
    if (!isFocus && flowWebSocket) {
      flowWebSocket.editFlowTitle(title);
    }
  }, [isFocus]);

  const changeBG = (bg) => {
    changeBackground(bg);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="navbar">
      <div className="left">
        <Button
          variant="dark"
          onClick={() => onSave(title)}
          className="toolBarButton lastPageButton"
        >
          <BiFirstPage size={18} />
        </Button>
        <input
          className="flowTitle"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          type="text"
          ref={inputRef}
        />
        <span className="focus-border"></span>
      </div>
      <div className="mid">
        <Button
          variant="dark"
          onClick={() => addNode()}
          className="toolBarButton addNodeButton"
        >
          <BsNodePlus size={18} />
        </Button>

        <Button variant="dark" onClick={handleClick} className="toolBarButton">
          <BsPalette size={18} />
        </Button>
        <Menu
          // id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem key="lines" onClick={() => changeBG('lines')}>
            <AiOutlineBorderlessTable /> Lines
          </MenuItem>
          <MenuItem key="dots" onClick={() => changeBG('dots')}>
            <BsDot /> Dots
          </MenuItem>
          <MenuItem key="cross" onClick={() => changeBG('cross')}>
            <BiCross /> Cross
          </MenuItem>
        </Menu>

        <Button
          variant="dark"
          className="toolBarButton"
          onClick={handleNodeBarOpen}
        >
          <BsBookmarkHeart size={18} />
        </Button>
      </div>
      <div className="right">
        <div
          ref={subRef}
          style={{ display: isEdit ? 'none' : 'flex' }}
          className="mouse-dot-subscribe"
        ></div>
        <Button
          variant="dark"
          onClick={handleShow}
          className="toolBarButton shareButton"
        >
          <BsShare size={18} />
        </Button>
      </div>
      <Colabs // modal
        show={show}
        setShow={setShow}
        flowId={flowId}
        handleClose={handleClose}
      />
    </nav>
  );
}
