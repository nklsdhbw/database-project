
import React, { useState } from "react";
  
export const Context = React.createContext();
export const ContextProvider = ({ children }) => {
    //const [items, setItems] = useState(0);
    const [updateData, setUpdateData] = useState(false);
    return (
        <Context.Provider value={{ updateData, setUpdateData }}>
            {children}
        </Context.Provider>
    );
};