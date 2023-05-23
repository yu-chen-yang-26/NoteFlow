import { Editor } from '../../Components/Editor/Editor';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import instance from '../../API/api';

import './Node.scss';

const Node = ({ nodeId, setIsEdit, nodeWidth }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editorId = nodeId ? nodeId : searchParams.get('id');

  const navigateTo = useNavigate();

  const handleDrawerClose = () => {
    if (!nodeId) navigateTo('/home');
    else setIsEdit(false);
  };

  return (
    <div
      className="Node-container"
      style={nodeId && { width: `${nodeWidth}px` }}
    >
      <div className="editor">
        <Editor editorId={editorId} handleDrawerClose={handleDrawerClose} />
      </div>
    </div>
  );
};
export default Node;
