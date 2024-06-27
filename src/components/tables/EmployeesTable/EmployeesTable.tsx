import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, CircularProgress } from '@mui/material';
import { fetchEmployees } from '../../../store/employees/reducer';


const EmployeesTable: React.FC = () => {
  const dispatch = useDispatch();
  const { data: employees, loading, error } = useSelector((state: RootState) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Employees</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Firstname</TableCell>
            <TableCell>Lastname</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Store</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.employeeid}>
              <TableCell>{employee.firstname}</TableCell>
              <TableCell>{employee.lastname}</TableCell>
              <TableCell>{employee.position.positionname}</TableCell>
              <TableCell>{employee.store.storename}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeesTable;
