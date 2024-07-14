import React, { useEffect, useRef, useState } from "react";
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
  // IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
// import { Check, Close, Search } from "@mui/icons-material";
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
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] = useState({
    firstname: "",
    lastname: "",
    surname: "",
    bod: "",
    positionid: "",
    storeid: "",
    general: "",
  });
  const [filterFirstname, setFilterFirstname] = useState("");
  const [filterLastname, setFilterLastname] = useState("");
  const [filterSurname, setFilterSurname] = useState("");
  const [filterStoreId, setFilterStoreId] = useState<number | null>(null);
  const [filterPositionId, setFilterPositionId] = useState<number | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [page, setPage] = useState(0);
  const hasFetched = useRef(false); // Новый флаг для предотвращения дублирования запроса


  useEffect(() => {
    if (!hasFetched.current) {
    dispatch(fetchEmployees({ limit: rowsPerPage, offset: page * rowsPerPage }));
    dispatch(fetchStores());
    dispatch(fetchPositions());
    hasFetched.current = true;
    }
  }, [dispatch, page, rowsPerPage]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setNewFirstname("");
    setNewLastname("");
    setNewSurname("");
    setNewBod("");
    setNewPositionId(null);
    setNewStoreId(null);
    setValidationError({
      firstname: "",
      lastname: "",
      surname: "",
      bod: "",
      positionid: "",
      storeid: "",
      general: "",
    });
    setIsEditing(false);
  };

  const validate = () => {
    const newErrors = {
      firstname: "",
      lastname: "",
      surname: "",
      bod: "",
      positionid: "",
      storeid: "",
      general: "",
    };

    if (!validateName(newFirstname)) newErrors.firstname = "Firstname is required";
    if (!validateName(newLastname)) newErrors.lastname = "Lastname is required";
    if (!validateName(newSurname)) newErrors.surname = "Surname is required";
    if (!validateBod(newBod)) newErrors.bod = "Valid Date of Birth is required";
    if (!validateId(newPositionId)) newErrors.positionid = "Position is required";
    if (!validateId(newStoreId)) newErrors.storeid = "Store is required";

    setValidationError(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleCreate = () => {
    if (validate()) {
      dispatch(
        createEmployee({
          firstname: newFirstname,
          lastname: newLastname,
          surname: newSurname,
          bod: new Date(newBod),
          positionid: newPositionId!,
          storeid: newStoreId!,
        })
      ).then(() => {
        handleClose();
      });
    }
  };

  const handleEditOpen = (employee: Employee) => {
    setEditId(employee.employeeid);
    setEditFirstname(employee.firstname);
    setEditLastname(employee.lastname);
    setEditSurname(employee.surname);
    setEditBod(employee.bod.toString().split("T")[0]);
    setEditPositionId(employee.positionid);
    setEditStoreId(employee.storeid);
    setIsEditing(true);
    handleOpen();
  };

  const validateEdit = () => {
    const newErrors = {
      firstname: "",
      lastname: "",
      surname: "",
      bod: "",
      positionid: "",
      storeid: "",
      general: "",
    };

    if (!validateName(editFirstname)) newErrors.firstname = "Firstname is required";
    if (!validateName(editLastname)) newErrors.lastname = "Lastname is required";
    if (!validateName(editSurname)) newErrors.surname = "Surname is required";
    if (!validateBod(editBod)) newErrors.bod = "Valid Date of Birth is required";
    if (!validateId(editPositionId)) newErrors.positionid = "Position is required";
    if (!validateId(editStoreId)) newErrors.storeid = "Store is required";

    setValidationError(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSave = () => {
    if (validateEdit() && editId !== null) {
      dispatch(
        updateEmployee({
          employeeid: editId,
          firstname: editFirstname,
          lastname: editLastname,
          surname: editSurname,
          bod: new Date(editBod).toISOString().slice(0, 10),
          positionid: editPositionId!,
          storeid: editStoreId!,
        })
      ).then(() => {
        handleClose();
      }).catch((error: any) => {
        setValidationError({ ...validationError, general: "Failed to update employee" });
        console.error(error);
      });
    }
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
              <TableCell>{employee.firstname}</TableCell>
              <TableCell>{employee.lastname}</TableCell>
              <TableCell>{employee.surname}</TableCell>
              <TableCell>{employee.bod.toString().split("T")[0]}</TableCell>
              <TableCell>{employee.position?.positionname || "N/A"}</TableCell>
              <TableCell>{employee.store?.storename || "N/A"}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleEditOpen(employee)}
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
        Add Employee
      </Button>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Edit Employee" : "Add New Employee"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill out the form.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Firstname"
            value={isEditing ? editFirstname : newFirstname}
            onChange={(e) => isEditing ? setEditFirstname(e.target.value) : setNewFirstname(e.target.value)}
            error={!!validationError.firstname}
            helperText={validationError.firstname}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Lastname"
            value={isEditing ? editLastname : newLastname}
            onChange={(e) => isEditing ? setEditLastname(e.target.value) : setNewLastname(e.target.value)}
            error={!!validationError.lastname}
            helperText={validationError.lastname}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Surname"
            value={isEditing ? editSurname : newSurname}
            onChange={(e) => isEditing ? setEditSurname(e.target.value) : setNewSurname(e.target.value)}
            error={!!validationError.surname}
            helperText={validationError.surname}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Date of Birth"
            type="date"
            value={isEditing ? editBod : newBod}
            onChange={(e) => isEditing ? setEditBod(e.target.value) : setNewBod(e.target.value)}
            error={!!validationError.bod}
            helperText={validationError.bod}
            fullWidth
          />
          <FormControl fullWidth error={!!validationError.positionid} margin="dense">
            <InputLabel id="position-label">Position</InputLabel>
            <Select
              labelId="position-label"
              value={isEditing ? editPositionId || "" : newPositionId || ""}
              onChange={(e) => isEditing ? setEditPositionId(e.target.value as number) : setNewPositionId(e.target.value as number)}
            >
              {positions.map((position) => (
                <MenuItem key={position.id} value={position.id}>
                  {position.positionname}
                </MenuItem>
              ))}
            </Select>
            {validationError.positionid && <FormHelperText>{validationError.positionid}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth error={!!validationError.storeid} margin="dense">
            <InputLabel id="store-label">Store</InputLabel>
            <Select
              labelId="store-label"
              value={isEditing ? editStoreId || "" : newStoreId || ""}
              onChange={(e) => isEditing ? setEditStoreId(e.target.value as number) : setNewStoreId(e.target.value as number)}
            >
              {stores.map((store) => (
                <MenuItem key={store.storeid} value={store.storeid}>
                  {store.storename}
                </MenuItem>
              ))}
            </Select>
            {validationError.storeid && <FormHelperText>{validationError.storeid}</FormHelperText>}
          </FormControl>
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

export default EmployeesTable;
