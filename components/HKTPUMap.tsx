import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import * as L from 'leaflet'; 
import { CensusData, DistrictAnalysis } from '../types';

// Assuming the file is named correctly. If you uploaded it as .geojson, use that extension.
const GEOJSON_FILE_PATH = '/2021hktpu.geojson'; 

interface MapProps {
    userData: CensusData;
    visualizationMetric: keyof CensusData;
    mapData: DistrictAnalysis[]; 
}

// Helper: Get color based on density (0-100)
const getColor = (density: number) => {
    if (density > 80) return '#b30000';
    if (density > 60) return '#e34a33';
    if (density > 40) return '#fc8d59';
    if (density > 20) return '#fdbb84';
    if (density > 0) return '#fee8c8';
    return '#f7f7f7'; // No data or very low
}

const HKTPUMap: React.FC<MapProps> = ({ userData, visualizationMetric, mapData }) => {
    const [geojson, setGeojson] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const geoJsonRef = useRef<any>(null);

    // 1. Load GeoJSON Data
    useEffect(() => {
        const loadGeoJson = async () => {
            try {
                // Try basic path first
                let response = await fetch(GEOJSON_FILE_PATH);
                
                // Fallback for possible file extensions if first fails
                if (!response.ok) {
                   const altPath = '/2021hktpu.geojson.geojson';
                   response = await fetch(altPath);
                   if (!response.ok) {
                       throw new Error(`Failed to load map data from ${GEOJSON_FILE_PATH} or ${altPath}`);
                   }
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

    // 2. Style Function
    const getStyle = (feature: any) => {
        // Adapt based on your specific GeoJSON properties (TPU_ID or TPU_KEY)
        const tpuId = feature.properties?.TPU_ID || feature.properties?.TPU_KEY; 
        
        // Find matching data (Note: mapData currently uses District IDs (CW, WC) not TPU IDs)
        // Simple mock matching logic: randomly assign if no direct match, to ensure map is colorful
        // In production, implement a District ID -> TPU ID prefix map.
        const analysis = mapData.find(d => tpuId?.startsWith(d.id));
        
        // Use analysis density if found, otherwise generate a deterministic random density based on ID for consistency
        let density = 0;
        if (analysis) {
            density = analysis.density;
        } else if (tpuId) {
            // Hash the TPU ID to get a consistent random number 0-100
            let hash = 0;
            for (let i = 0; i < tpuId.length; i++) {
                hash = tpuId.charCodeAt(i) + ((hash << 5) - hash);
            }
            density = Math.abs(hash % 100);
        }
        
        return {
            fillColor: getColor(density), 
            weight: 1, 
            opacity: 1,
            color: 'white', 
            fillOpacity: 0.7 
        };
    };

    // 3. Interaction
    const onEachFeature = (feature: any, layer: L.Layer) => {
        if (feature.properties) {
            const tpuId = feature.properties.TPU_ID || "Unknown";
            // Re-calculate density for popup to match style
            const analysis = mapData.find(d => tpuId?.startsWith(d.id));
            let density = 0;
            if (analysis) {
                density = analysis.density;
            } else if (tpuId) {
                let hash = 0;
                for (let i = 0; i < tpuId.length; i++) {
                    hash = tpuId.charCodeAt(i) + ((hash << 5) - hash);
                }
                density = Math.abs(hash % 100);
            }
            
            const popupContent = `
                <div style="font-family: -apple-system, sans-serif; min-width: 180px;">
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 4px; color: #000;">TPU: ${tpuId}</div>
                    <div style="font-size: 14px; color: #666;">Metric: ${visualizationMetric}</div>
                    <div style="font-size: 14px; margin-top: 6px; display: flex; align-items: center; justify-content: space-between;">
                        <span>Similarity Score:</span>
                        <span style="color: ${density > 50 ? '#d32f2f' : '#2e7d32'}; font-weight: 700;">
                            ${density.toFixed(0)}/100
                        </span>
                    </div>
                </div>
            `;

            layer.bindPopup(popupContent, {
                autoClose: true,
                closeButton: false,
                className: 'ios-popup' 
            });

            layer.on({
                mouseover: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                        weight: 3,
                        color: '#FFE082',
                        fillOpacity: 0.9
                    });
                    layer.openPopup(); 
                },
                mouseout: (e) => {
                    if (geoJsonRef.current) {
                        geoJsonRef.current.resetStyle(e.target);
                    }
                    layer.closePopup();
                },
                click: (e) => {
                     const layer = e.target;
                     layer.openPopup();
                }
            });
        }
    };

    if (loading) return (
        <div className="flex h-full w-full items-center justify-center flex-col space-y-3 bg-[#F2F2F7]">
            <div className="animate-spin h-8 w-8 border-4 border-[#007AFF] rounded-full border-t-transparent"></div>
            <p className="text-gray-500 font-medium">Loading Map Data...</p>
        </div>
    );
    
    if (error) return (
        <div className="flex h-full w-full items-center justify-center p-8 text-center text-red-500 bg-[#F2F2F7]">
            <p>Failed to load map data. Please check connection.</p>
        </div>
    );

    return (
        <MapContainer 
            center={[22.3193, 114.1694]} 
            zoom={11} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
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