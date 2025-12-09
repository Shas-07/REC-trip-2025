// Modal functionality
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

// Store original content for translation
let originalContent = '';
let currentLanguage = 'en';

// Open modal with place content
function openModal(placeId) {
    // Normalize placeId to lowercase for case-insensitive matching
    const normalizedPlaceId = placeId.toLowerCase();
    
    // Find content - try both exact match and case-insensitive
    let contentData = document.querySelector(`.place-content-data[data-place="${normalizedPlaceId}"]`) ||
                     document.querySelector(`.place-content-data[data-place="${placeId}"]`);
    
    // Try case-insensitive search if still not found
    if (!contentData) {
        const allContentData = document.querySelectorAll('.place-content-data');
        for (let elem of allContentData) {
            const elemPlaceId = elem.getAttribute('data-place');
            if (elemPlaceId && elemPlaceId.toLowerCase() === normalizedPlaceId) {
                contentData = elem;
                break;
            }
        }
    }
    
    let content = null;
    
    if (contentData) {
        content = contentData.querySelector('.place-card-content');
    }
    
    if (!content) {
        const placeCard = document.querySelector(`.place-card[data-place="${normalizedPlaceId}"]`) ||
                         document.querySelector(`.place-card[data-place="${placeId}"]`);
        if (placeCard) {
            content = placeCard.querySelector('.place-card-content');
        }
    }
    
    if (!content) {
        return;
    }
    
    // Store and load content
    originalContent = content.innerHTML;
    modalBody.innerHTML = originalContent;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalBody.scrollTop = 0;
    
    // Reset state
    currentLanguage = 'en';
    stopReadAloud();
    
    // Initialize features after DOM update
    // Use requestAnimationFrame for better DOM readiness, especially for mobile
    requestAnimationFrame(() => {
        setTimeout(() => {
            initReadAloud();
            initTranslate();
            updateTranslateUI();
        }, 150); // Increased timeout for better reliability on mobile
    });
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    stopReadAloud();
}

// Event listeners
document.querySelectorAll('.place-card-modern').forEach(card => {
    card.addEventListener('click', () => {
        const placeId = card.getAttribute('data-place');
        openModal(placeId);
    });
});

if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}
if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Journey animation on scroll
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const journeyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const journeyPath = entry.target;
            const points = journeyPath.querySelectorAll('.journey-point');
            const lines = journeyPath.querySelectorAll('.journey-line');
            
            points.forEach((point, index) => {
                setTimeout(() => {
                    point.classList.add('active');
                    if (index < lines.length) {
                        lines[index].classList.add('animate');
                    }
                }, index * 500);
            });
            
            journeyObserver.unobserve(journeyPath);
        }
    });
}, observerOptions);

const journeyPath = document.querySelector('.journey-path');
if (journeyPath) {
    journeyObserver.observe(journeyPath);
}

// Function to show city image popup
function showCityPopup(imageUrl, cityName) {
    const popup = document.createElement('div');
    popup.className = 'college-popup';
    popup.innerHTML = `
        <div class="popup-overlay"></div>
        <div class="popup-content">
            <button class="popup-close">&times;</button>
            <img src="${imageUrl}" alt="${cityName}" class="popup-image">
            <h3 class="popup-title">${cityName}</h3>
        </div>
    `;
    document.body.appendChild(popup);
    document.body.style.overflow = 'hidden';
    
    const closeBtn = popup.querySelector('.popup-close');
    const overlay = popup.querySelector('.popup-overlay');
    
    closeBtn.addEventListener('click', () => {
        popup.remove();
        document.body.style.overflow = '';
    });
    
    overlay.addEventListener('click', () => {
        popup.remove();
        document.body.style.overflow = '';
    });
}

// Gadag click to show college photo popup
const gadagPoint = document.querySelector('[data-city="gadag"]');
if (gadagPoint) {
    gadagPoint.addEventListener('click', () => {
        const collegeImage = 'https://static.wixstatic.com/media/5ed6bc_92f4bb70dc164e989bce90d940b05e86~mv2.jpeg/v1/fill/w_640,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/5ed6bc_92f4bb70dc164e989bce90d940b05e86~mv2.jpeg';
        const collegeName = 'RTE Society\'s Rural Engineering College Hulkoti';
        showCityPopup(collegeImage, collegeName);
    });
}

