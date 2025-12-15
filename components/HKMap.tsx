import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { DistrictAnalysis } from '../types';
import { HK_TPU_PATHS } from '../constants';
import { Move } from 'lucide-react';

interface HKMapProps {
  data: DistrictAnalysis[];
  selectedMetricLabel: string;
}

export const HKMap: React.FC<HKMapProps> = ({ data, selectedMetricLabel }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });

  // Map District Data to TPU Data (1-to-many) with noise for realism
  const tpuDataMap = useMemo(() => {
    const map = new Map<string, number>();
    const districtMap = new Map<string, number>(
      data.map(d => [d.id, d.density] as [string, number])
    );

    HK_TPU_PATHS.forEach(tpu => {
      const baseDensity = districtMap.get(tpu.districtId) || 0;
      const noise = (Math.random() * 20) - 10; 
      let density = baseDensity + noise;
      density = Math.max(0, Math.min(100, density)); // Clamp 0-100
      map.set(tpu.id, density);
    });
    return map;
  }, [data]);

  // Use a more vibrant color scale suitable for dark overlays or light backgrounds
  const colorScale = useMemo(() => {
    return d3.scaleLinear<string>()
      .domain([0, 50, 100])
      .range(["#FFE5CC", "#FF8800", "#4A0072"]) // Lighter start for better contrast on white
      .interpolate(d3.interpolateRgb);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .translateExtent([[-100, -100], [400, 400]])
      .on('zoom', (event) => {
        setTransform(event.transform);
      });

    svg.call(zoom);
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1));

    return () => {
      svg.on('.zoom', null);
    };
  }, []);

  return (
    <div className="w-full h-full bg-[#E5E5EA] relative overflow-hidden">
      <svg 
        ref={svgRef} 
        viewBox="0 0 300 300" 
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
            <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="0.5"/> 
                <feOffset dx="0" dy="0.5" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.2"/>
                </feComponentTransfer>
                <feMerge> 
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/> 
                </feMerge>
            </filter>
        </defs>

        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
            {HK_TPU_PATHS.map((tpu) => {
                const density = tpuDataMap.get(tpu.id) || 0;
                const fill = colorScale(density);

                return (
                    <g key={tpu.id}>
                        <path
                            d={tpu.d}
                            fill={fill}
                            stroke="white"
                            strokeWidth={0.8 / transform.k} 
                            strokeOpacity={0.5}
                            className="transition-colors duration-500 ease-out"
                        />
                         {transform.k > 3 && (
                           <text
                             x={getCentroid(tpu.d).x}
                             y={getCentroid(tpu.d).y}
                             fontSize={2.5 / transform.k}
                             textAnchor="middle"
                             fill="black"
                             opacity={0.7}
                             pointerEvents="none"
                             className="font-medium"
                           >
                             {tpu.name}
                           </text>
                         )}
                    </g>
                );
            })}
        </g>
      </svg>
    </div>
  );
};

function getCentroid(pathStr: string) {
  const matches = pathStr.match(/M\s?([\d.]+),([\d.]+)/);
  if (matches) {
    return { x: parseFloat(matches[1]), y: parseFloat(matches[2]) };
  }
  return { x: 0, y: 0 };
}
