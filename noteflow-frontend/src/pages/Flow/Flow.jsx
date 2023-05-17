import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  Position,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
  useReactFlow,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
} from 'reactflow';
import CustomNode from '../../Components/Flow/Node';
import ToolBar from '../../Components/Flow/ToolBar';
import StyleBar from '../../Components/Flow/StyleBar';
import Drawer from '@mui/material/Drawer';
import { Editor } from '../../Components/Editor/Editor';
import PageTab from '../../Components/PageTab/PageTab';
import { useFlowStorage } from '../../storage/Storage';
import { Navigate, useLocation } from 'react-router-dom';
import { QuillProvider } from '../../API/useQuill';
import instance from '../../API/api';
import { useApp } from '../../hooks/useApp';
import './Flow.scss';
import 'reactflow/dist/style.css';
import FlowWebSocket from '../../hooks/flowConnection';
import { useNavigate } from 'react-router-dom';

const nodeTypes = {
  CustomNode,
};

// const edgeTypes = {
//   CustomEdge,
// };

const defaultNodeStyle = {
  border: '2px solid',
  background: 'white',
  borderRadius: 10,
  height: 50,
  width: 150,
};

function downloadImage(dataUrl) {
  const a = document.createElement('a');

  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

function Flow({ flowId }) {
  const rfInstance = useReactFlow();
  const xPos = useRef(50);
  const yPos = useRef(0);
  const nodeId = useRef(0);
  const edgeId = useRef(0);

  const [bgVariant, setBgVariant] = useState('line');
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [title, setTitle] = useState('');
  const [isStyleBarOpen, setIsStyleBarOpen] = useState(false);
  const [back, setBack] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [flowWebSocket, setFlowWebSocket] = useState(null);
  const saveFlow = useFlowStorage((state) => state.saveFlow);

  const [editorId, setEditorId] = useState(null);

  const navigateTo = useNavigate();

  useEffect(() => {
    const flowConnection = new FlowWebSocket(flowId, (data) => {
      if (data.error) {
        navigateTo('/error');
      } else rerender(data);
    });
    setFlowWebSocket(flowConnection);
  }, []);
  //
  const rerender = (data) => {
    console.log('nodes', data.nodes);
    console.log('edges', data.edges);
    setNodes(data.nodes);
    setEdges(data.edges);
    setTitle(data.name);
    const node_ids = new Array(data.nodes.length);
    Object.keys(data.nodes).forEach((element, index) => {
      node_ids[index] = Number(element);
    });
    const edge_ids = new Array(data.edges.length);
    Object.keys(data.edges).forEach((element, index) => {
      edge_ids[index] = Number(element);
    });
    nodeId.current = data.nodes.length === 0 ? 0 : Math.max(...node_ids) + 1;
    edgeId.current = data.edges.length === 0 ? 0 : Math.max(...edge_ids) + 1;
  };

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );
  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    [],
  );

  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);
          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge),
          );
          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            })),
          );
          return [...remainingEdges, ...createdEdges];
        }, edges),
      );
    },
    [nodes, edges],
  );

  const onAdd = useCallback(() => {
    yPos.current += 50;
    if (yPos.current > 400) {
      yPos.current = 50;
      xPos.current += 150;
    }
    instance
      .post('/nodes/new-node')
      .then((res) => {
        const editorId = res.data.nodeId;
        const newNode = {
          id: nodeId.current.toString(),
          data: { label: 'Untitle', toolbarPosition: Position.Top },
          type: 'CustomNode',
          position: { x: xPos.current, y: yPos.current },
          style: defaultNodeStyle,
          class: 'Node',
          editorId: editorId,
        };
        // webSocket
        flowWebSocket.addComponent(newNode, 'node');
      })
      .catch((e) => console.log(e));
  }, [setNodes, flowWebSocket]);

  const changeStyle = () => {
    setIsStyleBarOpen(true);
  };

  const onSave = useCallback(
    (title) => {
      if (rfInstance) {
        const flow = rfInstance.toObject();
        setBack(true);
        saveFlow({
          id: flowId,
          flow: flow,
          title: title,
        });
        //connect to backend
      }
    },
    [rfInstance],
  );

  const [restart, setRestart] = useState(false);

  const onNodeDoubleClick = useCallback((event, node) => {
    //open editor by nodeID
    // if (isEdit && node.editorId !== editorId) {
    //   setEditorId(node.editorId);
    //   setIsEdit(false);
    //   setRestart(true);
    // } else {
    //   setEditorId(node.editorId);
    //   setIsEdit(true);
    // }

    setEditorId(node.editorId);
    setIsEdit(true);
  });

  // useEffect(() => {
  //   if (restart) {
  //     setIsEdit(true);
  //     setRestart(false);
  //   }
  // }, [restart]);

  return (
    <div className="FlowEditPanel">
      {!back ? (
        <>
          <ToolBar
            flowTitle={title}
            addNode={onAdd}
            onSave={onSave}
            changeBackground={(bgStyle) => {
              setBgVariant(bgStyle);
            }}
            flowId={flowId}
          />
          <ReactFlow
            className="NodePanel"
            nodes={nodes}
            edges={edges}
            onNodesChange={(param) => {
              onNodesChange(param);
              flowWebSocket.editComponent(param, 'node');
            }}
            onEdgesChange={(param) => {
              onEdgesChange(param);
              flowWebSocket.editComponent(param, 'edge');
            }}
            onEdgeUpdate={(param) => {
              onEdgeUpdate(param);
            }}
            onConnect={(param) => {
              onConnect(param);
              flowWebSocket.addComponent(
                { ...param, id: edgeId.current.toString() },
                'edge',
              );
            }}
            // onInit={setRfInstance}
            onNodeDoubleClick={onNodeDoubleClick}
            nodeTypes={nodeTypes}
            // edgeTypes={edgeTypes}
          >
            {isStyleBarOpen ? <StyleBar isOpen={isStyleBarOpen} /> : null}
            <MiniMap nodeStrokeWidth={10} zoomable pannable />
            <Controls />
            <Background color="#ccc" variant={bgVariant} />
          </ReactFlow>
        </>
      ) : (
        <Navigate to="/home" />
      )}
      {isEdit && (
        <div className="EditorContainer">
          <Drawer
            sx={{
              width: '50%',
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: '50%',
              },
            }}
            variant="persistent"
            anchor="right"
            open={isEdit}
          >
            <QuillProvider>
              <Editor
                nodes={nodes}
                editorId={editorId}
                handleDrawerClose={() => setIsEdit(false)}
              />
            </QuillProvider>
          </Drawer>
        </div>
      )}
    </div>
  );
}

function FlowWithProvider(...props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const flowId = searchParams.get('id');

  return (
    <div className="Flow-container">
      <PageTab flowId={flowId} />
      <ReactFlowProvider>
        <Flow flowId={flowId} />
      </ReactFlowProvider>
    </div>
  );
}

export default FlowWithProvider;
