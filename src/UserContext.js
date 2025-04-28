import React from 'react';

const UserContext = React.createContext();

const UserProvider = UserContext.Provider;

export { UserProvider };  // Exporting UserProvider as a named export
export default UserContext;
