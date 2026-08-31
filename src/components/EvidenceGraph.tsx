import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { D3GraphPayload, GraphNode } from '../types';
import { X } from 'lucide-react';

interface EvidenceGraphProps {
  data?: D3GraphPayload;
}

export const EvidenceGraph: React.FC<EvidenceGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Build or use provided nodes & links
    let rawNodes: GraphNode[] = data?.nodes || [];
    let rawLinks: any[] = data?.links || [];

    // Fallback graph if nodes are empty
    if (rawNodes.length === 0) {
      rawNodes = [
        {
          id: 'project:ROOT',
          label: 'MPLADS Project Claim',
          type: 'PROJECT',
          properties: { Source: 'e-SAKSHI Portal', Status: 'CLAIMED_100_PERCENT' }
        },
        {
          id: 'school:ROOT',
          label: 'Target Government School',
          type: 'SCHOOL',
          properties: { Category: 'GOVERNMENT', Verification: 'UDISE+ Master' }
        },
        {
          id: 'state:2022-23',
          label: 'Pre-Sanction Census (2022-23)',
          type: 'STATE',
          properties: { Source: 'UDISE+ September 30 Freeze', Delta: 'Baseline' }
        },
        {
          id: 'state:2023-24',
          label: 'Post-Comp Census (2023-24)',
          type: 'STATE',
          properties: { Source: 'UDISE+ Annual Return', Delta: 'Verified' }
        },
        {
          id: 'finding:AUDIT',
          label: 'Inter-System Audit Verdict',
          type: 'CONTRADICTION',
          properties: { Engine: '4-Lane Anomaly Evaluator', Result: 'Analyzed' }
        }
      ];

      rawLinks = [
        { source: 'project:ROOT', target: 'school:ROOT', relation: 'CLAIMS_INSTITUTION', confidence: 0.95 },
        { source: 'school:ROOT', target: 'state:2022-23', relation: 'BASELINE_CENSUS' },
        { source: 'school:ROOT', target: 'state:2023-24', relation: 'POST_COMP_CENSUS' },
        { source: 'project:ROOT', target: 'finding:AUDIT', relation: 'AUDIT_VERDICT' },
        { source: 'state:2023-24', target: 'finding:AUDIT', relation: 'GROUND_TRUTH' }
      ];
    }

    const width = 640;
    const height = 480;

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
      .scaleExtent([0.3, 3.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Color mapper by node type
    const getNodeColor = (type: string) => {
      switch (type) {
        case 'PROJECT':
          return '#3b82f6'; // Bright Blue
        case 'SCHOOL':
          return '#10b981'; // Vibrant Emerald
        case 'STATE':
          return '#0ea5e9'; // Vibrant Sky Blue
        case 'CONTRADICTION':
          return '#ef4444'; // Bright Red
        case 'RULE':
          return '#f59e0b'; // Amber
        default:
          return '#8b5cf6'; // Violet
      }
    };

    // Clone data for simulation
    const nodeMap = new Map<string, GraphNode>();
    const nodes: GraphNode[] = rawNodes.map((d) => {
      const copy = { ...d };
      nodeMap.set(d.id, copy);
      return copy;
    });

    // Filter valid links where both source and target exist
    const links: any[] = rawLinks
      .filter((d) => {
        const sId = typeof d.source === 'object' ? d.source.id : d.source;
        const tId = typeof d.target === 'object' ? d.target.id : d.target;
        return nodeMap.has(sId) && nodeMap.has(tId);
      })
      .map((d) => ({
        source: typeof d.source === 'object' ? d.source.id : d.source,
        target: typeof d.target === 'object' ? d.target.id : d.target,
        relation: d.relation || 'RELATES_TO',
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
          .distance(120)
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(45));

    // Arrow markers
    svg
      .append('defs')
      .selectAll('marker')
      .data(['arrow', 'arrow-red'])
      .enter()
      .append('marker')
      .attr('id', (d) => d)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', (d) => (d === 'arrow-red' ? '#ef4444' : '#64748b'));

    // Draw Links
    const link = g
      .append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke-width', (d) => (d.confidence ? 2.5 : 1.8))
      .attr('stroke', (d) => (d.relation.includes('CONTRADICT') || d.relation.includes('VIOLATE') ? '#ef4444' : '#475569'))
      .attr('stroke-dasharray', (d) => (d.relation.includes('CONTRADICT') ? '4,4' : 'none'))
      .attr('marker-end', (d) => (d.relation.includes('CONTRADICT') ? 'url(#arrow-red)' : 'url(#arrow)'));

    // Draw Link Labels with background badge
    const linkText = g
      .append('g')
      .selectAll('text')
      .data(links)
      .enter()
      .append('text')
      .attr('font-size', '9px')
      .attr('font-weight', '600')
      .attr('fill', (d) => (d.relation.includes('CONTRADICT') ? '#fca5a5' : '#94a3b8'))
      .attr('text-anchor', 'middle')
      .attr('paint-order', 'stroke')
      .attr('stroke', '#090d16')
      .attr('stroke-width', '3px')
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

    // Outer Glow Ring for Contradiction Nodes
    node
      .filter((d) => d.type === 'CONTRADICTION')
      .append('circle')
      .attr('r', 26)
      .attr('fill', 'none')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '3,3')
      .attr('class', 'animate-spin');

    // Main Node Circle
    node
      .append('circle')
      .attr('r', (d) => (d.type === 'CONTRADICTION' ? 22 : 18))
      .attr('fill', (d) => getNodeColor(d.type))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2.5)
      .attr('filter', 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))');

    // Text Label below Node (Crisp White with Dark Halo)
    node
      .append('text')
      .attr('y', 32)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('fill', '#ffffff')
      .attr('paint-order', 'stroke')
      .attr('stroke', '#020617')
      .attr('stroke-width', '3.5px')
      .attr('stroke-linejoin', 'round')
      .text((d) => (d.label.length > 28 ? `${d.label.slice(0, 26)}...` : d.label));

    // Simulation Tick Updates
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkText
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 4);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 h-[480px] shadow-inner flex flex-col">
      {/* Top Legend Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2 text-[10px] bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-white shadow-md">
        <span className="flex items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5 shadow-sm"></span> Project Claim
        </span>
        <span className="flex items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5 shadow-sm"></span> UDISE+ School
        </span>
        <span className="flex items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 mr-1.5 shadow-sm"></span> Census Return
        </span>
        <span className="flex items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5 shadow-sm animate-pulse"></span> Contradiction
        </span>
      </div>

      <div className="absolute top-3 right-3 z-10 text-xs text-slate-400">
        <span className="bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-mono text-slate-300">
          💡 Click node to view details
        </span>
      </div>

      {/* SVG Canvas */}
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>

      {/* Node Inspector Modal */}
      {selectedNode && (
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-slate-700 rounded-xl p-4 text-white text-xs backdrop-blur-md shadow-2xl z-20 transition-all animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-blue-600 font-bold uppercase text-[10px]">
                {selectedNode.type}
              </span>
              <span className="font-bold text-sm text-slate-100">{selectedNode.label}</span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
            {Object.entries(selectedNode.properties || {}).map(([k, v]) => (
              <div key={k} className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">{k}:</span>
                <span className="text-slate-200 font-semibold">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
