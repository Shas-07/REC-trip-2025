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
    console.log('🔵 Opening modal for place:', placeId);
    
    // Find content - try all possible locations
    let contentData = document.querySelector(`.place-content-data[data-place="${placeId}"]`);
    let content = null;
    
    if (contentData) {
        content = contentData.querySelector('.place-card-content');
        console.log('✅ Found content in place-content-data for:', placeId);
    }
    
    // If not found, try visible place-card
    if (!content) {
        const placeCard = document.querySelector(`.place-card[data-place="${placeId}"]`);
        if (placeCard) {
            content = placeCard.querySelector('.place-card-content');
            console.log('✅ Found content in place-card for:', placeId);
        }
    }
    
    if (!content) {
        console.error('❌ Content not found for place:', placeId);
        return;
    }
    
    // Store original content and load into modal
    originalContent = content.innerHTML;
    modalBody.innerHTML = originalContent;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalBody.scrollTop = 0;
    
    // Reset to English
    currentLanguage = 'en';
    stopReadAloud();
    
    console.log('🔄 Initializing features for:', placeId);
    
    // Initialize features - use multiple attempts to ensure button is ready
    // First attempt: immediate (microtask)
    Promise.resolve().then(() => {
        console.log('🔧 Attempt 1: Running initReadAloud for:', placeId);
        initReadAloud();
        initTranslate();
        updateTranslateUI();
        
        // Verify button was initialized
        const btn = document.getElementById('readAloudBtn');
        if (btn) {
            console.log('✅ Read Aloud button found and initialized (attempt 1) for:', placeId);
        } else {
            console.warn('⚠️ Button not found on attempt 1, retrying...');
            // Retry after a short delay
            setTimeout(() => {
                console.log('🔧 Attempt 2: Retrying initReadAloud for:', placeId);
                initReadAloud();
                const btn2 = document.getElementById('readAloudBtn');
                if (btn2) {
                    console.log('✅ Read Aloud button found on retry for:', placeId);
                } else {
                    console.error('❌ Read Aloud button NOT found after retry for:', placeId);
                }
            }, 100);
        }
    });
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Stop any ongoing speech
    stopReadAloud();
}

