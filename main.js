import "./style.css";
import Experience from "./Experience/Experience.js";
import "./utils/DetailsPanel.js"; // Initialize details panel
import "./utils/DetailsPanelHelper.js"; // Make openDetailsPanel globally available
import "./utils/ImageHoverOverlay.js"; // Initialize image hover overlays with tools

const experience = new Experience(document.querySelector(".experience-canvas"));
