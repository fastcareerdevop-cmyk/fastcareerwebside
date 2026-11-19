import React from 'react';
import { PREFERRED_CAMPUS_CITIES } from '../../utils/constants';

const PREFERRED_JOB_CITIES = [
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad'
];

export const Step5Experience = ({ experienceInfo, setExperienceInfo, personal, setPersonal }: any) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Placement Preferences</h2>
        <p className="text-gray-500 text-sm mt-1">Select your preferred campus placement drive city and target job location preferences.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4 mb-6">Additional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Campus City</label>
            <div className="grid grid-cols-2 gap-3">
              {PREFERRED_CAMPUS_CITIES.map((city) => (
                <label key={city} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${personal.preferredCampusCity === city ? 'bg-blue-50 border-primary shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="campusCity" checked={personal.preferredCampusCity === city} onChange={() => setPersonal({...personal, preferredCampusCity: city})} className="w-4 h-4 text-primary focus:ring-primary border-gray-300" />
                  <span className="text-sm font-medium text-gray-700">{city}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Job Cities (Optional)</label>
            <div className="space-y-3">
              {[1, 2, 3].map((num) => {
                const currentVal = personal[`prefCity${num}`] || '';
                return (
                  <div key={`prefCity${num}`} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-6">#{num}</span>
                    <select
                      value={currentVal}
                      onChange={(e) => setPersonal({ ...personal, [`prefCity${num}`]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 text-sm bg-white cursor-pointer font-medium outline-none"
                    >
                      <option value="">Preference {num} (Select City)</option>
                      {currentVal && !PREFERRED_JOB_CITIES.includes(currentVal) && (
                        <option value={currentVal}>{currentVal}</option>
                      )}
                      {PREFERRED_JOB_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
