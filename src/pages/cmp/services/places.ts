import { Store } from '../../type';
import { generateStoresAroundLocation } from '../data/mockStores';

export async function fetchNearbyMedicalStores(location: { lat: number; lng: number }): Promise<Store[]> {
  const service = new google.maps.places.PlacesService(document.createElement('div'));
  
  const request = {
    location: new google.maps.LatLng(location.lat, location.lng),
    radius: 5000, // 5km radius
    type: 'pharmacy',
    keyword: 'medical store pharmacy'
  };

  try {
    const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          reject(new Error('No medical stores found'));
        }
      });
    });

    // Convert Places results to our Store type
    const stores: Store[] = await Promise.all(
      results.map(async (place, index) => {
        // Get additional place details
        const details = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
          service.getDetails(
            { placeId: place.place_id!, fields: ['formatted_phone_number', 'opening_hours', 'rating'] },
            (result, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && result) {
                resolve(result);
              } else {
                reject(new Error('Could not fetch place details'));
              }
            }
          );
        });

        // Generate random medicines for the store
        const medicines = generateMedicines();

        return {
          id: place.place_id || `store-${index}`,
          name: place.name || 'Unknown Store',
          address: place.vicinity || 'Address unavailable',
          lat: place.geometry?.location?.lat() || location.lat,
          lng: place.geometry?.location?.lng() || location.lng,
          medicines,
          rating: place.rating,
          phone: details.formatted_phone_number,
          isOpen: details.opening_hours?.isOpen() || false
        };
      })
    );

    return stores;
  } catch (error) {
    console.error('Error fetching nearby stores:', error);
    return [];
  }
}

// Helper function to generate random medicines
function generateMedicines() {
  const medicineList = [
    { name: 'Aspirin', basePrice: 10 },
    { name: 'Paracetamol', basePrice: 8 },
    { name: 'Ibuprofen', basePrice: 12 },
    { name: 'Cetirizine', basePrice: 15 },
    { name: 'Amoxicillin', basePrice: 20 },
    { name: 'Omeprazole', basePrice: 18 },
    { name: 'Metformin', basePrice: 25 },
    { name: 'Amlodipine', basePrice: 22 }
  ];

  return medicineList.map(med => ({
    name: med.name,
    availability: Math.random() > 0.3, // 70% chance of availability
    price: med.basePrice + Math.floor(Math.random() * 5) // Add random price variation
  }));
}