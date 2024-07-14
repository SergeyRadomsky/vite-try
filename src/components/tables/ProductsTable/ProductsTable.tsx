import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from "../../../store/products/reducer";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Check, Close, Search } from "@mui/icons-material";

const ProductsTable: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.data);
  const loading = useSelector((state: RootState) => state.products.loading);
  const error = useSelector((state: RootState) => state.products.error);

  const [editId, setEditId] = useState<number | null>(null);
  const [editProductName, setEditProductName] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const hasFetched = useRef(false); // Новый флаг для предотвращения дублирования запроса

  useEffect(() => {
    if (!hasFetched.current) {
    dispatch(fetchProducts());
    hasFetched.current = true;
  }
  }, [dispatch]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setNewProductName("");
    setEditProductName("");
    setValidationError(null);
    setIsEditing(false);
  };

  const handleCreate = () => {
    if (validateProductName(newProductName)) {
      dispatch(createProduct({ productid: 0, productname: newProductName }));
      handleClose();
    } else {
      setValidationError("Invalid product name");
    }
  };

  const handleEditOpen = (product: Product) => {
    setEditId(product.productid);
    setEditProductName(product.productname);
    setIsEditing(true);
    handleOpen();
  };

  const handleSave = () => {
    if (validateProductName(editProductName) && editId !== null) {
      dispatch(updateProduct({ productid: editId, productname: editProductName }));
      handleClose();
    } else {
      setValidationError("Invalid product name");
    }
  };

  const validateProductName = (name: string) => {
    return name.trim().length > 0 && isNaN(Number(name));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteProduct(id));
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const filteredProducts = filter
    ? products.filter((product) =>
        product.productname.toLowerCase().includes(filter.toLowerCase())
      )
    : products;

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              {!isFiltering ? (
                <>
                  Product Name
                  <IconButton onClick={() => setIsFiltering(true)} size="small">
                    <Search />
                  </IconButton>
                </>
              ) : (
                <TextField
                  value={filter}
                  onChange={handleFilterChange}
                  onBlur={() => setIsFiltering(false)}
                  autoFocus
                  placeholder="Filter by product name"
                />
              )}
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.productid}>
              <TableCell>{product.productid}</TableCell>
              <TableCell>{product.productname}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleEditOpen(product)}
                  variant="contained"
                  color="primary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(product.productid)}
                  variant="contained"
                  color="secondary"
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        style={{ marginTop: "10px" }}
      >
        Add Product
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill out the form.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Product Name"
            value={isEditing ? editProductName : newProductName}
            onChange={(e) => isEditing ? setEditProductName(e.target.value) : setNewProductName(e.target.value)}
            error={!!validationError}
            helperText={validationError}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={isEditing ? handleSave : handleCreate} color="primary">
            {isEditing ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductsTable;
