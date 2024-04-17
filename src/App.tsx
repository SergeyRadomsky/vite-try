import { FC } from "react";
import { RouterProvider } from "react-router-dom";
import useRouter from "./router";

const App: FC = () => {
  const router = useRouter();

  return <RouterProvider router={router} />;
};
export default App;