// Mysore click to show Mysore image popup
const mysorePoint = document.querySelector('[data-city="mysore"]');
if (mysorePoint) {
    mysorePoint.addEventListener('click', () => {
        const mysoreImage = 'https://mysore.ind.in/wp-content/uploads/2010/12/infosys1.jpg';
        const mysoreName = 'Mysore - Days 1-2';
        showCityPopup(mysoreImage, mysoreName);
    });
}

// Bangalore click to show Bangalore image popup
const bangalorePoint = document.querySelector('[data-city="bangalore"]');
if (bangalorePoint) {
    bangalorePoint.addEventListener('click', () => {
        const bangaloreImage = 'https://image-static.collegedunia.com/public/image/institute/cover_17199928352021-11-11.jpg?h=194&w=375&mode=stretch';
        const bangaloreName = 'Bangalore - Day 3';
        showCityPopup(bangaloreImage, bangaloreName);
    });
}

// Timetable button functionality
const timetableBtn = document.getElementById('timetableBtn');
const timetableSection = document.getElementById('timetableSection');
const timetableClose = document.getElementById('timetableClose');

if (timetableBtn && timetableSection) {
    timetableBtn.addEventListener('click', () => {
        timetableSection.style.display = 'block';
        document.body.style.overflow = 'hidden';
        timetableSection.scrollTop = 0;
    });
}

if (timetableClose && timetableSection) {
    timetableClose.addEventListener('click', () => {
        timetableSection.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && timetableSection.style.display === 'block') {
            timetableSection.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// Timetable animation
const timetableObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const events = entry.target.querySelectorAll('.timetable-event');
            events.forEach((event, index) => {
                setTimeout(() => {
                    event.style.opacity = '1';
                    event.style.transform = 'translateX(0)';
                }, index * 50);
            });
            timetableObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.timetable-day').forEach(day => {
    const events = day.querySelectorAll('.timetable-event');
    events.forEach(event => {
        event.style.opacity = '0';
        event.style.transform = 'translateX(-20px)';
        event.style.transition = 'all 0.4s ease';
    });
    timetableObserver.observe(day);
});

// Scroll animations for place cards
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.place-card-modern').forEach(card => {
    cardObserver.observe(card);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Read Aloud functionality
let speechSynthesis = null;
let currentUtterance = null;
let isReading = false;
let voicesLoaded = false;
let voices = [];

// Initialize speech synthesis on page load (helps Chrome load voices)
if ('speechSynthesis' in window) {
    speechSynthesis = window.speechSynthesis;
    
    // Function to load voices
    const loadVoices = () => {
        voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            voicesLoaded = true;
        }
    };
    
    // Load voices immediately
    loadVoices();
    
    // Chrome mobile needs voiceschanged event
    speechSynthesis.addEventListener('voiceschanged', loadVoices, { once: false });
    
    // Also try loading after a delay for mobile
    setTimeout(loadVoices, 500);
    setTimeout(loadVoices, 1000);
}

