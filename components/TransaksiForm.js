import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getCurrencyOptions, formatCurrency, convertCurrency } from '../lib/currency';
import Card from './Card';

export default function TransaksiForm({ onSubmit, onCancel, initialData, customers = [] }) {
  const [formData, setFormData] = useState({
    customerId: '',
    tanggal: new Date().toISOString().split('T')[0],
    produk: '',
    hargaAsli: '',
    hargaJual: '',
    mataUang: 'IDR',
    kurs: 1.0,
    metode: '',
    tujuan: '',
    tag: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerId: initialData.customerId?.toString() || '',
        tanggal: initialData.tanggal ? new Date(initialData.tanggal).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        produk: initialData.produk || '',
        hargaAsli: initialData.hargaAsli?.toString() || '',
        hargaJual: initialData.hargaJual?.toString() || '',
        mataUang: initialData.mataUang || 'IDR',
        kurs: initialData.kurs || 1.0,
        metode: initialData.metode || '',
        tujuan: initialData.tujuan || '',
        tag: initialData.tag || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setFormData(prev => ({
      ...prev,
      mataUang: newCurrency,
      kurs: newCurrency === 'IDR' ? 1.0 : ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerId) newErrors.customerId = 'Customer harus dipilih';
    if (!formData.produk) newErrors.produk = 'Produk harus diisi';
    if (!formData.hargaAsli) newErrors.hargaAsli = 'Harga asli harus diisi';
    if (!formData.hargaJual) newErrors.hargaJual = 'Harga jual harus diisi';
    if (!formData.metode) newErrors.metode = 'Metode pembayaran harus dipilih';
    if (!formData.tujuan) newErrors.tujuan = 'Tujuan harus dipilih';

    // Validate that harga jual >= harga asli
    if (formData.hargaAsli && formData.hargaJual) {
      const hargaAsli = parseFloat(formData.hargaAsli);
      const hargaJual = parseFloat(formData.hargaJual);
      if (hargaJual < hargaAsli) {
        newErrors.hargaJual = 'Harga jual tidak boleh lebih kecil dari harga asli';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        customerId: parseInt(formData.customerId),
        hargaAsli: parseInt(formData.hargaAsli),
        hargaJual: parseInt(formData.hargaJual),
        kurs: parseFloat(formData.kurs)
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const currencyOptions = getCurrencyOptions();

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {initialData ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Customer *
            </label>
            <select
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.customerId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih Customer</option>
              {customers && customers.length > 0 ? (
                customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.nama}
                  </option>
                ))
              ) : (
                <option value="" disabled>No customers available</option>
              )}
            </select>
            {errors.customerId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerId}</p>
            )}
            {(!customers || customers.length === 0) && (
              <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
                No customers found. Please add customers first.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tanggal *
            </label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Produk *
            </label>
            <input
              type="text"
              name="produk"
              value={formData.produk}
              onChange={handleChange}
              placeholder="Nama produk"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.produk ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.produk && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.produk}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mata Uang
            </label>
            <select
              name="mataUang"
              value={formData.mataUang}
              onChange={handleCurrencyChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {currencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {formData.mataUang !== 'IDR' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kurs (1 {formData.mataUang} = ? IDR)
              </label>
              <input
                type="number"
                name="kurs"
                value={formData.kurs}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="Masukkan kurs"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Harga Asli ({formData.mataUang}) *
              </label>
              <input
                type="number"
                name="hargaAsli"
                value={formData.hargaAsli}
                onChange={handleChange}
                placeholder="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.hargaAsli ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.hargaAsli && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.hargaAsli}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Harga Jual ({formData.mataUang}) *
              </label>
              <input
                type="number"
                name="hargaJual"
                value={formData.hargaJual}
                onChange={handleChange}
                placeholder="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.hargaJual ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.hargaJual && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.hargaJual}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Metode Pembayaran *
            </label>
            <select
              name="metode"
              value={formData.metode}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.metode ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih Metode</option>
              <option value="Cash">Cash</option>
              <option value="Transfer">Transfer</option>
              <option value="E-Wallet">E-Wallet</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
            </select>
            {errors.metode && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.metode}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tujuan *
            </label>
            <input
              type="text"
              name="tujuan"
              value={formData.tujuan}
              onChange={handleChange}
              placeholder="Gopay/BNI/Tunai/Lainnya"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.tujuan ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.tujuan && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tujuan}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tag
            </label>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              placeholder="Tag (opsional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : initialData ? 'Update' : 'Simpan'}
          </button>
        </div>
      </form>
    </Card>
  );
} 