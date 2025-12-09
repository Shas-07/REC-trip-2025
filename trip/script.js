// Modal functionality
console.log('📄 Script.js loaded');
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
console.log('Modal elements found:', {
    modal: !!modal,
    modalBody: !!modalBody,
    modalClose: !!modalClose,
    modalOverlay: !!modalOverlay
});

// Store original content for translation
let originalContent = '';
let currentLanguage = 'en';

// Open modal with place content
function openModal(placeId) {
    console.log('📂 openModal called with placeId:', placeId);
    // Find content
    let contentData = document.querySelector(`.place-content-data[data-place="${placeId}"]`);
    let content = null;
    
    if (contentData) {
        content = contentData.querySelector('.place-card-content');
    }
    
    if (!content) {
        const placeCard = document.querySelector(`.place-card[data-place="${placeId}"]`);
        if (placeCard) {
            content = placeCard.querySelector('.place-card-content');
        }
    }
    
    if (!content) {
        console.error('Content not found for placeId:', placeId);
        return;
    }
    
    // Store and load content
    originalContent = content.innerHTML;
    modalBody.innerHTML = originalContent;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalBody.scrollTop = 0;
    
    console.log('Modal opened, content loaded. Content length:', originalContent.length);
    
    // Reset state
    currentLanguage = 'en';
    stopReadAloud();
    
    // Initialize features after DOM update
    requestAnimationFrame(() => {
        console.log('Initializing features after modal open...');
        initReadAloud();
        initTranslate();
        updateTranslateUI();
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

// Initialize speech synthesis on page load (helps Chrome load voices)
if ('speechSynthesis' in window) {
    speechSynthesis = window.speechSynthesis;
    // Load voices immediately
    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', () => {
            console.log('Voices loaded:', speechSynthesis.getVoices().length);
        }, { once: true });
    }
}

