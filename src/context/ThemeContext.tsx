import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { getCompany } from "../queries/CompanyQueries";

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

const defaultTheme: Theme = {
  primary: "#3498db",
  secondary: "#2ecc71",
  background: "#e2e2e2ff",
  text: "#000000",
};

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  reloadTheme: () => void;
}>({
  theme: defaultTheme,
  setTheme: () => {},
  reloadTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const fetchTheme = async () => {
    try {
      const companyName = await SecureStore.getItemAsync("companyName");
      const companyInfo = await getCompany(companyName);
      console.log("Company info: " + JSON.stringify(companyInfo?.data));
      const companyTheme = companyInfo?.data?.theme;
      if (!companyTheme) {
        console.log("No theme found for company, using default.");
        setTheme(defaultTheme);
      } else {
        console.log("Applying theme: ", companyTheme);
        setTheme(JSON.parse(companyTheme));
      }
    } catch (err) {
      console.error("Failed to fetch theme:", err);
    }
  };

  // fetch colors dynamically
  useEffect(() => {
    fetchTheme();
  }, []);

  const reloadTheme = () => {
    fetchTheme();
  };

  return <ThemeContext.Provider value={{ theme, setTheme, reloadTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
