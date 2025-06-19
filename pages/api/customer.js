import { getAllCustomers, addCustomer, updateCustomer, deleteCustomer } from '../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const data = await getAllCustomers();
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
            
            let customer = { ...item };
            
            // Validate nama
            if (!customer.nama || typeof customer.nama !== 'string' || customer.nama.trim() === '') {
              throw new Error('Invalid customer name');
            }
            
            // Trim customer name
            customer.nama = customer.nama.trim();
            
            const newCustomer = await addCustomer(customer);
            results.push(newCustomer);
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
        console.error('Error bulk importing customers:', error);
        res.status(500).json({ 
          message: 'Error bulk importing customers', 
          error: error.message,
          success: false,
          imported: 0,
          failed: req.body.data?.length || 0
        });
      }
    } else {
      // Handle single customer add
      const customer = req.body;
      const newCustomer = await addCustomer(customer);
      res.status(201).json(newCustomer);
    }
  } else if (req.method === 'PUT' && id) {
    const customer = req.body;
    const updatedCustomer = await updateCustomer(parseInt(id), customer);
    res.status(200).json(updatedCustomer);
  } else if (req.method === 'DELETE' && id) {
    try {
      await deleteCustomer(parseInt(id));
      res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 