import React, { useEffect } from 'react';
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from './EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import './Editor.scss';
import { IoIosArrowBack } from 'react-icons/io';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
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
  const [state, setState] = useState({
    value: '',
  });
  const { OpenEditor, QuillRef, setOnline, title, setTitle, newTitle, setNewTitle } = useQuill();
  useEffect(() => {
    OpenEditor(editorId);
    const connection = new Colab(editorId, user.email, (members) => {
      setColab(members);
    });
    setColabWebSocket(connection);
  }, []);

  useEffect(() => {
   setOnline(colab) 
  }, [colab]);

  // shareDB

  return (
    <div className='editor'>
      <div className='header'>
        <IconButton
          size='large'
          onClick={() => {
            handleDrawerClose();
            colabWebSocket.close();
          }}
        >
          <IoIosArrowBack size={20} />
        </IconButton>
        <input
          className='title-input'
          type='text'
          placeholder='Untitled...'
          value={newTitle}
          onChange={(e) => {
            setNewTitle(e.target.value)
          }}
          onKeyDown={(e) => {
            if(e.key === 'Enter') {
              e.preventDefault()
              setTitle(newTitle);
            }
          }}
        ></input>
        <span className='focus-border'></span>
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
          value={state}
          onChange={setState}
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
