import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from '../Editor/EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import './DemoEditor.scss';
import { IoIosArrowBack } from 'react-icons/io';
import { BsShare } from 'react-icons/bs';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useApp } from '../../hooks/useApp';
import { Button, IconButton } from '@mui/material';
import instance from '../../API/api';
import EditorSettings from '../Editor/EditorSettings';
import { useQuill } from '../../API/useQuill';

window.katex = katex;
const DemoEditor = ({ handleDrawerClose, editorId }) => {
  const [state, setState] = useState({
    title: '',
    value: '',
  });
  const { isMobile } = useApp();
  const [favorite, setFavorite] = useState(false);

  // 1-Title and content Display
  useEffect(() => {
    setState({
      title: '',
      value: '',
    });
  }, []);

  // 2-quill logic & avatar showing logic.
  const { newTitle, QuillRef, setNewTitle, sendNewTitle } = useQuill();
  const [colab, setColab] = useState([]);

  return (
    <div className={`${isMobile ? 'demo-editor-mobile' : 'demo-editor'}`}>
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
        />
        <span className="focus-border"></span>
        <Button variant="dark" className="toolBarButton">
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

export default DemoEditor;
