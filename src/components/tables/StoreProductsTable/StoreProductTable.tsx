import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { fetchStores } from '../../../store/stores/reducer';
import { fetchProducts } from '../../../store/products/reducer';
import { fetchStoreProducts } from '../../../store/storeproducts/reducer';
import { selectProducts, selectStoreProducts, selectStores } from '../../../store/storeproducts/selector';

const StoreProductsTable: React.FC = () => {
  const dispatch = useDispatch();
  const { data: storeproducts, loading, error } = useSelector((state: RootState) => state.storeproducts);
  const stores = useSelector(selectStores);
  const products = useSelector(selectProducts);

  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchStores());
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const filters: any = {};
    if (selectedStoreId) filters.storeId = selectedStoreId;
    if (selectedProductId) filters.productId = selectedProductId;
    dispatch(fetchStoreProducts(filters));
  }, [dispatch, selectedStoreId, selectedProductId]);

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <FormControl style={{ marginRight: '10px', minWidth: 200 }}>
          <InputLabel id="store-filter-label">Store</InputLabel>
          <Select
            labelId="store-filter-label"
            value={selectedStoreId || ''}
            onChange={(e) => setSelectedStoreId(e.target.value as number)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {stores.map((store) => (
              <MenuItem key={store.storeid} value={store.storeid}>
                {store.storename}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ marginRight: '10px', minWidth: 200 }}>
          <InputLabel id="product-filter-label">Product</InputLabel>
          <Select
            labelId="product-filter-label"
            value={selectedProductId || ''}
            onChange={(e) => setSelectedProductId(e.target.value as number)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {products.map((product) => (
              <MenuItem key={product.productid} value={product.productid}>
                {product.productname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Store Name</TableCell>
            <TableCell>Product Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {storeproducts.map((sp) => (
            <TableRow key={`${sp.storeid}-${sp.productid}`}>
              <TableCell>{sp.store.storename}</TableCell>
              <TableCell>{sp.product.productname}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StoreProductsTable;
