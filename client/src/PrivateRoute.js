import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { Context } from "./context"; // Import your context file

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { token } = useContext(Context);

  return (
    <Route
      {...rest}
      render={(props) =>
        token ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
