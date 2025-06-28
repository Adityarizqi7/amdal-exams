import { createContext, useContext } from "react";

const initialValue = {
    handleLogout: () => {},
};

const GlobalContext = createContext(initialValue);

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalContext;
