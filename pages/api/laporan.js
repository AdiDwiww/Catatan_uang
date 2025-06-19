import { getAllTransaksi } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const transaksi = await getAllTransaksi();
    const totalPenjualan = transaksi.reduce((sum, t) => sum + t.hargaJual, 0);
    const totalProfit = transaksi.reduce((sum, t) => sum + (t.hargaJual - t.hargaAsli), 0);
    const totalTransaksi = transaksi.length;
    const rataRataProfit = totalTransaksi > 0 ? totalProfit / totalTransaksi : 0;

    res.status(200).json({
      totalPenjualan,
      totalProfit,
      totalTransaksi,
      rataRataProfit
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 