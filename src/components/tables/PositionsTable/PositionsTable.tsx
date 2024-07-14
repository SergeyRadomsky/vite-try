import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import {
  fetchPositions,
  createPosition,
  deletePosition,
  Position,
} from "../../../store/positions/reducer";
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
  MenuItem,
  Menu,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Check, Close, ArrowDropDown } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const PositionsTable: React.FC = () => {
  const dispatch = useDispatch();
  const positions = useSelector((state: RootState) => state.positions.data);
  const loading = useSelector((state: RootState) => state.positions.loading);
  const error = useSelector((state: RootState) => state.positions.error);

  const [newPositionName, setNewPositionName] = useState("");
  const [newSalaryCoeff, setNewSalaryCoeff] = useState<string>("1");
  const [newNotes, setNewNotes] = useState("");
  const [newStatus, setNewStatus] = useState(false);
  const [newDate, setNewDate] = useState<string>("");
  const [validationError, setValidationError] = useState({
    positionname: "",
    salarycoeff: "",
    notes: "",
    date: "",
  });
  const [filter, setFilter] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const hasFetched = useRef(false); // Новый флаг для предотвращения дублирования запроса

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchPositions());
      hasFetched.current = true;
    }
  }, [dispatch]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValidationError({
      positionname: "",
      salarycoeff: "",
      notes: "",
      date: "",
    });
  };

  const validate = () => {
    const newErrors = {
      positionname: "",
      salarycoeff: "",
      notes: "",
      date: "",
    };
    const hasNumbers = /\d/;
    const hasLetters = /[a-zA-Z]/;
    const currentDate = new Date().toISOString().split("T")[0];

    if (!newPositionName) {
      newErrors.positionname = "Position name is required";
    } else if (hasNumbers.test(newPositionName)) {
      newErrors.positionname = "Position name can't contain numbers";
    }

    if (newSalaryCoeff === "") {
      newErrors.salarycoeff = "Salary coefficient can't be empty";
    } else if (hasLetters.test(newSalaryCoeff)) {
      newErrors.salarycoeff = "Salary coefficient can't contain letters";
    } else if (parseFloat(newSalaryCoeff) <= 0) {
      newErrors.salarycoeff = "Salary coefficient must be greater than 0";
    }

    if (newNotes.trim() !== "" && newNotes !== "") {
      newErrors.notes = "Notes can't consist only of spaces";
    } else if (newNotes.length > 250) {
      newErrors.notes = "Notes can't be longer than 250 characters";
    }

    if (!newDate) {
      newErrors.date = "Date is required";
    } else if (newDate < currentDate) {
      newErrors.date = "Date can't be in the past";
    }

    setValidationError(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleCreate = () => {
    if (validate()) {
      dispatch(
        createPosition({
          positionname: newPositionName,
          salarycoeff: parseFloat(newSalaryCoeff),
          notes: newNotes,
          status: newStatus,
          date: new Date(newDate),
        })
      );
      setNewPositionName("");
      setNewSalaryCoeff("1");
      setNewNotes("");
      setNewStatus(false);
      setNewDate("");
      setOpen(false);
      setValidationError({
        positionname: "",
        salarycoeff: "",
        notes: "",
        date: "",
      });
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/positions/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    dispatch(deletePosition(id));
  };

  const handleFilterChange = (filterValue: string) => {
    setFilter(filterValue);
    setAnchorEl(null);
  };

  const filteredPositions = filter
    ? positions.filter((position) => position.positionname === filter)
    : positions;

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Positions
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              <div style={{ display: "flex", alignItems: "center" }}>
                Position Name
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <ArrowDropDown />
                </IconButton>
              </div>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={() => handleFilterChange("")}>
                  <em>None</em>
                </MenuItem>
                {positions.map((position) => (
                  <MenuItem
                    key={position.id}
                    onClick={() => handleFilterChange(position.positionname)}
                  >
                    {position.positionname}
                  </MenuItem>
                ))}
              </Menu>
            </TableCell>
            <TableCell>salarycoeff</TableCell>
            <TableCell>notes</TableCell>
            <TableCell>status</TableCell>
            <TableCell>date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPositions.map((position) => (
            <TableRow key={position.id}>
              <TableCell>{position.id}</TableCell>
              <TableCell>{position.positionname}</TableCell>
              <TableCell>{position.salarycoeff}</TableCell>
              <TableCell>{position.notes}</TableCell>
              <TableCell>{position.status ? "active" : "no"}</TableCell>
              <TableCell>
                {position.date
                  ? new Date(position.date).toLocaleDateString()
                  : ""}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleEdit(position.id)}
                  variant="contained"
                  color="primary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(position.id)}
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
        Add Position
      </Button>
      {filter && (
        <div style={{ marginTop: "20px" }}>
          <Typography variant="subtitle1">Active Filters:</Typography>
          <Chip label={filter} onDelete={() => setFilter("")} />
        </div>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Position</DialogTitle>
        <DialogContent>
          <DialogContentText>Fill out the form.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Position Name"
            value={newPositionName}
            onChange={(e) => setNewPositionName(e.target.value)}
            error={!!validationError.positionname}
            helperText={validationError.positionname}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Salary Coefficient"
            type="number"
            value={newSalaryCoeff}
            onChange={(e) => setNewSalaryCoeff(e.target.value)}
            error={!!validationError.salarycoeff}
            helperText={validationError.salarycoeff}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Notes"
            value={newNotes}
            multiline
            onChange={(e) => setNewNotes(e.target.value)}
            error={!!validationError.notes}
            helperText={validationError.notes}
            fullWidth
          />
          <TextField
            margin="dense"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            error={!!validationError.date}
            helperText={validationError.date}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newStatus}
                onChange={(e) => setNewStatus(e.target.checked)}
              />
            }
            label="Status"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PositionsTable;
