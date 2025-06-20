import { getAllTransaksi, addTransaksi, updateTransaksi, deleteTransaksi } from '../../lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../src/app/api/auth/[...nextauth]/route";

export default async function handler(req, res) {
  // Get user session
  const session = await getServerSession(req, res, authOptions);
  
  // Require authentication
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const userId = session.user.id;
  const { id } = req.query;
  
  if (req.method === 'GET') {
    const data = await getAllTransaksi(userId);
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    // Check if this is a bulk import request
    if (req.body.bulkImport && Array.isArray(req.body.data)) {
      try {
        const results = [];
        const errors = [];

        // Validate the data array
        if (req.body.data.length === 0) {
          return res.status(400).json({ 
            message: 'No data provided for bulk import',
            success: false,
            imported: 0,
            failed: 0
          });
        }

        // Process each record in the array
        for (const item of req.body.data) {
          try {
            // Skip null or undefined items
            if (!item) {
              errors.push({
                item: null,
                error: 'Item is null or undefined'
              });
              continue;
            }
            
            let transaksi = { ...item, userId: parseInt(userId) };
            
            // Convert customerId to integer
            if (typeof transaksi.customerId === 'string') {
              transaksi.customerId = parseInt(transaksi.customerId);
            }
            
            // Validate customerId
            if (!transaksi.customerId || isNaN(transaksi.customerId)) {
              throw new Error('Invalid customer ID');
            }
            
            // Convert tanggal to Date
            if (typeof transaksi.tanggal === 'string') {
              transaksi.tanggal = new Date(transaksi.tanggal);
            }
            
            // Validate tanggal
            if (!(transaksi.tanggal instanceof Date) || isNaN(transaksi.tanggal.getTime())) {
              transaksi.tanggal = new Date(); // Default to current date if invalid
            }
            
            // Convert hargaAsli and hargaJual to integer
            transaksi.hargaAsli = parseInt(transaksi.hargaAsli);
            if (isNaN(transaksi.hargaAsli)) transaksi.hargaAsli = 0;
            
            transaksi.hargaJual = parseInt(transaksi.hargaJual);
            if (isNaN(transaksi.hargaJual)) transaksi.hargaJual = 0;
            
            // Ensure other required fields have defaults
            transaksi.produk = transaksi.produk || '';
            transaksi.metode = transaksi.metode || '';
            transaksi.tujuan = transaksi.tujuan || '';
            transaksi.tag = transaksi.tag || '';
            
            // Remove profit if present (not in schema)
            if ('profit' in transaksi) {
              delete transaksi.profit;
            }
            
            const newTransaksi = await addTransaksi(transaksi);
            results.push(newTransaksi);
          } catch (error) {
            errors.push({
              item,
              error: error.message
            });
          }
        }
        
        res.status(201).json({
          success: true,
          imported: results.length,
          failed: errors.length,
          results,
          errors
        });
      } catch (error) {
        console.error('Error bulk importing transaksi:', error);
        res.status(500).json({ 
          message: 'Error bulk importing transaksi', 
          error: error.message,
          success: false,
          imported: 0,
          failed: req.body.data?.length || 0
        });
      }
    } else {
      // Handle single transaction add
      try {
        let transaksi = { ...req.body, userId: parseInt(userId) };
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
      const updated = await updateTransaksi(parseInt(id), transaksi, userId);
      res.status(200).json(updated);
    } catch (error) {
      console.error('Error updating transaksi:', error);
      res.status(500).json({ message: 'Error updating transaksi', error: error.message });
    }
  } else if (req.method === 'DELETE' && id) {
    try {
      await deleteTransaksi(parseInt(id), userId);
      res.status(200).json({ message: 'Transaksi deleted successfully' });
    } catch (error) {
      console.error('Error deleting transaksi:', error);
      res.status(500).json({ message: 'Error deleting transaksi', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 