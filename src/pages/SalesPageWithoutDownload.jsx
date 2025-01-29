import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import { Paper } from "@mui/material";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import toast from "react-hot-toast";

function SalesPageWithoutDownload({ refreshTrigger }) {
    const { user } = useUser();
    const [paginatedData, setPaginatedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [visiblePages, setVisiblePages] = useState([]); // Initially show the first 4 pages
    const totalPages = paginatedData.length;

    const getMonthName = (month) => {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        return months[month - 1];
    };
    useEffect(() => {
        // Update visiblePages dynamically based on totalPages
        if (totalPages > 0) {
            const maxVisiblePages = 4;
            const pagesToShow = Math.min(maxVisiblePages, totalPages);
            setVisiblePages(Array.from({ length: pagesToShow }, (_, i) => i + 1));
        }
    }, [totalPages]);





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

    // Handle Page Change
    const handlePageChange = (page) => {
        setCurrentPage(page);

        // Update visible pages dynamically
        if (page > visiblePages[visiblePages.length - 1]) {
            setVisiblePages([page - 3, page - 2, page - 1, page]);
        } else if (page < visiblePages[0]) {
            setVisiblePages([page, page + 1, page + 2, page + 3]);
        }
    };

    // Handle next and previous navigation
    const handleNext = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const currentMonthData = paginatedData[currentPage - 1]?.sales || [];
    const currentMonthYear = paginatedData[currentPage - 1]?.monthYear || "";
    const [year, month] = currentMonthYear.split("-");
    const formattedMonthYear =
        currentMonthYear === ""
            ? "No Data"
            : `${getMonthName(Number(month))}, ${year}`;

    return (
        <motion.div
            className="p-8 bg-gray-50 min-h-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    Sales Records
                </h1>

                {paginatedData.length === 0 ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <p className="text-gray-500">No sales data available</p>
                    </div>
                ) : (
                    <>
                        <Paper elevation={0} className="p-8 rounded-t-3xl">
                            <h2 className="text-xl font-semibold mb-6">
                                Sales for {formattedMonthYear}
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Selling Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentMonthData.map((sale) => (
                                            <tr key={sale._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {sale.productName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {sale.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ₹ {(sale.price * sale.quantity).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(sale.date).toLocaleDateString("en-GB")}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Paper>

                        {/* Pagination */}
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
                                <FaChevronLeft className="mr-1" /> Previous
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
                                Next <FaChevronRight className="ml-1" />
                            </button>
                        </nav>
                    </>
                )}
            </div>
        </motion.div>
    );
}

export default SalesPageWithoutDownload;
