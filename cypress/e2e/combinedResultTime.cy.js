// Running the test in `cypress open` will allow you to check the assertion pass for the expected message
// The browser will not speak the message

describe("Voice result and time", () => {
  it(
    "Announces short passing test with result and time",
    { env: { voiceResultType: "detailed", voiceTime: true } },
    () => {
      const synth = window.speechSynthesis;
      synth.speak = (event) => {
        const text = event.text;
        expect(text).to.eq(
          "Spec passed: 1 test passed. Total time: Less than 1 second."
        );
      };
    }
  );
});
