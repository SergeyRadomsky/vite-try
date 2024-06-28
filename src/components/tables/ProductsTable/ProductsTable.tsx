import React, { useEffect, useState } from "react";
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
  const [isAdding, setIsAdding] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCreate = () => {
    if (validateProductName(newProductName)) {
      dispatch(createProduct({ productid: 0, productname: newProductName }));
      setNewProductName("");
      setIsAdding(false);
      setValidationError(null);
    } else {
      setValidationError("Invalid product name");
    }
  };

  const handleEdit = (product: Product) => {
    setEditId(product.productid);
    setEditProductName(product.productname);
    setValidationError(null);
  };

  const handleSave = (productid: number) => {
    if (validateProductName(editProductName)) {
      console.log("editProductName ", productid);
      
      dispatch(updateProduct({ productid, productname: editProductName }));
      setEditId(null);
      setValidationError(null);
    } else {
      setValidationError("Invalid product name");
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setValidationError(null);
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
              {/* <TableCell>
                {editId === product.productid ? (
                  <TextField value={product.productid} disabled />
                ) : (
                  product.productid
                )}
              </TableCell> */}
              <TableCell>{product.productid}</TableCell>
              <TableCell>
                {editId === product.productid ? (
                  <TextField
                    value={editProductName}
                    onChange={(e) => setEditProductName(e.target.value)}
                    error={!!validationError}
                    helperText={validationError}
                  />
                ) : (
                  product.productname
                )}
              </TableCell>
              <TableCell>
                {editId === product.productid ? (
                  <>
                    <IconButton
                      onClick={() => handleSave(product.productid)}
                      color="primary"
                    >
                      <Check />
                    </IconButton>
                    <IconButton onClick={handleCancel} color="secondary">
                      <Close />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => handleEdit(product)}
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
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
          {isAdding && (
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <TextField
                  placeholder="Enter new product name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  error={!!validationError}
                  helperText={validationError}
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={handleCreate} color="primary">
                  <Check />
                </IconButton>
                <IconButton
                  onClick={() => setIsAdding(false)}
                  color="secondary"
                >
                  <Close />
                </IconButton>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {!isAdding && (
        <Button
          onClick={() => setIsAdding(true)}
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
        >
          Add Product
        </Button>
      )}
    </div>
  );
};

export default ProductsTable;
