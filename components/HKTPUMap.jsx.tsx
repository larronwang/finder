
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import * as L from 'leaflet'; 
import 'leaflet/dist/leaflet.css'; 
import { CensusData, DistrictAnalysis } from '../types';

const GEOJSON_FILE_PATH = '/2021hktpu.geojson.geojson'; 

interface MapProps {
    userData: CensusData;
    visualizationMetric: keyof CensusData;
    mapData: DistrictAnalysis[]; 
}

// 辅助函数：根据密度获取颜色（示例）
const getColor = (density: number) => {
    if (density > 80) return '#b30000'; // 深红 (高相关)
    if (density > 60) return '#e34a33';
    if (density > 40) return '#fc8d59';
    if (density > 20) return '#fdbb84';
    if (density > 0) return '#fee8c8';
    return '#f7f7f7'; // 浅灰 (无相关或数据不足)
}


const HKTPUMap: React.FC<MapProps> = ({ userData, visualizationMetric, mapData }) => {
    const [geojson, setGeojson] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const geoJsonRef = useRef<any>(null);

    // 1. 数据加载 useEffect
    useEffect(() => {
        const loadGeoJson = async () => {
            try {
                const response = await fetch(GEOJSON_FILE_PATH);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}.`);
                }
                const data = await response.json();
                setGeojson(data);
                setLoading(false);
            } catch (e: any) {
                console.error("Error loading GeoJSON:", e);
                setError(e.message);
                setLoading(false);
            }
        };

        loadGeoJson();
    }, []);

    // 2. 样式函数：根据 TPU_ID 和分析数据上色
    const getStyle = (feature: any) => {
        const tpuId = feature.properties?.TPU_ID || feature.properties?.TPU_KEY; 
        
        const analysis = mapData.find(d => d.id === tpuId);
        const density = analysis?.density || 0; 
        
        return {
            fillColor: getColor(density), 
            weight: 2, 
            opacity: 1,
            color: '#333', 
            fillOpacity: 0.8 
        };
    };

    // 3. 交互函数：绑定弹出层和高亮效果
    const onEachFeature = (feature: any, layer: L.Layer) => {
        if (feature.properties && feature.properties.TPU_ID) {
            const tpuId = feature.properties.TPU_ID;
            const analysis = mapData.find(d => d.id === tpuId);
            const density = analysis?.density || 0;
            const densityPercent = density.toFixed(1);
            
            const popupContent = `
                <div style="font-size: 16px; font-weight: bold; padding: 5px;">
                    TPU 区域 ID: ${tpuId}
                </div>
                <div style="font-size: 14px;">
                    相关性指标: ${visualizationMetric}
                </div>
                <div style="font-size: 14px; color: ${density > 50 ? 'red' : 'green'}; font-weight: bold;">
                    相似度: ${densityPercent}%
                </div>
            `;

            (layer as L.Layer).bindPopup(popupContent, {
                autoClose: false,
                closeButton: true,
                maxHeight: 150,
                minWidth: 200 
            });

            layer.on({
                mouseover: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                        weight: 4,
                        color: 'yellow',
                        fillOpacity: 1
                    });
                    layer.openPopup(); 
                },
                mouseout: (e) => {
                    if (geoJsonRef.current) {
                        geoJsonRef.current.resetStyle(e.target);
                    }
                },
            });
        }
    };

    if (loading) return <div style={{height: '100vh', textAlign: 'center', paddingTop: '50px', fontSize: '24px'}}>正在加载香港地图数据 (约 54MB)...请稍候。</div>;
    if (error) return <div style={{color: 'red', height: '100vh', textAlign: 'center', paddingTop: '50px', fontSize: '24px'}}>地图加载失败: {error}。</div>;

    return (
        <MapContainer 
            center={[22.3193, 114.1694]} 
            zoom={11} 
            style={{ height: '100vh', width: '100%' }}
            doubleClickZoom={false} 
            scrollWheelZoom={true} 
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {geojson && (
                <GeoJSON 
                    data={geojson} 
                    style={getStyle} 
                    onEachFeature={onEachFeature}
                    ref={geoJsonRef}
                />
            )}
        </MapContainer>
    );
};

export default HKTPUMap;
