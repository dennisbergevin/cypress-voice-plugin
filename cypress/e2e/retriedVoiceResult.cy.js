// Running the test in `cypress open` will allow you to check the assertion pass for the expected message
// The browser will not speak the message

describe("Voice on retries", () => {
  it(
    "Announces short retried test",
    {
      retries: 1,
      env: { voiceResultType: "detailed", voiceTime: false },
    },
    () => {
      // this test will fail on first try, but pass on second

      if (Cypress.currentRetry === 0) {
        expect(1).to.eq(2);
      } else {
        const synth = window.speechSynthesis;
        synth.speak = (event) => {
          const text = event.text;
          expect(text).to.eq(
            "Spec passed with retries: 1 test passed with retries."
          );
        };
      }
    }
  );
});
