import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import useUser from "../hooks/useUser";

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  return user ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
