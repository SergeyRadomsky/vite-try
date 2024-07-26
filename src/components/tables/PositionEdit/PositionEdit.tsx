import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  fetchPositionById,
  updatePosition,
} from "../../../store/positions/reducer";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import { startLoading, stopLoading } from "../../../store/Loader/reducer";

const PositionEdit: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const position = useSelector((state: RootState) =>
    state.positions.data.find((pos) => pos.id === parseInt(id || "0"))
  );
  const loading = useSelector((state: RootState) => state.positions.loading);
  const error = useSelector((state: RootState) => state.positions.error);

  const [PositionEditName, setPositionEditName] = useState(
    position?.positionname || ""
  );
  const [editSalaryCoeff, setEditSalaryCoeff] = useState<string>(
    position?.salarycoeff ? position.salarycoeff.toString() : ""
  );
  const [editNotes, setEditNotes] = useState(position?.notes || "");
  const [editStatus, setEditStatus] = useState(position?.status || false);
  const [editDate, setEditDate] = useState<string>(
    position?.date ? new Date(position.date).toISOString().split("T")[0] : ""
  );

  const [errors, setErrors] = useState({
    positionname: "",
    salarycoeff: "",
    notes: "",
    date: "",
  });

  useEffect(() => {
    if (!position && id) {
      dispatch(fetchPositionById(parseInt(id)));
    }
  }, [dispatch, id, position]);

  useEffect(() => {
    if (position) {
      setPositionEditName(position.positionname);
      setEditSalaryCoeff(position.salarycoeff ? position.salarycoeff.toString() : "");
      setEditNotes(position.notes || "");
      setEditStatus(position.status || false);
      setEditDate(position.date ? new Date(position.date).toISOString().split("T")[0] : "");
    }
  }, [position]);

  useEffect(() => {
    console.log(error, loading);
    if (error || loading) {
      dispatch(startLoading());
    } else {
      dispatch(stopLoading());
    }
  }, [error, loading]);


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
  
    if (!PositionEditName) {
      newErrors.positionname = "Position name is required";
    } else if (hasNumbers.test(PositionEditName)) {
      newErrors.positionname = "Position name can't contain numbers";
    }
  
    if (editSalaryCoeff === '') {
      newErrors.salarycoeff = "Salary coefficient can't be empty";
    } else if (hasLetters.test(editSalaryCoeff.toString())) {
      newErrors.salarycoeff = "Salary coefficient can't contain letters";
    } else if (parseFloat(editSalaryCoeff) <= 0) {
      newErrors.salarycoeff = "Salary coefficient must be greater than 0";
    }
  
    if (editNotes.trim() === "" && editNotes !== "") {
      newErrors.notes = "Notes can't consist only of spaces";
    } else if (editNotes.length > 250) {
      newErrors.notes = "Notes can't be longer than 250 characters";
    }
  
    if (!editDate) {
      newErrors.date = "Date is required";
    } else if (editDate < currentDate) {
      newErrors.date = "Date can't be in the past";
    }
  
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  

  const handleSave = () => {
    if (validate()) {
      if (position) {
        dispatch(
          updatePosition({
            id: position.id,
            positionname: PositionEditName,
            salarycoeff: parseFloat(editSalaryCoeff),
            notes: editNotes,
            status: editStatus,
            date: new Date(editDate), // Ensure date is not null
          })
        ).then(() => {
          navigate("/positions");
        });
      }
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Edit Position
      </Typography>
      <TextField
        label="Position Name"
        value={PositionEditName}
        onChange={(e) => setPositionEditName(e.target.value)}
        error={!!errors.positionname}
        helperText={errors.positionname}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Salary Coefficient"
        type="number"
        value={editSalaryCoeff}
        onChange={(e) => setEditSalaryCoeff(e.target.value)}
        error={!!errors.salarycoeff}
        helperText={errors.salarycoeff}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Notes"
        value={editNotes}
        multiline
        onChange={(e) => setEditNotes(e.target.value)}
        error={!!errors.notes}
        helperText={errors.notes}
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={editStatus}
            onChange={(e) => setEditStatus(e.target.checked)}
          />
        }
        label="Status"
      />
      <TextField
        type="date"
        value={editDate}
        onChange={(e) => setEditDate(e.target.value)}
        error={!!errors.date}
        helperText={errors.date}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
      <Link href="/positions">
        <Button variant="contained" color="primary">
          Close
        </Button>
      </Link>
    </div>
  );
};

export default PositionEdit;