function initReadAloud() {
    const readAloudBtn = document.getElementById('readAloudBtn');
    if (!readAloudBtn) {
        return;
    }
    
    if (!('speechSynthesis' in window)) {
        readAloudBtn.style.display = 'none';
        return;
    }
    
    if (!speechSynthesis) {
        speechSynthesis = window.speechSynthesis;
    }
    
    // Ensure button is clickable
    readAloudBtn.style.pointerEvents = 'auto';
    readAloudBtn.style.webkitTouchCallout = 'none';
    readAloudBtn.style.userSelect = 'none';
    readAloudBtn.disabled = false;
    readAloudBtn.style.cursor = 'pointer';
    
    // Make child elements non-interactive so clicks go to button
    const spans = readAloudBtn.querySelectorAll('span');
    spans.forEach(span => {
        span.style.pointerEvents = 'none';
        span.style.webkitTouchCallout = 'none';
        span.style.userSelect = 'none';
    });
    
    // Unified handler function for both click and touch
    const handleButtonClick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Visual feedback IMMEDIATELY
        readAloudBtn.classList.add('active');
        const btnSpans = readAloudBtn.querySelectorAll('span');
        if (btnSpans.length > 1) btnSpans[1].textContent = 'Stop Reading';
        
        if (isReading) {
            stopReadAloud();
            return;
        }
        
        if (!speechSynthesis && 'speechSynthesis' in window) {
            speechSynthesis = window.speechSynthesis;
        }
        
        // Ensure voices are loaded (critical for mobile Chrome)
        if (!voicesLoaded || voices.length === 0) {
            voices = speechSynthesis.getVoices();
            voicesLoaded = voices.length > 0;
        }
        
        // If still no voices, get them again synchronously
        if (voices.length === 0) {
            voices = speechSynthesis.getVoices();
        }
        
        // Find blog content - try multiple selectors for all places
        // Check in order: direct .blog-content, nested .blog-content, then .blog-section
        let blogContent = null;
        
        // Try direct .blog-content first (most common)
        blogContent = modalBody?.querySelector('.blog-content');
        
        // If not found, try nested .blog-content within .blog-section
        if (!blogContent) {
            blogContent = modalBody?.querySelector('.blog-section .blog-content');
        }
        
        // If still not found, use the entire .blog-section
        if (!blogContent) {
            blogContent = modalBody?.querySelector('.blog-section');
        }
        
        // Last resort: look for any content in .place-card-content
        if (!blogContent && modalBody) {
            const placeContent = modalBody.querySelector('.place-card-content');
            if (placeContent) {
                blogContent = placeContent.querySelector('.blog-content') ||
                             placeContent.querySelector('.blog-section .blog-content') ||
                             placeContent.querySelector('.blog-section') ||
                             placeContent;
            }
        }
        
        if (!blogContent) {
            resetButtonState();
            return;
        }
        
        // Get text - only blog content
        // Use textContent which works even if element is hidden (important for Kaynes)
        let text = '';
        
        // Force text extraction - ensure we get ALL text content regardless of case or formatting
        // Clone the element to ensure we get all text even if it's hidden
        const clonedContent = blogContent.cloneNode(true);
        
        // Remove elements we don't want to read
        const elementsToRemove = clonedContent.querySelectorAll('button, a.location-link, .read-aloud-btn, .translate-btn, .location-section, .photo-gallery-section, .highlights');
        elementsToRemove.forEach(el => el.remove());
        
        // Get text content - this will work regardless of capitalization
        text = clonedContent.textContent || clonedContent.innerText || '';
        
        // If still empty, try direct extraction
        if (!text || text.trim().length === 0) {
            // Fallback: manually extract text from child nodes
            const textNodes = [];
            const walk = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const nodeText = node.textContent.trim();
                    if (nodeText && 
                        !nodeText.match(/^(Read Aloud|Stop Reading|Translate|View on Google Maps)$/i)) {
                        textNodes.push(nodeText);
                    }
                } else {
                    // Skip button and link elements, but include ALL other content
                    const tagName = node.tagName ? node.tagName.toUpperCase() : '';
                    const className = node.className || '';
                    
                    if (tagName !== 'BUTTON' && 
                        tagName !== 'A' &&
                        !className.includes('read-aloud-btn') &&
                        !className.includes('translate-btn') &&
                        !className.includes('location-link') &&
                        !className.includes('location-section') &&
                        !className.includes('photo-gallery')) {
                        for (let child of node.childNodes) {
                            walk(child);
                        }
                    }
                }
            };
            walk(blogContent);
            text = textNodes.join(' ');
        }
        
        // Clean up text - normalize whitespace
        text = text.replace(/\s+/g, ' ').trim();
        
        // Remove UI text that might have been included
        text = text.replace(/Read Aloud|Stop Reading|Translate|View on Google Maps|Location|Gallery|Key Highlights/gi, '').trim();
        
        if (!text || text.length < 10) {
            resetButtonState();
            return;
        }
        
        // Cancel existing - wait a tiny bit for mobile Chrome
        if (speechSynthesis.speaking || speechSynthesis.pending) {
            speechSynthesis.cancel();
            // Small synchronous wait for cancellation
            let waitCount = 0;
            while ((speechSynthesis.speaking || speechSynthesis.pending) && waitCount < 10) {
                waitCount++;
            }
        }
        
        // Create and speak IMMEDIATELY (critical for mobile Chrome)
        try {
            currentUtterance = new SpeechSynthesisUtterance(text);
            currentUtterance.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'kn' ? 'kn-IN' : 'en-US';
            currentUtterance.rate = 0.9;
            currentUtterance.pitch = 1;
            currentUtterance.volume = 1;
            
            // Set voice if available
            if (voices.length > 0) {
                const voice = voices.find(v => v.lang.startsWith(currentUtterance.lang)) || 
                             voices.find(v => v.lang.startsWith('en')) || 
                             voices[0];
                if (voice) {
                    currentUtterance.voice = voice;
                }
            }
            
            isReading = true;
            
            currentUtterance.onstart = () => {
                isReading = true;
            };
            
            currentUtterance.onend = () => {
                isReading = false;
                resetButtonState();
            };
            
            currentUtterance.onerror = (event) => {
                isReading = false;
                resetButtonState();
            };
            
            // CRITICAL: SPEAK IMMEDIATELY within user gesture context
            // No delays, no async, must be synchronous for mobile Chrome
            speechSynthesis.speak(currentUtterance);
        } catch (error) {
            isReading = false;
            resetButtonState();
        }
    };
    
    // Attach handlers directly - use both click and touch for maximum compatibility
    // Use capture phase to ensure we get the event first
    readAloudBtn.addEventListener('click', handleButtonClick, { passive: false, capture: true });
    
    // For mobile - handle touch events properly
    let touchStarted = false;
    readAloudBtn.addEventListener('touchstart', function(e) {
        touchStarted = true;
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });
    
    readAloudBtn.addEventListener('touchend', function(e) {
        if (touchStarted) {
            touchStarted = false;
            e.preventDefault();
            handleButtonClick(e);
        }
    }, { passive: false, capture: true });
    
    // Prevent page visibility changes from stopping speech
    document.addEventListener('visibilitychange', function() {
        // If page becomes hidden, keep speech playing (don't cancel)
        // Mobile Chrome sometimes triggers this during scrolling
    });
    
    // Prevent modal scroll from interfering with speech
    if (modalBody) {
        modalBody.addEventListener('touchmove', function(e) {
            // Allow scrolling but don't stop speech
        }, { passive: true });
    }
}

