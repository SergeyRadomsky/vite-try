import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../../store/users/reducer';
import { fetchRolesStart, fetchRolesSuccess, fetchRolesError } from '../../../store/roles/reducer';
import { selectUserRoles, selectRolesLoading, selectRolesError } from '../../../store/roles/selector';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { selectUsers } from '../../../store/users/selector';

// Функция для получения ВСЕХ ролей с сервера
const fetchRoles = async () => {
  const response = await fetch('/api/roles'); 
  if (!response.ok) {
    throw new Error('Error fetching roles');
  }
  return response.json();
};

const UserTable: React.FC = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const roles = useSelector(selectUserRoles);
  const loadingRoles = useSelector(selectRolesLoading);
  const errorRoles = useSelector(selectRolesError);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const hasFetchedUsers = useRef(false);
  const hasFetchedRoles = useRef(false);

  useEffect(() => {
    if (!hasFetchedUsers.current) {
      dispatch(fetchUsers());
      hasFetchedUsers.current = true;
    }
    if (!hasFetchedRoles.current) {
      dispatch(fetchRolesStart());
      fetchRoles()
        .then((roles) => dispatch(fetchRolesSuccess(roles)))
        .catch((error) => dispatch(fetchRolesError(error.message)));
      hasFetchedRoles.current = true;
    }
  }, [dispatch]);

  const handleOpen = (user: any = null) => {
    setCurrentUser(user ? { ...user, roles: user.Roles.map((role: any) => role.role) } : { username: '', email: '', password: '', Roles: [] });
    setIsEdit(!!user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser(null);
  };

  const handleSave = () => {
    const payload = {
      id: currentUser.id,
      username: currentUser.username,
      email: currentUser.email,
      Roles: currentUser.Roles 
    };

    if (isEdit) {
      dispatch(updateUser(payload));
    } else {
      dispatch(createUser(payload));
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    dispatch(deleteUser(id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const handleRolesChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const updatedRoles = e.target.value as string[];
    const newRoles = roles.filter(role => updatedRoles.includes(role.role)).map(role => ({ id: role.id, role: role.role }));
    setCurrentUser({ ...currentUser, Roles: newRoles });
  };

  if (loading || loadingRoles) return <Typography>Loading...</Typography>;
  if (error || errorRoles) return <Typography color="error">{error || errorRoles}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Roles</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users && users.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <ul>
                  {user.Roles && user.Roles.map((role: any) => (
                    <li key={role.id}>{role.role}</li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpen(user)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(user.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add User
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            name="username"
            value={currentUser?.username || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={currentUser?.email || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            select
            margin="dense"
            label="Roles"
            name="roles"
            value={currentUser?.Roles.map((role: any) => role.role) || []}
            onChange={handleRolesChange}
            fullWidth
            SelectProps={{
              multiple: true,
            }}
          >
            {roles.map((role: any) => (
              <MenuItem key={role.id} value={role.role}>
                {role.role}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            {isEdit ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserTable;
