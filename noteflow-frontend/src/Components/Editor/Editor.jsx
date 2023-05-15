import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from './EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import './Editor.scss';
import { IoIosArrowBack } from 'react-icons/io';
import IconButton from '@mui/material/IconButton';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useQuill } from '../../API/useQuill';
import { Colab } from '../../API/Colab.js';
import { useApp, getRandomPicture } from '../../hooks/useApp';
import Button from 'react-bootstrap/Button';
import { BsShare } from 'react-icons/bs';
import Settings from './Settings';
import instance from '../../API/api';

window.katex = katex;

const Editor = ({ handleDrawerClose, editorId }) => {
  const { user } = useApp();
  const {
    OpenEditor,
    QuillRef,
    setOnline,
    title,
    setTitle,
    newTitle,
    setNewTitle,
  } = useQuill();

  const [colab, setColab] = useState([]);
  const [colabWebSocket, setColabWebSocket] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  // const [rerender, setRerender] = useState(false);
  const [state, setState] = useState({
    value: '',
  });

  useEffect(() => {
    OpenEditor(editorId);
    const connection = new Colab(editorId, user.email, (members) => {
      setColab(members);
    });
    setColabWebSocket(connection);
    instance.get(`/nodes/get-title?id=${editorId}`).then((res) => {
      setTitle(res.data);
      setNewTitle(res.data);
    });
  }, []);

  useEffect(() => {
    setOnline(colab);
  }, [colab]);

  useEffect(() => {
    // quill-editor, editor-settings
    const toolbar = document.querySelector('#toolbar');
    const editor = document.querySelector('#quill-editor');

    console.log(editor.style.display);
    if (showSettings) {
      toolbar.style.pointerEvents = 'none';
      toolbar.style.opacity = '0.5';

      editor.style.display = 'none';
    } else {
      toolbar.style.pointerEvents = 'auto';
      toolbar.style.opacity = '1';

      editor.style.display = '';
    }
  }, [showSettings]);

  return (
    <div className="editor">
      <div className="header">
        <IconButton
          size="large"
          onClick={() => {
            handleDrawerClose();
            colabWebSocket.close();
          }}
        >
          <IoIosArrowBack size={20} />
        </IconButton>
        <input
          className="title-input"
          type="text"
          placeholder="Untitled..."
          value={newTitle}
          onChange={(e) => {
            setNewTitle(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              setTitle(newTitle);
              instance.post('/nodes/set-title', {
                id: editorId,
                title: newTitle,
              });
            }
          }}
        />
        <Button
          variant="dark"
          onClick={() => setShowSettings((state) => !state)}
          className="toolBarButton"
        >
          <BsShare size={18} />
        </Button>
        <span className="focus-border"></span>
        <div className="users">
          {colab.map((element, index) => {
            return (
              <div className="user" key={index}>
                <img src={getRandomPicture(element)} alt="" />
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-editor">
        <EditorToolbar />
        {showSettings ? <Settings editorId={editorId} /> : <></>}
        <ReactQuill
          theme="snow"
          value={state}
          onChange={setState}
          placeholder={'Write something awesome...'}
          modules={modules}
          formats={formats}
          className="editor-input"
          id="quill-editor"
          ref={QuillRef}
        />
      </div>
    </div>
  );
};

export { Editor };
