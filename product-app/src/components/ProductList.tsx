import { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Pagination,
  Box,
  Button,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface Product {
  productId: string;
  productName: string;
  dateTime: string;
  quantity: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [updatedProductName, setUpdatedProductName] = useState("");
  const [updatedQuantity, setUpdatedQuantity] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrderName, setSortOrderName] = useState<"asc" | "desc">("asc");
  const [sortOrderDate, setSortOrderDate] = useState<"asc" | "desc">("asc");
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 records per page

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(storedProducts);
    setFilteredProducts(storedProducts);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentProducts = JSON.parse(
        localStorage.getItem("products") || "[]"
      );
      if (JSON.stringify(currentProducts) !== JSON.stringify(products)) {
        setProducts(currentProducts);
        setFilteredProducts(currentProducts);
      }
    }, 500);
    return () => clearInterval(intervalId);
  }, [products]);

  const handleDelete = (productId: string) => {
    setSelectedProduct(
      products.find((product) => product.productId === productId) || null
    );
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      const updatedProducts = products.filter(
        (product) => product.productId !== selectedProduct.productId
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      setDeleteConfirmOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleUpdate = (product: Product) => {
    setSelectedProduct(product);
    setUpdatedProductName(product.productName);
    setUpdatedQuantity(product.quantity);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteConfirmOpen(false);
    setSelectedProduct(null);
    setUpdatedProductName("");
    setUpdatedQuantity("");
    setError("");
  };

  const handleUpdateProduct = () => {
    if (!updatedProductName.trim() || !updatedQuantity.trim()) {
      setError("Product name and quantity cannot be empty");
      return;
    }

    if (
      products.some(
        (product) =>
          product.productName.toLowerCase() ===
            updatedProductName.toLowerCase() &&
          product.productId !== selectedProduct?.productId
      )
    ) {
      setError("Product name must be unique");
      return;
    }

    if (selectedProduct) {
      const updatedProducts = products.map((product) =>
        product.productId === selectedProduct.productId
          ? {
              ...product,
              productName: updatedProductName,
              quantity: updatedQuantity,
              dateTime: new Date().toISOString(), // Update timestamp
            }
          : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      handleClose();
    }
  };

  const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
    setPage(1); // Reset to first page on search
  };

  const handleSortByName = () => {
    const newOrder = sortOrderName === "asc" ? "desc" : "asc";
    const sorted = [...filteredProducts].sort((a, b) => {
      return newOrder === "asc"
        ? a.productName.localeCompare(b.productName)
        : b.productName.localeCompare(a.productName);
    });
    setSortOrderName(newOrder);
    setFilteredProducts(sorted);
  };

  const handleSortByDate = () => {
    const order = sortOrderDate === "asc" ? "desc" : "asc";
    setSortOrderDate(order);
    const sorted = [...filteredProducts].sort((a, b) => {
      if (order === "asc") {
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
      } else {
        return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
      }
    });
    setFilteredProducts(sorted);
  };

  const handleRecordsPerPageChange = (e: { target: { value: number } }) => {
    setItemsPerPage(Number(e.target.value));
    setPage(1); // Reset to the first page whenever items per page is changed
  };

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        marginTop: -10,
        marginLeft: -12,
        marginRight: -11,
        marginBottom: -13,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          m: 2,
          p: 2,
          overflow: "auto",
          mb: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            pr: 2,
          }}
        >
          <TextField
            label="Search Product"
            variant="outlined"
            placeholder={`Search among ${filteredProducts.length} products`}
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: "400px", ml: "auto" }}
          />
        </Box>
        {/* Dropdown for records per page */}
        <TableContainer
          component={Paper}
          sx={{ flexGrow: 1, maxHeight: "100%", overflow: "auto", mb: 9.5 }}
        >
          <Table stickyHeader sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6">Name</Typography>
                    <IconButton
                      onClick={handleSortByName}
                      size="small"
                      sx={{ backgroundColor: "secondary.main", ml: 0.7 }}
                    >
                      {sortOrderName === "asc" ? (
                        <ArrowUpwardIcon />
                      ) : (
                        <ArrowDownwardIcon />
                      )}
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <Typography variant="h6">Product ID</Typography>
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6">Date & Time</Typography>
                    <IconButton
                      onClick={handleSortByDate}
                      size="small"
                      sx={{ backgroundColor: "secondary.main", ml: 0.7 }}
                    >
                      {sortOrderDate === "asc" ? (
                        <ArrowUpwardIcon />
                      ) : (
                        <ArrowDownwardIcon />
                      )}
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <Typography variant="h6">Quantity</Typography>
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <Typography variant="h6">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ overflow: "hidden" }}>
              {paginatedProducts.map((product) => (
                <TableRow
                  key={product.productId}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor: (theme) => theme.palette.action.hover,
                    "&:nth-of-type(even)": { backgroundColor: "#f9f9f9" }, // Alternating row colors
                  }}
                >
                  <TableCell sx={{ padding: "12px", color: "GrayText" }}>
                    {product.productName}
                  </TableCell>
                  <TableCell sx={{ padding: "12px", color: "GrayText" }}>
                    {product.productId}
                  </TableCell>
                  <TableCell sx={{ padding: "12px", color: "GrayText" }}>
                    {product.dateTime}
                  </TableCell>
                  <TableCell sx={{ padding: "12px", color: "GrayText" }}>
                    {product.quantity}
                  </TableCell>
                  <TableCell sx={{ padding: "12px", color: "GrayText" }}>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDelete(product.productId)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleUpdate(product)}
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        // Replace the existing Box containing Pagination and Typography with
        this:
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "16px",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderTop: "1px solid rgba(0, 0, 0, 0.12)",
            zIndex: 1000,
            boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <Box /> {/* Spacer */}
          <FormControl sx={{ minWidth: 120, height: 50, ml: -10 }}>
            <InputLabel id="records-per-page-label">
              Records per Page
            </InputLabel>
            <Select
              labelId="records-per-page-label"
              value={itemsPerPage}
              label="Records per Page"
              onChange={(e) => handleRecordsPerPageChange(e)}
            >
              {[10, 20, 30, 40, 50].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Pagination
            count={Math.ceil(filteredProducts.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            sx={{
              "& .MuiPagination-ul": {
                margin: 0,
              },
            }}
          />
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              marginLeft: "16px",
              marginRight: "16px",
              whiteSpace: "nowrap",
            }}
          >
            Page {page} of {Math.ceil(filteredProducts.length / itemsPerPage)}
          </Typography>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this?</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ width: 400, position: "center", ml: "35%" }}
      >
        <DialogTitle>Update Product</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Product Name"
            type="text"
            fullWidth
            value={updatedProductName}
            onChange={(e) => setUpdatedProductName(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={updatedQuantity}
            onChange={(e) => setUpdatedQuantity(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateProduct} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductList;
