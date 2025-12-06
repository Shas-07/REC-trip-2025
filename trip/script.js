// Modal functionality
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

// Open modal with place content
function openModal(placeId) {
    // Get content from hidden content storage
    const contentData = document.querySelector(`.place-content-data[data-place="${placeId}"]`);
    if (contentData) {
        const content = contentData.querySelector('.place-card-content');
        if (content) {
            modalBody.innerHTML = content.innerHTML;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Scroll to top of modal
            modalBody.scrollTop = 0;
        }
    }
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
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
    Object.keys(placeContent).forEach(placeId => {
        const originalCard = document.querySelector(`[data-place="${placeId}"]`)?.closest('.place-card');
        if (originalCard) {
            const content = originalCard.querySelector('.place-card-content');
            if (content) {
                placeContent[placeId].content = content.innerHTML;
            }
        }
    });
});
