import { ThemeProvider } from "./src/context/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </NavigationContainer>
  );
}