// Ensure initReadAloud is called even if button appears later
if (typeof initReadAloud === 'function') {
    // This function is now defined above
}

function startReadAloud() {
    startReadAloudDirect(null);
}

function startReadAloudDirect(event) {
    // Update button immediately
    const btn = document.getElementById('readAloudBtn');
    if (btn) {
        btn.classList.add('active');
        const spans = btn.querySelectorAll('span');
        if (spans.length > 1) {
            spans[1].textContent = 'Stop Reading';
        }
    }
    
    // Initialize speech synthesis if needed
    if (!speechSynthesis) {
        if ('speechSynthesis' in window) {
            speechSynthesis = window.speechSynthesis;
        } else {
            resetButtonState();
            return;
        }
    }
    
    // Check modal body
    if (!modalBody || !modalBody.innerHTML || !modalBody.innerHTML.trim()) {
        resetButtonState();
        return;
    }
    
    // Find blog content - try multiple selectors for all places
    let blogContent = null;
    
    // Try direct .blog-content first (most common)
    blogContent = modalBody.querySelector('.blog-content');
    
    // If not found, try nested .blog-content within .blog-section
    if (!blogContent) {
        blogContent = modalBody.querySelector('.blog-section .blog-content');
    }
    
    // If still not found, use the entire .blog-section
    if (!blogContent) {
        blogContent = modalBody.querySelector('.blog-section');
    }
    
    // Last resort: look for any content in .place-card-content
    if (!blogContent) {
        const placeContent = modalBody.querySelector('.place-card-content');
        if (placeContent) {
            blogContent = placeContent.querySelector('.blog-content') ||
                         placeContent.querySelector('.blog-section .blog-content') ||
                         placeContent.querySelector('.blog-section') ||
                         placeContent;
        }
    }
    
    if (!blogContent) {
        resetButtonState();
        return;
    }
    
    // Extract text - use textContent for better reliability
    let text = blogContent.textContent || blogContent.innerText || '';
    
    // Clean up text
    text = text.replace(/\s+/g, ' ').trim();
    text = text.replace(/[\r\n]+/g, ' '); // Remove newlines
    
    if (!text || text.length < 10) {
        resetButtonState();
        return;
    }
    
    // Cancel any existing speech first
    if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
    }
    
    // If called from user gesture, speak immediately to maintain gesture context
    if (event) {
        // Small delay to ensure cancellation is processed, but still within gesture context
        requestAnimationFrame(() => {
            speakText(text);
        });
    } else {
        // Fallback for programmatic calls
        setTimeout(() => {
            speakText(text);
        }, 100);
    }
}

