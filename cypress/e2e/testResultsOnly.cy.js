// Running the test in `cypress open` will allow you to check the assertion pass for the expected message
// The browser will not speak the message

describe("Test results only", () => {
  it(
    "Announces short passing test with only test results",
    { env: { voiceResultType: "detailed", voiceTime: false } },
    () => {
      const synth = window.speechSynthesis;
      synth.speak = (event) => {
        const text = event.text;
        expect(text).to.eq("Spec passed: 1 test passed.");
      };
    }
  );
});
