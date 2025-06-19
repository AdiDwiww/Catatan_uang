import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { ArrowUpTrayIcon, ArrowDownTrayIcon, DocumentTextIcon, FolderIcon } from '@heroicons/react/24/outline';

export default function FileImportExport({ onImport, onExport, sampleData }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  // Create a custom file selection handler to avoid Chrome extension issues
  const triggerFileSelection = () => {
    try {
      // Clear previous errors
      setError('');
      
      // Create a brand new file input element each time
      const tempFileInput = document.createElement('input');
      tempFileInput.type = 'file';
      tempFileInput.accept = '.csv,.json';
      tempFileInput.style.display = 'none';
      document.body.appendChild(tempFileInput);
      
      // Define the change handler
      tempFileInput.onchange = function() {
        try {
          if (this.files && this.files.length > 0) {
            const selectedFile = this.files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name || 'Unknown file');
          } else {
            console.log('No file selected');
          }
          // Remove the temporary input
          document.body.removeChild(tempFileInput);
        } catch (e) {
          console.error('Error in file selection:', e);
          setError('Error selecting file');
          // Ensure cleanup
          document.body.removeChild(tempFileInput);
        }
      };
      
      // Trigger the file selection dialog
      tempFileInput.click();
    } catch (error) {
      console.error('Error creating file input:', error);
      setError('Could not open file selector');
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Pilih file terlebih dahulu');
      return;
    }

    setImporting(true);
    setError('');

    try {
      // Get file extension
      const name = fileName || '';
      const fileExtension = name.split('.').pop()?.toLowerCase() || '';
      
      if (fileExtension === 'csv') {
        try {
          // Use vanilla JS approach to read CSV files
          const reader = new FileReader();
          reader.onload = function(e) {
            try {
              // Parse CSV data
              const csvData = this.result;
              Papa.parse(csvData, {
                header: true,
                complete: function(results) {
                  try {
                    if (results.data && results.data.length > 0) {
                      if (typeof onImport === 'function') {
                        onImport(results.data);
                      } else {
                        setError('Import handler not properly configured');
                      }
                    } else {
                      setError('CSV file contains no valid data');
                    }
                  } catch (parseError) {
                    console.error('Error processing CSV data:', parseError);
                    setError(`Error processing CSV: ${parseError.message}`);
                  } finally {
                    setImporting(false);
                    resetState();
                  }
                },
                error: function(error) {
                  console.error('CSV parsing error:', error);
                  setError(`CSV parsing error: ${error.message}`);
                  setImporting(false);
                }
              });
            } catch (e) {
              console.error('Error processing file data:', e);
              setError(`Error processing file: ${e.message}`);
              setImporting(false);
            }
          };
          
          reader.onerror = function() {
            setError('Error reading file');
            setImporting(false);
          };
          
          reader.readAsText(file);
        } catch (e) {
          console.error('Error reading CSV:', e);
          setError(`Error reading CSV file: ${e.message}`);
          setImporting(false);
        }
      } else if (fileExtension === 'json') {
        try {
          // Use vanilla JS approach to read JSON files
          const reader = new FileReader();
          reader.onload = function(e) {
            try {
              // Parse JSON data
              const jsonText = this.result;
              let jsonData;
              
              try {
                jsonData = JSON.parse(jsonText);
              } catch (jsonError) {
                throw new Error(`Invalid JSON format: ${jsonError.message}`);
              }
              
              if (!jsonData) {
                throw new Error('JSON file contains no data');
              }
              
              // Process the data
              if (typeof onImport === 'function') {
                onImport(Array.isArray(jsonData) ? jsonData : [jsonData]);
              } else {
                throw new Error('Import handler not properly configured');
              }
              
              resetState();
            } catch (e) {
              console.error('Error processing JSON:', e);
              setError(`Error processing JSON: ${e.message}`);
            } finally {
              setImporting(false);
            }
          };
          
          reader.onerror = function() {
            setError('Error reading file');
            setImporting(false);
          };
          
          reader.readAsText(file);
        } catch (e) {
          console.error('Error reading JSON:', e);
          setError(`Error reading JSON file: ${e.message}`);
          setImporting(false);
        }
      } else {
        setError(`Format file tidak didukung: ${fileExtension}. Gunakan CSV atau JSON.`);
        setImporting(false);
      }
    } catch (error) {
      console.error('General error in handleImport:', error);
      setError(`Error: ${error.message}`);
      setImporting(false);
    }
  };
  
  // Helper function to reset state
  const resetState = () => {
    setFile(null);
    setFileName('');
  };

  const handleExport = () => {
    try {
      if (typeof onExport === 'function') {
        onExport();
      } else {
        setError('Export handler not properly configured');
      }
    } catch (error) {
      console.error('Error in handleExport:', error);
      setError(`Export error: ${error.message}`);
    }
  };

  const downloadSample = () => {
    try {
      if (!sampleData || !Array.isArray(sampleData) || sampleData.length === 0) {
        setError('No sample data available');
        return;
      }
      
      const csvData = Papa.unparse(sampleData);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Use vanilla approach for downloading
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sample_format.csv';
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error downloading sample:', error);
      setError(`Error downloading sample: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Pilih File (CSV atau JSON)
        </label>
        
        {/* Custom file selection button to avoid Chrome extension issues */}
        <button
          onClick={triggerFileSelection}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <FolderIcon className="w-5 h-5 mr-2" />
          {fileName ? 'Change File' : 'Select File'}
        </button>
        
        {fileName && (
          <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            {fileName}
          </div>
        )}
        
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        <button
          onClick={handleImport}
          disabled={importing || !file}
          className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 transition-colors"
        >
          <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
          {importing ? 'Mengimpor...' : 'Import Data'}
        </button>

        <button
          onClick={handleExport}
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
            onClick={downloadSample}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Download Contoh Format CSV
          </button>
        </div>
      </div>
    </div>
  );
} 