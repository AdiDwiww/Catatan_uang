import { getAllCustomers, addCustomer, updateCustomer, deleteCustomer } from '../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const data = await getAllCustomers();
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const customer = req.body;
    const newCustomer = await addCustomer(customer);
    res.status(201).json(newCustomer);
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