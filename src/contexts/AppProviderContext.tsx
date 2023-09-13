import React, { createContext, useState } from "react";

type AppProviderContextProps = {
  children: React.ReactNode;
};

export const AppContext = createContext({});

const AppProviderContext: React.FC<AppProviderContextProps> = ({
  children,
}) => {
  const [loadingBarProgress, setLoadingBarProgress] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <AppContext.Provider
      value={{
        isOpen,
        setIsOpen,
        loadingBarProgress,
        setLoadingBarProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export default AppProviderContext;
