import { getAllTransaksi } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const transaksi = await getAllTransaksi();
      
      // Calculate base summary statistics
      const totalPenjualan = transaksi.reduce((sum, t) => sum + t.hargaJual, 0);
      const totalProfit = transaksi.reduce((sum, t) => sum + (t.hargaJual - t.hargaAsli), 0);
      const totalTransaksi = transaksi.length;
      const rataRataProfit = totalTransaksi > 0 ? totalProfit / totalTransaksi : 0;

      // Calculate profitability rate
      const profitabilityRate = totalPenjualan > 0 ? (totalProfit / totalPenjualan) * 100 : 0;
      
      // Calculate average transaction value
      const avgTransactionValue = totalTransaksi > 0 ? totalPenjualan / totalTransaksi : 0;
      
      // Analisis per metode pembayaran
      const paymentMethodAnalysis = transaksi.reduce((acc, t) => {
        const method = t.metode || 'Unknown';
        if (!acc[method]) {
          acc[method] = { total: 0, count: 0, profit: 0 };
        }
        acc[method].total += t.hargaJual;
        acc[method].profit += (t.hargaJual - t.hargaAsli);
        acc[method].count += 1;
        return acc;
      }, {});
      
      // Konversi ke array dan tambahkan persentase
      const paymentMethods = Object.entries(paymentMethodAnalysis).map(([method, data]) => ({
        method,
        total: data.total,
        count: data.count,
        profit: data.profit,
        percentageOfSales: totalPenjualan > 0 ? (data.total / totalPenjualan) * 100 : 0,
        profitMargin: data.total > 0 ? (data.profit / data.total) * 100 : 0
      }));
      
      // Analisis per tujuan
      const destinationAnalysis = transaksi.reduce((acc, t) => {
        const destination = t.tujuan || 'Unknown';
        if (!acc[destination]) {
          acc[destination] = { total: 0, count: 0, profit: 0 };
        }
        acc[destination].total += t.hargaJual;
        acc[destination].profit += (t.hargaJual - t.hargaAsli);
        acc[destination].count += 1;
        return acc;
      }, {});
      
      // Konversi ke array dan tambahkan persentase
      const destinations = Object.entries(destinationAnalysis).map(([destination, data]) => ({
        destination,
        total: data.total,
        count: data.count,
        profit: data.profit,
        percentageOfSales: totalPenjualan > 0 ? (data.total / totalPenjualan) * 100 : 0,
        profitMargin: data.total > 0 ? (data.profit / data.total) * 100 : 0
      }));
      
      // Analisis per produk (top products)
      const productAnalysis = transaksi.reduce((acc, t) => {
        const product = t.produk || 'Unknown';
        if (!acc[product]) {
          acc[product] = { total: 0, count: 0, profit: 0 };
        }
        acc[product].total += t.hargaJual;
        acc[product].profit += (t.hargaJual - t.hargaAsli);
        acc[product].count += 1;
        return acc;
      }, {});
      
      // Konversi ke array, tambahkan persentase, dan urutkan berdasarkan total penjualan
      const products = Object.entries(productAnalysis)
        .map(([product, data]) => ({
          product,
          total: data.total,
          count: data.count,
          profit: data.profit,
          percentageOfSales: totalPenjualan > 0 ? (data.total / totalPenjualan) * 100 : 0,
          profitMargin: data.total > 0 ? (data.profit / data.total) * 100 : 0
        }))
        .sort((a, b) => b.total - a.total);
      
      // Analisis tren penjualan harian
      const dailySales = transaksi.reduce((acc, t) => {
        const date = new Date(t.tanggal).toLocaleDateString('id-ID');
        if (!acc[date]) {
          acc[date] = { total: 0, count: 0, profit: 0 };
        }
        acc[date].total += t.hargaJual;
        acc[date].profit += (t.hargaJual - t.hargaAsli);
        acc[date].count += 1;
        return acc;
      }, {});
      
      // Konversi ke array dan urutkan berdasarkan tanggal
      const salesTrend = Object.entries(dailySales)
        .map(([date, data]) => ({
          date,
          total: data.total,
          count: data.count,
          profit: data.profit
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Customer analysis
      const customerAnalysis = transaksi.reduce((acc, t) => {
        const customerId = t.customerId;
        const customerName = t.customer?.nama || `Customer ${customerId}`;
        
        if (!acc[customerId]) {
          acc[customerId] = { 
            id: customerId,
            name: customerName,
            total: 0, 
            count: 0, 
            profit: 0,
            firstPurchase: new Date(t.tanggal),
            lastPurchase: new Date(t.tanggal)
          };
        }
        
        acc[customerId].total += t.hargaJual;
        acc[customerId].profit += (t.hargaJual - t.hargaAsli);
        acc[customerId].count += 1;
        
        // Update first and last purchase dates
        const purchaseDate = new Date(t.tanggal);
        if (purchaseDate < acc[customerId].firstPurchase) {
          acc[customerId].firstPurchase = purchaseDate;
        }
        if (purchaseDate > acc[customerId].lastPurchase) {
          acc[customerId].lastPurchase = purchaseDate;
        }
        
        return acc;
      }, {});
      
      // Convert to array and add averages
      const customers = Object.values(customerAnalysis)
        .map(customer => ({
          ...customer,
          avgPurchaseValue: customer.count > 0 ? customer.total / customer.count : 0,
          daysSinceLastPurchase: Math.floor((new Date() - customer.lastPurchase) / (1000 * 60 * 60 * 24))
        }))
        .sort((a, b) => b.total - a.total);
      
      // Send all data
      res.status(200).json({
        // Basic summary
        totalPenjualan,
        totalProfit,
        totalTransaksi,
        rataRataProfit,
        
        // Additional KPIs
        profitabilityRate,
        avgTransactionValue,
        
        // Analysis breakdowns
        paymentMethods,
        destinations,
        topProducts: products.slice(0, 10), // Top 10 products
        salesTrend,
        topCustomers: customers.slice(0, 10), // Top 10 customers
        
        // Raw data for client-side processing if needed
        transaksi: transaksi.map(t => ({
          id: t.id,
          tanggal: t.tanggal,
          customerId: t.customerId,
          customerNama: t.customer?.nama || '',
          produk: t.produk,
          hargaAsli: t.hargaAsli,
          hargaJual: t.hargaJual,
          profit: t.hargaJual - t.hargaAsli,
          metode: t.metode,
          tujuan: t.tujuan || '',
          tag: t.tag || ''
        }))
      });
    } catch (error) {
      console.error('Error in laporan API:', error);
      res.status(500).json({ message: 'Error fetching report data', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 