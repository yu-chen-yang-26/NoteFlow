import { Editor } from '../../Components/Editor/Editor';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
// import instance from '../../API/api';
import React from 'react';
import SuspenseEditor from '../../Components/Editor/SuspenseEditor';

import './Node.scss';

const Node = ({ nodeId, setIsEdit, nodeWidth }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editorId = nodeId ? nodeId : searchParams.get('id');
  const { isMobile } = useApp();

  const navigateTo = useNavigate();

  const handleDrawerClose = () => {
    if (!nodeId) navigateTo('/home');
    else setIsEdit(false);
  };

  return (
    <div
      className="Node-container"
      style={nodeId && { width: isMobile ? '100vw' : `${nodeWidth}px` }}
    >
      <div className="editor">
        <Editor editorId={editorId} handleDrawerClose={handleDrawerClose} />
      </div>
    </div>
  );
};
export default Node;
