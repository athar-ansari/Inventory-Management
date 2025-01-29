import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, ResponsiveContainer, Cell
} from 'recharts';
import axios from 'axios';
import { motion } from 'framer-motion';



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: [],
    salesData: [],
    productDistribution: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const api = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${api}/dashboard`, {
          params: { email: user.primaryEmailAddress.emailAddress }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(dummyData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen ml-72 lg:ml-0">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-8 bg-gray-50 min-h-screen ml-72 lg:ml-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      <div className="grid sm:grid-cols-1 grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm"
          variants={cardVariants}
        >
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Products</h2>
          <p className="text-4xl font-bold text-blue-600">{stats.totalProducts}</p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm"
          variants={cardVariants}
        >
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Low Stock Items</h2>
          <p className="text-4xl font-bold text-red-500">
            {stats.lowStockProducts?.length || 0}
          </p>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm"
          variants={cardVariants}
        >
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Sales</h2>
          <p className="text-4xl font-bold text-green-600">
            {stats.salesData?.reduce((acc, curr) => acc + curr.sales, 0) || 0}
          </p>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-1 grid-cols-2 gap-8 mb-8">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm"
          variants={cardVariants}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.salesData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm"
          variants={cardVariants}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Product Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.productDistribution || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {(stats.productDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        className="bg-white rounded-xl shadow-sm overflow-hidden"
        variants={cardVariants}
      >
        <h2 className="text-3xl font-semibold text-gray-800 p-6 border-b">Low Stock Alerts</h2>
        <div className="overflow-x-auto">
          {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200 ">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200 ">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200 ">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.lowStockProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200 text-start">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-200 text-center">
                      {product.totalQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border border-gray-200  text-center">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 ">
                        Low Stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-gray-500">No low stock products found.</p>
          )}
        </div>
      </motion.div>

    </motion.div>
  );
}

export default Dashboard;