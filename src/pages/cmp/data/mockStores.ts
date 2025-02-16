import { Store } from '../types';

// Helper function to generate stores around a given location
export function generateStoresAroundLocation(center: { lat: number; lng: number }): Store[] {
  // Generate 10 stores in a 5km radius
  const stores: Store[] = [];
  for (let i = 0; i < 10; i++) {
    // Random offset in latitude and longitude (roughly 5km radius)
    const latOffset = (Math.random() - 0.5) * 0.09; // ~5km in lat
    const lngOffset = (Math.random() - 0.5) * 0.09; // ~5km in lng

    stores.push({
      id: `store-${i + 1}`,
      name: `${getRandomStoreName()} Pharmacy`,
      address: getRandomAddress(),
      lat: center.lat + latOffset,
      lng: center.lng + lngOffset,
      medicines: generateRandomMedicines()
    });
  }
  return stores;
}

// Helper function to get random store names
function getRandomStoreName(): string {
  const names = [
    'City', 'Care', 'Health', 'Life', 'Med', 'Wellness', 
    'Family', 'Community', 'Quick', 'Prime'
  ];
  return names[Math.floor(Math.random() * names.length)];
}

// Helper function to get random addresses
function getRandomAddress(): string {
  const streets = [
    'Main Street', 'Park Road', 'Hospital Road', 'Market Street',
    'Station Road', 'Church Street', 'Mall Road', 'Central Avenue'
  ];
  return `${Math.floor(Math.random() * 100) + 1} ${
    streets[Math.floor(Math.random() * streets.length)]
  }`;
}

// Helper function to generate random medicines
function generateRandomMedicines() {
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

// Initial stores for Thalassery
export const mockStores: Store[] = generateStoresAroundLocation({
  lat: 11.748050,
  lng: 75.489380
});