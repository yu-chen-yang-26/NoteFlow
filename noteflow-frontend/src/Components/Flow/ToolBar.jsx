import React, { useState } from "react";
import "./FlowEditor.scss";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import "./ToolBar.scss"
import {
  BsDot,
  BsNodePlus,
  BsArrowCounterclockwise,
  BsShare,
  BsPalette,
} from "react-icons/bs";
import { BiFirstPage, BiCross } from "react-icons/bi";
import { AiOutlineBorderlessTable } from "react-icons/ai";

export default function ToolBar({
  addNode,
  flowTitle,
  changeBackground,
  onSave,
}) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(flowTitle);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className ="toolbar">
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
            className="titleInput"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            type="text"
          />
        </div>
        <div className="mid">
          <div>
            <Button
              variant="dark"
              onClick={() => addNode()}
              className="toolBarButton addNodeButton"
            >
              <BsNodePlus size={18} />
            </Button>
          </div>
          <div>
            <Button
              variant="dark"
              onClick={handleShow}
              className="toolBarButton backwardButton"
            >
              <BsArrowCounterclockwise size={18} />
            </Button>
          </div>
          <Dropdown onSelect={(e) => changeBackground(e)}>
            <Dropdown.Toggle
              variant="dark"
              className="toolBarButton paletteButton"
            >
              <BsPalette size={18} />
            </Dropdown.Toggle>
            <Dropdown.Menu className="bgDropDown">
              <Dropdown.Item eventKey="lines">
                <AiOutlineBorderlessTable /> Lines
              </Dropdown.Item>
              <Dropdown.Item eventKey="dots">
                <BsDot /> Dots
              </Dropdown.Item>
              <Dropdown.Item eventKey="cross">
                <BiCross /> Cross
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="right">
          <Button
            variant="dark"
            onClick={handleShow}
            className="toolBarButton shareButton"
          >
            <BsShare size={18} />
          </Button>
        </div>
      </nav>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Coming Soon</Modal.Title>
        </Modal.Header>
      </Modal>
    </div>
  );
}
