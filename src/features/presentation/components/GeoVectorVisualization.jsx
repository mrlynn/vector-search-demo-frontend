import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Polyline, InfoWindow } from '@react-google-maps/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const libraries = ['marker'];

const mapOptions = {
  mapTypeId: 'terrain',
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: true,
  mapId: 'YOUR_MAP_ID'
};

const mapContainerStyle = {
  width: '100%',
  height: '700px',
  minWidth: '1200px'
};

const points = [
  { id: 1, name: "New York", lat: 40.7128, lng: -74.0060, color: "#FF4444" },
  { id: 2, name: "London", lat: 51.5074, lng: -0.1278, color: "#4444FF" },
  { id: 3, name: "Tokyo", lat: 35.6762, lng: 139.6503, color: "#44FF44" },
  { id: 4, name: "Sydney", lat: -33.8688, lng: 151.2093, color: "#FFAA00" }
];

const GeoVectorVisualization = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [clickedPoint, setClickedPoint] = useState(null);
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
    mapIds: [mapOptions.mapId]
  });

  const mapCenter = { lat: 20, lng: 0 };

  const onMapLoad = async (map) => {
    setMap(map);
    
    if (window.google) {
      const { AdvancedMarkerElement } = google.maps.marker;
      
      // Origin marker
      createAdvancedMarker({
        map,
        position: { lat: 0, lng: 0 },
        title: "Origin (0°, 0°)",
        color: "#00ED64",
        label: "Origin",
        point: { id: 'origin', name: "Origin", lat: 0, lng: 0 }
      });

      // City markers
      points.forEach(point => {
        createAdvancedMarker({
          map,
          position: { lat: point.lat, lng: point.lng },
          title: `${point.name} [${point.lat.toFixed(1)}°, ${point.lng.toFixed(1)}°]`,
          color: point.color,
          label: point.name,
          onMouseOver: () => setSelectedPoint(point.id),
          onMouseOut: () => setSelectedPoint(null),
          point: point
        });
      });
    }
  };

  const createAdvancedMarker = ({ map, position, title, color, label, onMouseOver, onMouseOut, point }) => {
    const markerElement = document.createElement('div');
    markerElement.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="width: 16px; height: 16px; background-color: ${color}; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
        <div style="color: white; font-size: 12px; font-weight: bold; margin-top: 4px; text-shadow: 0 1px 2px rgba(0,0,0,0.6); white-space: nowrap;">${label}</div>
      </div>
    `;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      content: markerElement,
      title
    });

    if (onMouseOver && onMouseOut) {
      marker.addListener('mouseover', onMouseOver);
      marker.addListener('mouseout', onMouseOut);
    }

    marker.addListener('click', () => {
      setClickedPoint(point);
    });

    return marker;
  };

  if (!isLoaded) {
    return (
      <div className="p-6 w-full max-w-[1600px] mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Geographic Vectors: Points on Earth as Vector Coordinates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[700px] flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-gray-500">Loading Google Maps...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-[1600px] mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Geographic Vectors: Points on Earth as Vector Coordinates</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="relative min-w-[1200px]">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={2}
              options={mapOptions}
              onLoad={onMapLoad}
            >
              {/* Vector Lines */}
              {points.map(point => (
                <Polyline
                  key={point.id}
                  options={{
                    path: [
                      { lat: 0, lng: 0 },
                      { lat: point.lat, lng: point.lng }
                    ],
                    geodesic: true,
                    strokeColor: point.color,
                    strokeOpacity: selectedPoint === point.id ? 1 : 0.5,
                    strokeWeight: selectedPoint === point.id ? 3 : 2,
                  }}
                />
              ))}

              {/* Info Window */}
              {clickedPoint && (
                <InfoWindow
                  position={{ lat: clickedPoint.lat, lng: clickedPoint.lng }}
                  onCloseClick={() => setClickedPoint(null)}
                >
                  <div className="p-2">
                    <h3 className="font-bold text-lg mb-2">{clickedPoint.name}</h3>
                    <p className="text-sm">
                      Latitude: {clickedPoint.lat.toFixed(4)}°<br />
                      Longitude: {clickedPoint.lng.toFixed(4)}°
                    </p>
                    {clickedPoint.id !== 'origin' && (
                      <p className="text-sm mt-2">
                        Distance from origin: {
                          google.maps.geometry.spherical.computeDistanceBetween(
                            new google.maps.LatLng(0, 0),
                            new google.maps.LatLng(clickedPoint.lat, clickedPoint.lng)
                          ).toFixed(0)
                        } meters
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>

            {/* Legend */}
            <div className="absolute top-4 right-4 bg-white/90 p-4 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-sm font-semibold mb-2">Vector Coordinates</h3>
              <div className="space-y-2">
                {points.map(point => (
                  <div 
                    key={point.id}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                    onMouseEnter={() => setSelectedPoint(point.id)}
                    onMouseLeave={() => setSelectedPoint(null)}
                  >
                    <div 
                      className="w-3 h-3 rounded-full border border-white shadow-sm" 
                      style={{ backgroundColor: point.color }}
                    />
                    <span>
                      {point.name}: [{point.lat.toFixed(1)}°, {point.lng.toFixed(1)}°]
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 pt-2 border-t">
                Hover over points to highlight vector paths from origin (0°, 0°)<br/>
                Click on points to see detailed coordinates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeoVectorVisualization;