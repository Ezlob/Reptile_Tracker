import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './pages/Home';
import { SignUp } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Reptile } from './pages/Reptile';
import { CreateReptile } from './pages/CreateReptile';
import { SignIn } from './pages/Signin';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  }, {
    path: "/signup",
    element: <SignUp />
  }, {
    path: "/dashboard",
    element: <Dashboard />
  }, {
    path: "/reptiles/:id",
    element: <Reptile />
  }, {
    path: "/createReptile",
    element: <CreateReptile />
  }, {
    path: "/signin",
    element: <SignIn />
  }
])

export const App = () =>{
  return (
    <RouterProvider router={router} />
  )
}