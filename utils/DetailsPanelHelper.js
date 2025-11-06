/**
 * Helper to make DetailsPanel functions globally available
 * for use in inline onclick handlers
 */

import { openDetails } from './DetailsPanel.js';

// Export to make it available globally
export { openDetails };

/**
 * Open details panel with automatic slide direction detection
 * @param {string} projectId - The ID of the project/experience
 * @param {HTMLElement} button - The button that was clicked (optional)
 */
window.openDetailsPanel = function(projectId, event) {
  let slideDirection = 'right'; // Default for works
  
  // Get the button element from the event
  const button = event ? event.target || event.currentTarget : null;
  
  // Try to determine slide direction from button's parent section
  if (button) {
    // Find the closest section element
    let section = button.closest('section');
    if (section) {
      // Check if it's a left section (experiences) or right section (works)
      if (section.classList.contains('left') || section.classList.contains('third-section')) {
        slideDirection = 'left';
      } else if (section.classList.contains('right') || section.classList.contains('second-section')) {
        slideDirection = 'right';
      }
    }
  }
  
  openDetails(projectId, slideDirection);
};
