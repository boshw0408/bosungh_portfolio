/**
 * Reusable Project Buttons Component
 * Generates Learn More and Website buttons for projects and experiences
 */

export class ProjectButtons {
    /**
     * Creates HTML for project/experience buttons
     * @param {Object} options - Button configuration
     * @param {string} options.learnMoreUrl - URL or action for Learn More button (optional)
     * @param {string} options.websiteUrl - URL for Website button (optional)
     * @param {Function} options.onLearnMore - Custom handler for Learn More button (optional)
     * @returns {string} HTML string for button container
     */
    static createButtons({ learnMoreUrl = null, websiteUrl = null, onLearnMore = null }) {
        const buttons = [];

        // Always add Learn More button for all items
        if (learnMoreUrl || onLearnMore) {
            const learnMoreHandler = onLearnMore 
                ? `onclick="(${onLearnMore.toString()})()"` 
                : `onclick="window.open('${learnMoreUrl}', '_blank')"`;
            
            buttons.push(
                `<button class="btn-learn-more" ${learnMoreHandler}>Learn More</button>`
            );
        } else {
            // Add Learn More button even without URL (can be customized later)
            buttons.push(
                `<button class="btn-learn-more" onclick="alert('More details coming soon!')">Learn More</button>`
            );
        }

        // Add Website button if there's a URL
        if (websiteUrl) {
            buttons.push(
                `<button class="btn-website" onclick="window.open('${websiteUrl}', '_blank')">Website</button>`
            );
        }

        // Return button container HTML if there are any buttons
        if (buttons.length > 0) {
            return `<div class="project-buttons">${buttons.join('')}</div>`;
        }

        return '';
    }

    /**
     * Renders buttons into a container element
     * @param {HTMLElement} container - Container element to insert buttons into
     * @param {Object} options - Button configuration (see createButtons)
     */
    static renderButtons(container, options) {
        const buttonsHTML = this.createButtons(options);
        if (buttonsHTML && container) {
            container.insertAdjacentHTML('beforeend', buttonsHTML);
        }
    }
}

export default ProjectButtons;
