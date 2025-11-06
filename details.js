import projectDetails from './data/projectDetails.js';

/**
 * Load and display project/experience details based on URL parameter
 */
function loadDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  
  const contentDiv = document.getElementById('details-content');
  
  if (!id) {
    contentDiv.innerHTML = `
      <div class="error">
        <h2>No project selected</h2>
        <p>Please select a project or experience from the portfolio.</p>
        <a href="index.html" class="back-button">Go to Portfolio</a>
      </div>
    `;
    return;
  }
  
  const details = projectDetails[id];
  
  if (!details) {
    contentDiv.innerHTML = `
      <div class="error">
        <h2>Project not found</h2>
        <p>The requested project or experience could not be found.</p>
        <a href="index.html" class="back-button">Go to Portfolio</a>
      </div>
    `;
    return;
  }
  
  // Build the details HTML
  let html = '<div class="details-header">';
  html += `<h1>${details.title}</h1>`;
  
  if (details.company) {
    html += `<h2>${details.company}</h2>`;
  }
  
  if (details.role) {
    html += `<h3>${details.role}</h3>`;
  }
  
  html += '</div>';
  
  // Hero image or video (prioritize heroImage if both exist)
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
  
  // Main description
  html += `<div class="details-content">${details.description}</div>`;
  
  // Content sections
  if (details.sections && details.sections.length > 0) {
    details.sections.forEach(section => {
      html += '<div class="details-section">';
      html += `<h3 class="details-section-title">${section.title}</h3>`;
      html += `<div class="details-section-content">${section.content.replace(/\n/g, '<br>')}</div>`;
      html += '</div>';
    });
  }
  
  // Image gallery (excluding hero image if it's in the images array)
  if (details.images && details.images.length > 0) {
    // Filter out hero image from gallery
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
  
  // Videos section (excluding hero video if it's in the videos array)
  if (details.videos && details.videos.length > 0) {
    // Filter out hero video from videos section (only if heroVideo exists and heroImage doesn't)
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
  
  // Tools section
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
  
  contentDiv.innerHTML = html;
  
  // Update page title
  document.title = `${details.title} - Bosung's Portfolio`;
}

// Load details when page loads
loadDetails();
