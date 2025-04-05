import { addStyles } from "./addStyles";

// Voice plugin to announce spec result when Cypress runner UI is open (cypress open)
if (
  (Cypress.env("voiceResultType") === "simple" ||
    Cypress.env("voiceResultType") === "detailed" ||
    Cypress.env("voiceTime")) &&
  Cypress.config("isInteractive")
) {
  // Cancel any ongoing spoken results when a new spec is selected mid-speech
  // Apply styles for voice rate slider bar
  Cypress.on("test:before:run", () => {
    const voice = window.speechSynthesis;
    voice.cancel();
    addStyles();
  });

  Cypress.on("window:unload", () => {
    const voice = window.speechSynthesis;
    voice.cancel();
  });

  Cypress.on("test:after:run", (config, test) => {
    // Additional context of test index
    // To account for loops where there is one test per describe and suite names may stay
    // And to account for both specs with multiple suites or only one suite
    const lastTestIndex = test.order;

    // Querying the headed Cypress browser to find number of total tests in spec
    const testNumber = window.top?.document.querySelectorAll(".test").length;

    // Checking the current test index is either equal to the last index of the suite or the test context
    const currentTestIsLast = lastTestIndex === testNumber;
    // Rate toggle for speed of spoken text
    const rate = window.top?.document.querySelector("#rate");

    // Pitch toggle for pitch of spoken text
    const pitch = window.top?.document.querySelector("#pitch");

    // Volume toggle for volume of spoken text
    const volume = window.top?.document.querySelector("#volume");

    function waitForElement(selector, callback) {
      const observer = new MutationObserver((mutations, observer) => {
        const element = window.top?.document.querySelector(selector);
        if (element) {
          observer.disconnect();
          callback(element);
        }
      });

      observer.observe(window.top?.document.body, {
        childList: true,
        subtree: true,
      });
    }
    // Checks within the document for a failure state
    const failed = window.top?.document.querySelector(".runnable-failed");
    // Checks within the document for a retried state to determine if retry occurred
    const retried = window.top?.document.querySelector(".runnable-retried");

    // Check test result count for passed, failed, skipped, retried
    // If count is 1, use singular
    function pluralizeWord(singularWord, pluralWord, count) {
      return count > 1 ? pluralWord : singularWord;
    }

    // Calculate total spec time in mm:ss from milliseconds
    // Taking total spec time from browser
    // Only return seconds if minutes are less than or equal to 0
    function specTime() {
      const specTime = window.top?.document.querySelector(
        '[data-cy="spec-duration"]',
      )?.textContent;
      const specSec = specTime?.slice(-2);
      const specMin = specTime?.slice(0, 2);

      // House single digit options
      // Check against captured minute and second so browser speechSynthesis does not announce the zero
      const singleDigit = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
      ];
      // If the captured minute or second matches one of the singleDigit values, remove the zero
      const singleMin = specTime?.slice(1, 2);
      const singleSec = specTime?.slice(-1);

      // Checking for undefined time if an immediate spec error occurs
      if (
        specTime?.includes("ms") ||
        specMin === undefined ||
        specSec === undefined
      ) {
        return "Less than 1 second.";
      } else if (specMin === "00") {
        if (singleDigit.includes(specSec)) {
          return (
            `${singleSec}` + pluralizeWord("second", "seconds", `${singleSec}`)
          );
        } else {
          return `${specSec} seconds`;
        }
      } else {
        if (singleDigit.includes(specMin) && singleDigit.includes(specSec)) {
          return (
            `${singleMin}` +
            pluralizeWord("minute", "minutes", `${singleMin}`) +
            " and " +
            `${singleSec} ` +
            pluralizeWord("second", "seconds", `${singleSec}`)
          );
        } else if (
          singleDigit.includes(specMin) &&
          !singleDigit.includes(specSec)
        ) {
          return (
            `${singleMin} ` +
            pluralizeWord("minute", "minutes", `${singleMin}`) +
            " and " +
            `${specSec} seconds.`
          );
        } else if (
          !singleDigit.includes(specMin) &&
          singleDigit.includes(specSec)
        ) {
          return (
            `${specMin} minutes and ${singleSec} ` +
            pluralizeWord("second", "seconds", `${singleSec}`)
          );
        } else return `${specMin} minutes and ${specSec} seconds.`;
      }
    }

    // Retrieve count of passed, failed, retried, and skipped tests
    function retrieveTestStats() {
      let failedTests = window.top?.document
        .querySelector(".failed")
        .innerText.replace("Failed:\n", "");

      const retriedTests = window.top?.document.querySelectorAll(
        ".test.runnable-passed.runnable-retried",
      ).length;

      let passedTests = window.top?.document
        .querySelector(".passed")
        .innerText.replace("Passed:\n", "");

      let skippedTests = window.top?.document
        .querySelector(".pending")
        .innerText.replace("Pending:\n", "");

      if (passedTests === "--") {
        passedTests = 0;
      } else {
        passedTests = parseInt(passedTests);
      }

      if (failedTests === "--") {
        failedTests = 0;
      } else {
        failedTests = parseInt(failedTests);
      }

      if (skippedTests === "--") {
        skippedTests = 0;
      } else {
        skippedTests = parseInt(skippedTests);
      }

      const stats = [
        `${passedTests - retriedTests}` +
          pluralizeWord(" test", " tests", `${passedTests - retriedTests}`) +
          " passed.",
        `${retriedTests}` +
          pluralizeWord(" test", " tests", `${retriedTests}`) +
          " passed with retries.",
        `${failedTests}` +
          pluralizeWord(" test", " tests", `${failedTests}`) +
          " failed.",
        `${skippedTests}` +
          pluralizeWord(" test", " tests", `${skippedTests}`) +
          " skipped.",
      ];
      // Filter out any zero counts and return a string for use in speechSynthesis
      const filteredStats = stats.filter((stat) => !stat.startsWith("0"));
      return `${filteredStats.toString()}`;
    }

    if (currentTestIsLast) {
      waitForElement(".restart", () => {
        // Perform actions on the element
        // Additional context of test index
        // To account for loops where there is one test per describe and suite names may stay
        // And to account for both specs with multiple suites or only one suite

        // Announce spec run result and/or total time based on provided environment variable(s)
        if (
          Cypress.env("voiceResultType") === "simple" &&
          !Cypress.env("voiceTime")
        ) {
          const message = new SpeechSynthesisUtterance(
            `Spec ${
              failed ? "failed." : retried ? "passed with retries." : "passed."
            }`,
          );
          message.rate = rate.value;
          message.pitch = pitch.value;
          message.volume = volume.value;
          speechSynthesis.speak(message);
        } else if (
          Cypress.env("voiceTime") &&
          !(Cypress.env("voiceResultType") === "simple") &&
          !(Cypress.env("voiceResultType") === "detailed")
        ) {
          const message = new SpeechSynthesisUtterance(
            "Total time: " + specTime(),
          );
          message.rate = rate.value;
          message.pitch = pitch.value;
          message.volume = volume.value;
          speechSynthesis.speak(message);
        } else if (
          Cypress.env("voiceResultType") === "detailed" &&
          !Cypress.env("voiceTime")
        ) {
          const message = new SpeechSynthesisUtterance(
            `Spec ${
              failed
                ? "failed: " + retrieveTestStats()
                : retried
                  ? "passed with retries: " + retrieveTestStats()
                  : "passed: " + retrieveTestStats()
            }`,
          );
          message.rate = rate.value;
          message.pitch = pitch.value;
          message.volume = volume.value;
          speechSynthesis.speak(message);
        } else if (
          Cypress.env("voiceResultType") === "simple" &&
          Cypress.env("voiceTime")
        ) {
          const message = new SpeechSynthesisUtterance(
            `Spec ${
              failed
                ? "failed. Total time: " + specTime()
                : retried
                  ? "passed with retries. Total time: " + specTime()
                  : "passed. Total time: " + specTime()
            }`,
          );
          message.rate = rate.value;
          message.pitch = pitch.value;
          message.volume = volume.value;
          speechSynthesis.speak(message);
        } else if (
          Cypress.env("voiceResultType") === "detailed" &&
          Cypress.env("voiceTime")
        ) {
          const message = new SpeechSynthesisUtterance(
            `Spec ${
              failed
                ? "failed: " +
                  retrieveTestStats() +
                  " Total time: " +
                  specTime()
                : retried
                  ? "passed with retries: " +
                    retrieveTestStats() +
                    ". Total time: " +
                    specTime()
                  : "passed: " +
                    retrieveTestStats() +
                    " Total time: " +
                    specTime()
            }`,
          );
          message.rate = rate.value;
          message.pitch = pitch.value;
          message.volume = volume.value;
          speechSynthesis.speak(message);
        }
      });
    }
  });
}
