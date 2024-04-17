// import TodoList from './components/TodoList/TodoList';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './layout';
import Home from './pages/Home/Home';

const useRouter = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/Home',
          element: <Home />,
        },
        // {
        //   path: '/api-todos',
        //   element: <UnderList />,
        // },
        // {
        //   path: '/local-todos',
        //   element: (
        //     <RequireAuth >
        //       <TodoList />
        //     </RequireAuth>
        //   ),
        // },
        // {
        //   path: '/login',
        //   element: <LoginComp />,
        // },
      ],
    },
  ]);

  // const useRouter = () => {
  //   return (
  //     <BrowserRouter>
  //       <Routes>
  //         {/* <Route path="logoSVG/:logoSVG" element={<SVGComponent />} /> */}
  //         <Route path="/" element={<App />} />
  //         <Route path="/local-todos" element={<TodoList />} />
  //         <Route path="/api-todos" element={<UnderList />} />
  //       </Routes>
  //     </BrowserRouter>
  //   );
  // };

  return router;
};
export default useRouter;