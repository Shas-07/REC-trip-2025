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
    requestAnimationFrame(() => {
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
    
    // Remove old listeners by cloning
    const newBtn = readAloudBtn.cloneNode(true);
    newBtn.id = 'readAloudBtn';
    newBtn.className = readAloudBtn.className;
    readAloudBtn.parentNode.replaceChild(newBtn, readAloudBtn);
    
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
        e.preventDefault();
        e.stopPropagation();
        
        if (isReading) {
            stopReadAloud();
        } else {
            startReadAloud();
        }
    };
    
    // Attach event listeners
    newBtn.addEventListener('click', handleClick, false);
    newBtn.addEventListener('touchend', handleClick, false);
    newBtn.onclick = handleClick;
    newBtn.ontouchend = handleClick;
}

function startReadAloud() {
    const btn = document.getElementById('readAloudBtn');
    if (btn) {
        btn.classList.add('active');
        const spans = btn.querySelectorAll('span');
        if (spans.length > 1) {
            spans[1].textContent = 'Stop Reading';
        }
    }
    
    if (!speechSynthesis) {
        speechSynthesis = window.speechSynthesis;
    }
    
    if (!modalBody || !modalBody.innerHTML || !modalBody.innerHTML.trim()) {
        resetButtonState();
        return;
    }
    
    // Find blog content
    let blogContent = modalBody.querySelector('.blog-content') ||
                     modalBody.querySelector('.blog-section .blog-content') ||
                     modalBody.querySelector('.blog-section') ||
                     modalBody.querySelector('.place-card-content .blog-content') ||
                     modalBody.querySelector('.place-card-content .blog-section');
    
    if (!blogContent) {
        resetButtonState();
        return;
    }
    
    // Extract text
    let text = blogContent.textContent || blogContent.innerText || '';
    text = text.replace(/\s+/g, ' ').trim();
    
    if (!text || text.length < 10) {
        resetButtonState();
        return;
    }
    
    // Cancel existing speech
    if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
    }
    
    // Create and speak utterance
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = currentLanguage === 'en' ? 'en-US' : (currentLanguage === 'hi' ? 'hi-IN' : 'kn-IN');
    currentUtterance.rate = 0.9;
    currentUtterance.pitch = 1;
    currentUtterance.volume = 1;
    
    isReading = true;
    
    currentUtterance.onend = () => {
        resetButtonState();
    };
    
    currentUtterance.onerror = () => {
        resetButtonState();
    };
    
    try {
        speechSynthesis.speak(currentUtterance);
    } catch (error) {
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
        modalBody.innerHTML = originalContent;
        requestAnimationFrame(() => {
            initReadAloud();
        });
    }
    
    stopReadAloud();
}
