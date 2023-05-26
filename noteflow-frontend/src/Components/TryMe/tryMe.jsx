import React, { useCallback, useState } from 'react';
import ReactFlow, { addEdge, useNodesState, useEdgesState } from 'reactflow';

const DemoEditor = React.lazy(() => import('./DemoEditor'));

import {
  nodes as initialNodes,
  edges as initialEdges,
} from './initial-elements';
import 'reactflow/dist/style.css';

const onInit = (reactFlowInstance) =>
  console.log('flow loaded:', reactFlowInstance);

const TryMe = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isEdit, setIsEdit] = useState(false);
  const [editorId, setEditorId] = useState('');

  const onNodeDoubleClick = useCallback((event, node) => {
    setEditorId(node.id);
    setIsEdit(true);
  });

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example
  const edgesWithUpdatedTypes = edges.map((edge) => {
    return edge;
  });

  return (
    <>
      {/* <h1>Try Me</h1> */}

      {isEdit ? (
        <DemoEditor
          editorId={editorId}
          handleDrawerClose={() => setIsEdit(false)}
        />
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edgesWithUpdatedTypes}
          onNodesChange={(param) => {
            console.log(param);
            onNodesChange(param);
          }}
          onEdgesChange={onEdgesChange}
          onNodeDoubleClick={onNodeDoubleClick}
          onConnect={onConnect}
          onInit={onInit}
          fitView
        />
      )}
    </>
  );
};

export default TryMe;
