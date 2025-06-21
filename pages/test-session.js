import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../components/Layout';

export default function TestSession() {
  const { data: session, status } = useSession();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      fetchCustomers();
    }
  }, [session]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/customer');
      console.log('Customer API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Customer data:', data);
        setCustomers(data);
      } else {
        const errorData = await response.json();
        console.error('Customer API error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Session Test Page
        </h1>

        <div className="space-y-6">
          {/* Session Info */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Session Information
            </h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {status}</p>
              {session ? (
                <div>
                  <p><strong>User ID:</strong> {session.user.id}</p>
                  <p><strong>Name:</strong> {session.user.name}</p>
                  <p><strong>Email:</strong> {session.user.email}</p>
                </div>
              ) : (
                <p>No session found</p>
              )}
            </div>
          </div>

          {/* Customer Test */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Customer Data Test
            </h2>
            <button
              onClick={fetchCustomers}
              disabled={loading || !session}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch Customers'}
            </button>
            
            <div className="mt-4">
              <p><strong>Customers loaded:</strong> {customers.length}</p>
              {customers.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {customers.map(customer => (
                    <li key={customer.id} className="text-sm">
                      ID: {customer.id} - Name: {customer.nama}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Console Log */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Console Log
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Check browser console for detailed logs
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 