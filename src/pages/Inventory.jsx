import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { motion } from "framer-motion";

function Inventory() {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const api = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${api}/products`, {
          params: { email: user.primaryEmailAddress.emailAddress },
        });
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold"); // Set font to bold
    doc.setFontSize(16); // Increase font size
    doc.text("Inventory Report", 105, 10, { align: "center" }); // Center the text

    autoTable(doc, {
      head: [
        ["Serial No", "Product Name", "Purchase Price", "Purchase Quantity", "Sales", "Balance Stock"]
      ],
      body: filteredProducts.map((product, index) => [
        index + 1,
        product.name,
        Number(product.purchasePrice).toFixed(2),
        product.purchaseQuantity,
        product.sales,
        product.totalQuantity,
      ]),
      styles: {
        cellPadding: 3,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
      },
      columnStyles: {
        1: { halign: "left" },  // Align "Product Name" to the left
        2: { halign: "right" },  // Align "Purchase Price" to the right
      },
      theme: "grid",
    });

    doc.save("inventory.pdf");
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Inventory Management
        </h1>

        <div className="flex    gap-4 w-full justify-between">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500   w-4/5  lg:w-3/4 sm:w-2/4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-bold lg:text-base sm:text-sm lg:px-2"
            onClick={downloadPDF}
          >
            Download PDF
            <CloudDownloadIcon />
          </button>
        </div>
      </div>

      <div className="bg-white   shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border border-gray-200 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Serial No
                </th>
                <th className="px-6 py-3 border border-gray-200 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 border border-gray-200 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Purchase Price
                </th>
                <th className="px-6 py-3 border border-gray-200 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Purchase Quantity
                </th>
                <th className="px-6 py-3 border border-gray-200 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 border border-gray-200 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Balance Stock
                </th>

              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border border-gray-200 whitespace-nowrap text-sm text-gray-500 font-medium text-center">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 border border-gray-200 whitespace-nowrap text-sm font-medium text-gray-900 text-start">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 border border-gray-200 whitespace-nowrap text-sm text-blue-600 font-medium text-center">
                    ₹ {Number(product.purchasePrice).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 border border-gray-200 whitespace-nowrap text-sm text-green-700 font-medium text-center">
                    {product.purchaseQuantity}
                  </td>
                  <td className="px-6 py-4 border border-gray-200 whitespace-nowrap text-sm text-amber-950 font-medium text-center">
                    {product.sales}
                  </td>
                  <td className="px-6 py-4 border border-gray-200 whitespace-nowrap text-sm text-red-600 font-medium text-center">
                    {product.totalQuantity}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default Inventory;
