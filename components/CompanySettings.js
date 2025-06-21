import { useState, useEffect } from 'react';
import Card from './Card';
import { 
  BuildingOfficeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function CompanySettings() {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Catatan Uang',
    address: 'Jl. Contoh No. 123, Jakarta',
    phone: '+62 21 1234 5678',
    email: 'info@catatanuang.com',
    website: 'www.catatanuang.com',
    taxNumber: '',
    bankAccount: '',
    bankName: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});

  useEffect(() => {
    // Load company info from localStorage
    const savedInfo = localStorage.getItem('companyInfo');
    if (savedInfo) {
      setCompanyInfo(JSON.parse(savedInfo));
    }
  }, []);

  const handleEdit = () => {
    setEditedInfo({ ...companyInfo });
    setIsEditing(true);
  };

  const handleSave = () => {
    setCompanyInfo(editedInfo);
    localStorage.setItem('companyInfo', JSON.stringify(editedInfo));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo({});
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const currentInfo = isEditing ? editedInfo : companyInfo;

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <BuildingOfficeIcon className="w-6 h-6 text-indigo-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Company Information
          </h2>
        </div>
        
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            value={currentInfo.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="text"
            value={currentInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address
          </label>
          <textarea
            value={currentInfo.address}
            onChange={(e) => handleChange('address', e.target.value)}
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={currentInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Website
          </label>
          <input
            type="text"
            value={currentInfo.website}
            onChange={(e) => handleChange('website', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tax Number (NPWP)
          </label>
          <input
            type="text"
            value={currentInfo.taxNumber}
            onChange={(e) => handleChange('taxNumber', e.target.value)}
            disabled={!isEditing}
            placeholder="12.345.678.9-123.000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bank Name
          </label>
          <input
            type="text"
            value={currentInfo.bankName}
            onChange={(e) => handleChange('bankName', e.target.value)}
            disabled={!isEditing}
            placeholder="Bank Central Asia"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bank Account Number
          </label>
          <input
            type="text"
            value={currentInfo.bankAccount}
            onChange={(e) => handleChange('bankAccount', e.target.value)}
            disabled={!isEditing}
            placeholder="1234567890"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-800"
          />
        </div>
      </div>

      {!isEditing && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> This company information will be used for generating invoices. 
            Make sure all details are accurate before generating any invoices.
          </p>
        </div>
      )}
    </Card>
  );
} 