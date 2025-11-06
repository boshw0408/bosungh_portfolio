/**
 * Image Hover Overlay Utility
 * Populates tools in the hover overlay for project/experience images
 */

import { projectDetails } from '../data/projectDetails.js';

/**
 * Initialize image hover overlays with tools data
 */
export function initializeImageHoverOverlays() {
  // Find all image wrappers with data-project-id
  const imageWrappers = document.querySelectorAll('.section-image-wrapper[data-project-id]');
  
  imageWrappers.forEach(wrapper => {
    const projectId = wrapper.getAttribute('data-project-id');
    const toolsWrapper = wrapper.querySelector('.overlay-tools-wrapper');
    
    if (!toolsWrapper || !projectId) return;
    
    // Get project details
    const project = projectDetails[projectId];
    if (!project || !project.tools || project.tools.length === 0) return;
    
    // Get first 5 tools
    const firstFiveTools = project.tools.slice(0, 5);
    const remainingToolsCount = project.tools.length - 5;
    
    // Clear existing tools (if any)
    toolsWrapper.innerHTML = '';
    
    // Create tool elements for first 5
    firstFiveTools.forEach(tool => {
      const toolElement = document.createElement('div');
      toolElement.className = 'tool';
      toolElement.textContent = tool;
      toolsWrapper.appendChild(toolElement);
    });
    
    // Add "+X more" indicator if there are more tools
    if (remainingToolsCount > 0) {
      const moreIndicator = document.createElement('div');
      moreIndicator.className = 'tool tool-more';
      moreIndicator.textContent = `+${remainingToolsCount} more`;
      toolsWrapper.appendChild(moreIndicator);
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeImageHoverOverlays);
} else {
  // DOM already loaded
  initializeImageHoverOverlays();
}

