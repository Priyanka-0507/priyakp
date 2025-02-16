import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router,Routes, Route, useNavigate,Link } from 'react-router-dom';
import { Globe,PlusCircle, Clock, LogOut, User,LayoutDashboard, Info, FileText,Pill,Trash2  } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import Home from '../pages/Home';
import SplitText from '../designs/Split';
import { easeCubicOut } from 'd3-ease';


interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string[];
  notes: string;
  next_dose: string;
}
export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isAddingMed, setIsAddingMed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  
 
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    time_of_day: ['morning'],
    notes: ''
  });

  useEffect(() => {
    fetchMedications();
    
  }, []);
  const handleAnimationComplete = () => {
    console.log('Letter animation completed!');
  };

  

  

  const fetchMedications = async () => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('next_dose', { ascending: true });

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      toast.error('Error fetching medications');
    }
  };
  const handleDeleteMedication = async (medicationId: string) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', medicationId);

      if (error) throw error;
      
      toast.success('Medication deleted successfully');
      fetchMedications();
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast.error('Error deleting medication');
    }
  };

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('medications').insert([
        {
          ...newMed,
          user_id: user?.id,
          next_dose: new Date().toISOString()
        }
      ]);

      if (error) throw error;
      
      setIsAddingMed(false);
      setNewMed({
        name: '',
        dosage: '',
        frequency: 'daily',
        time_of_day: ['morning'],
        notes: ''
      });
      fetchMedications();
      toast.success('Medication added successfully');
    } catch (error) {
      toast.error('Error adding medication');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
    <nav className="bg-teal-700 p-4 relative shadow-sm">
                        
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
                              
                            </div>
                          )}
                        </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
            <>
              <div className="flex justify-between items-center mb-6">
              <SplitText
  text="Your Medications"
  className="text-2xl font-semibold text-center"
  delay={150}
  animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
  animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
  easing={easeCubicOut} // ✅ Correct, passes a function
  threshold={0.2}
  rootMargin="-50px"
  onLetterAnimationComplete={handleAnimationComplete}
/>
                <button
                  onClick={() => setIsAddingMed(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Medication
                </button>
              </div>

              {isAddingMed && (
                <div className="mb-6 bg-white shadow sm:rounded-lg p-6">
                  <form onSubmit={handleAddMedication}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          required
                          value={newMed.name}
                          onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dosage</label>
                        <input
                          type="text"
                          required
                          value={newMed.dosage}
                          onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Frequency</label>
                        <select
                          value={newMed.frequency}
                          onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="as_needed">As needed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Time of Day</label>
                        <select
                          value={newMed.time_of_day[0]}
                          onChange={(e) => setNewMed({ ...newMed, time_of_day: [e.target.value] })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                          <option value="morning">Morning</option>
                          <option value="afternoon">Afternoon</option>
                          <option value="evening">Evening</option>
                          <option value="bedtime">Bedtime</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        value={newMed.notes}
                        onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsAddingMed(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {medications.map((med) => (
                    <li key={med.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{med.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {med.dosage} - {med.frequency} ({med.time_of_day.join(', ')})
                          </p>
                          {med.notes && (
                            <p className="mt-2 text-sm text-gray-500">{med.notes}</p>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Next dose: {new Date(med.next_dose).toLocaleString()}
                        </div>
                        <button
                            onClick={() => handleDeleteMedication(med.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete medication"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                      </div>
                    </li>
                  ))}
                  {medications.length === 0 && (
                    <li className="p-6 text-center text-gray-500">
                      No medications added yet. Click the "Add Medication" button to get started.
                    </li>
                  )}
                </ul>
              </div>
            </>
           
        </div>
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