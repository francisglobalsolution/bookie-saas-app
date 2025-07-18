import React from "react";
import { render } from "@testing-library/react-native";
import TabTwoScreen from "../(tabs)/explore";
import { UserProvider } from "../../components/UserContext";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

describe("TabTwoScreen", () => {
  it("renders without crashing", () => {
    render(
      <UserProvider>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Explore" component={TabTwoScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </UserProvider>,
    );
  });
});