// Event listeners
document.querySelectorAll('.place-card-modern').forEach(card => {
    card.addEventListener('click', () => {
        const placeId = card.getAttribute('data-place');
        openModal(placeId);
    });
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

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
    
    // Close popup
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
    
    // Close on escape key
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

// Load original content from existing cards if available
document.addEventListener('DOMContentLoaded', () => {
    // Try to extract content from existing place cards
    if (typeof placeContent !== 'undefined') {
        Object.keys(placeContent).forEach(placeId => {
            const originalCard = document.querySelector(`[data-place="${placeId}"]`)?.closest('.place-card');
            if (originalCard) {
                const content = originalCard.querySelector('.place-card-content');
                if (content) {
                    placeContent[placeId].content = content.innerHTML;
                }
            }
        });
    }
    
    // Initialize read aloud and translate features (will be re-initialized when modal opens)
    setTimeout(() => {
        initReadAloud();
        initTranslate();
    }, 500);
});

// Read Aloud functionality
let speechSynthesis = null;
let currentUtterance = null;
let isReading = false;
let touchStarted = false; // Track touch events for mobile

function initReadAloud() {
    console.log('🎤 initReadAloud() called');
    const readAloudBtn = document.getElementById('readAloudBtn');
    if (!readAloudBtn) {
        console.error('❌ Read Aloud button not found by ID');
        // Try alternative selectors
        const altBtn = document.querySelector('.read-aloud-btn');
        if (altBtn) {
            console.log('✅ Found button by class, assigning ID');
            altBtn.id = 'readAloudBtn';
            // Retry initialization
            return initReadAloud();
        }
        console.error('❌ Read Aloud button not found at all');
        return;
    }
    
    console.log('✅ Read Aloud button found');
    
    // Check browser support
    if (!('speechSynthesis' in window)) {
        console.warn('⚠️ Speech synthesis not supported');
        readAloudBtn.style.display = 'none';
        return;
    }
    
    // Initialize speech synthesis
    if (!speechSynthesis) {
        speechSynthesis = window.speechSynthesis;
        console.log('✅ Speech synthesis initialized');
    }
    
    // Remove old listeners by cloning
    const newBtn = readAloudBtn.cloneNode(true);
    newBtn.id = 'readAloudBtn';
    const parent = readAloudBtn.parentNode;
    if (parent) {
        parent.replaceChild(newBtn, readAloudBtn);
        console.log('✅ Button cloned and replaced');
    } else {
        console.error('❌ Could not replace button - parent not found');
        return;
    }
    
    // Handler function - defined once for reuse
    const handleButtonClick = function(e) {
        console.log('🔘 Button clicked/touched!', e.type);
        e.preventDefault();
        e.stopPropagation();
        if (isReading) {
            console.log('⏹️ Stopping read aloud');
            stopReadAloud();
        } else {
            console.log('▶️ Starting read aloud');
            startReadAloudDirect(e);
        }
    };
    
    // Attach both click and touchend handlers
    // Use addEventListener for better compatibility
    newBtn.addEventListener('click', handleButtonClick, { passive: false });
    newBtn.addEventListener('touchend', handleButtonClick, { passive: false });
    newBtn.addEventListener('touchstart', function(e) {
        console.log('👆 Touch start detected');
    }, { passive: true });
    
    console.log('✅ Event listeners attached to button');
}

// Direct start function - called immediately from user gesture (CRITICAL for mobile)
function startReadAloudDirect(event) {
    console.log('🎙️ startReadAloudDirect() called');
    
    // Update button immediately
    const btn = document.getElementById('readAloudBtn');
    if (btn) {
        btn.classList.add('active');
        const spans = btn.querySelectorAll('span');
        if (spans.length > 1) spans[1].textContent = 'Stop Reading';
        console.log('✅ Button state updated');
    } else {
        console.error('❌ Button not found in startReadAloudDirect');
    }
    
    if (!speechSynthesis) {
        if ('speechSynthesis' in window) {
            speechSynthesis = window.speechSynthesis;
            console.log('✅ Speech synthesis initialized in startReadAloudDirect');
        } else {
            console.error('❌ Speech synthesis not available');
            resetButtonState();
            return;
        }
    }
    
    if (!modalBody || !modalBody.innerHTML || !modalBody.innerHTML.trim()) {
        console.error('❌ Modal body is empty or not found');
        resetButtonState();
        return;
    }
    
    console.log('✅ Modal body found, length:', modalBody.innerHTML.length);
    
    // Find blog content - try multiple selectors
    let blogContent = modalBody.querySelector('.blog-content') ||
                     modalBody.querySelector('.blog-section .blog-content') ||
                     modalBody.querySelector('.blog-section') ||
                     modalBody.querySelector('.place-card-content .blog-content') ||
                     modalBody.querySelector('.place-card-content .blog-section');
    
    if (!blogContent) {
        console.error('❌ Blog content not found. Selectors tried: .blog-content, .blog-section .blog-content, .blog-section, .place-card-content .blog-content, .place-card-content .blog-section');
        console.log('Modal body HTML preview:', modalBody.innerHTML.substring(0, 200));
        resetButtonState();
        return;
    }
    
    console.log('✅ Blog content found:', blogContent.className || 'no class');
    
    // Extract text - use textContent (works even if from hidden parent)
    let text = blogContent.textContent || blogContent.innerText || '';
    console.log('📝 Extracted text length:', text.length);
    text = text.replace(/\s+/g, ' ').trim();
    
    if (!text || text.length < 10) {
        console.error('❌ Text too short or empty:', text.length);
        resetButtonState();
        return;
    }
    
    console.log('✅ Text extracted successfully, length:', text.length);
    
    // Check protocol (HTTPS required for mobile)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        console.warn('⚠️ Not HTTPS - speech may not work on mobile');
    }
    
    // Cancel any existing speech
    if (speechSynthesis.speaking || speechSynthesis.pending) {
        console.log('⏹️ Canceling existing speech');
        speechSynthesis.cancel();
    }
    
    // Create utterance
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = currentLanguage === 'en' ? 'en-US' : (currentLanguage === 'hi' ? 'hi-IN' : 'kn-IN');
    currentUtterance.rate = 0.9;
    currentUtterance.pitch = 1;
    currentUtterance.volume = 1;
    
    isReading = true;
    
    // Event handlers
    currentUtterance.onend = () => {
        console.log('✅ Speech ended');
        resetButtonState();
    };
    
    currentUtterance.onerror = (error) => {
        console.error('❌ Speech error:', error);
        resetButtonState();
    };
    
    // CRITICAL: Call speak() immediately (synchronously from user gesture)
    try {
        console.log('🎤 Calling speechSynthesis.speak()...');
        speechSynthesis.speak(currentUtterance);
        console.log('✅ speechSynthesis.speak() called successfully');
    } catch (error) {
        console.error('❌ Error calling speak():', error);
        resetButtonState();
    }
}

function stopReadAloud() {
    if (speechSynthesis) {
        // Cancel all speech synthesis (important for mobile)
        if (speechSynthesis.speaking || speechSynthesis.pending) {
            speechSynthesis.cancel();
        }
        isReading = false;
    }
    resetButtonState();
}

// Helper function to reset button state
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
    
    if (!translateBtn || !translateDropdown) return;
    
    // Remove existing event listeners by cloning
    const newBtn = translateBtn.cloneNode(true);
    translateBtn.parentNode.replaceChild(newBtn, translateBtn);
    
    const newDropdown = document.getElementById('translateDropdown');
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
    document.removeEventListener('click', clickHandler);
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
    if (!modalBody || !originalContent) return;
    
    // If English, restore original content
    if (targetLang === 'en') {
        modalBody.innerHTML = originalContent;
        stopReadAloud();
        // Re-initialize after restoring content
        requestAnimationFrame(() => {
            initReadAloud();
        });
        return;
    }
    
    // Find blog content - same logic as read aloud
    const blogContent = modalBody.querySelector('.blog-content') ||
                       modalBody.querySelector('.blog-section .blog-content') ||
                       modalBody.querySelector('.blog-section');
    if (!blogContent) return;
    
    // Show loading state
    blogContent.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Translating content...</p>';
    
    try {
        // Extract text content from original - use textContent for reliability
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalContent;
        const originalBlogContent = tempDiv.querySelector('.blog-content') ||
                                   tempDiv.querySelector('.blog-section .blog-content') ||
                                   tempDiv.querySelector('.blog-section');
        if (!originalBlogContent) {
            modalBody.innerHTML = originalContent;
            requestAnimationFrame(() => {
                initReadAloud();
            });
            return;
        }
        
        // Use textContent (same as read aloud for consistency)
        const textToTranslate = originalBlogContent.textContent || originalBlogContent.innerText || '';
        
        // Use Google Translate API (public endpoint) - split into chunks if too long
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
                        // Extract translated text from chunk
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
                    // Get 2-4 sentences per paragraph
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
            
            // Re-initialize read aloud after translation
            requestAnimationFrame(() => {
                initReadAloud();
            });
        } else {
            // Restore original on error
            modalBody.innerHTML = originalContent;
            requestAnimationFrame(() => {
                initReadAloud();
            });
            alert('Translation failed. Please check your internet connection and try again.');
        }
    } catch (error) {
        console.error('Translation error:', error);
        // Restore original content on error
        modalBody.innerHTML = originalContent;
        requestAnimationFrame(() => {
            initReadAloud();
        });
    }
    
    // Stop any ongoing speech when language changes
    stopReadAloud();
}
