import React, { useCallback } from 'react';
import ReactFlow, { addEdge, useNodesState, useEdgesState } from 'reactflow';

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
    <ReactFlow
      nodes={nodes}
      edges={edgesWithUpdatedTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
      fitView
    >
      {/* <h1>Try Me</h1> */}
    </ReactFlow>
  );
};

export default TryMe;
