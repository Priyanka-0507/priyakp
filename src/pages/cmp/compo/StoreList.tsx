import React from 'react';
import { Store } from '../../type';
import { MapPin, Phone, Clock, Star } from 'lucide-react';

interface StoreListProps {
  stores: Store[];
  selectedStore: Store | null;
  onStoreSelect: (store: Store) => void;
  searchQuery: string;
}

const StoreList: React.FC<StoreListProps> = ({
  stores,
  selectedStore,
  onStoreSelect,
  searchQuery,
}) => {
  const filteredStores = stores.filter((store) =>
    store.medicines.some((medicine) =>
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (stores.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Stores Found</h2>
        <p className="text-gray-600">
          Try searching in a different location
        </p>
      </div>
    );
  }

  if (searchQuery && filteredStores.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Medicine Not Found</h2>
        <p className="text-gray-600">
          No stores in this area have the medicine you're looking for
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 overflow-y-auto max-h-[calc(100vh-16rem)]">
      <h2 className="text-xl font-semibold mb-4">
        {filteredStores.length === 0
          ? "No stores found"
          : `Found ${filteredStores.length} store${filteredStores.length === 1 ? '' : 's'}`}
      </h2>
      <div className="space-y-4">
        {(searchQuery ? filteredStores : stores).map((store) => {
          const matchingMedicines = store.medicines.filter((medicine) =>
            medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return (
            <div
              key={store.id}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedStore?.id === store.id
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => onStoreSelect(store)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{store.name}</h3>
                {store.rating && (
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{store.rating}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{store.address}</span>
                </div>
                {store.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{store.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className={store.isOpen ? 'text-green-600' : 'text-red-600'}>
                    {store.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>
                {searchQuery && matchingMedicines.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium mb-2">Matching Medicines:</h4>
                    <ul className="space-y-1">
                      {matchingMedicines.map((medicine) => (
                        <li
                          key={medicine.name}
                          className="flex items-center justify-between"
                        >
                          <span>{medicine.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">₹{medicine.price}</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                medicine.availability
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {medicine.availability ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoreList;