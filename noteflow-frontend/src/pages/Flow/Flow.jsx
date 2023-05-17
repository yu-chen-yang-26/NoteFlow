import React, { useCallback, useState, useRef, useEffect } from "react";
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
<<<<<<< HEAD
} from "reactflow";
import CustomNode from "../../Components/Flow/Node";
import ToolBar from "../../Components/Flow/ToolBar";
import StyleBar from "../../Components/Flow/StyleBar";
import PageTab from "../../Components/PageTab/PageTab";
import { Navigate, useLocation } from "react-router-dom";
import { toPng } from "html-to-image";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

import instance from "../../API/api";
import { useApp } from "../../hooks/useApp";
import "./Flow.scss";
import "reactflow/dist/style.css";
import FlowWebSocket from "../../hooks/flowConnection";
import { useNavigate } from "react-router-dom";
import { usePageTab } from "../../hooks/usePageTab";
import Node from "../Node/Node";
=======
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
>>>>>>> yoho

const nodeTypes = {
  CustomNode,
};

// const edgeTypes = {
//   CustomEdge,
// };

const defaultNodeStyle = {
  border: "2px solid",
  background: "white",
  borderRadius: 10,
  height: 50,
  width: 150,
};

function downloadImage(dataUrl) {
  const a = document.createElement("a");

  a.setAttribute("download", "reactflow.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

function Flow({ flowId }) {
  const rfInstance = useReactFlow();
  const xPos = useRef(50);
  const yPos = useRef(0);
  const nodeId = useRef(0);
  const edgeId = useRef(0);

  const [bgVariant, setBgVariant] = useState("line");
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [title, setTitle] = useState("");
  const [isStyleBarOpen, setIsStyleBarOpen] = useState(false);
  const [back, setBack] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [flowWebSocket, setFlowWebSocket] = useState(null);
<<<<<<< HEAD
  const [nodeWidth, setNodeWidth] = useState(700);
  const [editorId, setEditorId] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const flowId = searchParams.get("id");

  const { addTab } = usePageTab();
=======
  const saveFlow = useFlowStorage((state) => state.saveFlow);

  const [editorId, setEditorId] = useState(null);
>>>>>>> yoho

  const navigateTo = useNavigate();

  const onResize = (event, { element, size, handle }) => {
    setNodeWidth(size.width);
    console.log(size.width);
  };

  useEffect(() => {
    const flowConnection = new FlowWebSocket(flowId, (data) => {
      if (data.error) {
<<<<<<< HEAD
        navigateTo("/error");
=======
        navigateTo('/error');
>>>>>>> yoho
      } else rerender(data);
    });
    setFlowWebSocket(flowConnection);
  }, [flowId]);
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
      .post("/nodes/new-node")
      .then((res) => {
<<<<<<< HEAD
        console.log("res:", res.data);
=======
>>>>>>> yoho
        const editorId = res.data.nodeId;
        const newNode = {
          id: nodeId.current.toString(),
          data: { label: "Untitle", toolbarPosition: Position.Top },
          type: "CustomNode",
          position: { x: xPos.current, y: yPos.current },
          style: defaultNodeStyle,
          class: "Node",
          editorId: editorId,
        };
        // webSocket
        flowWebSocket.addComponent(newNode, "node");
      })
      .catch((e) => console.log(e));
  }, [setNodes, flowWebSocket]);

  const changeStyle = () => {
    setIsStyleBarOpen(true);
  };

<<<<<<< HEAD
  const onSave = (title) => {
    flowWebSocket.editFlowTitle(title);
    setBack(true);
  };
=======
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
>>>>>>> yoho

  const [restart, setRestart] = useState(false);

  const onNodeDoubleClick = useCallback((event, node) => {
    //open editor by nodeID
<<<<<<< HEAD

    console.log(node);
=======
    // if (isEdit && node.editorId !== editorId) {
    //   setEditorId(node.editorId);
    //   setIsEdit(false);
    //   setRestart(true);
    // } else {
    //   setEditorId(node.editorId);
    //   setIsEdit(true);
    // }

>>>>>>> yoho
    setEditorId(node.editorId);
    setIsEdit(true);
    addTab({
      type: "node",
      objectId: node.editorId,
      name: node.data.label ? node.data.label : ":)",
    });
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
        <ReactFlow
          className="NodePanel"
          nodes={nodes}
          edges={edges}
          onNodesChange={(param) => {
            onNodesChange(param);
            flowWebSocket.editComponent(param, "node");
          }}
          onEdgesChange={(param) => {
            onEdgesChange(param);
            flowWebSocket.editComponent(param, "edge");
          }}
          onEdgeUpdate={(param) => {
            onEdgeUpdate(param);
            console.log("2");
          }}
          onConnect={(param) => {
            onConnect(param);
            flowWebSocket.addComponent(
              { ...param, id: edgeId.current.toString() },
              "edge"
            );
            console.log(param);
          }}
          // onInit={setRfInstance}
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={nodeTypes}
          // edgeTypes={edgeTypes}
        >
          <ToolBar
            setTitle={setTitle}
            title={title}
            addNode={onAdd}
            onSave={onSave}
            changeBackground={(bgStyle) => {
              setBgVariant(bgStyle);
            }}
<<<<<<< HEAD
            flowWebSocket={flowWebSocket}
          />
          {isStyleBarOpen ? <StyleBar isOpen={isStyleBarOpen} /> : null}
          <MiniMap nodeStrokeWidth={10} zoomable pannable />
          <Controls />
          <Background color="#ccc" variant={bgVariant} />
        </ReactFlow>
=======
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
>>>>>>> yoho
      ) : (
        <Navigate to="/home" />
      )}
      {isEdit && (
<<<<<<< HEAD
        // <div className="EditorContainer">
        <Resizable
          className="box"
          height={Infinity}
          width={nodeWidth}
          onResize={onResize}
          resizeHandles={["w"]}
          minConstraints={[400, Infinity]}
          maxConstraints={[window.innerWidth * 0.7, Infinity]}
        >
          <div style={{ width: `${nodeWidth}px` }}>
            <Node
              nodeId={editorId}
              setIsEdit={setIsEdit}
              nodeWidth={nodeWidth}
            />
          </div>
        </Resizable>
        // </div>
=======
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
>>>>>>> yoho
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
<<<<<<< HEAD
      <PageTab />
=======
      <PageTab flowId={flowId} />
>>>>>>> yoho
      <ReactFlowProvider>
        <Flow flowId={flowId} />
      </ReactFlowProvider>
    </div>
  );
}

export default FlowWithProvider;
