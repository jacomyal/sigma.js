import floatColor from "../floatColor";

describe("The Float Color utils", () => {
  it("can map hex colors to numeric values", () => {
    const inputs = [
      "#FF0",
      "#D1D1D1",
      "#d1d1d1",
      "rgb(234, 245, 298)",
      "rgba(234, 245, 298, 0.1)",
      "rgba(234, 245, 298, .1)"
    ];

    const outputs = [
      16776960,
      13750737,
      13750737,
      15398442,
      15398442,
      15398442
    ];

    inputs.forEach((input, i) => {
      expect(floatColor(input)).toEqual(outputs[i]);
    });
  });
});