function initReadAloud() {
    console.log('🔊 initReadAloud() called');
    const readAloudBtn = document.getElementById('readAloudBtn');
    if (!readAloudBtn) {
        console.error('Read aloud button not found!');
        return;
    }
    
    console.log('Read aloud button found:', readAloudBtn);
    
    if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        readAloudBtn.style.display = 'none';
        return;
    }
    
    if (!speechSynthesis) {
        speechSynthesis = window.speechSynthesis;
    }
    
    // Remove old listeners by cloning
    const newBtn = readAloudBtn.cloneNode(true);
    newBtn.id = 'readAloudBtn';
    newBtn.className = readAloudBtn.className;
    const parent = readAloudBtn.parentNode;
    if (parent) {
        parent.replaceChild(newBtn, readAloudBtn);
        console.log('Button cloned and replaced');
    } else {
        console.error('Button parent not found!');
        return;
    }
    
    // Ensure button is clickable
    newBtn.style.pointerEvents = 'auto';
    newBtn.disabled = false;
    
    // Make child elements non-interactive so clicks go to button
    const spans = newBtn.querySelectorAll('span');
    spans.forEach(span => {
        span.style.pointerEvents = 'none';
    });
    
    // Handler function
    const handleClick = function(e) {
        console.log('🔊 Read Aloud button clicked!', e);
        e.preventDefault();
        e.stopPropagation();
        
        if (isReading) {
            console.log('Stopping speech...');
            stopReadAloud();
        } else {
            console.log('Starting speech...');
            // Start reading immediately to maintain user gesture context for Chrome
            if (!speechSynthesis) {
                if ('speechSynthesis' in window) {
                    speechSynthesis = window.speechSynthesis;
                    console.log('Speech synthesis initialized');
                } else {
                    console.error('Speech synthesis is not supported in this browser.');
                    resetButtonState();
                    return;
                }
            }
            
            // Get text immediately
            console.log('Looking for blog content in modalBody...');
            let blogContent = modalBody ? (
                modalBody.querySelector('.blog-content') ||
                modalBody.querySelector('.blog-section .blog-content') ||
                modalBody.querySelector('.blog-section') ||
                modalBody.querySelector('.place-card-content .blog-content') ||
                modalBody.querySelector('.place-card-content .blog-section')
            ) : null;
            
            console.log('Blog content found:', !!blogContent);
            
            if (!blogContent) {
                console.error('Blog content not found. Modal body:', modalBody);
                console.error('Modal body innerHTML length:', modalBody ? modalBody.innerHTML.length : 0);
                resetButtonState();
                return;
            }
            
            let text = blogContent.textContent || blogContent.innerText || '';
            text = text.replace(/\s+/g, ' ').trim().replace(/[\r\n]+/g, ' ');
            
            console.log('Extracted text length:', text.length);
            
            if (!text || text.length < 10) {
                console.error('No readable text found. Text:', text.substring(0, 50));
                resetButtonState();
                return;
            }
            
            // Update button
            const btn = document.getElementById('readAloudBtn');
            if (btn) {
                btn.classList.add('active');
                const spans = btn.querySelectorAll('span');
                if (spans.length > 1) {
                    spans[1].textContent = 'Stop Reading';
                }
            }
            
            // Cancel any existing speech
            if (speechSynthesis.speaking || speechSynthesis.pending) {
                console.log('Canceling existing speech');
                speechSynthesis.cancel();
            }
            
            // For Chrome: Create and speak directly in the click handler
            // This maintains the user gesture context
            try {
                // Get voices
                let voices = speechSynthesis.getVoices();
                if (voices.length === 0) {
                    // Voices not loaded yet, wait for them
                    speechSynthesis.addEventListener('voiceschanged', function onVoicesChanged() {
                        speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
                        voices = speechSynthesis.getVoices();
                        if (voices.length > 0) {
                            startSpeaking(text, voices);
                        }
                    }, { once: true });
                } else {
                    startSpeaking(text, voices);
                }
            } catch (error) {
                console.error('Error in click handler:', error);
                resetButtonState();
            }
        }
    };
    
    // Attach event listeners
    console.log('Attaching event listeners to read aloud button');
    newBtn.addEventListener('click', handleClick, false);
    newBtn.addEventListener('touchend', handleClick, false);
    newBtn.onclick = handleClick;
    newBtn.ontouchend = handleClick;
    
    // Test if button is clickable
    console.log('Read aloud button initialized. Button:', newBtn);
    console.log('Button disabled:', newBtn.disabled);
    console.log('Button style pointerEvents:', newBtn.style.pointerEvents);
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
            console.warn('Speech synthesis is not supported in this browser.');
            resetButtonState();
            return;
        }
    }
    
    // Check modal body
    if (!modalBody || !modalBody.innerHTML || !modalBody.innerHTML.trim()) {
        console.warn('No content found to read.');
        resetButtonState();
        return;
    }
    
    // Find blog content - try multiple selectors
    let blogContent = modalBody.querySelector('.blog-content') ||
                     modalBody.querySelector('.blog-section .blog-content') ||
                     modalBody.querySelector('.blog-section') ||
                     modalBody.querySelector('.place-card-content .blog-content') ||
                     modalBody.querySelector('.place-card-content .blog-section');
    
    if (!blogContent) {
        console.warn('Blog content not found in the page.');
        resetButtonState();
        return;
    }
    
    // Extract text - use textContent for better reliability
    let text = blogContent.textContent || blogContent.innerText || '';
    
    // Clean up text
    text = text.replace(/\s+/g, ' ').trim();
    text = text.replace(/[\r\n]+/g, ' '); // Remove newlines
    
    if (!text || text.length < 10) {
        console.warn('No readable text found.');
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
        console.log('startSpeaking called, text length:', text.length, 'voices:', voices.length);
        
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
                console.log('Using voice:', voice.name);
            }
        }
        
        currentUtterance.rate = 0.9;
        currentUtterance.pitch = 1;
        currentUtterance.volume = 1;
        
        isReading = true;
        
        // Event handlers
        currentUtterance.onstart = () => {
            console.log('✓ Speech started successfully');
        };
        
        currentUtterance.onend = () => {
            console.log('✓ Speech ended');
            isReading = false;
            resetButtonState();
        };
        
        currentUtterance.onerror = (event) => {
            console.error('✗ Speech error:', event.error, event);
            isReading = false;
            resetButtonState();
        };
        
        // Speak immediately (must be in user gesture context)
        console.log('Calling speechSynthesis.speak() NOW...');
        speechSynthesis.speak(currentUtterance);
        console.log('After speak() - speaking:', speechSynthesis.speaking, 'pending:', speechSynthesis.pending);
        
    } catch (error) {
        console.error('Exception in startSpeaking:', error);
        isReading = false;
        resetButtonState();
    }
}

