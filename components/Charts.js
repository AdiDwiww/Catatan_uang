import React from 'react';
import Card from './Card';

export default function Charts({ data }) {
  // Memproses data hanya jika ada perubahan
  const lineChartData = React.useMemo(() => {
    const dailyData = data.reduce((acc, curr) => {
      const d = new Date(curr.tanggal);
      const date = d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      if (!acc[date]) {
        acc[date] = { date, penjualan: 0, profit: 0 };
      }
      acc[date].penjualan += curr.hargaJual;
      acc[date].profit += (curr.hargaJual - curr.hargaAsli);
      return acc;
    }, {});
    return Object.values(dailyData);
  }, [data]);

  const barChartData = React.useMemo(() => {
    const paymentData = data.reduce((acc, curr) => {
      if (!acc[curr.metode]) {
        acc[curr.metode] = { metode: curr.metode, total: 0 };
      }
      acc[curr.metode].total += curr.hargaJual;
      return acc;
    }, {});
    return Object.values(paymentData);
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Penjualan per Hari
        </h3>
        <div className="h-80 overflow-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-right">Penjualan</th>
                <th className="px-4 py-2 text-right">Profit</th>
              </tr>
            </thead>
            <tbody>
              {lineChartData.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2 text-right">Rp {item.penjualan.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">Rp {item.profit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Penjualan per Metode Pembayaran
        </h3>
        <div className="h-80 overflow-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Metode</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {barChartData.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{item.metode}</td>
                  <td className="px-4 py-2 text-right">Rp {item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
} 