import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Todo = {
  id: string;
  text: string;
  status: boolean;
};

export type Todos = Todo[];
export type TodosState = Todo[];

export enum ThemeVariants {
  dark = "dark",
  light = "light",
}

export enum peremLS {
  todosLS = "todosLS",
  ActualThemeLS = "ActualThemeLS",
}

const initialTodosList = JSON.parse(
  localStorage.getItem(peremLS.todosLS) || "[]"
);

const initialTheme = JSON.parse(
  localStorage.getItem(peremLS.ActualThemeLS) || "light"
);

const initialState = {
  todosState: initialTodosList,
};

const todos = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodoAction: (state: TodosState, {payload: text} : PayloadAction<string>) => ({
      // payload:
    })
    
  },
});

export const {} = todos.actions;

export default todos.reducer;
