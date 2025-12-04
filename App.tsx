import { useEffect } from "react";
import { ThemeProvider } from "./src/context/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

export default function App() {
  useEffect(() => {
    activateKeepAwakeAsync();
    
    return () => {
      deactivateKeepAwake();
    };
  }, []);

  return (
    <NavigationContainer>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </NavigationContainer>
  );
}
