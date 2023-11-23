import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Meals from "./pages/Meals";
import Share from "./pages/Share";
import Profile from "./pages/Profile";
import ViewPost from "./components/posts/ViewPost";
import Navbar from "./components/layout/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Edit from "./pages/Edit";

function App() {
  return (
    <>
      <Toaster />
      <Router>
        <RoutesWithTransition />
      </Router>
    </>
  );

  function RoutesWithTransition() {
    const location = useLocation();

    return (
      <AnimatePresence mode="wait" initial={false}>
        <Routes key={location.pathname}>
          <Route
            path="/"
            element={
              <Navbar>
                <Home />
              </Navbar>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/meals"
            element={
              <Navbar>
                <Meals />
              </Navbar>
            }
          />
          <Route
            path="/share"
            element={
              <Navbar>
                <Share />
              </Navbar>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <Navbar>
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              </Navbar>
            }
          />
          <Route
            path="/view/:postID"
            element={
              <Navbar>
                <ViewPost />
              </Navbar>
            }
          />
          <Route
            path="/edit/:postID"
            element={
              <Navbar>
                <Edit />
              </Navbar>
            }
          />
        </Routes>
      </AnimatePresence>
    );
  }
}

export default App;
