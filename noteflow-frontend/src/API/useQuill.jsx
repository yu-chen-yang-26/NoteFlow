import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
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
  setOnline: () => {},
  QuillRef: {},
});

const collection = 'editor';

/**
 * 亂數產生的 hashId, 這個 id 可以再綁定一個名字
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
  const [cursors, setCursors] = useState(null);
  const [online, setOnline] = useState([])
  const QuillRef = useRef();

  const { user } = useApp();

  useEffect(() => {
    if (!editorId) return;
    const socket = new WebSocket(`wss://${BASE_URL}/ws/node?id=${editorId}`);
    const connection = new sharedb.Connection(socket);
    setWebsocket(connection);
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
    setEditorId(editorId);
    QuillRef.current !== null
      ? setQuill(QuillRef.current.getEditor())
      : console.error('NULL QUILL REFERENCE');
  };

  useEffect(() => {
    // 拿 member 跟 presence 比？ 應該拿 colors 就好了
    // 包含在裡面的我不想要留著，留著的都是等等要被殺掉的
    if(quill && editor) {
      /*
        當 members 裡面少了一個 3，剩下 1 2
        原本的 colors 有 2 3，
        killed = [3]
      */
      const cursors = quill.getModule('cursors');
      const killed = Object.keys(colors).filter(email => !online.includes(email))
      killed.forEach(email => {
        delete colors[email];
        cursors.removeCursor(email);
      })
    }
  }, [online])

  useEffect(() => {
    if (!editorId || !quill || !websocket) return;

    const editor = websocket.get(collection, editorId);

    editor.subscribe((error) => {
      if (error) throw error;

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
        setPresence(presence);
      });

      const localPresence = presence.create(user.email);

      quill.on('selection-change', (range, oldRange, source) => {
        // client 端，送給其他人你的消息
        if (source !== 'user') return;
        if (!range) return;
        range.name = user ? (user.name ? user.name : '-') : '-'; // # TODO
        localPresence.submit(range, (error) => {
          if (error) throw error;
        });
      });

      quill.on('')
      const cursors = quill.getModule('cursors');
      presence.on('receive', function (id, range) {
        // 我收到了來自 server 端的，其他人的消息
        colors[id] = colors[id] || tinycolor.random().toHexString();
        const name = (range && range.name) || 'Anonymous';
        cursors.createCursor(id, name, colors[id]);
        cursors.moveCursor(id, range);
      });
    });

    setEditor(editor);
  }, [editorId, quill, websocket, user]);

  return (
    <QuillContext.Provider
      value={{ OpenEditor, setOnline, QuillRef }}
      {...props}
    />
  );
};

const useQuill = () => useContext(QuillContext);

export { QuillProvider, useQuill };
