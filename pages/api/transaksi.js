import { getAllTransaksi, addTransaksi, updateTransaksi, deleteTransaksi } from '../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const data = await getAllTransaksi();
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    try {
      let transaksi = req.body;
      console.log('Received transaksi data:', transaksi); // log request body
      // Convert customerId to integer
      if (typeof transaksi.customerId === 'string') {
        transaksi.customerId = parseInt(transaksi.customerId);
      }
      // Convert tanggal to Date
      if (typeof transaksi.tanggal === 'string') {
        transaksi.tanggal = new Date(transaksi.tanggal);
      }
      // Convert hargaAsli and hargaJual to integer, fallback to 0 if NaN
      transaksi.hargaAsli = parseInt(transaksi.hargaAsli);
      if (isNaN(transaksi.hargaAsli)) transaksi.hargaAsli = 0;
      transaksi.hargaJual = parseInt(transaksi.hargaJual);
      if (isNaN(transaksi.hargaJual)) transaksi.hargaJual = 0;
      // Log types for debugging
      console.log('After conversion:', {
        customerId: transaksi.customerId,
        tanggal: transaksi.tanggal,
        hargaAsli: transaksi.hargaAsli,
        hargaJual: transaksi.hargaJual,
        typeofHargaAsli: typeof transaksi.hargaAsli,
        typeofHargaJual: typeof transaksi.hargaJual
      });
      // Remove profit if present (not in schema)
      if ('profit' in transaksi) {
        delete transaksi.profit;
      }
      const newTransaksi = await addTransaksi(transaksi);
      res.status(201).json(newTransaksi);
    } catch (error) {
      console.error('Error adding transaksi:', error);
      res.status(500).json({ message: 'Error adding transaksi', error: error.message });
    }
  } else if (req.method === 'PUT' && id) {
    try {
      let transaksi = req.body;
      // Convert customerId to integer
      if (typeof transaksi.customerId === 'string') {
        transaksi.customerId = parseInt(transaksi.customerId);
      }
      // Convert tanggal to Date
      if (typeof transaksi.tanggal === 'string') {
        transaksi.tanggal = new Date(transaksi.tanggal);
      }
      // Convert hargaAsli and hargaJual to integer, fallback to 0 if NaN
      transaksi.hargaAsli = parseInt(transaksi.hargaAsli);
      if (isNaN(transaksi.hargaAsli)) transaksi.hargaAsli = 0;
      transaksi.hargaJual = parseInt(transaksi.hargaJual);
      if (isNaN(transaksi.hargaJual)) transaksi.hargaJual = 0;
      if ('profit' in transaksi) {
        delete transaksi.profit;
      }
      const updated = await updateTransaksi(parseInt(id), transaksi);
      res.status(200).json(updated);
    } catch (error) {
      console.error('Error updating transaksi:', error);
      res.status(500).json({ message: 'Error updating transaksi', error: error.message });
    }
  } else if (req.method === 'DELETE' && id) {
    try {
      await deleteTransaksi(parseInt(id));
      res.status(200).json({ message: 'Transaksi deleted successfully' });
    } catch (error) {
      console.error('Error deleting transaksi:', error);
      res.status(500).json({ message: 'Error deleting transaksi', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 