import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PhotoSelectionScreen from "../screens/PhotoSelectionScreen";
import RatingScreen from "../screens/RatingScreen";
import CommentsScreen from "../screens/CommentsScreen";
import ConfigurationScreen from "../screens/admin/ConfigurationScreen";
import InitialConfigurationScreen from "../screens/InitialConfigurationScreen";
import RatingsScreen from "../screens/admin/RatingsScreen";
import EmployeesScreen from "../screens/admin/EmployeesScreen";
import EmployeeScreen from "../screens/admin/EmployeeScreen";
import ThemeConfigurationScreen from "../screens/admin/ThemeConfigurationScreen";

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      id={undefined}
    >
      <Stack.Screen name="Home" component={PhotoSelectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Rating" component={RatingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Comments" component={CommentsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Configuration" component={ConfigurationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="InitialConfiguration" component={InitialConfigurationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Ratings" component={RatingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Employees" component={EmployeesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Employee" component={EmployeeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Theme" component={ThemeConfigurationScreen} options={{ headerShown: false }} /> 
    </Stack.Navigator>
  );
};

export default AppNavigator;