import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import TransaksiForm from '../components/TransaksiForm';
import Modal from '../components/Modal';
import Papa from 'papaparse';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  FolderIcon
} from '@heroicons/react/24/outline';

export default function Transaksi() {
  const [transaksi, setTransaksi] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const [importFileName, setImportFileName] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchTransaksi();
  }, []);

  const fetchTransaksi = async () => {
    try {
      const response = await fetch('/api/transaksi');
      if (response.ok) {
        const data = await response.json();
        setTransaksi(data);
      }
    } catch (error) {
      console.error('Error fetching transaksi:', error);
    }
  };

  // Custom file selection function to avoid Chrome extension issues
  const selectImportFile = () => {
    // Create a temporary input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.style.display = 'none';
    
    // Add handlers
    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        setImportFile(file);
        setImportFileName(file.name || 'Selected file');
      }
      // Clean up
      document.body.removeChild(input);
    };
    
    // Add to DOM and trigger click
    document.body.appendChild(input);
    input.click();
  };

  // Handle file import
  const handleImportFile = () => {
    if (!importFile) {
      setImportStatus({
        success: false,
        message: 'Please select a file first'
      });
      return;
    }
    
    const fileExtension = importFileName.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv') {
      // Parse CSV
      Papa.parse(importFile, {
        header: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            handleImportData(results.data);
          } else {
            setImportStatus({
              success: false,
              message: 'No valid data found in CSV'
            });
          }
        },
        error: (error) => {
          setImportStatus({
            success: false,
            message: `CSV parse error: ${error.message}`
          });
        }
      });
    } else if (fileExtension === 'json') {
      // Parse JSON
      const reader = new FileReader();
      reader.onload = function() {
        try {
          const jsonData = JSON.parse(this.result);
          if (jsonData) {
            handleImportData(Array.isArray(jsonData) ? jsonData : [jsonData]);
          } else {
            setImportStatus({
              success: false,
              message: 'Invalid JSON data'
            });
          }
        } catch (error) {
          setImportStatus({
            success: false,
            message: `JSON parse error: ${error.message}`
          });
        }
      };
      reader.readAsText(importFile);
    } else {
      setImportStatus({
        success: false,
        message: `Unsupported file type: ${fileExtension}`
      });
    }
  };

  // Download sample data
  const downloadSampleData = () => {
    const sampleData = [
      {
        customerId: "1",
        tanggal: new Date().toISOString().split('T')[0],
        produk: "Sample Product",
        hargaAsli: 100000,
        hargaJual: 150000,
        metode: "Cash",
        tujuan: "Online",
        tag: "Sample"
      }
    ];
    
    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sample_transaksi.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (formTransaksi) => {
    try {
      let dataToSend = { ...formTransaksi };
      // Hapus field customer jika ada
      if ('customer' in dataToSend) {
        delete dataToSend.customer;
      }
      let response;
      if (selectedTransaksi) {
        // Edit transaksi
        const editUrl = `/api/transaksi?id=${selectedTransaksi.id}`;
        console.log('Edit URL:', editUrl);
        response = await fetch(editUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });
      } else {
        // Tambah transaksi
        response = await fetch('/api/transaksi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });
      }
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        if (selectedTransaksi) {
          setTransaksi((prev) => prev.map((t) => (t.id === data.id ? data : t)));
        } else {
          setTransaksi((prev) => [...prev, data]);
        }
        setShowForm(false);
        setSelectedTransaksi(null);
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error saving transaksi:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      try {
        const response = await fetch(`/api/transaksi?id=${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setTransaksi((prev) => prev.filter((t) => t.id !== id));
        }
      } catch (error) {
        console.error('Error deleting transaksi:', error);
      }
    }
  };

  const handleImportData = async (data) => {
    try {
      // Ensure data is an array and not empty
      if (!data || !Array.isArray(data) || data.length === 0) {
        setImportStatus({
          success: false,
          message: 'Tidak ada data valid untuk diimpor'
        });
        return;
      }

      // Map CSV/JSON fields to match our schema
      const mappedData = data.map(item => {
        if (!item) return null;
        
        return {
          customerId: item.customerId || item.customer_id || "",
          tanggal: item.tanggal || item.date || new Date().toISOString(),
          produk: item.produk || item.product || "",
          hargaAsli: item.hargaAsli || item.harga_asli || item.original_price || 0,
          hargaJual: item.hargaJual || item.harga_jual || item.selling_price || 0,
          metode: item.metode || item.method || "",
          tujuan: item.tujuan || item.destination || "",
          tag: item.tag || ""
        };
      }).filter(item => item !== null); // Filter out any null items
      
      // Check if we have valid data after mapping
      if (mappedData.length === 0) {
        setImportStatus({
          success: false,
          message: 'Tidak ada data valid untuk diimpor setelah pemetaan'
        });
        return;
      }

      const response = await fetch('/api/transaksi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bulkImport: true,
          data: mappedData
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setImportStatus({
          success: true,
          message: `${result.imported} transaksi berhasil diimpor. ${result.failed} gagal.`,
          imported: result.imported,
          failed: result.failed
        });
        
        // Reset file state
        setImportFile(null);
        setImportFileName('');
        
        // Refresh data
        fetchTransaksi();
        
        // Close modal after 3 seconds if import was successful
        if (result.imported > 0) {
          setTimeout(() => {
            setShowImportModal(false);
            setImportStatus(null);
          }, 3000);
        }
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: await response.text() || 'Terjadi kesalahan saat import data' };
        }
        
        setImportStatus({
          success: false,
          message: `Error: ${errorData.message || 'Terjadi kesalahan saat import data'}`
        });
      }
    } catch (error) {
      console.error('Error importing data:', error);
      setImportStatus({
        success: false,
        message: `Error: ${error.message || 'Terjadi kesalahan yang tidak diketahui'}`
      });
    }
  };

  const handleExportData = () => {
    try {
      // Ensure transaksi data exists
      if (!transaksi || !Array.isArray(transaksi) || transaksi.length === 0) {
        alert('Tidak ada data transaksi untuk diexport');
        return;
      }
      
      // Prepare data for export with null checks
      const dataToExport = transaksi.map(t => {
        if (!t) return null;
        
        return {
          Tanggal: t.tanggal ? new Date(t.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '',
          Customer: t.customer?.nama || '',
          Produk: t.produk || '',
          'Harga Asli': t.hargaAsli || 0,
          'Harga Jual': t.hargaJual || 0,
          Profit: (t.hargaJual || 0) - (t.hargaAsli || 0),
          'Metode Pembayaran': t.metode || '',
          Tujuan: t.tujuan || '',
          Tag: t.tag || ''
        };
      }).filter(item => item !== null); // Filter out any null items
      
      if (dataToExport.length === 0) {
        alert('Tidak ada data valid untuk diexport');
        return;
      }

      // Convert to CSV
      const csv = Papa.unparse(dataToExport);
      
      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transaksi_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Close modal
      setShowExportModal(false);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert(`Error saat export data: ${error.message}`);
    }
  };

  const filteredTransaksi = transaksi.filter((t) =>
    t.produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customer.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.metode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tujuan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 mt-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Transaksi
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
              Import
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Export
            </button>
            <button
              onClick={() => {
                setSelectedTransaksi(null);
                setShowForm(true);
              }}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Tambah Transaksi
            </button>
          </div>
        </div>

        <Card>
          <div className="mb-4 px-2 sm:px-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Harga Jual
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Metode
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {filteredTransaksi.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-300">
                      {(() => { const d = new Date(t.tanggal); return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }); })()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-300">
                      {t.customer.nama}
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-300">
                      {t.produk}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-300">
                      Rp {t.hargaJual.toLocaleString()}
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-green-600 dark:text-green-400">
                      Rp {(t.hargaJual - t.hargaAsli).toLocaleString()}
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-gray-300">
                      {t.metode}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTransaksi(t);
                            setShowForm(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {showForm && (
        <TransaksiForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedTransaksi(null);
          }}
          onSubmit={handleSubmit}
          initialData={selectedTransaksi}
        />
      )}

      {/* Custom Import Modal */}
      <Modal 
        isOpen={showImportModal} 
        onClose={() => setShowImportModal(false)}
        title="Import Data Transaksi"
      >
        <div className="space-y-4">
          {importStatus && (
            <div className={`mb-4 p-3 rounded-lg ${importStatus.success ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'}`}>
              {importStatus.message}
            </div>
          )}
          
          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pilih File (CSV atau JSON)
            </label>
            
            <button
              onClick={selectImportFile}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FolderIcon className="w-5 h-5 mr-2" />
              {importFileName ? 'Change File' : 'Select File'}
            </button>
            
            {importFileName && (
              <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                <DocumentTextIcon className="h-4 w-4 mr-1" />
                {importFileName}
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleImportFile}
              disabled={!importFile}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 transition-colors"
            >
              <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
              Import Data
            </button>
            
            <button
              onClick={handleExportData}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Export Data (CSV)
            </button>
            
            <div className="pt-2 border-t dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Unduh contoh format untuk import:
              </p>
              <button
                onClick={downloadSampleData}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Download Contoh Format CSV
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Export Modal */}
      <Modal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)}
        title="Export Data Transaksi"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Export data transaksi dalam format CSV yang bisa diimpor kembali atau diolah di aplikasi spreadsheet.
          </p>
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Download CSV
          </button>
          <div className="pt-4 border-t dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Data yang akan diexport:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
              <li>Total {filteredTransaksi.length} transaksi</li>
              <li>Termasuk data customer, produk, harga, dan lainnya</li>
              <li>Format: CSV (Comma Separated Values)</li>
            </ul>
          </div>
        </div>
      </Modal>
    </Layout>
  );
} 