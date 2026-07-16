import { render } from "@testing-library/react-native";

import HomeScreen from "../app/(main)/index";

describe("HomeScreen", () => {
  it("renders the app title", async () => {
    const { getByText } = await render(<HomeScreen />);

    expect(getByText("HCMS")).toBeTruthy();
  });
});