// Helper function to start speaking (called from user gesture context)
function startSpeaking(text, voices) {
    try {
        // Create utterance
        currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Set language
        if (currentLanguage === 'en') {
            currentUtterance.lang = 'en-US';
        } else if (currentLanguage === 'hi') {
            currentUtterance.lang = 'hi-IN';
        } else if (currentLanguage === 'kn') {
            currentUtterance.lang = 'kn-IN';
        } else {
            currentUtterance.lang = 'en-US';
        }
        
        // Set voice
        if (voices && voices.length > 0) {
            let voice = voices.find(v => v.lang.startsWith(currentUtterance.lang)) || 
                       voices.find(v => v.lang.startsWith('en')) || 
                       voices[0];
            if (voice) {
                currentUtterance.voice = voice;
            }
        }
        
        currentUtterance.rate = 0.9;
        currentUtterance.pitch = 1;
        currentUtterance.volume = 1;
        
        isReading = true;
        
        // Event handlers
        currentUtterance.onstart = () => {
            isReading = true;
        };
        
        currentUtterance.onend = () => {
            isReading = false;
            resetButtonState();
        };
        
        currentUtterance.onerror = () => {
            isReading = false;
            resetButtonState();
        };
        
        // Speak immediately (must be in user gesture context)
        speechSynthesis.speak(currentUtterance);
        
    } catch (error) {
        isReading = false;
        resetButtonState();
    }
}

function speakTextDirectly(text) {
    try {
        // Ensure we have speech synthesis
        if (!speechSynthesis) {
            if ('speechSynthesis' in window) {
                speechSynthesis = window.speechSynthesis;
            } else {
                resetButtonState();
                return;
            }
        }
        
        // Get voices first (Chrome needs this)
        let voices = speechSynthesis.getVoices();
        
        // If no voices, wait for them to load
        if (voices.length === 0) {
            speechSynthesis.addEventListener('voiceschanged', () => {
                voices = speechSynthesis.getVoices();
                if (voices.length > 0) {
                    speakTextDirectly(text);
                }
            }, { once: true });
            return;
        }
        
        // Cancel any pending speech first
        if (speechSynthesis.speaking || speechSynthesis.pending) {
            speechSynthesis.cancel();
            // Wait a tiny bit for cancellation
            let wait = 0;
            while ((speechSynthesis.speaking || speechSynthesis.pending) && wait < 50) {
                wait++;
            }
        }
        
        // Create utterance
        currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Set language
        if (currentLanguage === 'en') {
            currentUtterance.lang = 'en-US';
        } else if (currentLanguage === 'hi') {
            currentUtterance.lang = 'hi-IN';
        } else if (currentLanguage === 'kn') {
            currentUtterance.lang = 'kn-IN';
        } else {
            currentUtterance.lang = 'en-US';
        }
        
        // Find and set voice
        let voice = voices.find(v => v.lang.startsWith(currentUtterance.lang)) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (voice) {
            currentUtterance.voice = voice;
        }
        
        currentUtterance.rate = 0.9;
        currentUtterance.pitch = 1;
        currentUtterance.volume = 1;
        
        isReading = true;
        
        // Event handlers
        currentUtterance.onstart = () => {
            isReading = true;
        };
        
        currentUtterance.onend = () => {
            isReading = false;
            resetButtonState();
        };
        
        currentUtterance.onerror = () => {
            isReading = false;
            resetButtonState();
        };
        
        // Speak immediately (must be in user gesture context)
        speechSynthesis.speak(currentUtterance);
        
    } catch (error) {
        isReading = false;
        resetButtonState();
    }
}

