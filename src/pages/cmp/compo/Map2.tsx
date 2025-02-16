import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Store } from '../../type';

interface MapProps {
  stores: Store[];
  selectedStore: Store | null;
  onStoreSelect: (store: Store) => void;
  searchQuery: string;
  center: { lat: number; lng: number };
  zoom: number;
}

const Map: React.FC<MapProps> = ({ 
  stores, 
  selectedStore, 
  onStoreSelect, 
  searchQuery,
  center,
  zoom
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markers = useRef<{ [key: string]: google.maps.Marker }>({});
  const infoWindows = useRef<{ [key: string]: google.maps.InfoWindow }>({});
  const API_KEY = 'AIzaSyDPGPIE1JOEfCER2Z8JyXKsoRpg1c33Snk';

  // Initialize map
  useEffect(() => {
    if (!API_KEY || !mapRef.current) return;

    const initMap = async () => {
      const loader = new Loader({
        apiKey: API_KEY,
        version: 'weekly',
        libraries: ['places']
      });

      try {
        await loader.load(); // ✅ Ensure Google Maps API is loaded
      
        if (mapRef.current) { // ✅ Check if mapRef.current is not null
          mapInstance.current = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          });
        } else {
          console.error("mapRef is null, cannot initialize Google Maps.");
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
      
    };

    initMap();

    return () => {
      Object.values(markers.current).forEach((marker) => marker.setMap(null));
      Object.values(infoWindows.current).forEach((window) => window.close());
      markers.current = {};
      infoWindows.current = {};
    };
  }, [API_KEY, center, zoom]);

  // Handle markers
  useEffect(() => {
    if (!mapInstance.current || !stores.length) return;

    // Clear existing markers
    Object.values(markers.current).forEach((marker) => marker.setMap(null));
    Object.values(infoWindows.current).forEach((window) => window.close());
    markers.current = {};
    infoWindows.current = {};

    // Create new markers
    stores.forEach((store) => {
      const marker = new google.maps.Marker({
        position: { lat: store.lat, lng: store.lng },
        map: mapInstance.current,
        title: store.name,
        icon: {
          url: searchQuery ? (
            store.medicines.some(
              med => med.name.toLowerCase().includes(searchQuery.toLowerCase()) && med.availability
            )
              ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
              : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          ) : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new google.maps.Size(40, 40)
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: getInfoWindowContent(store, searchQuery)
      });

      marker.addListener('click', () => {
        Object.values(infoWindows.current).forEach(window => window.close());
        infoWindow.open(mapInstance.current, marker);
        onStoreSelect(store);
      });

      markers.current[store.id] = marker;
      infoWindows.current[store.id] = infoWindow;
    });
  }, [stores, searchQuery, mapInstance.current]);

  // Update selected store
  useEffect(() => {
    if (!selectedStore) {
      Object.values(markers.current).forEach(marker => {
        marker.setAnimation(null);
      });
      Object.values(infoWindows.current).forEach(window => window.close());
      return;
    }

    Object.entries(markers.current).forEach(([storeId, marker]) => {
      if (storeId === selectedStore.id) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        marker.setZIndex(3);
        infoWindows.current[storeId].open(mapInstance.current, marker);
      } else {
        marker.setAnimation(null);
        marker.setZIndex(1);
        infoWindows.current[storeId].close();
      }
    });
  }, [selectedStore]);

  const getInfoWindowContent = (store: Store, searchQuery: string) => {
    const matchingMedicines = searchQuery
      ? store.medicines.filter(med => 
          med.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

    const medicinesList = matchingMedicines.length > 0
      ? `
        <div style="margin-top: 8px;">
          <h4 style="font-weight: 500; margin-bottom: 4px;">Searched Medicines:</h4>
          ${matchingMedicines
            .map(med => `
              <div style="display: flex; justify-content: space-between; margin: 4px 0;">
                <span>${med.name}</span>
                <span style="margin-left: 12px; color: ${med.availability ? 'green' : 'red'}">
                  ${med.availability ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
              </div>
            `)
            .join('')}
        </div>
      `
      : '';

    return `
      <div style="padding: 8px; max-width: 300px;">
        <h3 style="font-weight: 600; margin-bottom: 8px;">${store.name}</h3>
        <p style="margin-bottom: 8px;">${store.address}</p>
        ${store.isOpen 
          ? '<p style="color: green;">Open Now</p>' 
          : '<p style="color: red;">Closed</p>'
        }
        ${store.phone 
          ? `<p style="margin-bottom: 8px;">📞 ${store.phone}</p>` 
          : ''
        }
        ${medicinesList}
      </div>
    `;
  };

  if (!API_KEY) {
    return (
      <div className="w-full h-full rounded-lg shadow-lg bg-white flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Google Maps API Key Required</h3>
          <p className="text-gray-600">Please add your Google Maps API key to the Map component to enable the map functionality.</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />;
};

export default Map;