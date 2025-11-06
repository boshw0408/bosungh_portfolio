/**
 * Details Panel Component
 * Handles sliding details panel from left (experiences) or right (works)
 */

import projectDetails from '../data/projectDetails.js'; // Path: utils/ -> data/

class DetailsPanel {
  constructor() {
    this.panel = null;
    this.overlay = null;
    this.currentSlideDirection = null;
    this.asscrollInstance = null;
    this.init();
  }

  init() {
    // Create the panel HTML structure
    const panelHTML = `
      <div id="details-overlay" class="details-overlay">
        <div id="details-panel" class="details-panel">
          <button id="details-close-btn" class="details-close-btn" aria-label="Close details">×</button>
          <div id="details-panel-content" class="details-panel-content"></div>
        </div>
      </div>
    `;

    // Insert panel into body
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // Get references
    this.panel = document.getElementById('details-panel');
    this.overlay = document.getElementById('details-overlay');
    this.content = document.getElementById('details-panel-content');
    const closeBtn = document.getElementById('details-close-btn');

    // Setup event listeners
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // Ensure panel can scroll independently - stop ASScroll from interfering
    this.panel.addEventListener('wheel', (e) => {
      e.stopPropagation(); // Prevent ASScroll from handling this
    }, { passive: false });

    this.panel.addEventListener('touchstart', (e) => {
      e.stopPropagation(); // Prevent ASScroll from handling this
    }, { passive: true });

    this.panel.addEventListener('touchmove', (e) => {
      e.stopPropagation(); // Prevent ASScroll from handling this
    }, { passive: true });
  }

  open(projectId, slideDirection = 'right') {
    const details = projectDetails[projectId];
    
    if (!details) {
      console.error(`Project details not found for id: ${projectId}`);
      return;
    }

    this.currentSlideDirection = slideDirection;
    this.renderContent(details);
    
    // Set slide direction class
    this.panel.className = `details-panel details-panel-${slideDirection}`;
    this.overlay.classList.add('active');
    
    // Store the scroll position if needed
    const pageWrapper = document.querySelector('.page-wrapper');
    if (pageWrapper) {
      this.scrollPosition = window.pageYOffset || pageWrapper.scrollTop || 0;
    }
    
    // Disable ASScroll by finding the Controls instance through Experience
    // ASScroll might be interfering with native scrolling
    try {
      const experienceEl = document.querySelector('.experience-canvas');
      if (experienceEl && experienceEl.experienceInstance) {
        const controls = experienceEl.experienceInstance.world?.controls;
        if (controls && controls.asscroll && controls.asscroll.disable) {
          this.asscrollInstance = controls.asscroll;
          this.asscrollInstance.disable();
        }
      }
    } catch (e) {
      console.log('Could not access ASScroll instance:', e);
    }
    
    // Trigger slide animation
    requestAnimationFrame(() => {
      this.panel.classList.add('active');
      
      // Prevent background from scrolling but allow panel to scroll
      const pageElement = document.querySelector('.page');
      if (pageElement) {
        pageElement.style.pointerEvents = 'none'; // Prevent interaction with background
      }
      
      // Reset panel scroll position when opening
      this.content.scrollTop = 0;
      this.panel.scrollTop = 0;
    });
  }

  close() {
    if (!this.isOpen()) return;

    this.panel.classList.remove('active');
    
    // Re-enable background page interaction
    const pageElement = document.querySelector('.page');
    if (pageElement) {
      pageElement.style.pointerEvents = '';
    }
    
    // Re-enable ASScroll if it was disabled
    if (this.asscrollInstance && this.asscrollInstance.enable) {
      setTimeout(() => {
        this.asscrollInstance.enable();
      }, 300);
    }
    
    // Wait for animation to complete before removing overlay
    setTimeout(() => {
      this.overlay.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
      document.documentElement.style.overflow = ''; // Restore html scrolling
    }, 300); // Match CSS transition duration
  }

  isOpen() {
    return this.overlay.classList.contains('active');
  }

  /**
   * Format content as bullet points
   * Expects content with explicit bullet markers (•, -, *)
   */
  formatAsBulletPoints(content) {
    // Split by newlines and convert bullet points (•) to HTML list
    const lines = content.split(/\n/).map(line => line.trim()).filter(line => line.length > 0);
    
    const bullets = lines
      .filter(line => /^[•\-\*]\s/.test(line))
      .map(line => {
        // Remove bullet marker and trim
        const text = line.replace(/^[•\-\*]\s+/, '').trim();
        return text ? `<li>${text}</li>` : '';
      })
      .filter(li => li.length > 0);
    
    if (bullets.length > 0) {
      return `<ul>${bullets.join('')}</ul>`;
    }
    
    // If no bullets found, just return content with newlines as breaks
    return content.replace(/\n/g, '<br>');
  }

