import React from "react";
import { render } from "@testing-library/react-native";
import HomeScreen from "../(tabs)/index";
import { UserProvider } from "../../components/UserContext";
import { NavigationContainer } from "@react-navigation/native";

describe("HomeScreen", () => {
  it("renders without crashing", () => {
    render(
      <UserProvider>
        <NavigationContainer>
          <HomeScreen />
        </NavigationContainer>
      </UserProvider>,
    );
  });
});
