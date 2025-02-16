import React, { useState, useMemo, useCallback } from 'react';
import { Search, MapPin, Navigation, Globe,LayoutDashboard, User, Info, FileText,Pill,LogOut,Camera} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import Map from './cmp/compo/Map2';
import StoreList from './cmp/compo/StoreList';
import { Store } from './type';
import { fetchNearbyMedicalStores } from './cmp/services/places';
import Profile from './profile';
import About from './Aboutus';
import Policy from './policy';
import Dashboard from '../components/Dashboard';
import { useAuth } from '../contexts/AuthContext';
import SplitText from "../designs/Split";
import { easeCubicOut } from 'd3-ease';



export default function Maps() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 11.748050, lng: 75.489380 });
  const [mapZoom, setMapZoom] = useState(14);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useAuth();
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const handleAnimationComplete = () => {
    console.log('Letter animation completed!');
  };

  const handleLocationSearch = async () => {
    if (!locationQuery) return;

    try {
      setLoading(true);
      const geocoder = new google.maps.Geocoder();
      const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address: locationQuery }, (results, status) => {
          if (status === 'OK' && results) {
            resolve(results);
          } else {
            reject(new Error('Location not found'));
          }
        });
      });

      const location = result[0].geometry.location;
      const newCenter = { lat: location.lat(), lng: location.lng() };
      setMapCenter(newCenter);
      setMapZoom(14);
      
      // Fetch real medical stores from the area
      const nearbyStores = await fetchNearbyMedicalStores(newCenter);
      setStores(nearbyStores);
      setSelectedStore(null);
    } catch (error) {
      console.error('Error finding location:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores;
    return stores.filter((store) =>
      store.medicines.some(
        (medicine) =>
          medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, stores]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-teal-700 p-4 relative shadow-sm">
        <div className="flex items-center">
         
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-green-200 rounded-lg transition-colors duration-200 ease-in-out"
        >
          <LayoutDashboard className="h-6 w-6 text-teal-200" />
        </button>

        {isMenuOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-3 z-10 transform transition-all duration-200 ease-in-out">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 uppercase">Dashboard Menu</h3>
            </div>

            <Link
              to="/dashboard"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors duration-200 gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <Pill className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Dosage Tracker</p>
                <p className="text-sm text-gray-500">Track your dosage</p>
              </div>
            </Link>
            <Link
              to="/profile"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors duration-200 gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">User Profile Details</p>
                <p className="text-sm text-gray-500">View and edit your profile</p>
              </div>
            </Link>
            <Link
              to="/about"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors duration-200 gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <Info className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">About Us</p>
                <p className="text-sm text-gray-500">Learn more about our company</p>
              </div>
            </Link>

            <Link
              to="/policy"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors duration-200 gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Our Policy</p>
                <p className="text-sm text-gray-500">Review our terms and policies</p>
              </div>
            </Link>
            <Link
              to="/"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors duration-200 gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <Globe className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Home Page</p>
                <p className="text-sm text-gray-500">Go back to home page</p>
              </div>
            </Link>
            <Link
              to="/maps"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors duration-200 gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Medicines Near Me</p>
                <p className="text-sm text-gray-500">Available medicines near me</p>
              </div>
            </Link>
            <button onClick={() => signOut()}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors duration-200 gap-3">
              <LogOut className="h-5 w-5 text-green-600" />
              Sign out
            </button>
          </div>
        )}
      </nav>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-teal-600" />
                <SplitText
  text="MediFind!"
  className="text-2xl font-semibold text-center"
  delay={150}
  animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
  animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
  easing={easeCubicOut} // ✅ Correct, passes a function
  threshold={0.2}
  rootMargin="-50px"
  onLetterAnimationComplete={handleAnimationComplete}
/>




              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter location..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                />
                <Navigation className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search for medicines..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <button
                onClick={handleLocationSearch}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-teal-400"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Area'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Store List */}
          <div className="md:col-span-1">
            {loading ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching for medical stores...</p>
              </div>
            ) : (
              <StoreList
                stores={filteredStores}
                selectedStore={selectedStore}
                onStoreSelect={setSelectedStore}
                searchQuery={searchQuery}
              />
            )}
          </div>

          {/* Map */}
          <div className="md:col-span-2 h-[calc(100vh-16rem)]">
            <Map
              stores={stores}
              selectedStore={selectedStore}
              onStoreSelect={setSelectedStore}
              searchQuery={searchQuery}
              center={mapCenter}
              zoom={mapZoom}
            />
          </div>
        </div>
        <Routes>
          <Route path="/profile" element={<Profile />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/policy" element={<Policy />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/maps" element={<Maps />} />
        </Routes>
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-400">123 Medical Center Drive</p>
              <p className="text-gray-400">Healthcare City, HC 12345</p>
              <p className="text-gray-400">Phone: (555) 123-4567</p>
              <p className="text-gray-400">Email: info@medicare.com</p>
            </div>
            <div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Emergency</h3>
              <p className="text-gray-400">For medical emergencies, please dial 911 immediately.</p>
              <p className="text-gray-400 mt-2">24/7 Nurse Hotline: (555) 999-8888</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="text-sm text-gray-400">
              <p className="font-semibold mb-2">Medical Disclaimer:</p>
              <p>
                © {new Date().getFullYear()} MediCare. All rights reserved. Powered By MEDTECH.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

