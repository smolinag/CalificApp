import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PhotoSelectionScreen from "../screens/PhotoSelectionScreen";
import RatingScreen from "../screens/RatingScreen";
import CommentsScreen from "../screens/CommentsScreen";
import InitialConfigurationScreen from "../screens/InitialConfigurationScreen";
import ConfigurationScreen from "../screens/ConfigurationScreen";

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
      <Stack.Screen name="InitConfiguration" component={InitialConfigurationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Configuration" component={ConfigurationScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;