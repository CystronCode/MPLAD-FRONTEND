import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { D3GraphPayload, GraphNode } from '../types';
import { X } from 'lucide-react';

interface EvidenceGraphProps {
  data: D3GraphPayload;
}

export const EvidenceGraph: React.FC<EvidenceGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data || !data.nodes || data.nodes.length === 0) return;

    const width = 600;
    const height = 450;

    // Clear previous SVG contents
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('width', '100%')
      .attr('height', '100%');

    // Create a container group for zoom/pan
    const g = svg.append('g');

    // Setup zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 3.0])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Color mapper by node type
    const getNodeColor = (type: string) => {
      switch (type) {
        case 'PROJECT':
          return '#1e40af'; // Blue
        case 'SCHOOL':
          return '#047857'; // Green
        case 'STATE':
          return '#0284c7'; // Sky Blue
        case 'CONTRADICTION':
          return '#dc2626'; // Red
        case 'RULE':
          return '#d97706'; // Amber
        default:
          return '#64748b'; // Slate
      }
    };

    // Clone data for simulation
    const nodes: GraphNode[] = data.nodes.map((d) => ({ ...d }));
    const links: any[] = data.links.map((d) => ({
      source: d.source,
      target: d.target,
      relation: d.relation,
      confidence: d.confidence
    }));

    // Setup D3 Force Simulation
    const simulation = d3
      .forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(35));

    // Draw Arrow markers for directed edges
    svg
      .append('defs')
      .selectAll('marker')
      .data(['arrow'])
      .enter()
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 26)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#94a3b8');

    // Draw Links
    const link = g
      .append('g')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-opacity', 0.8)
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke-width', (d) => (d.confidence ? 2.5 : 1.5))
      .attr('stroke', (d) => (d.relation.includes('CONTRADICT') || d.relation.includes('VIOLATE') ? '#ef4444' : '#94a3b8'))
      .attr('marker-end', 'url(#arrow)');

    // Draw Link Labels
    const linkText = g
      .append('g')
      .selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .attr('font-size', '8px')
      .attr('fill', '#64748b')
      .attr('text-anchor', 'middle')
      .text((d) => d.relation);

    // Draw Node Groups
    const node = g
      .append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .on('click', (_, d) => setSelectedNode(d))
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on('start', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node Circles
    node
      .append('circle')
      .attr('r', (d) => (d.type === 'CONTRADICTION' ? 22 : 18))
      .attr('fill', (d) => getNodeColor(d.type))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2.5)
      .attr('class', (d) => (d.type === 'CONTRADICTION' ? 'animate-pulse' : ''));

    // Node Labels
    node
      .append('text')
      .attr('y', 28)
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1e293b')
      .text((d) => d.label);

    // Simulation Tick Updates
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkText
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 3);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 h-[450px] shadow-inner flex flex-col">
      {/* Top Overlay Legend */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2 text-[10px] bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-white">
        <span className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-600 mr-1"></span> Project
        </span>
        <span className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-600 mr-1"></span> School
        </span>
        <span className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-sky-500 mr-1"></span> Census State
        </span>
        <span className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-red-600 mr-1"></span> Contradiction
        </span>
      </div>

      <div className="absolute top-3 right-3 z-10 text-xs text-slate-400">
        <span className="bg-slate-950/80 px-2 py-1 rounded border border-slate-700">
          Click node to inspect SHA-256
        </span>
      </div>

      {/* SVG Container */}
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>

      {/* Node Inspector Modal */}
      {selectedNode && (
        <div className="absolute bottom-3 left-3 right-3 bg-slate-950/95 border border-slate-700 rounded-lg p-4 text-white text-xs backdrop-blur-md shadow-2xl z-20 transition-all">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-blue-600 font-bold uppercase text-[10px]">
                {selectedNode.type}
              </span>
              <span className="font-bold text-sm text-slate-100">{selectedNode.label}</span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
            {Object.entries(selectedNode.properties || {}).map(([k, v]) => (
              <div key={k} className="bg-slate-900 p-1.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">{k}:</span>
                <span className="text-slate-200 font-semibold">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
