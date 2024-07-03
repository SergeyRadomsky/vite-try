import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import {
  fetchStores,
  createStore,
  updateStore,
  deleteStore,
  Store,
} from "../../../store/stores/reducer";
import { fetchEmployees } from "../../../store/employees/reducer";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Chip,
} from "@mui/material";
import { Check, Close, Search } from "@mui/icons-material";

const StoresTable: React.FC = () => {
  const dispatch = useDispatch();
  const stores = useSelector((state: RootState) => state.stores.data);
  const employees = useSelector((state: RootState) => state.employees.data);
  const loading = useSelector((state: RootState) => state.stores.loading);
  const error = useSelector((state: RootState) => state.stores.error);

  const [editId, setEditId] = useState<number | null>(null);
  const [editStoreName, setEditStoreName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editDirectorId, setEditDirectorId] = useState<number | null>(null);
  const [newStoreName, setNewStoreName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newDirectorId, setNewDirectorId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [directorError, setDirectorError] = useState<string | null>(null);
  const [filterStoreName, setFilterStoreName] = useState("");
  const [filterAddress, setFilterAddress] = useState("");
  const [filterDirectorId, setFilterDirectorId] = useState<number | null>(null);
  const [isStoreNameFilterActive, setIsStoreNameFilterActive] = useState(false);
  const [isAddressFilterActive, setIsAddressFilterActive] = useState(false);
  const [isDirectorFilterActive, setIsDirectorFilterActive] = useState(false);

  useEffect(() => {
    dispatch(fetchStores());
    dispatch(fetchEmployees({limit: 0, offset: 0}));
  }, [dispatch]);

  const handleCreate = () => {
    if (
      validateStoreName(newStoreName) &&
      validateAddress(newAddress) &&
      validateDirectorId(newDirectorId)
    ) {
      dispatch(
        createStore({
          storename: newStoreName,
          address: newAddress,
          directorid: newDirectorId,
        })
      );
      setNewStoreName("");
      setNewAddress("");
      setNewDirectorId(null);
      setIsAdding(false);
      setValidationError(null);
      setDirectorError(null);
    } else {
      if (!validateStoreName(newStoreName) || !validateAddress(newAddress)) {
        setValidationError("Invalid store name or address");
      }
      if (!validateDirectorId(newDirectorId)) {
        setDirectorError("Director is required");
      } else {
        setDirectorError(null);
      }
    }
  };


  const handleEdit = (store: Store) => {
    setEditId(store.storeid);
    setEditStoreName(store.storename);
    setEditAddress(store.address);
    setEditDirectorId(store.directorid);
    setValidationError(null);
  };

  const handleSave = (id: number) => {
    if (validateStoreName(editStoreName) && validateAddress(editAddress) && validateDirectorId(editDirectorId)) {
      const directorId = editDirectorId ?? 0;
      dispatch(
        updateStore({
          storeid: id,
          storename: editStoreName,
          address: editAddress,
          directorid: directorId,
        })
      )
        .then(() => {
          setEditId(null);
          setValidationError(null);
          setDirectorError(null); // Clear director error
        })
        .catch((error: any) => {
          setValidationError("Failed to update store");
          console.error(error);
        });
    } else {
      if (!validateStoreName(editStoreName) || !validateAddress(editAddress)) {
        setValidationError("Invalid store name or address");
      }
      if (!validateDirectorId(editDirectorId)) {
        setDirectorError("Director is required");
      } else {
        setDirectorError(null);
      }
    }
  };
  
  const handleCancel = () => {
    setEditId(null);
    setValidationError(null);
  };

  const validateStoreName = (name: string) => {
    return name.trim().length > 0 && isNaN(Number(name));
  };

  const validateAddress = (address: string) => {
    return address.trim().length > 0;
  };

  const validateDirectorId = (id: number | null) => {
    return id !== null && id !== 0 && id !== '';
  };

  const handleDelete = (storeid: number) => {
    const store = stores.find((store) => store.storeid === storeid);
    if (store) {
      console.log(store);
    }
    dispatch(deleteStore(storeid));
  };

  const handleDeleteFilter = (filterType: string) => {
    if (filterType === "StoreName") {
      setFilterStoreName("");
    } else if (filterType === "Address") {
      setFilterAddress("");
    } else if (filterType === "Director") {
      setFilterDirectorId(null);
      setDirectorError(null);
    }
  };

  const filteredStores = stores.filter(
    (store) =>
      (filterStoreName ? store.storename.includes(filterStoreName) : true) &&
      (filterAddress ? store.address.includes(filterAddress) : true) &&
      (filterDirectorId ? store.directorid === filterDirectorId : true)
  );

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Stores
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              {isStoreNameFilterActive ? (
                <TextField
                  placeholder="Filter by store name"
                  value={filterStoreName}
                  onChange={(e) => setFilterStoreName(e.target.value)}
                  onBlur={() => setIsStoreNameFilterActive(false)}
                  autoFocus
                />
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  Store Name
                  <IconButton
                    onClick={() => setIsStoreNameFilterActive(true)}
                    size="small"
                  >
                    <Search />
                  </IconButton>
                </div>
              )}
            </TableCell>
            <TableCell>
              {isAddressFilterActive ? (
                <TextField
                  placeholder="Filter by address"
                  value={filterAddress}
                  onChange={(e) => setFilterAddress(e.target.value)}
                  onBlur={() => setIsAddressFilterActive(false)}
                  autoFocus
                />
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  Address
                  <IconButton
                    onClick={() => setIsAddressFilterActive(true)}
                    size="small"
                  >
                    <Search />
                  </IconButton>
                </div>
              )}
            </TableCell>
            <TableCell>
              {isDirectorFilterActive ? (
                <FormControl fullWidth>
                  <InputLabel id="director-filter-label">Director</InputLabel>
                  <Select
                    labelId="director-filter-label"
                    id="director-filter-select"
                    value={filterDirectorId || ""}
                    onChange={(e) =>
                      setFilterDirectorId(e.target.value as number)
                    }
                    onBlur={() => setIsDirectorFilterActive(false)}
                    autoFocus
                  >
                    {/* <MenuItem value="">
                      <em>None</em>
                    </MenuItem> */}
                    {[
                      ...new Set(
                        employees.data.map((employee) => employee.employeeid)
                      ),
                    ].map((uniqueId) => {
                      const employee = employees.data.find(
                        (emp) => emp.employeeid === uniqueId
                      );
                      return (
                        <MenuItem
                          key={employee?.employeeid}
                          value={employee?.employeeid}
                        >
                          {`${employee?.surname} ${employee?.firstname[0]}.${employee?.lastname[0]}.`}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  Director
                  <IconButton
                    onClick={() => setIsDirectorFilterActive(true)}
                    size="small"
                  >
                    <Search />
                  </IconButton>
                </div>
              )}
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredStores.map((store) => (
            <TableRow key={store.storeid}>
              <TableCell>{store.storeid}</TableCell>
              <TableCell>
                {editId === store.storeid ? (
                  <TextField
                    value={editStoreName}
                    onChange={(e) => setEditStoreName(e.target.value)}
                    error={!!validationError}
                    helperText={validationError}
                  />
                ) : (
                  store.storename
                )}
              </TableCell>
              <TableCell>
                {editId === store.storeid ? (
                  <TextField
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    error={!!validationError}
                    helperText={validationError}
                  />
                ) : (
                  store.address
                )}
              </TableCell>
              <TableCell>
                {editId === store.storeid ? (
                  <FormControl fullWidth error={!!directorError}>
  <InputLabel id="director-label">Director</InputLabel>
  <Select
    labelId="director-label"
    id="director-select"
    value={editDirectorId || ""}
    onChange={(e) => setEditDirectorId(e.target.value as number)}
    error={!!directorError}
  >
    <MenuItem value="">
      <em>None</em>
    </MenuItem>
    {employees.data.map((employee) => (
      <MenuItem
        key={employee.employeeid}
        value={employee.employeeid}
      >
        {`${employee.surname} ${employee.firstname[0]}.${employee.lastname[0]}.`}
      </MenuItem>
    ))}
  </Select>
  {directorError && (
    <FormHelperText>{directorError}</FormHelperText>
  )}
</FormControl>


                ) : store.directorid &&
                  employees.data.find(
                    (emp) => emp.employeeid === store.directorid
                  ) ? (
                  `${
                    employees.data.find((emp) => emp.employeeid === store.directorid)
                      ?.surname
                  } ${
                    employees.data.find((emp) => emp.employeeid === store.directorid)
                      ?.firstname[0]
                  }.${
                    employees.data.find((emp) => emp.employeeid === store.directorid)
                      ?.lastname[0]
                  }.`
                ) : (
                  "None"
                )}
              </TableCell>
              <TableCell>
                {editId === store.storeid ? (
                  <>
                    <IconButton
                      onClick={() => handleSave(store.storeid)}
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
                      onClick={() => handleEdit(store)}
                      variant="contained"
                      color="primary"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(store.storeid)}
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
                  placeholder="Enter new store name"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  error={!!validationError}
                  helperText={validationError}
                />
              </TableCell>
              <TableCell>
                <TextField
                  placeholder="Enter new address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  error={!!validationError}
                  helperText={validationError}
                />
              </TableCell>
              <TableCell>
                <FormControl fullWidth error={!!directorError}>
                  <InputLabel id="new-director-label">Director</InputLabel>
                  <Select
                    labelId="new-director-label"
                    id="new-director-select"
                    value={newDirectorId || ""}
                    onChange={(e) => setNewDirectorId(e.target.value as number)}
                    error={!!validationError}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {employees.data.map((employee) => (
                      <MenuItem
                        key={employee.employeeid}
                        value={employee.employeeid}
                      >
                        {`${employee.surname} ${employee.firstname[0]}.${employee.lastname[0]}.`}
                      </MenuItem>
                    ))}
                  </Select>
                  {directorError && (
                    <FormHelperText>{directorError}</FormHelperText>
                  )}
                </FormControl>
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
          Add Store
        </Button>
      )}

      <div style={{ marginTop: "20px" }}>
        <Typography variant="h6">Active Filters:</Typography>
        {filterStoreName && (
          <Chip
            label={`Store Name: ${filterStoreName}`}
            onDelete={() => handleDeleteFilter("StoreName")}
            style={{ margin: "5px" }}
          />
        )}
        {filterAddress && (
          <Chip
            label={`Address: ${filterAddress}`}
            onDelete={() => handleDeleteFilter("Address")}
            style={{ margin: "5px" }}
          />
        )}
        {filterDirectorId && (
          <Chip
            label={`Director: ${
              employees.data.find((emp) => emp.employeeid === filterDirectorId)
                ?.surname
            }`}
            onDelete={() => handleDeleteFilter("Director")}
            style={{ margin: "5px" }}
          />
        )}
      </div>
    </div>
  );
};

export default StoresTable;
