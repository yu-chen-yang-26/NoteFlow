import React, { useEffect, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import EditorToolbar, { modules, formats } from './EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import './Editor.scss';
import { IoIosArrowBack } from 'react-icons/io';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { useFlowStorage } from '../../storage/Storage';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useQuill } from '../../API/useQuill';
import { useApp, getRandomPicture } from '../../hooks/useApp';
import { Colab } from '../../API/Colab.js';

window.katex = katex;

const Editor = ({ handleDrawerClose, editorId }) => {
  // const saveNode = useFlowStorage((state) => state.saveNode);
  const { user } = useApp();
  const [colab, setColab] = useState([]);
  const [colabWebSocket, setColabWebSocket] = useState(null);
  const { OpenEditor, QuillRef, setOnline } = useQuill();
  useEffect(() => {
    OpenEditor(editorId);
    const connection = new Colab(editorId, user.email, (members) => {
      // 定期看要不要 clean 掉
      setColab(members);
    });
    setColabWebSocket(connection);
    // setColab();
    setState({
      title: '',
      value: '',
    });
  }, []);

  useEffect(() => {
   setOnline(colab) 
  }, [colab]);

  const [state, setState] = useState({
    title: '',
    value: '',
  });

  const handleChange = (value) => {
    setState({ ...state, value });
  };

  const onSave = () => {
    // saveNode({
    //   flow_id: flowId,
    //   node_id: nodeId,
    //   title: state.title,
    //   value: state.value,
    // });
    //connect to backend
  };



  // shareDB

  return (
    <div className='editor'>
      <div className='header'>
        <IconButton
          size='large'
          onClick={() => {
            handleDrawerClose();
            colabWebSocket.close();
            onSave();
          }}
        >
          <IoIosArrowBack size={20} />
        </IconButton>
        <input
          className='title-input'
          type='text'
          placeholder='Untitled...'
          value={state.title}
          onChange={(e) => {
            setState({ ...state, title: e.target.value });
          }}
        ></input>
        <span className='focus-border'></span>
        {/* 需限制 user 數量 */}
        <div className='users'>
          {colab.map((element, index) => {
            return (
              <div className='user' key={index}>
                <img src={getRandomPicture(element)} alt='' />
              </div>
            );
          })}
        </div>
      </div>
      <div className='text-editor'>
        <EditorToolbar />
        <ReactQuill
          theme='snow'
          value={state.value}
          onChange={handleChange}
          placeholder={'Write something awesome...'}
          modules={modules}
          formats={formats}
          className='editor-input'
          ref={QuillRef}
        />
      </div>
    </div>
  );
};

export { Editor };
