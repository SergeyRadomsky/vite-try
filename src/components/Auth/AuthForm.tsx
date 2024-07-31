import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TextField, Button, MenuItem } from "@mui/material";
import {
  fetchRolesError,
  fetchRolesStart,
  fetchRolesSuccess,
} from "../../store/roles/reducer";
import { selectUserRoles } from "../../store/roles/selector";
import { loginUser, registerUser } from "../../store/Auth/reducer";
// import { SelectIsLoadingLoader } from "../../store/Loader/selector";
import { stopLoading } from "../../store/Loader/reducer";
import s from "./authform.module.scss";

// Функция для получения ролей с сервера
const fetchRoles = async () => {
  const response = await fetch("/api/roles");
  if (!response.ok) {
    throw new Error("Error fetching roles");
  }
  return response.json();
};

const AuthForm = ({ isLogin }: { isLogin: boolean }) => {
  const [authForm, setAuthForm] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roles = useSelector(selectUserRoles);
  const hasFetchedRoles = useRef(false);

  useEffect(() => {
    if (!hasFetchedRoles.current) {
      dispatch(fetchRolesStart());

      fetchRoles()
        .then((roles) => dispatch(fetchRolesSuccess(roles)))
        .catch((error) => dispatch(fetchRolesError(error.message)));
      hasFetchedRoles.current = true;
    }
  }, [dispatch]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        dispatch(stopLoading());
        navigate("/employees");
      })
      .catch((error: any) => {
        console.error("Error during authentication");
        console.error(error);
        if (error.errors) {
          const newErrors: { [key: string]: string } = {};
          error.errors.forEach((err: any) => {
            newErrors[err.path] = err.msg;
          });
          setErrors(newErrors);
        }
      });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser({ username, email, password, roles: selectedRoles }))
      .unwrap()
      .then(() => {
        dispatch(stopLoading());
        navigate("/employees");
      })
      .catch((error: any) => {
        console.error(error);
        if (error.errors) {
          const newErrors: { [key: string]: string } = {};
          error.errors.forEach((err: any) => {
            newErrors[err.path] = err.msg;
          });
          setErrors(newErrors);
        }
      });
  };

  const handleChangeForm = (authForm : boolean) => {
    setAuthForm(!authForm);
    setErrors({});
  }

  return (
    <div>
      <h1>{authForm ? "Authorization" : "Registration"}</h1>
      <form className={s.formOfAuth}>
        {!authForm && (
          <TextField
            className={s.textFieldReg}
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
            error={!!errors.username}
            helperText={errors.username}
            InputLabelProps={{ className: s.label }}
            InputProps={{
              className: s.input,
            }}
          />
        )}
        <TextField
          className={s.textFieldReg}
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          error={!!errors.email}
          helperText={errors.email}
          InputProps={{
            className: s.input,
          }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            className: s.input,
          }}
        />
        {!authForm && (
          <TextField
            select
            label="roles"
            value={selectedRoles}
            onChange={(e) =>
              setSelectedRoles(e.target.value as unknown as number[])
            }
            fullWidth
            SelectProps={{
              multiple: true,
            }}
            InputProps={{
              className: s.input,
            }}
            error={!!errors.roles}
            helperText={errors.roles}
          >
            {roles.map((role: any) => (
              <MenuItem key={role.id} value={role.id}>
                {role.role}
              </MenuItem>
            ))}
          </TextField>
        )}
        <div className={s.authBtns}>
          <Button
            type="submit"
            onClick={authForm ? handleSignIn : handleSignUp}
            variant="contained"
            color="primary"
          >
            {authForm ? "Login" : "Register"}
          </Button>
          <Button onClick={() => handleChangeForm(authForm)}>
            {authForm ? "registration" : "already have an account"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
