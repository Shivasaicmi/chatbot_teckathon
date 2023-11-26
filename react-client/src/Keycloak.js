import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:9080",
  realm: "executors",
  clientId: "executors",
});

export default keycloak;