function speakText(text) {
    try {
        // Cancel any pending speech
        if (speechSynthesis.speaking || speechSynthesis.pending) {
            speechSynthesis.cancel();
            // Wait for cancellation to complete
            let cancelWait = 0;
            while ((speechSynthesis.speaking || speechSynthesis.pending) && cancelWait < 10) {
                cancelWait++;
            }
        }
        
        // Create utterance
        currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Set language based on current translation
        if (currentLanguage === 'en') {
            currentUtterance.lang = 'en-US';
        } else if (currentLanguage === 'hi') {
            currentUtterance.lang = 'hi-IN';
        } else if (currentLanguage === 'kn') {
            currentUtterance.lang = 'kn-IN';
        } else {
            currentUtterance.lang = 'en-US';
        }
        
        currentUtterance.rate = 0.9;
        currentUtterance.pitch = 1;
        currentUtterance.volume = 1;
        
        isReading = true;
        
        // Event handlers
        currentUtterance.onstart = () => {
            isReading = true;
        };
        
        currentUtterance.onend = () => {
            isReading = false;
            resetButtonState();
        };
        
        currentUtterance.onerror = () => {
            isReading = false;
            resetButtonState();
        };
        
        // Speak immediately (must be called from user gesture context)
        speechSynthesis.speak(currentUtterance);
        
    } catch (error) {
        isReading = false;
        resetButtonState();
    }
}

function stopReadAloud() {
    if (speechSynthesis) {
        if (speechSynthesis.speaking || speechSynthesis.pending) {
            speechSynthesis.cancel();
        }
        isReading = false;
    }
    resetButtonState();
}

function resetButtonState() {
    const readAloudBtn = document.getElementById('readAloudBtn');
    if (readAloudBtn) {
        readAloudBtn.classList.remove('active');
        const spans = readAloudBtn.querySelectorAll('span');
        if (spans.length > 1) {
            spans[1].textContent = 'Read Aloud';
        }
    }
    isReading = false;
}

// Translate functionality
function initTranslate() {
    const translateBtn = document.getElementById('translateBtn');
    const translateDropdown = document.getElementById('translateDropdown');
    
    if (!translateBtn || !translateDropdown) {
        return;
    }
    
    // Remove old listeners
    const newBtn = translateBtn.cloneNode(true);
    newBtn.id = 'translateBtn';
    const parent = translateBtn.parentNode;
    if (parent) {
        parent.replaceChild(newBtn, translateBtn);
    } else {
        return;
    }
    
    const newDropdown = document.getElementById('translateDropdown');
    if (!newDropdown) {
        return;
    }
    const translateOptions = newDropdown.querySelectorAll('.translate-option');
    
    // Toggle dropdown
    newBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        newDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    const clickHandler = (e) => {
        if (!newBtn.contains(e.target) && !newDropdown.contains(e.target)) {
            newDropdown.classList.remove('show');
        }
    };
    document.addEventListener('click', clickHandler);
    
    // Handle language selection
    translateOptions.forEach(option => {
        option.addEventListener('click', async (e) => {
            e.stopPropagation();
            const lang = option.getAttribute('data-lang');
            if (lang !== currentLanguage) {
                currentLanguage = lang;
                updateTranslateUI();
                await translateContent(lang);
            }
            newDropdown.classList.remove('show');
        });
    });
}

