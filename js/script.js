document.addEventListener('DOMContentLoaded', () => {
    // Inject Floating Button and Modal to all pages
    injectGlobals();

    // Load Header
    loadComponent('header', '/layout/header.html', () => {
        setupMobileMenu();
        setupDropdowns();
        handleScroll();
    });

    // Load Footer
    loadComponent('footer', '/layout/footer.html');

    // Initialize Scroll Animations
    setupScrollReveal();

    // Sticky Header Logic
    window.addEventListener('scroll', handleScroll);
});

function injectGlobals() {
    // 1. Inject Floating Button
    const floatingBtn = document.createElement('div');
    floatingBtn.className = 'floating-apply';
    floatingBtn.dataset.openModal = 'true';
    floatingBtn.innerHTML = `
        <i class="fas fa-edit" style="font-size: 1.5rem; margin-bottom: 5px;"></i>
        <span>APPLY <br> NOW</span>
    `;
    document.body.appendChild(floatingBtn);

    // 2. Inject Modal
    const modalHTML = `
    <div class="modal" id="enquiryModal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 style="margin-bottom: 25px; text-align: center; color: var(--primary-color);">Direct Admission Enquiry</h2>
            <form>
                <div class="form-group">
                    <label>Candidate Name</label>
                    <input type="text" placeholder="Enter Full Name" required>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="Enter Mobile Number" required>
                </div>
                <div class="form-group">
                    <label>Course Interested</label>
                    <select required>
                        <option value="">Select Course</option>
                        <option>Mechanical Engineering</option>
                        <option>Civil Engineering</option>
                        <option>Computer Engineering</option>
                        <option>Automobile Engineering</option>
                        <option>EEE (Electrical)</option>
                        <option>ECE (Electronics)</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px; background: var(--primary-color); color: white;">Submit Enquiry</button>
            </form>
        </div>
    </div>`;
    
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHTML;
    document.body.appendChild(modalDiv.firstElementChild);

    // After injecting, setup the modal triggers
    setupModal();
}

function loadComponent(id, path, callback) {
    const element = document.getElementById(id);
    if (!element) return;

    fetch(path)
        .then(res => res.text())
        .then(data => {
            element.innerHTML = data;
            if (callback) callback();
        })
        .catch(err => console.error(`Error loading ${path}:`, err));
}

function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

function setupDropdowns() {
    const dropdowns = document.querySelectorAll('.has-dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        const icon = dropdown.querySelector('i');

        // Mobile click logic
        if (link) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    
                    // Close other dropdowns
                    dropdowns.forEach(other => {
                        if (other !== dropdown) {
                            const otherMenu = other.querySelector('.dropdown-menu');
                            if (otherMenu) otherMenu.classList.remove('active');
                        }
                    });

                    if (menu) menu.classList.toggle('active');
                    if (icon) icon.style.transform = (menu && menu.classList.contains('active')) ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            });
        }
    });

    // Close on outside click for mobile
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.has-dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('active');
            });
        }
    });
}

function handleScroll() {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

function setupScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
}

function setupModal() {
    const modal = document.getElementById('enquiryModal');
    const openBtns = document.querySelectorAll('[data-open-modal="true"], .floating-apply, #openModal');
    const closeBtn = document.querySelector('.close-modal');

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (modal) modal.style.display = 'flex';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}
