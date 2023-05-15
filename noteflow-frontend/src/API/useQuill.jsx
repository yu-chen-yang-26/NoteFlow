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
  setTitle: () => {},
  setNewTitle: () => {},
  QuillRef: {},
  title: "",
  newTitle: ""
});

const collection = 'editor';

const colors = {};

const QuillProvider = (props) => {
  const [websocket, setWebsocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const [editorId, setEditorId] = useState(null);
  const [editor, setEditor] = useState(null);
  const [presence, setPresence] = useState(null);
  const [localPresence, setLocalPresence] = useState(null);
  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState(title);
  const [online, setOnline] = useState([]);
  
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

  const presenceHook = async (id, range, callback) => {
    // server
    switch(range.type) {
      case 'disable':
        const cursors = quill.getModule('cursors');
        delete colors[range.name];
        cursors.removeCursor(range.name);
        return // ...
      case 'change-title':
        setTitle(range.title);
        setNewTitle(range.title);
        return;
      default:
        return callback();
    }
  }

  useEffect(() => {
    // 檢查 ws 連線，自動刪除無效連線的 cursor
    if(quill && editor) {
      const cursors = quill.getModule('cursors');
      const killed = Object.keys(colors).filter(email => !online.includes(email))
      killed.forEach(email => {
        delete colors[email];
        cursors.removeCursor(email);
      })
    }
  }, [online])

  useEffect(() => {
    // 創造一個 local presence.
    // 當 setTitle 的時候觸發這個 hook
    // 通常是按 enter 的時候按下這個 hook
    if(localPresence) {
      const range = {
        title: title,
        type: 'change-title',
        name: user.email,
      }
      localPresence.submit(range, (error) => {
        if (error) throw error;
      });
    }
  }, [title])

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
        const localPresence = presence.create(user.email);
        setPresence(presence);
        setLocalPresence(localPresence);

        const cursors = quill.getModule('cursors');

        quill.on('selection-change', (range, oldRange, source) => {
          // client 端，送給其他人你的消息
          // console.log('selection-change', source, range)
          if (source !== 'user') return; // 有可能是 api 或 user
          if (!range) { // 我們可以考慮推一個奇怪的東西上去
            range = {
              type: 'disable',
            }
          }
          // console.log('range', range, source);
          range.name = user ? (user.name ? user.name : '-') : '-'; // # TODO
          localPresence.submit(range, (error) => {
            if (error) throw error;
          });
        });

        presence.on('receive', function (id, range) {
          // 我收到了來自 server 端的，其他人的消息
          if(id === user.email) return;
          presenceHook(id, range, () => {
            colors[id] = colors[id] || tinycolor.random().toHexString();
            const name = (range && range.name) || 'Anonymous';
            cursors.createCursor(id, name, colors[id]);
            cursors.moveCursor(id, range);
          })
        });
      });     
    });
  }, [editorId, quill, websocket, user]);

  return (
    <QuillContext.Provider
      value={{ OpenEditor, setOnline, title, setTitle, newTitle, setNewTitle, QuillRef,  }}
      {...props}
    />
  );
};

const useQuill = () => useContext(QuillContext);

export { QuillProvider, useQuill };
