import PageTab from "../../Components/PageTab/PageTab";
import { Editor } from "../../Components/Editor/Editor";
import { useNavigate } from "react-router-dom";
import { useQuill } from "../../API/useQuill";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useApp } from "../../hooks/useApp";
import { Colab } from "../../API/Colab";
import "./Node.scss";

const Node = ({ nodeId, setIsEdit }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const editorId = nodeId ? nodeId : searchParams.get("id");
  const { OpenEditor, QuillRef } = useQuill();
  const [colab, setColab] = useState([]);
  const { user } = useApp();
  const navigateTo = useNavigate();
  const handleDrawerClose = () => {
    if (!nodeId) navigateTo("/home");
    else setIsEdit(false);
  };

  useEffect(() => {
    if (!editorId) return;
    OpenEditor(editorId);
    const connection = new Colab(editorId, user.email, (members) => {
      setColab(members);
    });
    return () => {
      console.log("CLOSING colab connection");
      connection.close();
    };
  }, [editorId]);

  return (
    <div className="Node-container">
      {!nodeId && <PageTab />}
      <div className="EditorContainer">

        <Editor
          editorId={editorId}
          handleDrawerClose={handleDrawerClose}
          QuillRef={QuillRef}
          colab={colab}
        />
      </div>
    </div>
  );
};
export default Node;
