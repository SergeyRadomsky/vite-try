import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTableData } from '../../../store/tableSlice';
import { RootState } from '../../../store/store';
import { Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Typography, TextField, Button, IconButton, Menu, MenuItem, TablePagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { findSourceMap } from 'module';

interface DynamicTableProps {
  tableName: string;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ tableName }) => {
  const dispatch = useDispatch();
  const { data, columns, loading, error } = useSelector((state: RootState) => state.table);
  const [filter, setFilter] = useState<{ [key: string]: string }>({});
  const [editColumn, setEditColumn] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newRow, setNewRow] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedRow, setEditedRow] = useState<any>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<{ column: string, order: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    console.log('Fetching data', tableName);
    dispatch(fetchTableData(tableName));
  }, [dispatch, tableName]);

  const handleFilterChange = (column: string, value: string) => {
    setFilter((prevFilter) => ({ ...prevFilter, [column]: value }));
  };

  const handleDoubleClick = (column: string) => {
    setEditColumn(column);
    setFilterValue(filter[column] || '');
  };

  const handleFilterSubmit = (column: string) => {
    handleFilterChange(column, filterValue);
    setEditColumn(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, column: string) => {
    if (e.key === 'Enter') {
      handleFilterSubmit(column);
    }
  };

  const handleDeleteRecord = async (id: any) => {
    console.log(`Deleting record with id: ${id}`);
    try {
      const response = await fetch(`/api/${tableName}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        dispatch(fetchTableData(tableName));
      } else {
        console.error('Failed to delete record');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleDeleteFilter = (column: string) => {
    setFilter((prevFilter) => {
      const newFilter = { ...prevFilter };
      delete newFilter[column];
      return newFilter;
    });
    if (sortOrder && sortOrder.column === column) {
      setSortOrder(null);
    }
  };

  const handleDeleteAllFilters = () => {
    setFilter({});
    setSortOrder(null);
  };

  const handleAddNewRowClick = () => {
    setNewRow({});
    setIsAdding(true);
  };

  const handleNewRowChange = (column: string, value: string | number) => {
    setNewRow((prevNewRow: any) => ({ ...prevNewRow, [column]: value }));
  };

  const handleAddRecord = async () => {
    try {
      console.log(newRow);
  
      const { firstname, lastname, surname, positionid, storeid, positionname, productname, storename, address, directorid } = newRow ?? {};
      let validationErrors = {};
  
      if (tableName === 'employees') {
        if (firstname) {
          if (firstname.length > 15) {
            validationErrors.firstname = 'Должно быть не более 15 символов в длину';
          } else if (/\d/.test(firstname)) {
            validationErrors.firstname = 'Имя не должно содержать цифры';
          }
        } else {
          validationErrors.firstname = 'Это поле обязательно для заполнения';
        }
  
        if (lastname) {
          if (lastname.length > 15) {
            validationErrors.lastname = 'Должно быть не более 15 символов в длину';
          } else if (/\d/.test(lastname)) {
            validationErrors.lastname = 'Имя не должно содержать цифры';
          }
        } else {
          validationErrors.lastname = 'Это поле обязательно для заполнения';
        }
  
        if (surname) {
          if (surname.length > 15) {
            validationErrors.surname = 'Должно быть не более 15 символов в длину';
          } else if (/\d/.test(surname)) {
            validationErrors.surname = 'Имя не должно содержать цифры';
          }
        } else {
          validationErrors.surname = 'Это поле обязательно для заполнения';
        }
        if (positionid) {
          if (positionid.length > 15) {
            validationErrors.positionid = 'Должно быть не более 15 символов в длину';
          } else if (!/^\d+$/.test(positionid)) {
            validationErrors.positionid = 'Имя не должно содержать символы';	
          }
        } else {
          validationErrors.positionid = 'Это поле обязательно для заполнения';
        }
        if (storeid) {
          if (storeid.length > 15) {
            validationErrors.storeid = 'Должно быть не более 15 символов в длину';
          } else if (!/^\d+$/.test(storeid)) {
            validationErrors.storeid = 'Имя не должно содержать символы';	
          }
        } else {
          validationErrors.storeid = 'Это поле обязательно для заполнения';
        }
      }
  
      if (tableName === 'positions') {
        if (positionname) {
          if (positionname.length > 15) {
            validationErrors.positionname = 'Должно быть не более 15 символов в длину';
          } else if (/\d/.test(positionname)) {
            validationErrors.positionname = 'Имя не должно содержать цифры';
          } else {
            const existingPosition = data.find((row: any) => row.positionname === positionname);
            if (existingPosition) {
              validationErrors.positionname = 'Уже есть такая запись';
            }
          }
        } else {
          validationErrors.positionname = 'Это поле обязательно для заполнения';
        }
      }
  
      if (tableName === 'products') {
        if (productname) {
          if (productname.length > 15) {
            validationErrors.productname = 'Должно быть не более 15 символов в длину';
          } else if (/\d/.test(productname)) {
            validationErrors.productname = 'Имя не должно содержать цифры';
          } else {
            const existingProduct = data.find((row: any) => row.productname === productname);
            if (existingProduct) {
              validationErrors.productname = 'Уже есть такая запись';
            }
          }
        } else {
          validationErrors.productname = 'Это поле обязательно для заполнения';
        }
      }

      if (tableName === 'stores') {
        if (storename) {
          if (storename.length > 15) {
            validationErrors.storename = 'Должно быть не более 50 символов в длину';
          } else if (/\d/.test(storename)) {
            validationErrors.storename = 'Имя не должно содержать цифры';
          }
        } else {
          validationErrors.storename = 'Это поле обязательно для заполнения';
        }
  
        if (address) {
          if (address.length > 15) {
            validationErrors.address = 'Должно быть не более 50 символов в длину';
          } else if (/\d/.test(address)) {
            validationErrors.address = 'Имя не должно содержать цифры';
          }
        } else {
          validationErrors.address = 'Это поле обязательно для заполнения';
        }
  
        if (directorid) {
          if (directorid.length > 15) {
            validationErrors.directorid = 'Должно быть не более 15 символов в длину';
          } else if (!/^\d+$/.test(directorid)) {
            validationErrors.directorid = 'Имя не должно содержать символы';
          }
        } else {
          validationErrors.directorid = 'Это поле обязательно для заполнения';
        }
      }
      
  
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
  
      setErrors({});
  
      const response = await fetch(`/api/${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      });
  
      if (response.ok) {
        dispatch(fetchTableData(tableName));
        setNewRow({});
        setIsAdding(false);
      } else {
        console.error('Failed to add new record');
      }
    } catch (error) {
      console.error('Error adding new record:', error);
    }
  };
  

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewRow({});
  };

  const handleEditRow = (rowIndex: number) => {
    setEditingRow(rowIndex);
    setEditedRow({ ...data[rowIndex] });
  };

  const handleEditRowChange = (column: string, value: string | number) => {
    setEditedRow((prevEditedRow: any) => ({ ...prevEditedRow, [column]: value }));
  };

  const handleSaveEdit = async (id: any) => {
    try {
      const response = await fetch(`/api/${tableName}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedRow),
      });
      if (response.ok) {
        dispatch(fetchTableData(tableName));
        setEditingRow(null);
        setEditedRow({});
      } else {
        console.error('Failed to update record');
      }
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditedRow({});
  };

  const handleColumnMenuClick = (event: React.MouseEvent<HTMLButtonElement>, column: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedColumn(column);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedColumn(null);
  };

  const handleStringFilterSelect = (value: string) => {
    handleFilterChange(selectedColumn!, value);
    handleMenuClose();
  };

  const handleSort = (order: 'asc' | 'desc') => {
    setSortOrder({ column: selectedColumn!, order });
    handleMenuClose();
  };

  const sortedData = sortOrder
    ? [...data].sort((a, b) => {
        if (sortOrder.order === 'asc') {
          return a[sortOrder.column] - b[sortOrder.column];
        } else {
          return b[sortOrder.column] - a[sortOrder.column];
        }
      })
    : data;

  const filteredData = sortedData.filter((row: any) =>
    columns.every((column) =>
      typeof filter[column] === 'string'
        ? row[column].toString().toLowerCase().includes(filter[column]!.toLowerCase())
        : true
    )
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const firstColumn = columns[0];

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {tableName.charAt(0).toUpperCase() + tableName.slice(1)}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column}>
                <Typography onDoubleClick={() => handleDoubleClick(column)}>
                  {column}
                  <IconButton onClick={(event) => handleColumnMenuClick(event, column)} size="small">
                    <ArrowDropDownIcon />
                  </IconButton>
                </Typography>
                {editColumn === column ? (
                  <TextField
                    value={filterValue}
                    variant="outlined"
                    size="small"
                    onChange={(e) => setFilterValue(e.target.value)}
                    onBlur={() => handleFilterSubmit(column)}
                    onKeyPress={(e) => handleKeyPress(e, column)}
                    autoFocus
                  />
                ) : null}
              </TableCell>
            ))}
            <TableCell>
              <IconButton onClick={handleAddNewRowClick}>
                <AddIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row: any, rowIndex: number) => (
              <TableRow key={rowIndex} onDoubleClick={() => handleEditRow(rowIndex)}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {editingRow === rowIndex ? (
                      column === firstColumn ? (
                        <TextField
                          value={editedRow[column] || ''}
                          variant="outlined"
                          size="small"
                          disabled
                        />
                      ) : (
                        <TextField
                          value={editedRow[column] || ''}
                          variant="outlined"
                          size="small"
                          onChange={(e) => handleEditRowChange(column, e.target.value)}
                        />
                      )
                    ) : (
                      row[column]
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {editingRow === rowIndex ? (
                    <>
                      <IconButton onClick={() => handleSaveEdit(row[firstColumn])}>
                        <CheckIcon />
                      </IconButton>
                      <IconButton onClick={handleCancelEdit}>
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton onClick={() => handleDeleteRecord(row[firstColumn])} size="small">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          {isAdding && (
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>
                  {column === 'storeid' && tableName === 'stores' ? (
                    <TextField value="auto" disabled variant="outlined" size="small" />
                  ) : column === 'employeeid' && tableName === 'employees' ? (
                    <TextField value="auto" disabled variant="outlined" size="small" />
                  ) : column === 'productid' && tableName === 'products' ? (
                    <TextField value="auto" disabled variant="outlined" size="small" />
                  ) : column === 'id' && tableName === 'positions' ? (
                    <TextField value="auto" disabled variant="outlined" size="small" />
                  ) : (
                    <TextField
                      value={newRow[column] || ''}
                      error={Boolean(errors[column])}
                      helperText={errors[column]}
                      variant="outlined"
                      size="small"
                      onChange={(e) => handleNewRowChange(column, e.target.value)}
                    />
                  )}
                </TableCell>
              ))}
              <TableCell>
                <IconButton onClick={handleAddRecord}>
                  <CheckIcon />
                </IconButton>
                <IconButton onClick={handleCancelAdd}>
                  <CancelIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <div style={{ marginTop: '20px' }}>
        <Typography variant="h6" display="inline">
          Active Filters:
        </Typography>
        <Button onClick={handleDeleteAllFilters} variant="outlined" color="secondary" size="small" style={{ marginLeft: '10px' }}>
          Delete all
        </Button>
        {Object.entries(filter).map(([column, value]) => (
          value && (
            <Typography key={column} style={{ display: 'flex', alignItems: 'center' }}>
              {column}: {value}
              <IconButton onClick={() => handleDeleteFilter(column)} size="small">
                <DeleteIcon />
              </IconButton>
            </Typography>
          )
        ))}
        {sortOrder && (
          <Typography style={{ display: 'flex', alignItems: 'center' }}>
            {sortOrder.column}: {sortOrder.order === 'asc' ? 'Min' : 'Max'}
            <IconButton onClick={() => handleDeleteFilter(sortOrder.column)} size="small">
              <DeleteIcon />
            </IconButton>
          </Typography>
        )}
      </div>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {selectedColumn && typeof data[0][selectedColumn] === 'string' ? (
          data
            .map((row: any) => row[selectedColumn])
            .filter((value: any, index: number, self: any[]) => self.indexOf(value) === index)
            .map((value: string, index: number) => (
              <MenuItem key={index} onClick={() => handleStringFilterSelect(value)}>
                {value}
              </MenuItem>
            ))
        ) : (
          <div style={{ padding: '8px' }}>
            <Button onClick={() => handleSort('asc')} fullWidth>
              Min
            </Button>
            <Button onClick={() => handleSort('desc')} fullWidth>
              Max
            </Button>
          </div>
        )}
      </Menu>
    </div>
  );
};

export default DynamicTable;
