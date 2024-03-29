// Running the test in `cypress open` will allow you to check the assertion pass for the expected message
// The browser will not speak the message

describe("Failing voice", () => {
  it(
    "Announces failed test without time",
    {
      env: {
        voiceResultType: "simple",
      },
    },
    () => {
      // Trigger a "Spec failed" TTS on failure
      cy.on("fail", () => {
        const message = new SpeechSynthesisUtterance("Spec failed.");
        speechSynthesis.speak(message);
      });

      cy.get("body", { timeout: 25 }).should("not.exist");

      const synth = window.speechSynthesis;

      synth.speak = (event) => {
        const char = event.text;

        expect(char).to.eq("Spec failed.");
      };
    }
  );
});
