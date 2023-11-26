import React, { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Route } from "react-router-dom";

const PrivateRoute = ({ children, ...rest }) => {
  const { initialized, keycloak } = useKeycloak();
  console.log(initialized, keycloak.authenticated);
  useEffect(() => {
    if (initialized) {
      if (!keycloak.authenticated) {
        keycloak.login();
      }
    }
  });
  if (keycloak.authenticated) {
    return <Route {...rest}>{children}</Route>;
  }
  return null;
};

export default PrivateRoute;
