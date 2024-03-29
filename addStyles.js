export const addStyles = () => {
  const hasStyles = top?.document.querySelector("#rateStyle");
  const hasRate = top?.document.querySelector("#rate");
  const hasPitch = top?.document.querySelector("#pitch");
  const hasVolume = top?.document.querySelector("#volume");

  const styles = `
    .reporter header {
        overflow: visible;
        z-index: 2;
      }
    .reporter label {
        background-color: inherit;
        color: inherit;
        font-weight: bold;
        font-size: 11px
      }
    #rate-control {
        display: flex;
        align-items: center;
      }
    #rate {
        position: relative;
        display: inline-block;
        overflow-block: auto;
        cursor: grab;
      }
      /* Apply a "closed-hand" cursor during drag operation. */
    #rate:active {
        cursor: grabbing;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
      }
    #pitch-control {
        display: flex;
        align-items: center;
      }
    #pitch {
        position: relative;
        display: inline-block;
        overflow-block: auto;
        cursor: grab;
      }
      /* Apply a "closed-hand" cursor during drag operation. */
    #pitch:active {
        cursor: grabbing;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
      }
    #volume-control {
        display: flex;
        align-items: center;
      }
    #volume {
        position: relative;
        display: inline-block;
        overflow-block: auto;
        cursor: grab;
      }
      /* Apply a "closed-hand" cursor during drag operation. */
    #volume:active {
        cursor: grabbing;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
      }
      `;
  // Add styles
  if (!hasStyles) {
    const reporter = top?.document.querySelector("#unified-reporter");
    const reporterStyle = document.createElement("style");
    reporterStyle.setAttribute("id", "rateStyle");
    reporterStyle.innerHTML = styles;
    reporter?.appendChild(reporterStyle);
  }

  if (!hasRate && !hasPitch && !hasVolume) {
    const header = top?.document.querySelector("#unified-reporter header");
    const headerRateSliderDiv = document.createElement("div");
    const headerRateSliderLabel = document.createElement("label");
    const headerRateSliderInput = document.createElement("input");

    headerRateSliderLabel.setAttribute("for", "rate");
    headerRateSliderLabel.innerText = "Voice rate: ";
    headerRateSliderDiv.setAttribute("id", "rate-control");

    headerRateSliderInput.setAttribute("id", "rate");
    headerRateSliderInput.setAttribute("step", "0.1");
    headerRateSliderInput.setAttribute("value", "1");
    headerRateSliderInput.setAttribute("max", "1.3");
    headerRateSliderInput.setAttribute("min", "0.3");
    headerRateSliderInput.setAttribute("type", "range");
    headerRateSliderInput.setAttribute("aria-valuenow", "1");
    headerRateSliderInput.setAttribute("aria-label", "Voice rate of speed");
    headerRateSliderInput.setAttribute("aria-valuetext", "Normal voice rate");

    header?.appendChild(headerRateSliderDiv);
    headerRateSliderDiv?.appendChild(headerRateSliderLabel);
    headerRateSliderDiv?.appendChild(headerRateSliderInput);

    const headerPitchSliderDiv = document.createElement("div");
    const headerPitchSliderLabel = document.createElement("label");
    const headerPitchSliderInput = document.createElement("input");

    headerPitchSliderLabel.setAttribute("for", "pitch");
    headerPitchSliderLabel.innerText = "Voice pitch: ";
    headerPitchSliderDiv.setAttribute("id", "pitch-control");

    headerPitchSliderInput.setAttribute("id", "pitch");
    headerPitchSliderInput.setAttribute("step", "0.1");
    headerPitchSliderInput.setAttribute("value", "1");
    headerPitchSliderInput.setAttribute("max", "1.3");
    headerPitchSliderInput.setAttribute("min", "0.3");
    headerPitchSliderInput.setAttribute("type", "range");
    headerPitchSliderInput.setAttribute("aria-valuenow", "1");
    headerPitchSliderInput.setAttribute("aria-label", "Voice pitch");
    headerPitchSliderInput.setAttribute("aria-valuetext", "Normal voice pitch");

    header?.appendChild(headerPitchSliderDiv);
    headerPitchSliderDiv?.appendChild(headerPitchSliderLabel);
    headerPitchSliderDiv?.appendChild(headerPitchSliderInput);

    const headerVolumeSliderDiv = document.createElement("div");
    const headerVolumeSliderLabel = document.createElement("label");
    const headerVolumeSliderInput = document.createElement("input");

    headerVolumeSliderLabel.setAttribute("for", "volume");
    headerVolumeSliderLabel.innerText = "Voice volume: ";
    headerVolumeSliderDiv.setAttribute("id", "volume-control");

    headerVolumeSliderInput.setAttribute("id", "volume");
    headerVolumeSliderInput.setAttribute("step", "0.1");
    headerVolumeSliderInput.setAttribute("value", "1");
    headerVolumeSliderInput.setAttribute("max", "1");
    headerVolumeSliderInput.setAttribute("min", "0");
    headerVolumeSliderInput.setAttribute("type", "range");
    headerVolumeSliderInput.setAttribute("aria-valuenow", "1");
    headerVolumeSliderInput.setAttribute("aria-label", "Voice volume");
    headerVolumeSliderInput.setAttribute(
      "aria-valuetext",
      "Normal voice volume"
    );

    header?.appendChild(headerVolumeSliderDiv);
    headerVolumeSliderDiv?.appendChild(headerVolumeSliderLabel);
    headerVolumeSliderDiv?.appendChild(headerVolumeSliderInput);
  }
};