function speakTextDirectly(text) {
    try {
        console.log('speakTextDirectly called with text length:', text.length);
        
        // Ensure we have speech synthesis
        if (!speechSynthesis) {
            if ('speechSynthesis' in window) {
                speechSynthesis = window.speechSynthesis;
            } else {
                console.error('Speech synthesis is not supported in this browser.');
                resetButtonState();
                return;
            }
        }
        
        // Get voices first (Chrome needs this)
        let voices = speechSynthesis.getVoices();
        console.log('Available voices:', voices.length);
        
        // If no voices, wait for them to load
        if (voices.length === 0) {
            console.log('Waiting for voices to load...');
            speechSynthesis.addEventListener('voiceschanged', () => {
                voices = speechSynthesis.getVoices();
                console.log('Voices loaded:', voices.length);
                if (voices.length > 0) {
                    speakTextDirectly(text);
                }
            }, { once: true });
            return;
        }
        
        // Cancel any pending speech first
        if (speechSynthesis.speaking || speechSynthesis.pending) {
            console.log('Canceling existing speech');
            speechSynthesis.cancel();
            // Wait a tiny bit for cancellation
            let wait = 0;
            while ((speechSynthesis.speaking || speechSynthesis.pending) && wait < 50) {
                wait++;
            }
        }
        
        // Create utterance
        currentUtterance = new SpeechSynthesisUtterance(text);
        console.log('Created utterance, text length:', text.length);
        
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
            console.log('Using voice:', voice.name);
        }
        
        currentUtterance.rate = 0.9;
        currentUtterance.pitch = 1;
        currentUtterance.volume = 1;
        
        isReading = true;
        let speechStarted = false;
        
        // Event handlers
        currentUtterance.onstart = () => {
            console.log('✓ Speech started successfully');
            speechStarted = true;
        };
        
        currentUtterance.onend = () => {
            console.log('✓ Speech ended');
            isReading = false;
            resetButtonState();
        };
        
        currentUtterance.onerror = (event) => {
            console.error('✗ Speech error:', event);
            console.error('Error type:', event.error);
            console.error('Error char index:', event.charIndex);
            isReading = false;
            resetButtonState();
        };
        
        // Speak immediately (must be in user gesture context)
        console.log('Calling speechSynthesis.speak()...');
        speechSynthesis.speak(currentUtterance);
        console.log('speak() called, speaking:', speechSynthesis.speaking, 'pending:', speechSynthesis.pending);
        
        // Verify it started after a short delay
        setTimeout(() => {
            if (!speechStarted && !speechSynthesis.speaking && !speechSynthesis.pending && isReading) {
                console.warn('Speech did not start - attempting retry');
                // Retry once
                if (currentUtterance) {
                    speechSynthesis.cancel();
                    setTimeout(() => {
                        speechSynthesis.speak(currentUtterance);
                    }, 50);
                }
            }
        }, 200);
        
    } catch (error) {
        console.error('Exception in speakTextDirectly:', error);
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
            console.log('Speech started');
        };
        
        currentUtterance.onend = () => {
            console.log('Speech ended');
            isReading = false;
            resetButtonState();
        };
        
        currentUtterance.onerror = (event) => {
            console.error('Speech error:', event);
            console.error('Error type:', event.error);
            console.error('Error message:', event.message);
            isReading = false;
            resetButtonState();
            // Errors are logged to console only, no popup alerts
        };
        
        // Speak immediately (must be called from user gesture context)
        speechSynthesis.speak(currentUtterance);
        
        // Verify it actually started (Chrome sometimes silently fails)
        setTimeout(() => {
            if (!speechSynthesis.speaking && !speechSynthesis.pending && isReading) {
                console.warn('Speech did not start, may need user gesture');
                isReading = false;
                resetButtonState();
                // No alert, just log to console
            }
        }, 500);
        
    } catch (error) {
        console.error('Error calling speak:', error);
        isReading = false;
        resetButtonState();
        // Errors are logged to console only, no popup alerts
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
    
    // Find blog content
    const blogContent = modalBody.querySelector('.blog-content') ||
                       modalBody.querySelector('.blog-section .blog-content') ||
                       modalBody.querySelector('.blog-section');
    
    if (!blogContent) {
        return;
    }
    
    // Show loading state
    blogContent.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Translating content...</p>';
    
    try {
        // Extract text from original content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalContent;
        const originalBlogContent = tempDiv.querySelector('.blog-content') ||
                                   tempDiv.querySelector('.blog-section .blog-content') ||
                                   tempDiv.querySelector('.blog-section');
        
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
                console.error('Translation chunk error:', chunkError);
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
            console.warn('Translation failed. Please check your internet connection.');
            modalBody.innerHTML = originalContent;
            requestAnimationFrame(() => {
                initReadAloud();
                initTranslate();
            });
        }
    } catch (error) {
        console.error('Translation error:', error);
        modalBody.innerHTML = originalContent;
        requestAnimationFrame(() => {
            initReadAloud();
            initTranslate();
        });
        // Errors are logged to console only, no popup alerts
    }
    
    stopReadAloud();
}
