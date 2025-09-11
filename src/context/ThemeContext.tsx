import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { getCompany } from "../queries/CompanyQueries";
import { ConfigProperties } from "../utils/ConfigProperties";

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

const defaultTheme: Theme = {
  primary: "#54758b",
  secondary: "#2ecc71",
  background: "#cacaca",
  text: "#1d1d1d",
};

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  reloadTheme: () => void;
  logoUrl: string;
}>({
  theme: defaultTheme,
  setTheme: () => {},
  reloadTheme: () => {},
  logoUrl: "",
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [logoUrl, setLogoUrl] = useState("");

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
      const companyVersion = companyInfo?.data?.version;
      if (!companyVersion) {
        console.log("No version found for company, using default logo.");
        setLogoUrl("");
      } else {
        console.log(`Version ${companyVersion} for company ${companyName}`);
        const logoUrl = `${ConfigProperties.s3BucketUrl.replace(/\/$/, "")}/${companyName}/logo.png?v=${companyVersion}`;
        console.log("Logo URL: ", logoUrl);
        setLogoUrl(logoUrl);
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

  return (
    <ThemeContext.Provider value={{ theme, setTheme, reloadTheme, logoUrl }}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
