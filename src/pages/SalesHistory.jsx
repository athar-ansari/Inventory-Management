import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import { Paper, Modal, RadioGroup, FormControlLabel, Radio, Select, MenuItem } from "@mui/material";
import { FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function SalesHistory({ refreshTrigger }) {
  const { user } = useUser();
  const [paginatedData, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePages, setVisiblePages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [downloadOption, setDownloadOption] = useState("all");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const totalPages = paginatedData.length;

  // Function to get month name
  const getMonthName = (month) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1];
  };

  // Effect to handle pagination visibility
  useEffect(() => {
    if (totalPages > 0) {
      const maxVisiblePages = 4;
      const pagesToShow = Math.min(maxVisiblePages, totalPages);
      setVisiblePages(Array.from({ length: pagesToShow }, (_, i) => i + 1));
    }
  }, [totalPages]);

  // Effect to fetch sales data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = import.meta.env.VITE_API_URL;
        const salesRes = await axios.get(`${api}/sales`, {
          params: { email: user.primaryEmailAddress.emailAddress },
        });
        processSalesData(salesRes.data || []);
      } catch (error) {
        toast.error("Error fetching data");
        console.error(error);
      }
    };

    fetchData();
  }, [user, refreshTrigger]);


  // Function to process sales data
  const processSalesData = (data) => {
    const groupedData = {};
    data.forEach((sale) => {
      const date = new Date(sale.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const key = `${year}-${month}`;
      if (!groupedData[key]) groupedData[key] = [];
      groupedData[key].push(sale);
    });

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    const sortedKeys = Object.keys(groupedData)
      .sort((a, b) => {
        const [yearA, monthA] = a.split("-").map(Number);
        const [yearB, monthB] = b.split("-").map(Number);
        return yearB - yearA || monthB - monthA;
      })
      .filter((key) => {
        const [year, month] = key.split("-").map(Number);
        return year < currentYear || (year === currentYear && month <= currentMonth);
      });

    const currentMonthKey = `${currentYear}-${currentMonth}`;
    if (!sortedKeys.includes(currentMonthKey)) {
      sortedKeys.unshift(currentMonthKey);
    }

    const sortedData = sortedKeys.map((key) => ({
      monthYear: key,
      sales: groupedData[key] || [],
    }));

    setPaginatedData(sortedData);
  };


  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (page > visiblePages[visiblePages.length - 1]) {
      setVisiblePages([page - 3, page - 2, page - 1, page]);
    } else if (page < visiblePages[0]) {
      setVisiblePages([page, page + 1, page + 2, page + 3]);
    }
  };

  // Function to handle next page
  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Function to handle previous page
  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  // Current month data and formatting
  const currentMonthData = paginatedData[currentPage - 1]?.sales || [];
  const currentMonthYear = paginatedData[currentPage - 1]?.monthYear || "";
  const [year, month] = currentMonthYear.split("-");
  const formattedMonthYear =
    currentMonthYear === ""
      ? "No Data"
      : `${getMonthName(Number(month))}, ${year}`;

  // Function to handle download button click
  const handleDownloadClick = () => {
    setOpenModal(true);
  };

  // Function to handle PDF download
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const salesData = downloadOption === "all" ? paginatedData.flatMap(p => p.sales) : currentMonthData;
    doc.setFont("helvetica", "bold"); // Set font to bold
    doc.setFontSize(16); // Increase font size
    doc.text(75, 10, `Sales Report (${downloadOption === "all" ? "All Months" : `${getMonthName(Number(selectedMonth))}, ${selectedYear}`})`);
    autoTable(doc, {
      head: [["Serial No", "Product Name", "Quantity", "Selling Price", "Date"]],
      body: salesData.map((sale, index) => [
        index + 1,
        sale.productName,
        sale.quantity,
        (sale.price * sale.quantity).toFixed(2),
        new Date(sale.date).toLocaleDateString("en-GB"),
      ]),
      styles: {
        cellPadding: 3,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        fontStyle: 'bold',
        halign: "center",
        valign: "middle",
      },
      columnStyles: {
        1: { halign: 'left' }, // Align "Product Name" column to the left (index 1)
        3: { halign: "right" },  // Align "Selling Price" to the right
      },
      theme: 'grid',
    });
    doc.save("sales-record.pdf");
    setOpenModal(false);
  };

  return (
    <motion.div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Sales Records Data</h1>
        {paginatedData.length === 0 ? (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-500">No sales data available</p>
          </div>
        ) : (
          <>
            <Paper elevation={0} className="p-8 rounded-3xl">
              {/* Sales Record Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold">Sales Record for {formattedMonthYear}</h2>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  onClick={handleDownloadClick}
                >
                  <FaDownload className="inline mr-2" /> Download
                </button>
              </div>
              {/* Sales Data Table */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3  text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200 text-center ">
                      Product
                    </th>
                    <th className="px-6 py-3  text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200 text-center">
                      Quantity
                    </th>
                    <th className="px-6 py-3  text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200 text-center">
                      Selling Price
                    </th>
                    <th className="px-6 py-3  text-xs font-semibold text-gray-500 uppercase tracking-wider border border-gray-200 text-center">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentMonthData.map((sale) => (
                    <tr key={sale._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border text-start">
                        {sale.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border text-center">
                        {sale.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border text-center">
                        ₹ {(sale.price * sale.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border text-center">
                        {new Date(sale.date).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Paper>

            {/* Pagination Controls */}
            <nav className="flex items-center justify-center gap-x-2 mt-4" aria-label="Pagination">
              <button
                type="button"
                className={`py-1 px-3 text-sm rounded-md border ${currentPage === 1
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                &lt; Previous
              </button>

              {visiblePages.map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`py-1 px-3 text-sm rounded-md border ${page === currentPage
                    ? "bg-gray-200 text-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => handlePageChange(page)}
                  disabled={page > totalPages}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                className={`py-1 px-3 text-sm rounded-md border ${currentPage === totalPages
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next &gt;
              </button>
            </nav>

            {/* Modal for Download Options */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mt-24">
                <h3 className="text-lg font-semibold mb-4">Download Sales Record Data</h3>
                <RadioGroup value={downloadOption} onChange={(e) => setDownloadOption(e.target.value)}>
                  <FormControlLabel value="all" control={<Radio />} label="All Months" />
                  <FormControlLabel value="specific" control={<Radio />} label="Choose Month" />
                </RadioGroup>
                {downloadOption === "specific" && (
                  <div className="flex gap-4 mt-4">
                    <Select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Select Year</MenuItem>
                      {paginatedData.map((p) => {
                        const [y] = p.monthYear.split("-");
                        return (
                          <MenuItem key={y} value={y}>
                            {y}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <Select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Select Month</MenuItem>
                      {paginatedData
                        .filter((p) => p.monthYear.startsWith(selectedYear))
                        .map((p) => {
                          const [, m] = p.monthYear.split("-");
                          return (
                            <MenuItem key={m} value={m}>
                              {getMonthName(Number(m))}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </div>
                )}
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-6 w-full"
                  onClick={handleDownloadPDF}
                >
                  PDF Download
                </button>
              </div>
            </Modal>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default SalesHistory;
