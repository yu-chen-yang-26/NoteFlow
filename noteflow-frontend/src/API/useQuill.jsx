import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

import sharedb from "sharedb/lib/client";
import richText from "rich-text";
import { useApp } from "../hooks/useApp";
import { BASE_URL } from "./api";
import quillEvent from "./QuillEvent";

sharedb.types.register(richText.type);

const QuillContext = createContext({
  OpenEditor: () => {},
  setIdentity: () => {},
});

const collection = "editor";

const QuillProvider = ({ ...props }) => {
  const [websocket, setWebsocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const QuillRef = useRef();
  const [identity, setIdentity] = useState(null);

  const { user } = useApp();

  const OpenEditor = async (editorId) => {
    const socket = new WebSocket(`wss://${BASE_URL}/ws/node?id=${editorId}`);
    const connection = new sharedb.Connection(socket);
    setWebsocket({ socket: socket, sharedb: connection, editorId: editorId });
    QuillRef.current !== null
      ? setQuill(QuillRef.current.getEditor())
      : console.error("NULL QUILL REFERENCE");
  };

  useEffect(() => {
    if (!quill || !websocket) return;
    const editor = websocket.sharedb.get(collection, websocket.editorId);
    editor.subscribe((error) => {
      if (error) throw error;
      quill.setContents(editor.data);
      const presence = editor.connection.getDocPresence(
        collection,
        websocket.editorId
      );

      presence.subscribe((error) => {
        if (error) throw error;
        quillEvent.offon(quill, editor, presence, user);
      });
    });
  }, [quill, websocket, identity]);

  return <QuillContext.Provider value={{ OpenEditor, QuillRef }} {...props} />;
};

const useQuill = () => useContext(QuillContext);

export { QuillProvider, useQuill };
