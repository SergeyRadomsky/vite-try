import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  TextField,
  Button,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  TablePagination,
} from "@mui/material";
import { Check, Close, Search } from "@mui/icons-material";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  Employee,
} from "../../../store/employees/reducer";
import { fetchStores } from "../../../store/stores/reducer";
import { fetchPositions } from "../../../store/positions/reducer";

const EmployeesTable: React.FC = () => {
  const dispatch = useDispatch();
  const { data: employeesData, loading, error } = useSelector(
    (state: RootState) => state.employees
  );
  const employees = employeesData.data;
  const totalCount = employeesData.count;

  const stores = useSelector((state: RootState) => state.stores.data);
  const positions = useSelector((state: RootState) => state.positions.data);

  const [editId, setEditId] = useState<number | null>(null);
  const [editFirstname, setEditFirstname] = useState("");
  const [editLastname, setEditLastname] = useState("");
  const [editSurname, setEditSurname] = useState("");
  const [editBod, setEditBod] = useState("");
  const [editPositionId, setEditPositionId] = useState<number | null>(null);
  const [editStoreId, setEditStoreId] = useState<number | null>(null);
  const [newFirstname, setNewFirstname] = useState("");
  const [newLastname, setNewLastname] = useState("");
  const [newSurname, setNewSurname] = useState("");
  const [newBod, setNewBod] = useState("");
  const [newPositionId, setNewPositionId] = useState<number | null>(null);
  const [newStoreId, setNewStoreId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [filterFirstname, setFilterFirstname] = useState("");
  const [filterLastname, setFilterLastname] = useState("");
  const [filterSurname, setFilterSurname] = useState("");
  const [filterStoreId, setFilterStoreId] = useState<number | null>(null);
  const [filterPositionId, setFilterPositionId] = useState<number | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchEmployees({ limit: rowsPerPage, offset: page * rowsPerPage}));
    dispatch(fetchStores());
    dispatch(fetchPositions());
  }, [dispatch, page, rowsPerPage]);

  const handleCreate = () => {
    if (
      validateName(newFirstname) &&
      validateName(newLastname) &&
      validateName(newSurname) &&
      validateBod(newBod) &&
      validateId(newPositionId) &&
      validateId(newStoreId)
    ) {
      dispatch(
        createEmployee({
          firstname: newFirstname,
          lastname: newLastname,
          surname: newSurname,
          bod: new Date(newBod),
          positionid: newPositionId!,
          storeid: newStoreId!,
        })
      );
      setNewFirstname("");
      setNewLastname("");
      setNewSurname("");
      setNewBod("");
      setNewPositionId(null);
      setNewStoreId(null);
      setIsAdding(false);
      setValidationError(null);
    } else {
      setValidationError("All fields are required");
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditId(employee.employeeid);
    setEditFirstname(employee.firstname);
    setEditLastname(employee.lastname);
    setEditSurname(employee.surname);
    setEditBod(employee.bod.toString().split("T")[0]);
    setEditPositionId(employee.positionid);
    setEditStoreId(employee.storeid);
    setValidationError(null);
  };

  const handleSave = (id: number) => {
    if (
      validateName(editFirstname) &&
      validateName(editLastname) &&
      validateName(editSurname) &&
      validateBod(editBod) &&
      validateId(editPositionId) &&
      validateId(editStoreId)
    ) {
      dispatch(
        updateEmployee({
          employeeid: id,
          firstname: editFirstname,
          lastname: editLastname,
          surname: editSurname,
          bod: new Date(editBod),
          positionid: editPositionId!,
          storeid: editStoreId!,
        })
      )
        .then(() => {
          setEditId(null);
          setValidationError(null);
        })
        .catch((error: any) => {
          setValidationError("Failed to update employee");
          console.error(error);
        });
    } else {
      setValidationError("All fields are required");
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setValidationError(null);
  };

  const validateName = (name: string) => {
    return name.trim().length > 0;
  };

  const validateBod = (bod: string) => {
    return !isNaN(Date.parse(bod));
  };

  const validateId = (id: number | null) => {
    return id !== null && id > 0;
  };

  const handleDelete = (employeeid: number) => {
    dispatch(deleteEmployee(employeeid));
  };

  const handleFilterToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      (filterFirstname ? employee.firstname.includes(filterFirstname) : true) &&
      (filterLastname ? employee.lastname.includes(filterLastname) : true) &&
      (filterSurname ? employee.surname.includes(filterSurname) : true) &&
      (filterStoreId ? employee.storeid === filterStoreId : true) &&
      (filterPositionId ? employee.positionid === filterPositionId : true)
  );

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Employees
      </Typography>
      {isFilterActive && (
        <div>
          <TextField
            label="Firstname"
            value={filterFirstname}
            onChange={(e) => setFilterFirstname(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <TextField
            label="Lastname"
            value={filterLastname}
            onChange={(e) => setFilterLastname(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <TextField
            label="Surname"
            value={filterSurname}
            onChange={(e) => setFilterSurname(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <FormControl style={{ marginRight: "10px", minWidth: 120 }}>
            <InputLabel id="filter-store-label">Store</InputLabel>
            <Select
              labelId="filter-store-label"
              id="filter-store"
              value={filterStoreId || ""}
              onChange={(e) => setFilterStoreId(e.target.value as number)}
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
          <FormControl style={{ marginRight: "10px", minWidth: 120 }}>
            <InputLabel id="filter-position-label">Position</InputLabel>
            <Select
              labelId="filter-position-label"
              id="filter-position"
              value={filterPositionId || ""}
              onChange={(e) => setFilterPositionId(e.target.value as number)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {positions.map((position) => (
                <MenuItem key={position.id} value={position.id}>
                  {position.positionname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
      <Button
        onClick={handleFilterToggle}
        variant="contained"
        color="primary"
        style={{ marginTop: "10px", marginBottom: "20px" }}
      >
        {isFilterActive ? "Hide Filters" : "Show Filters"}
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Firstname</TableCell>
            <TableCell>Lastname</TableCell>
            <TableCell>Surname</TableCell>
            <TableCell>D.o.B.</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Store</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredEmployees.map((employee) => (
            <TableRow key={employee.employeeid}>
              <TableCell>
                {editId === employee.employeeid ? (
                  <TextField
                    value={editFirstname}
                    onChange={(e) => setEditFirstname(e.target.value)}
                    error={!!validationError}
                    helperText={validationError}
                  />
                ) : (
                  employee.firstname
                )}
              </TableCell>
              <TableCell>
                {editId === employee.employeeid ? (
                  <TextField
                    value={editLastname}
                    onChange={(e) => setEditLastname(e.target.value)}
                    error={!!validationError}
                    helperText={validationError}
                  />
                ) : (
                  employee.lastname
                )}
              </TableCell>
              <TableCell>
                {editId === employee.employeeid ? (
                  <TextField
                    value={editSurname}
                    onChange={(e) => setEditSurname(e.target.value)}
                    error={!!validationError}
                    helperText={validationError}
                  />
                ) : (
                  employee.surname
                )}
              </TableCell>
              <TableCell>
                {editId === employee.employeeid ? (
                  <TextField
                    type="date"
                    value={editBod}
                    onChange={(e) => setEditBod(e.target.value)}
                    error={!!validationError}
                    helperText={validationError}
                  />
                ) : (
                  employee.bod.toString().split("T")[0]
                )}
              </TableCell>
              <TableCell>
                {editId === employee.employeeid ? (
                  <FormControl fullWidth error={!!validationError}>
                    <InputLabel id="edit-position-label">Position</InputLabel>
                    <Select
                      labelId="edit-position-label"
                      id="edit-position-select"
                      value={editPositionId || ""}
                      onChange={(e) =>
                        setEditPositionId(e.target.value as number)
                      }
                    >
                      {positions.map((position) => (
                        <MenuItem
                          key={position.id}
                          value={position.id}
                        >
                          {position.positionname}
                        </MenuItem>
                      ))}
                    </Select>
                    {validationError && (
                      <FormHelperText>{validationError}</FormHelperText>
                    )}
                  </FormControl>
                ) : (
                  employee.position?.positionname || "N/A"
                )}
              </TableCell>
              <TableCell>
                {editId === employee.employeeid ? (
                  <FormControl fullWidth error={!!validationError}>
                    <InputLabel id="edit-store-label">Store</InputLabel>
                    <Select
                      labelId="edit-store-label"
                      id="edit-store-select"
                      value={editStoreId || ""}
                      onChange={(e) => setEditStoreId(e.target.value as number)}
                    >
                      {stores.map((store) => (
                        <MenuItem key={store.storeid} value={store.storeid}>
                          {store.storename}
                        </MenuItem>
                      ))}
                    </Select>
                    {validationError && (
                      <FormHelperText>{validationError}</FormHelperText>
                    )}
                  </FormControl>
                ) : (
                  employee.store?.storename || "N/A"
                )}
              </TableCell>
              <TableCell>
                {editId === employee.employeeid ? (
                  <>
                    <IconButton
                      onClick={() => handleSave(employee.employeeid)}
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
                      onClick={() => handleEdit(employee)}
                      variant="contained"
                      color="primary"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(employee.employeeid)}
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
              <TableCell>
                <TextField
                  placeholder="Firstname"
                  value={newFirstname}
                  onChange={(e) => setNewFirstname(e.target.value)}
                  error={!!validationError}
                  helperText={validationError}
                />
              </TableCell>
              <TableCell>
                <TextField
                  placeholder="Lastname"
                  value={newLastname}
                  onChange={(e) => setNewLastname(e.target.value)}
                  error={!!validationError}
                  helperText={validationError}
                />
              </TableCell>
              <TableCell>
                <TextField
                  placeholder="Surname"
                  value={newSurname}
                  onChange={(e) => setNewSurname(e.target.value)}
                  error={!!validationError}
                  helperText={validationError}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="date"
                  placeholder="Date of Birth"
                  value={newBod}
                  onChange={(e) => setNewBod(e.target.value)}
                  error={!!validationError}
                  helperText={validationError}
                />
              </TableCell>
              <TableCell>
                <FormControl fullWidth error={!!validationError}>
                  <InputLabel id="new-position-label">Position</InputLabel>
                  <Select
                    labelId="new-position-label"
                    id="new-position-select"
                    value={newPositionId || ""}
                    onChange={(e) => setNewPositionId(e.target.value as number)}
                  >
                    {positions.map((position) => (
                      <MenuItem
                        key={position.id}
                        value={position.id}
                      >
                        {position.positionname}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationError && (
                    <FormHelperText>{validationError}</FormHelperText>
                  )}
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControl fullWidth error={!!validationError}>
                  <InputLabel id="new-store-label">Store</InputLabel>
                  <Select
                    labelId="new-store-label"
                    id="new-store-select"
                    value={newStoreId || ""}
                    onChange={(e) => setNewStoreId(e.target.value as number)}
                  >
                    {stores.map((store) => (
                      <MenuItem key={store.storeid} value={store.storeid}>
                        {store.storename}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationError && (
                    <FormHelperText>{validationError}</FormHelperText>
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
          Add Employee
        </Button>
      )}
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default EmployeesTable;
