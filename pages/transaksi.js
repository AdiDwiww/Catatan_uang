import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import TransaksiForm from '../components/TransaksiForm';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function Transaksi() {
  const [transaksi, setTransaksi] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);

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

  const filteredTransaksi = transaksi
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.tanggal);
      const dateB = new Date(b.tanggal);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateB - dateA; // terbaru ke terlama
      }
      // Jika tanggal sama, urutkan nama customer A-Z
      return a.customer.nama.localeCompare(b.customer.nama);
    })
    .filter((t) => 
      t.customer.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.metode.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Transaksi
          </h1>
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

        {showForm && (
          <Card>
            <TransaksiForm 
              onSubmit={handleSubmit} 
              onCancel={() => setShowForm(false)}
              initialData={selectedTransaksi}
            />
          </Card>
        )}

        <Card>
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Produk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Harga Jual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Metode
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransaksi.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {(() => { const d = new Date(t.tanggal); return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }); })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {t.customer.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {t.produk}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      Rp {t.hargaJual.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                      Rp {(t.hargaJual - t.hargaAsli).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {t.metode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedTransaksi(t);
                          setShowForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
} 