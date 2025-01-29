import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TextField, Button, Paper, Autocomplete } from '@mui/material';
import { Update as UpdateIcon, Search as SearchIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

function UpdateStock() {
  const { user } = useUser();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [newPurchasePrice, setNewPurchasePrice] = useState(''); // New State for Purchase Price
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const getNumberFormat = (value) => {
    const parsedVal = parseFloat(value);
    return isNaN(parsedVal) ? value : parsedVal.toFixed(2);
  };

  const searchProducts = async (term) => {
    setIsSearching(true);
    try {
      const api = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${api}/products/search`, {
        params: {
          term,
          email: user.primaryEmailAddress.emailAddress
        }
      });
      setSearchResults(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !newQuantity) return;

    const updatedQuantity = selectedProduct.totalQuantity + parseInt(newQuantity);

    setIsSubmitting(true);
    try {
      const api = import.meta.env.VITE_API_URL;
      await axios.put(`${api}/products/${selectedProduct._id}`, {
        purchaseQuantity: updatedQuantity,
        totalQuantity: updatedQuantity,
        purchasePrice: newPurchasePrice, // Add new purchase price to update payload
        sales: 0,
        email: user.primaryEmailAddress.emailAddress
      });

      setSelectedProduct(null);
      setNewQuantity('');
      setNewPurchasePrice(''); // Reset new purchase price
      setSearchResults([]);

      toast.success('Stock updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating stock');
    } finally {
      setIsSubmitting(false);
    }
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Update Stock</h1>

        <Paper elevation={0} className="p-8 rounded-xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <Autocomplete
              options={searchResults}
              getOptionLabel={(option) => option.name}
              onChange={(_, newValue) => {
                setSelectedProduct(newValue);
                setNewQuantity(newValue.totalQuantity || '');
                setNewPurchasePrice(getNumberFormat(newValue.purchasePrice) || ''); // Set to current purchase price
              }}
              onInputChange={(_, newInputValue) => {
                if (newInputValue) searchProducts(newInputValue);
              }}
              loading={isSearching}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Product"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <SearchIcon className="text-gray-400 mr-2" />
                  }}
                />
              )}
            />
          </motion.div>

          {selectedProduct && (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TextField
                fullWidth
                label="Current Stock"
                value={selectedProduct ? selectedProduct.totalQuantity : ''}
                disabled
                variant="outlined"
              />

              <TextField
                fullWidth
                label="New Purchase Quantity"
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                variant="outlined"
                required
                InputProps={{
                  min: 1
                }}
              />

              <TextField
                fullWidth
                label="New Purchase Price"
                type="number"
                value={newPurchasePrice}
                onChange={(e) => setNewPurchasePrice(e.target.value)}
                variant="outlined"
                required
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isSubmitting}
                startIcon={<UpdateIcon />}
                className="h-12 bg-blue-600 hover:bg-blue-700 font-semibold"
              >
                {isSubmitting ? 'Updating...' : 'Update Stock'}
              </Button>
            </motion.form>
          )}
        </Paper>
      </motion.div>
    </motion.div>
  );
}

export default UpdateStock;
