import React, { useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";
import "./Editor.scss";
import { IoIosArrowBack } from "react-icons/io";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { getRandomPicture } from "../../hooks/useApp";

window.katex = katex;
const Editor = ({ handleDrawerClose, QuillRef, colab }) => {
  const [state, setState] = useState({
    title: "",
    value: "",
  });

  useEffect(() => {
    setState({
      title: "",
      value: "",
    });
  }, []);

  const handleChange = (value) => {
    setState({ ...state, value });
  };

  return (
    <div className="editor">
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
          value={state.title}
          onChange={(e) => {
            setState({ ...state, title: e.target.value });
          }}
        ></input>
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
        <ReactQuill
          theme="snow"
          value={state.value}
          onChange={handleChange}
          placeholder={"Write something awesome..."}
          modules={modules}
          formats={formats}
          className="editor-input"
          ref={QuillRef}
        />
      </div>
    </div>
  );
};

export { Editor };
