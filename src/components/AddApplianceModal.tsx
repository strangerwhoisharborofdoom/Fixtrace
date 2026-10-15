import React, { useState } from 'react';
import { X, Upload, Plus, Tv2, Calendar, ShieldCheck, MapPin } from 'lucide-react';
import { Appliance, ApplianceCategory } from '../types';
import { useApp } from '../context/AppContext';

export const AddApplianceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  editAppliance?: Appliance | null;
}> = ({ isOpen, onClose, editAppliance }) => {
  const { saveAppliance, user, t } = useApp();

  const categories: ApplianceCategory[] = [
    'Washing Machine',
    'Air Conditioner',
    'Refrigerator',
    'Water Heater / Geyser',
    'Microwave Oven',
    'Water Purifier (RO)',
    'Television',
    'Kitchen Chimney',
    'Mixer Grinder',
    'Air Fryer',
    'Other Appliance',
  ];

  const [category, setCategory] = useState<ApplianceCategory>(
    editAppliance?.category || 'Washing Machine'
  );
  const [name, setName] = useState(editAppliance?.name || '');
  const [brand, setBrand] = useState(editAppliance?.brand || '');
  const [modelNumber, setModelNumber] = useState(editAppliance?.modelNumber || '');
  const [serialNumber, setSerialNumber] = useState(editAppliance?.serialNumber || '');
  const [purchaseDate, setPurchaseDate] = useState(editAppliance?.purchaseDate || '');
  const [purchasePrice, setPurchasePrice] = useState<string>(
    editAppliance?.purchasePrice ? String(editAppliance.purchasePrice) : ''
  );
  const [locationTag, setLocationTag] = useState(editAppliance?.locationTag || 'Kitchen');
  const [warrantyDetails, setWarrantyDetails] = useState(editAppliance?.warrantyDetails || '');
  const [warrantyExpiryDate, setWarrantyExpiryDate] = useState(
    editAppliance?.warrantyExpiryDate || ''
  );
  const [isPublicPassport, setIsPublicPassport] = useState(
    editAppliance ? editAppliance.isPublicPassport : true
  );
  const [photos, setPhotos] = useState<string[]>(editAppliance?.photos || []);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotos([...photos, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Appliance name is required.');
      return;
    }
    if (!brand.trim()) {
      setError('Brand is required.');
      return;
    }

    const priceNum = purchasePrice ? parseFloat(purchasePrice) : undefined;

    const appliance: Appliance = {
      id: editAppliance?.id || 'app-' + Date.now(),
      ownerId: user.uid,
      ownerName: user.displayName,
      name: name.trim(),
      category,
      brand: brand.trim(),
      modelNumber: modelNumber.trim() || undefined,
      serialNumber: serialNumber.trim() || undefined,
      purchaseDate: purchaseDate || undefined,
      purchasePrice: priceNum,
      locationTag: locationTag.trim() || 'Home',
      warrantyDetails: warrantyDetails.trim() || undefined,
      warrantySource: 'customer',
      warrantyExpiryDate: warrantyExpiryDate || undefined,
      isPublicPassport,
      photos:
        photos.length > 0
          ? photos
          : [
              'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
            ],
      createdAt: editAppliance?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: user.isDemo,
    };

    saveAppliance(appliance);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto no-print">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center">
              <Tv2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {editAppliance ? 'Edit Appliance' : 'Register New Appliance'}
              </h2>
              <p className="text-xs text-slate-400">Generate an immutable digital Repair Passport</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ApplianceCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Nickname / Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Appliance Name / Nickname *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Master Bedroom Inverter AC"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 placeholder:text-slate-500"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Brand / Manufacturer *
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. LG, Samsung, Voltas, Havells"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 placeholder:text-slate-500"
              />
            </div>

            {/* Model Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Model Number
              </label>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                placeholder="e.g. FHM1207ZDL"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 placeholder:text-slate-500"
              />
            </div>

            {/* Serial Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Serial Number (on barcode sticker)
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. 208INLG773412"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 placeholder:text-slate-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Room / Placement
              </label>
              <input
                type="text"
                value={locationTag}
                onChange={(e) => setLocationTag(e.target.value)}
                placeholder="e.g. Utility Balcony, Kitchen"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 placeholder:text-slate-500"
              />
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Purchase Date
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>

            {/* Purchase Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Purchase Price (₹)
              </label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="e.g. 32000"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Warranty details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Warranty Coverage Info
              </label>
              <input
                type="text"
                value={warrantyDetails}
                onChange={(e) => setWarrantyDetails(e.target.value)}
                placeholder="e.g. 10-year motor warranty; 2-year comprehensive"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Warranty Expiry Date
              </label>
              <input
                type="date"
                value={warrantyExpiryDate}
                onChange={(e) => setWarrantyExpiryDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>
          </div>

          {/* Photos */}
          <div className="pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Appliance Photos & Nameplate
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {photos.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-700 group">
                  <img src={url} alt="Appliance" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                    className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-700 hover:border-lime-400/60 bg-slate-800/40 hover:bg-slate-800 flex flex-col items-center justify-center cursor-pointer transition-colors text-slate-400 hover:text-lime-400">
                <Upload className="w-4 h-4 mb-0.5" />
                <span className="text-[9px] font-semibold">Upload</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Public Passport Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-lime-400" />
                <span>Public QR Access</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Allow visiting technicians to view verified service records by scanning the QR code sticker without account creation.
              </p>
            </div>
            <input
              type="checkbox"
              checked={isPublicPassport}
              onChange={(e) => setIsPublicPassport(e.target.checked)}
              className="w-4 h-4 rounded text-lime-400 accent-lime-400 cursor-pointer"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-lime-400 text-slate-950 hover:bg-lime-300 shadow-md shadow-lime-400/20 transition-colors"
            >
              {editAppliance ? 'Save Changes' : 'Create Repair Passport'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