  renderContent(details) {
    let html = '<div class="details-header">';
    html += `<h1>${details.title}</h1>`;
    
    if (details.company) {
      html += `<h2>${details.company}</h2>`;
    }
    
    if (details.role) {
      html += `<h3>${details.role}</h3>`;
    }
    
    html += '</div>';
    
    // 1. Hero image or video (prioritize heroImage if both exist)
    if (details.heroImage) {
      html += `
        <div class="details-hero">
          <img src="${details.heroImage}" alt="${details.title}" class="details-hero-image">
        </div>
      `;
    } else if (details.heroVideo) {
      html += `
        <div class="details-hero">
          <video class="details-hero-video" controls autoplay muted loop>
            <source src="${details.heroVideo}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      `;
    }
    
    // 2. Main description
    html += `<div class="details-content">${details.description}</div>`;
    
    // 3. Tools section
    if (details.tools && details.tools.length > 0) {
      html += '<div class="details-tools-section">';
      html += '<h3 class="details-section-title">Technologies & Tools</h3>';
      html += '<div class="details-tools">';
      details.tools.forEach(tool => {
        html += `<div class="tool">${tool}</div>`;
      });
      html += '</div>';
      html += '</div>';
    }
    
    // 4. Technical Implementation section (look for this specific section) - formatted as bullets
    if (details.sections && details.sections.length > 0) {
      const technicalSection = details.sections.find(s => 
        s.title.toLowerCase().includes('technical') || 
        s.title.toLowerCase().includes('implementation') ||
        s.title === 'Technical Implementation'
      );
      
      if (technicalSection) {
        html += '<div class="details-section">';
        html += `<h3 class="details-section-title">Technical Implementation</h3>`;
        // Split by sentences and create bullet points
        const bulletPoints = this.formatAsBulletPoints(technicalSection.content);
        html += `<div class="details-section-content details-bullets">${bulletPoints}</div>`;
        html += '</div>';
      }
    }
    
    // 5. Impact section (look for this specific section) - formatted as bullets
    if (details.sections && details.sections.length > 0) {
      const impactSection = details.sections.find(s => 
        s.title.toLowerCase().includes('impact') ||
        s.title === 'Impact'
      );
      
      if (impactSection) {
        html += '<div class="details-section">';
        html += `<h3 class="details-section-title">Impact</h3>`;
        // Split by sentences and create bullet points
        const bulletPoints = this.formatAsBulletPoints(impactSection.content);
        html += `<div class="details-section-content details-bullets">${bulletPoints}</div>`;
        html += '</div>';
      }
    }
    
    // Other sections (excluding Technical Implementation and Impact which we already rendered)
    if (details.sections && details.sections.length > 0) {
      const otherSections = details.sections.filter(s => {
        const title = s.title.toLowerCase();
        return !title.includes('technical') && 
               !title.includes('implementation') && 
               !title.includes('impact') &&
               s.title !== 'Technical Implementation' &&
               s.title !== 'Impact';
      });
      
      otherSections.forEach(section => {
        html += '<div class="details-section">';
        html += `<h3 class="details-section-title">${section.title}</h3>`;
        html += `<div class="details-section-content">${section.content.replace(/\n/g, '<br>')}</div>`;
        html += '</div>';
      });
    }
    
    // Image gallery (excluding hero image if it's in the images array)
    if (details.images && details.images.length > 0) {
      const galleryImages = details.images.filter(img => img !== details.heroImage);
      
      if (galleryImages.length > 0) {
        html += '<div class="details-gallery">';
        html += '<h3 class="details-section-title">Gallery</h3>';
        html += '<div class="details-gallery-grid">';
        galleryImages.forEach(image => {
          html += `
            <div class="details-gallery-item">
              <img src="${image}" alt="${details.title}" class="details-gallery-image">
            </div>
          `;
        });
        html += '</div>';
        html += '</div>';
      }
    }
    
    // Videos section
    if (details.videos && details.videos.length > 0) {
      const galleryVideos = details.heroVideo && !details.heroImage
        ? details.videos.filter(vid => vid !== details.heroVideo)
        : details.videos;
      
      if (galleryVideos.length > 0) {
        html += '<div class="details-videos">';
        html += '<h3 class="details-section-title">Videos</h3>';
        html += '<div class="details-videos-grid">';
        galleryVideos.forEach(video => {
          html += `
            <div class="details-video-item">
              <video class="details-video" controls>
                <source src="${video}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          `;
        });
        html += '</div>';
        html += '</div>';
      }
    }
    
    // Website button
    if (details.websiteUrl) {
      html += `
        <div class="details-website-button">
          <a 
            href="${details.websiteUrl}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="btn-website"
          >
            Visit Website
          </a>
        </div>
      `;
    }

    this.content.innerHTML = html;
    
    // Scroll to top of panel content
    this.content.scrollTop = 0;
  }
}

// Create singleton instance
const detailsPanel = new DetailsPanel();

/**
 * Open details panel for a project/experience
 * @param {string} projectId - The ID of the project/experience
 * @param {string} slideDirection - 'left' or 'right' (default: 'right')
 */
export function openDetails(projectId, slideDirection = 'right') {
  detailsPanel.open(projectId, slideDirection);
}

/**
 * Close the details panel
 */
export function closeDetails() {
  detailsPanel.close();
}

export default detailsPanel;
