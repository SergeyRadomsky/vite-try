import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TextField, Button, MenuItem } from "@mui/material";
import { fetchRolesError, fetchRolesStart, fetchRolesSuccess } from "../../store/roles/reducer";
import { selectUserRoles } from "../../store/roles/selector";
import { loginUser, registerUser } from "../../store/Auth/reducer";
import { SelectIsLoadingLoader } from "../../store/Loader/selector";
import { stopLoading } from "../../store/Loader/reducer";


// Функция для получения ролей с сервера
const fetchRoles = async () => {
  const response = await fetch('/api/roles'); 
  if (!response.ok) {
    throw new Error('Error fetching roles');
  }
  return response.json();
};

const AuthForm = ({ isLogin }: { isLogin: boolean }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roles = useSelector(selectUserRoles);
  const hasFetchedRoles = useRef(false);
  const isLoading = useSelector(SelectIsLoadingLoader);

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
        console.error("Error during authentication", error);
      });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser({ username, email, password, roles: selectedRoles }))
      .unwrap()
      .then(() => {
        dispatch(stopLoading());
        navigate("/employees");
        // dispatch(startLoading());
      })
      .catch((error: any) => {
        console.error("Error during registration", error);
      });
  };
  
  
  // const handleSignIn = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("/api/auth/login", {
  //       email,
  //       password,
  //     });
  //     console.log(response);
  //     localStorage.setItem("access-token", response.data.token);

  //     if (isLogin) {
  //       navigate("/");
  //     } else {
  //       navigate("/stores");
  //     }
  //   } catch (error) {
  //     console.error("Error during authentication", error);
  //   }
  // };

  // const handleSignUp = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("/api/auth/registration", {
  //       username,
  //       email,
  //       password,
  //       roles: selectedRoles,
  //     });
  //     localStorage.setItem("access-token", response.data.token);

  //     if (isLogin) {
  //       navigate("/");
  //     } else {
  //       navigate("/stores");
  //     }
  //   } catch (error) {
  //     console.error("Error during authentication", error);
  //   }
  // };

  return (
    <form>
      {!isLogin && (
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
        />
      )}
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
      />
      {!isLogin && (
        <TextField
          select
          label="Roles"
          value={selectedRoles}
          onChange={(e) => setSelectedRoles(e.target.value as unknown as number[])}
          fullWidth
          SelectProps={{
            multiple: true,
          }}
        >
          {roles.map((role: any) => (
            <MenuItem key={role.id} value={role.id}>
              {role.role}
            </MenuItem>
          ))}
        </TextField>
      )}
      <Button type="submit" onClick={!isLogin ? handleSignIn : handleSignUp} variant="contained" color="primary">
        {!isLogin ? "Login" : "Register"}
      </Button>
      <Button type="submit" onClick={isLogin ? handleSignIn : handleSignUp} variant="contained" color="primary">
        {isLogin ? "Login" : "Register"}
      </Button>
    </form>
  );
};

export default AuthForm;
