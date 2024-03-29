// Running the test in `cypress open` will allow you to check the assertion pass for the expected message
// The browser will not speak the message

describe("Voice time", () => {
  it(
    "Announces short passing test with only time",
    { env: { voiceTime: true, voiceResultType: false } },
    () => {
      const synth = window.speechSynthesis;
      synth.speak = (event) => {
        const text = event.text;
        expect(text).to.eq("Total time: Less than 1 second.");
      };
    }
  );
});
