import { useState, useEffect } from 'react';
import Modal from './Modal';
import { generateInvoiceFromTransaction, downloadInvoice } from '../lib/invoice';
import { 
  DocumentTextIcon, 
  DownloadIcon,
  EyeIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  UserIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function InvoiceModal({ isOpen, onClose, transaction, customer }) {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Catatan Uang',
    address: 'Jl. Contoh No. 123, Jakarta',
    phone: '+62 21 1234 5678',
    email: 'info@catatanuang.com',
    website: 'www.catatanuang.com'
  });
  
  const [invoiceData, setInvoiceData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    // Load company info from localStorage
    const savedInfo = localStorage.getItem('companyInfo');
    if (savedInfo) {
      setCompanyInfo(JSON.parse(savedInfo));
    }
    
    if (isOpen && transaction && customer) {
      generateInvoice();
    }
  }, [isOpen, transaction, customer]);

  const generateInvoice = async () => {
    if (!transaction || !customer) return;
    
    setIsGenerating(true);
    try {
      const doc = generateInvoiceFromTransaction(transaction, customer, companyInfo);
      
      // Create preview URL
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPreviewUrl(url);
      
      // Prepare invoice data for download
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(transaction.id).padStart(4, '0')}`;
      const invoiceDate = new Date();
      const dueDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const items = [{
        description: transaction.produk,
        quantity: 1,
        price: transaction.hargaJual,
        total: transaction.hargaJual
      }];
      
      setInvoiceData({
        invoiceNumber,
        invoiceDate,
        dueDate,
        customer,
        items,
        subtotal: transaction.hargaJual,
        tax: 0,
        total: transaction.hargaJual,
        currency: transaction.mataUang || 'IDR',
        notes: `Transaction ID: ${transaction.id}`,
        terms: 'Payment is due within 30 days of invoice date.'
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (invoiceData) {
      downloadInvoice(invoiceData, `invoice-${invoiceData.invoiceNumber}.pdf`);
    }
  };

  const handleCompanyInfoChange = (field, value) => {
    const updatedInfo = {
      ...companyInfo,
      [field]: value
    };
    setCompanyInfo(updatedInfo);
    localStorage.setItem('companyInfo', JSON.stringify(updatedInfo));
  };

  const handleRegenerate = () => {
    generateInvoice();
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setInvoiceData(null);
    onClose();
  };

  if (!transaction || !customer) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Generate Invoice" size="xl">
      <div className="space-y-6">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Invoice Generator</h2>
                <p className="text-indigo-100 text-sm">Create professional invoices</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <BuildingOfficeIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Company Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Name
              </label>
              <input
                type="text"
                value={companyInfo.name}
                onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <input
                type="text"
                value={companyInfo.phone}
                onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                placeholder="Enter phone number"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <input
                type="text"
                value={companyInfo.address}
                onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                placeholder="Enter company address"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={companyInfo.email}
                onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Website
              </label>
              <input
                type="text"
                value={companyInfo.website}
                onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                placeholder="Enter website URL"
              />
            </div>
          </div>
        </div>

        {/* Transaction Information */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3 mb-4">
            <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Transaction Details
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-2">
                <DocumentTextIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Product</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold text-lg">{transaction.produk}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-2">
                <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold text-lg">{customer.nama}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-2">
                <CurrencyDollarIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Price</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold text-lg">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: transaction.mataUang || 'IDR'
                }).format(transaction.hargaJual)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-2">
                <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Date</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold text-lg">
                {new Date(transaction.tanggal).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            {isGenerating ? 'Generating...' : 'Regenerate Invoice'}
          </button>
          
          {invoiceData && (
            <button
              onClick={handleDownload}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <DownloadIcon className="w-5 h-5 mr-2" />
              Download PDF
            </button>
          )}
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 px-6 py-4 border-b border-gray-300 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <EyeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Invoice Preview
                </h4>
              </div>
            </div>
            <div className="h-96 bg-white">
              <iframe
                src={previewUrl}
                className="w-full h-full"
                title="Invoice Preview"
              />
            </div>
          </div>
        )}

        {/* Invoice Information */}
        {invoiceData && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <DocumentTextIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Invoice Generated Successfully
                </h3>
                <p className="text-green-600 dark:text-green-400 text-sm">Your invoice is ready for download</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Invoice Number</span>
                <p className="text-gray-900 dark:text-white font-semibold text-lg">{invoiceData.invoiceNumber}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</span>
                <p className="text-gray-900 dark:text-white font-semibold text-lg">
                  {new Date(invoiceData.dueDate).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</span>
                <p className="text-gray-900 dark:text-white font-semibold text-lg">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: invoiceData.currency
                  }).format(invoiceData.total)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Currency</span>
                <p className="text-gray-900 dark:text-white font-semibold text-lg">{invoiceData.currency}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
} 