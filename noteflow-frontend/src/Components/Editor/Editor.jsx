import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from './EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import './Editor.scss';
import { IoIosArrowBack } from 'react-icons/io';
import { BsShare } from 'react-icons/bs';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useApp } from '../../hooks/useApp';
import { Button, IconButton } from '@mui/material';
import instance from '../../API/api';
import EditorSettings from './EditorSettings';
import { useQuill } from '../../API/useQuill';
import { Colab } from '../../API/Colab';

window.katex = katex;
const Editor = ({ handleDrawerClose, editorId }) => {
  const [state, setState] = useState({
    title: '',
    value: '',
  });
  const [showSettings, setShowSettings] = useState(false);
  const { user, isMobile } = useApp();
  const [favorite, setFavorite] = useState(false);

  // 1-Title and content Display
  useEffect(() => {
    setState({
      title: '',
      value: '',
    });
  }, []);

  // 2-quill logic & avatar showing logic.
  const {
    OpenEditor,
    newTitle,
    QuillRef,
    setTitle,
    setNewTitle,
    sendNewTitle,
  } = useQuill();
  const [colab, setColab] = useState([]);

  useEffect(() => {
    if (!editorId) return;

    OpenEditor(editorId);
    instance.get(`/nodes/get-title?id=${editorId}`).then((res) => {
      setTitle(res.data);
      setNewTitle(res.data);
    });
    instance.get(`/library/is-favorite?id=${editorId}`).then((res) => {
      if (res.status === 200) {
        setFavorite(res.data);
      }
    });

    const connection = new Colab(editorId, user, (members) => {
      setColab(members);
    });
    return () => {
      connection.close();
    };
  }, [editorId]);

  useEffect(() => {
    // quill-editor, editor-settings
    const toolbar = document.querySelector('#toolbar');
    const editor = document.querySelector('#quill-editor');

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
    <div className={`${isMobile ? 'editor-mobile' : 'editor'}`}>
      <div className="header">
        <IconButton
          size="large"
          onClick={() => {
            handleDrawerClose();
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
              sendNewTitle(newTitle);
              instance
                .post('/nodes/set-title', {
                  id: editorId,
                  title: newTitle,
                })
                .then((res) => {
                  console.log(res.status);
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
        <Button
          variant="dark"
          size="small"
          onClick={() => {
            const fav = favorite;
            setFavorite((state) => !state);
            instance.post(!fav ? '/library/add-node' : 'library/remove-node', {
              id: editorId,
            });
          }}
          className="toolBarButton"
        >
          {favorite ? <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />}
        </Button>
        <span className="focus-border"></span>
        <div className="users">
          {/* 右上角可愛的大頭貼 */}
          {colab.map((element, index) => {
            return (
              <div className="user" key={index}>
                <img src={element.picture} alt="" />
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-editor">
        <EditorToolbar />
        {showSettings ? <EditorSettings editorId={editorId} /> : <></>}
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
