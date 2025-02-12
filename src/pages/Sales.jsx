import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { TextField, Button, Autocomplete, Paper } from "@mui/material";
import { AddShoppingCart as SaleIcon } from "@mui/icons-material";
import toast from "react-hot-toast";
import axios from "axios";
import SalesHistory from "./SalesHistory";


function Sales() {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saleQuantity, setSaleQuantity] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshSalesHistory, setRefreshSalesHistory] = useState(false); // State to trigger history refresh

  // Fetch Products Data
  useState(() => {
    const fetchProducts = async () => {
      try {
        const api = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${api}/products`, {
          params: { email: user.primaryEmailAddress.emailAddress },
        });
        setProducts(response.data || []);
      } catch (error) {
        toast.error("Error fetching products");
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [user]);

  // Handle Sale Submission
  const handleSale = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !saleQuantity || !sellingPrice) {
      toast.error("Please fill in all fields");
      return;
    }

    const quantity = parseInt(saleQuantity);
    const price = parseFloat(sellingPrice);

    if (quantity <= 0 || price <= 0) {
      toast.error("Quantity and price must be greater than zero");
      return;
    }

    if (quantity > selectedProduct.totalQuantity) {
      toast.error("Sale quantity exceeds available stock");
      return;
    }

    setIsSubmitting(true);
    try {
      const api = import.meta.env.VITE_API_URL;
      await axios.post(`${api}/sales`, {
        productId: selectedProduct._id,
        quantity,
        price,
        email: user.primaryEmailAddress.emailAddress,
      });

      setSelectedProduct(null);
      setSaleQuantity("");
      setSellingPrice("");
      setRefreshSalesHistory(!refreshSalesHistory); // Toggle state to trigger history refresh

      toast.success("Sale recorded successfully!");
    } catch (error) {
      console.error("Error recording sale:", error);
      toast.error("Failed to record sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen ml-72 lg:ml-0">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Sales Records</h1>
        <Paper elevation={0} className="p-8 rounded-3xl">
          <h2 className="text-xl font-semibold mb-6">New Sale</h2>
          <form onSubmit={handleSale} className="space-y-6">
            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.name}
              onChange={(_, newValue) => setSelectedProduct(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Product"
                  variant="outlined"
                  required
                />
              )}
            />
            {selectedProduct && (
              <div className="space-y-4">
                <TextField
                  fullWidth
                  label="Available Quantity"
                  value={selectedProduct.totalQuantity}
                  disabled
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Sale Quantity"
                  type="number"
                  value={saleQuantity}
                  onChange={(e) => setSaleQuantity(e.target.value)}
                  variant="outlined"
                  required
                />
                <TextField
                  fullWidth
                  label="Selling Price (per unit)"
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  variant="outlined"
                  required
                />
                <div className="text-sm text-gray-700">
                  Total Price: ₹
                  {(parseFloat(saleQuantity) * parseFloat(sellingPrice) || 0).toFixed(2)}
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={isSubmitting}
                  startIcon={<SaleIcon />}
                >
                  {isSubmitting ? "Recording..." : "Record Sale"}
                </Button>
              </div>
            )}
          </form>
        </Paper>

        {/* SalesHistory */}
        <SalesHistory refreshTrigger={refreshSalesHistory} /> {/* Pass prop */}

      </div>
    </div>
  );
}

export default Sales;
