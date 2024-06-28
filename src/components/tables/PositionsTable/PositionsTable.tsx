import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import {
  fetchPositions,
  createPosition,
  updatePosition,
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
} from "@mui/material";
import { Check, Close, ArrowDropDown } from "@mui/icons-material";

const PositionsTable: React.FC = () => {
  const dispatch = useDispatch();
  const positions = useSelector((state: RootState) => state.positions.data);
  const loading = useSelector((state: RootState) => state.positions.loading);
  const error = useSelector((state: RootState) => state.positions.error);

  const [editId, setEditId] = useState<number | null>(null);
  const [editPositionName, setEditPositionName] = useState("");
  const [newPositionName, setNewPositionName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    dispatch(fetchPositions());
  }, [dispatch]);

  const handleCreate = () => {
    if (validatePositionName(newPositionName)) {
      dispatch(createPosition({positionname: newPositionName }));
      setNewPositionName("");
      setIsAdding(false);
      setValidationError(null);
    } else {
      setValidationError("Invalid position name");
    }
  };

  const handleEdit = (position: Position) => {
    setEditId(position.id);
    setEditPositionName(position.positionname);
    setValidationError(null);
  };

  const handleSave = (id: number) => {
    if (validatePositionName(editPositionName)) {
      dispatch(updatePosition({ id, positionname: editPositionName }));
      setEditId(null);
      setValidationError(null);
    } else {
      setValidationError("Invalid position name");
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setValidationError(null);
  };

  const validatePositionName = (name: string) => {
    return name.trim().length > 0 && isNaN(Number(name));
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
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPositions.map((position) => (
            <TableRow key={position.id}>
              <TableCell>{position.id}</TableCell>

              {/* <TableCell>
                {editId === position.id ? (
                  <TextField value={position.id} disabled />
                ) : (
                  position.id
                )}
              </TableCell> */}

              <TableCell>
                {editId === position.id ? (
                  <TextField
                    value={editPositionName}
                    onChange={(e) => setEditPositionName(e.target.value)}
                    error={!!validationError}
                    helperText={validationError}
                  />
                ) : (
                  position.positionname
                )}
              </TableCell>
              <TableCell>
                {editId === position.id ? (
                  <>
                    <IconButton
                      onClick={() => handleSave(position.id)}
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
                      onClick={() => handleEdit(position)}
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
                  placeholder="Enter new position name"
                  value={newPositionName}
                  onChange={(e) => setNewPositionName(e.target.value)}
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
          Add Position
        </Button>
      )}
      {filter && (
        <div style={{ marginTop: "20px" }}>
          <Typography variant="subtitle1">Active Filters:</Typography>
          <Chip label={filter} onDelete={() => setFilter("")} />
        </div>
      )}
    </div>
  );
};

export default PositionsTable;
