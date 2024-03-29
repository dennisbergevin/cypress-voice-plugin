// Running the test in `cypress open` will allow you to check the assertion pass for the expected message
// The browser will not speak the message

describe("Passing voice", () => {
  it(
    "Announces passed test",
    { env: { voiceResultType: "simple", voiceTime: false } },
    () => {
      const synth = window.speechSynthesis;
      synth.speak = (event) => {
        const char = event.text;

        expect(char).to.eq("Spec passed.");
      };
    }
  );
});
