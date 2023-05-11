import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import ObjectID from 'bson-objectid';
import tinycolor from 'tinycolor2';
// import ReconnectingWebSocket from 'reconnecting-websocket';
import sharedb from 'sharedb/lib/client';
import richText from 'rich-text';
import { useApp } from '../hooks/useApp';
import { BASE_URL } from './api';

const NOTEFLOW_HOST = 'noteflow.live';

sharedb.types.register(richText.type);

const QuillContext = createContext({
  OpenEditor: () => {},
  setIdentity: () => {},
});

const collection = 'editor';

/**
 * 亂數產生的 hashId, 這個 id 可以再綁定一個名字，
 * 可以使用 setIdentity({..., name: ...}) 來綁定名字。
 */
const presenceId = new ObjectID().toHexString(); // TODO

/**
 * 自動為不同人的 Cursors 產生不同顏色並渲染
 * {
 *  hashId1: '#......',
 *  hashId2: '#......',
 * }
 */
const colors = {};

const QuillProvider = (props) => {
  const [websocket, setWebsocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const [editorId, setEditorId] = useState(null);
  const [editor, setEditor] = useState(null);
  const [presence, setPresence] = useState(null);
  const QuillRef = useRef();
  const [identity, setIdentity] = useState(null);
  const [colabs, setColabs] = useState([]);

  const { user } = useApp();

  useEffect(() => {
    if (!editorId) return;
    const socket = new WebSocket(`wss://${BASE_URL}/ws/node?id=${editorId}`);
    const connection = new sharedb.Connection(socket);
    setWebsocket(connection);
    setIdentity(user);
  }, [editorId]);

  const OpenEditor = async (editorId) => {
    // TODO: 確認有沒有這個 collection & table 存在 mongodb 裡面
    if (editor) {
      // 如果先前有訂閱其他的 Node，取消訂閱，清除 eventListener
      await editor.unsubscribe();
    }
    if (presence) {
      await presence.unsubscribe();
    }
    console.log('open', editorId);
    setEditorId(editorId);
    QuillRef.current !== null
      ? setQuill(QuillRef.current.getEditor())
      : console.error('NULL QUILL REFERENCE');
  };

  useEffect(() => {
    if (!editorId || !quill || !websocket) return;

    console.log('editorId', editorId);

    const editor = websocket.get(collection, editorId);
    console.log(editor);
    editor.subscribe((error) => {
      if (error) throw error;
      console.log('訂閱好啦！');
      // 設定特定 node editor 的 websocket
      // if (editor.type === null) {
      //   editor.create([{ insert: "hello world" }], "rich-text");
      // }
      setEditor(editor);
      quill.setContents(editor.data);

      // 如果你改變文字
      quill.on('text-change', (delta, oldDelta, source) => {
        if (source !== 'user') return; // ?
        editor.submitOp(delta);
      });

      // 如果你收到從別的地方來的訊息
      editor.on('op', function (op, source) {
        if (source) return;
        quill.updateContents(op);
      });

      // 進入
      const presence = editor.connection.getDocPresence(collection, editorId);
      presence.subscribe((error) => {
        if (error) throw error;
        console.log(presence);
        setPresence(presence);
        // console.log(presence.所有其他人);
        // const colabs = presence.所有其他人;
        // setColabs(colabs);
      });

      const localPresence = presence.create(user.email);
      quill.on('');
      quill.on('selection-change', (range, oldRange, source) => {
        if (source !== 'user') return;
        if (!range) return;
        console.log(1);
        range.name = identity ? (identity.name ? identity.name : '-') : '-'; // # TODO
        localPresence.submit(range, (error) => {
          if (error) throw error;
        });
      });

      const cursors = quill.getModule('cursors');
      presence.on('receive', function (id, range) {
        colors[id] = colors[id] || tinycolor.random().toHexString();
        var name = (range && range.name) || 'Anonymous';
        cursors.createCursor(id, name, colors[id]);
        cursors.moveCursor(id, range);
      });
    });

    setEditor(editor);
    console.log('Done');
  }, [editorId, quill, websocket, identity]);

  return (
    <QuillContext.Provider
      value={{ OpenEditor, setIdentity, identity, QuillRef, colabs }}
      {...props}
    />
  );
};

const useQuill = () => useContext(QuillContext);

export { QuillProvider, useQuill };
