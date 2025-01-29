import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import { TextField, Button, Paper } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import toast from "react-hot-toast";

function AddProduct() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    purchasePrice: "",
    purchaseQuantity: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const api = import.meta.env.VITE_API_URL;
      await axios.post(`${api}/products`, {
        ...formData,
        email: user.primaryEmailAddress.emailAddress,
        totalQuantity: formData.purchaseQuantity,
        sales: 0,
      });

      setFormData({
        name: "",
        purchasePrice: "",
        purchaseQuantity: "",
      });

      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      if (error.response && error.response.status === 400) {
        toast.error("Product with the same name already exists"); // Show specific error message
      } else {
        toast.error("Error adding product");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
      className="p-8 bg-gray-50 min-h-screen ml-72 lg:ml-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Add New Product
        </h1>

        <Paper elevation={0} className="p-8 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                required
                className="mb-4"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <TextField
                fullWidth
                label="Purchase Price"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={handleChange}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: <span className="text-gray-500 mr-2">₹</span>,
                }}
                className="mb-4"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TextField
                fullWidth
                label="Purchase Quantity"
                name="purchaseQuantity"
                type="number"
                value={formData.purchaseQuantity}
                onChange={handleChange}
                variant="outlined"
                required
                className="mb-6"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isSubmitting}
                startIcon={<AddIcon />}
                className="h-12 bg-blue-600 hover:bg-blue-700 font-semibold"
              >
                {isSubmitting ? "Processing..." : "Add Product"}
              </Button>
            </motion.div>
          </form>
        </Paper>
      </motion.div>
    </motion.div>
  );
}

export default AddProduct;
