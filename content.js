let video_allowed = true;
let ad_removal = true;

const classesToRemove = [
    '.mv-ad-box',
    '.p-gameNavText', 
    '.l-header', 
    '.p-gameHeader', 
    '.l-breadcrumb', 
    '.l-3colMain__left', 
    '.l-3colSide', 
    '.l-footer',
    '.a-announce',
    '.p-archiveHeader__count',
    '.c-share',
    '.c-row',
    '.p-article__author',
    '.p-archiveFeedback',
    '.p-archiveBreadcrumb',
    '.mv-rail-frame-440'
];

chrome.runtime.sendMessage({action: "getSettings"}, (response) => {
  video_allowed = response.videoAllowed;
  ad_removal = response.adRemoval;
  // Apply initial settings
  cleanPage();
});

function cleanPage() {
    // Remove elements with specified classes
    classesToRemove.forEach(function(className) {
        document.querySelectorAll(className).forEach(function(element) {
            element.remove();
        });
    });

    // Delay clicking accordion buttons
    setTimeout(clickAccordionButtons, 3000);

    // Remove all <video> tags if video_allowed is false
    if (!video_allowed) {
        document.querySelectorAll('video').forEach(function(videoElement) {
            videoElement.remove();
        });
    }

    // Remove ads if ad_removal is true
    if (ad_removal) {
        document.querySelectorAll('.ad, .advertisement, [class*="ad-"], [id*="ad-"]').forEach(function(adElement) {
            adElement.remove();
        });
    }
}

function clickAccordionButtons() {
    let attempts = 0;
    const maxAttempts = 5;
    const intervalId = setInterval(() => {
        const buttons = document.querySelectorAll('.a-accordion__btn.js-accordion-toggle:not(.is-open)');
        buttons.forEach(button => button.click());
        
        attempts++;
        if (attempts >= maxAttempts || buttons.length === 0) {
            clearInterval(intervalId);
        }
    }, 1000);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleVideo") {
        video_allowed = request.allowed;
        cleanPage();
    } else if (request.action === "toggleAdRemoval") {
        ad_removal = request.enabled;
        cleanPage();
    } else if (request.action === "cleanPage") {
        cleanPage();
    }
});

// Run cleanPage whenever the DOM content changes
const observer = new MutationObserver(() => {
    cleanPage();
    clickAccordionButtons();
});
observer.observe(document.body, { childList: true, subtree: true });

// Initial run
cleanPage();