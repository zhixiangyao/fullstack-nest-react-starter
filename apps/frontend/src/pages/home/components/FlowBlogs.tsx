import type { Edge, FitViewOptions, Node, OnConnect, OnEdgesChange, OnNodesChange } from '@xyflow/react'
import type { Blog } from '~/fetchers'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  Position,
  ReactFlow,
} from '@xyflow/react'
import { useMemoizedFn, useRequest } from 'ahooks'
import { Typography } from 'antd'
import { useEffect, useState } from 'react'
import * as fetchers from '~/fetchers'
import { useAppStore } from '~/stores/useAppStore'
import '@xyflow/react/dist/style.css'

function generateFlowElements(items: Blog[]): { nodes: Node[], edges: Edge[] } {
  const rootNodeId = 'root'
  const radius = 400
  const angleIncrement = (2 * Math.PI) / items.length
  const nodes: Node[] = []
  const edges: Edge[] = []

  nodes.push({
    id: rootNodeId,
    type: 'input',
    data: { label: 'Root' },
    position: { x: -1200, y: 0 },
    sourcePosition: Position.Right,
  })

  items.forEach((item, index) => {
    const nodeId = `item-${index}`
    const angle = index * angleIncrement

    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)

    nodes.push({
      id: nodeId,
      type: 'output',
      data: {
        label: (
          <Typography.Text className="text-xs" ellipsis>
            {item.title}
          </Typography.Text>
        ),
      },
      position: { x, y },
      targetPosition: Position.Left,
    })

    edges.push({
      id: `edge-${rootNodeId}-${nodeId}`,
      source: rootNodeId,
      target: nodeId,
      animated: true,
    })
  })

  return { nodes, edges }
}

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
}

interface Props {
  className?: string
  style?: React.CSSProperties
}

function FlowBlogs({ className, style }: Props) {
  const { data } = useRequest(fetchers.blogFindAll, { cacheKey: fetchers.blogFindAll.name })
  const appStore = useAppStore()
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  const handleNodesChange = useMemoizedFn<OnNodesChange>(changes => setNodes(nds => applyNodeChanges(changes, nds)))
  const handleEdgesChange = useMemoizedFn<OnEdgesChange>(changes => setEdges(eds => applyEdgeChanges(changes, eds)))
  const handleConnect = useMemoizedFn<OnConnect>(connection => setEdges(eds => addEdge(connection, eds)))

  useEffect(() => {
    if (!data)
      return
    const { nodes, edges } = generateFlowElements(data?.data.list)
    setNodes(nodes)
    setEdges(edges)
  }, [data])

  return (
    <div style={style} className={className}>
      <ReactFlow
        fitView
        attributionPosition="top-right"
        nodes={nodes}
        edges={edges}
        fitViewOptions={fitViewOptions}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        colorMode={appStore.mode}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}

export { FlowBlogs }
