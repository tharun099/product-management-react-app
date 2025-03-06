import React, { useState } from 'react';
import { TextField, Button, Container, Grid, Typography } from '@mui/material';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [productId, setProductId] = useState(String(Math.floor(100000000000000 + Math.random() * 999999999999999)));
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const products = JSON.parse(localStorage.getItem('products') || '[]');

    if (products.some((product: any) => product.productName === productName)) {
      setError('Product name must be unique');
      return;
    }

    const product = { productName, productId, dateTime, quantity };
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));

    // Reset form and generate new productId and dateTime
    setProductName('');
    setQuantity('');
    setError('');
    setProductId(String(Math.floor(100000000000000 + Math.random() * 999999999999999)));
    setDateTime(new Date().toLocaleString());
  };

  return (
    <Container sx={{ maxWidth: '100%', marginLeft:13, marginBottom:-10}}>
      <Typography variant="h4" gutterBottom sx={{mr:40, mb:2,fontWeight:'bold'}}>Add Product Details</Typography>
      
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <TextField label="Product ID" value={productId} disabled fullWidth />
            </Grid>
            <Grid item xs={8}>
              <TextField
                label="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                fullWidth
                required
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={8}>
              <TextField label="Date & Time" value={dateTime} disabled fullWidth />
            </Grid>
            <Grid item xs={8}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Add Product
              </Button>
            </Grid>
          </Grid>
        </form>

    </Container>
  );
};

export default AddProduct;