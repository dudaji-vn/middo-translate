import { Edge, Node, getConnectedEdges } from 'reactflow';

const deepDeleteNodes = (
  nodes: Node[],
  nodesToDelete: Node[],
  edges: Edge[],
): Node[] => {
  const connected = getConnectedEdges(nodesToDelete, edges);
  const newNodes = nodes.filter(
    (node) =>
      !connected.some(
        (edge) => edge.source === node.id || edge.target === node.id,
      ),
  );
  const nodesWithDeathParents = newNodes.filter(
    (node) =>
      node.parentNode && !newNodes.find((n) => n.id === node.parentNode),
  );
  if (nodesWithDeathParents.length) {
    return deepDeleteNodes(newNodes, nodesWithDeathParents, edges);
  }
  return newNodes;
};

export { deepDeleteNodes };