function updateTranslateUI() {
    const translateOptions = document.querySelectorAll('.translate-option');
    translateOptions.forEach(option => {
        if (option.getAttribute('data-lang') === currentLanguage) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

async function translateContent(targetLang) {
    if (!modalBody || !originalContent) {
        return;
    }
    
    // If English, restore original content
    if (targetLang === 'en') {
        modalBody.innerHTML = originalContent;
        stopReadAloud();
        requestAnimationFrame(() => {
            initReadAloud();
            initTranslate();
        });
        return;
    }
    
    // Find blog content - try multiple selectors for all places
    let blogContent = null;
    
    // Try direct .blog-content first (most common)
    blogContent = modalBody.querySelector('.blog-content');
    
    // If not found, try nested .blog-content within .blog-section
    if (!blogContent) {
        blogContent = modalBody.querySelector('.blog-section .blog-content');
    }
    
    // If still not found, use the entire .blog-section
    if (!blogContent) {
        blogContent = modalBody.querySelector('.blog-section');
    }
    
    // Last resort: look for any content in .place-card-content
    if (!blogContent) {
        const placeContent = modalBody.querySelector('.place-card-content');
        if (placeContent) {
            blogContent = placeContent.querySelector('.blog-content') ||
                         placeContent.querySelector('.blog-section .blog-content') ||
                         placeContent.querySelector('.blog-section') ||
                         placeContent;
        }
    }
    
    if (!blogContent) {
        return;
    }
    
    // Show loading state
    blogContent.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Translating content...</p>';
    
    try {
        // Extract text from original content - try multiple selectors
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalContent;
        
        let originalBlogContent = null;
        
        // Try direct .blog-content first
        originalBlogContent = tempDiv.querySelector('.blog-content');
        
        // If not found, try nested .blog-content within .blog-section
        if (!originalBlogContent) {
            originalBlogContent = tempDiv.querySelector('.blog-section .blog-content');
        }
        
        // If still not found, use the entire .blog-section
        if (!originalBlogContent) {
            originalBlogContent = tempDiv.querySelector('.blog-section');
        }
        
        // Last resort: look for any content in .place-card-content
        if (!originalBlogContent) {
            const placeContent = tempDiv.querySelector('.place-card-content');
            if (placeContent) {
                originalBlogContent = placeContent.querySelector('.blog-content') ||
                                    placeContent.querySelector('.blog-section .blog-content') ||
                                    placeContent.querySelector('.blog-section') ||
                                    placeContent;
            }
        }
        
        if (!originalBlogContent) {
            modalBody.innerHTML = originalContent;
            requestAnimationFrame(() => {
                initReadAloud();
                initTranslate();
            });
            return;
        }
        
        const textToTranslate = originalBlogContent.textContent || originalBlogContent.innerText || '';
        
        // Split into chunks if too long
        const maxLength = 5000;
        let textChunks = [];
        if (textToTranslate.length > maxLength) {
            const sentences = textToTranslate.match(/[^\.!\?]+[\.!\?]+/g) || [textToTranslate];
            let currentChunk = '';
            sentences.forEach(sentence => {
                if ((currentChunk + sentence).length < maxLength) {
                    currentChunk += sentence;
                } else {
                    if (currentChunk) textChunks.push(currentChunk);
                    currentChunk = sentence;
                }
            });
            if (currentChunk) textChunks.push(currentChunk);
        } else {
            textChunks = [textToTranslate];
        }
        
        // Translate each chunk
        let translatedText = '';
        for (const chunk of textChunks) {
            const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(chunk)}`;
            
            try {
                const response = await fetch(translateUrl, {
                    method: 'GET',
                    mode: 'cors'
                });
        
                if (response.ok) {
                    const data = await response.json();
                    if (data && data[0] && Array.isArray(data[0])) {
                        data[0].forEach(item => {
                            if (item && item[0]) {
                                translatedText += item[0];
                            }
                        });
                    }
                }
            } catch (chunkError) {
                // Translation chunk error - continue with next chunk
            }
        }
        
        if (translatedText) {
            // Split translated text into sentences
            const translatedSentences = translatedText.split(/[\.!\?]+\s*/).filter(s => s.trim());
            
            // Clone original structure and replace text
            const clonedContent = originalBlogContent.cloneNode(true);
            const paragraphs = clonedContent.querySelectorAll('p');
            
            // Distribute translated sentences to paragraphs
            let sentenceIndex = 0;
            paragraphs.forEach((p) => {
                if (sentenceIndex < translatedSentences.length) {
                    const sentencesPerPara = Math.min(3, translatedSentences.length - sentenceIndex);
                    const paraText = translatedSentences.slice(sentenceIndex, sentenceIndex + sentencesPerPara)
                        .join('. ').trim();
                    if (paraText) {
                        p.textContent = paraText + (paraText.endsWith('.') ? '' : '.');
                    }
                    sentenceIndex += sentencesPerPara;
                }
            });
            
            // Update the blog content section
            const blogSection = tempDiv.querySelector('.blog-section');
            if (blogSection) {
                const blogContentDiv = blogSection.querySelector('.blog-content');
                if (blogContentDiv) {
                    blogContentDiv.innerHTML = clonedContent.innerHTML;
                }
            }
            
            modalBody.innerHTML = tempDiv.innerHTML;
            
            // Re-initialize read aloud and translate after translation
            requestAnimationFrame(() => {
                initReadAloud();
                initTranslate();
            });
        } else {
            // Restore original on error
            modalBody.innerHTML = originalContent;
            requestAnimationFrame(() => {
                initReadAloud();
                initTranslate();
            });
        }
    } catch (error) {
        modalBody.innerHTML = originalContent;
        requestAnimationFrame(() => {
            initReadAloud();
            initTranslate();
        });
    }
    
    stopReadAloud();
}
