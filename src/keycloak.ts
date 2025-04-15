import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://keycloak.farmeasytechnologies.com/auth',  
  realm: 'farm-infinity-realm-dev',           
  clientId: '001',        
});

export default keycloak;
``