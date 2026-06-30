/* ==========================================================================
   INTERACTIVE LOGIC - MANOJ V PORTFOLIO
   ========================================================================== */

console.log('Portfolio script loading...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    console.log('Three.js loaded:', typeof THREE !== 'undefined');
    // 1. PRELOADER CONTROLLER
    const preloader = document.getElementById('preloader');
    document.body.classList.add('preloader-active');
    
    // Safety fallback to make sure page displays even if loading takes too long
    const preloaderTimeout = setTimeout(dismissPreloader, 3000);
    
    window.addEventListener('load', () => {
        clearTimeout(preloaderTimeout);
        dismissPreloader();
    });
    
    function dismissPreloader() {
        if (preloader && !preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
            document.body.classList.remove('preloader-active');
            
            // Start animations in view
            triggerScrollReveal();
        }
    }

    // 2. THEME SWITCHER (DARK / LIGHT)
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check saved preference
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        document.body.classList.remove('light-theme');
        themeIcon.className = 'fa-solid fa-moon';
    }
    
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        if (isLight) {
            localStorage.setItem('portfolio-theme', 'light');
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            localStorage.setItem('portfolio-theme', 'dark');
            themeIcon.className = 'fa-solid fa-moon';
        }
        
        // Redraw canvas particles with appropriate color based on theme
        init3DParticles();
    });

    // 3. MOBILE MENU NAVIGATION
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('preloader-active'); // Prevent scrolling behind menu
    });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('preloader-active');
        });
    });

    // 4. NAVBAR SCROLL EFFECT & ACTIVE STATE
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        // Sticky Header Glassmorphism
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active Link Highlighter on Scroll
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });

    // 5. HERO TYPING EFFECT
    const typingText = document.getElementById('typing-text');
    const roles = ['Software Engineer Aspirant', 'Frontend Developer', 'Problem Solver'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeEffect() {
        if (!typingText) return;
        
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster deleting
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Regular typing speed
        }
        
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start typing
    setTimeout(typeEffect, 1000);

    // 6. SCROLL REVEAL (Intersection Observer)
    const revealItems = document.querySelectorAll('.reveal-item');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                
                // Trigger stats count up when About section enters
                if (entry.target.classList.contains('about-stats-col')) {
                    startCounterAnimation();
                }
                // Trigger skills progress bar load when Skills enters
                if (entry.target.classList.contains('skills-grid')) {
                    document.body.classList.add('skills-animated');
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    function triggerScrollReveal() {
        revealItems.forEach(item => {
            revealObserver.observe(item);
        });
    }

    // 7. STATS COUNTER ANIMATION
    let counterStarted = false;
    
    function startCounterAnimation() {
        if (counterStarted) return;
        counterStarted = true;
        
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isDecimal = target % 1 !== 0;
            const duration = 2000; // 2 seconds duration
            const startTime = performance.now();
            
            function updateNumber(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const currentVal = easeProgress * target;
                
                if (isDecimal) {
                    stat.textContent = currentVal.toFixed(1);
                } else {
                    stat.textContent = Math.floor(currentVal) + '+';
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = isDecimal ? target : target + '+';
                }
            }
            
            requestAnimationFrame(updateNumber);
        });
    }

    // 8. INTERACTIVE TRUE 3D CANVAS PARTICLES
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas?.getContext('2d');
    let particles3DArray = [];
    let animationFrameId;
    const fov = 400; // Field of view / perspective depth factor
    
    const mouse = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight / 2
    };
    
    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    });
    
    window.addEventListener('resize', () => {
        init3DParticles();
    });
    
    class Particle3D {
        constructor(x, y, z, size) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.baseSize = size;
            
            // Speed of floating through depth
            this.speedZ = -0.5 - Math.random() * 0.5;
        }
        
        rotateX(angle) {
            const rad = angle * Math.PI / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            const y1 = this.y * cos - this.z * sin;
            const z1 = this.z * cos + this.y * sin;
            this.y = y1;
            this.z = z1;
        }
        
        rotateY(angle) {
            const rad = angle * Math.PI / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            const x1 = this.x * cos - this.z * sin;
            const z1 = this.z * cos + this.x * sin;
            this.x = x1;
            this.z = z1;
        }
        
        update(rotateSpeedX, rotateSpeedY) {
            // Apply mouse-driven camera rotations
            if (rotateSpeedX !== 0) this.rotateX(rotateSpeedX);
            if (rotateSpeedY !== 0) this.rotateY(rotateSpeedY);
            
            // Move through 3D space (towards the viewport)
            this.z += this.speedZ;
            
            // Recycle particles once they get too close to the screen
            if (this.z <= -fov) {
                this.z = fov + Math.random() * 200;
                this.x = (Math.random() - 0.5) * 800;
                this.y = (Math.random() - 0.5) * 800;
            }
        }
        
        project() {
            // 3D coordinate projection onto 2D viewport coordinates
            const scale = fov / (fov + this.z);
            const projX = this.x * scale + canvas.width / 2;
            const projY = this.y * scale + canvas.height / 2;
            const size = this.baseSize * scale;
            
            return { x: projX, y: projY, size: size, scale: scale };
        }
    }
    
    function init3DParticles() {
        if (!canvas || !ctx) return;
        
        cancelAnimationFrame(animationFrameId);
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        particles3DArray = [];
        
        // Define appropriate particle count based on display size
        const count = Math.floor((canvas.width * canvas.height) / 10000);
        
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 1000;
            const y = (Math.random() - 0.5) * 1000;
            const z = Math.random() * (fov * 2) - fov;
            const size = Math.random() * 2 + 1.5;
            
            particles3DArray.push(new Particle3D(x, y, z, size));
        }
        
        animate3DParticles();
    }
    
    function animate3DParticles() {
        if (!ctx || !canvas) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Smooth mouse movement interpolation
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
        
        // Calculate camera rotation speeds based on mouse coordinates relative to center
        const rotX = (mouse.y - canvas.height / 2) * 0.0003;
        const rotY = (mouse.x - canvas.width / 2) * 0.0003;
        
        const isLight = document.body.classList.contains('light-theme');
        const particleColor = isLight ? 'rgba(8, 145, 178, ' : 'rgba(34, 211, 238, ';
        const lineColor = isLight ? 'rgba(8, 145, 178, ' : 'rgba(34, 211, 238, ';
        
        // Update positions
        particles3DArray.forEach(p => p.update(rotX, -rotY));
        
        // Draw connecting network lines in 3D
        ctx.lineWidth = 1;
        
        for (let a = 0; a < particles3DArray.length; a++) {
            const pA = particles3DArray[a];
            const projA = pA.project();
            
            // Skip drawing if particle falls out of screen boundaries
            if (projA.x < 0 || projA.x > canvas.width || projA.y < 0 || projA.y > canvas.height) continue;
            
            // Render particle node
            const alphaNode = Math.max(0, Math.min(1 - pA.z / fov, 0.7));
            ctx.beginPath();
            ctx.arc(projA.x, projA.y, Math.max(0.1, projA.size), 0, Math.PI * 2);
            ctx.fillStyle = particleColor + alphaNode + ')';
            ctx.fill();
            
            // Draw connections to nearby nodes
            for (let b = a + 1; b < particles3DArray.length; b++) {
                const pB = particles3DArray[b];
                
                // Calculate distance in 3D coordinates
                const dx = pA.x - pB.x;
                const dy = pA.y - pB.y;
                const dz = pA.z - pB.z;
                const distance3D = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                if (distance3D < 130) {
                    const projB = pB.project();
                    
                    // Alpha based on average depth and distance
                    const avgZ = (pA.z + pB.z) / 2;
                    const depthAlpha = Math.max(0, Math.min(1 - avgZ / fov, 0.7));
                    const distanceAlpha = 1 - (distance3D / 130);
                    const finalAlpha = Math.min(depthAlpha, distanceAlpha) * 0.15;
                    
                    ctx.beginPath();
                    ctx.moveTo(projA.x, projA.y);
                    ctx.lineTo(projB.x, projB.y);
                    ctx.strokeStyle = lineColor + finalAlpha + ')';
                    ctx.stroke();
                }
            }
        }
        
        animationFrameId = requestAnimationFrame(animate3DParticles);
    }
    
    init3DParticles();

    // 9. DYNAMIC 3D CARD TILT & GLOSS REFLECTION (Stripe & Apple Style)
    const tiltCards = document.querySelectorAll('.tilt-target');
    
    tiltCards.forEach(card => {
        // Inject a glare element dynamically to maintain clean HTML markup
        if (!card.querySelector('.card-glare')) {
            const glare = document.createElement('div');
            glare.className = 'card-glare';
            card.appendChild(glare);
        }
        
        const glare = card.querySelector('.card-glare');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // mouse x position inside the card
            const y = e.clientY - rect.top;  // mouse y position inside the card
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate dynamic rotation angle (max 15 degrees tilt)
            const rotateX = ((centerY - y) / centerY) * 15;
            const rotateY = ((x - centerX) / centerX) * 15;
            
            // Apply Card Tilt Transform
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            
            // Calculate mouse percentage for glare gradient direction
            const percentX = (x / rect.width) * 100;
            const percentY = (y / rect.height) * 100;
            
            // Apply radial gradient shifts reflecting glare off glass surface
            const isLight = document.body.classList.contains('light-theme');
            if (isLight) {
                glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(8, 145, 178, 0.08) 0%, transparent 65%)`;
            } else {
                glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.12) 0%, transparent 60%)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            // Smoothly snap back to origin
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
            glare.style.background = 'transparent';
        });
    });

    // 10. CONTACT FORM INTERACTION
    const contactForm = document.getElementById('portfolio-contact-form');
    const toast = document.getElementById('contact-success-toast');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            // Show sending state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-text">Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';
            
            // Simulate API request delay
            setTimeout(() => {
                // Show success notification
                showToast();
                
                // Reset Form
                contactForm.reset();
                
                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1500);
        });
    }
    
    function showToast() {
        if (toast) {
            toast.classList.add('show');
            // Auto hide after 5 seconds
            setTimeout(closeToast, 5000);
        }
    }
    
    window.closeToast = function() {
        if (toast) {
            toast.classList.remove('show');
        }
    };
    
    // 11. RESUME BUTTON ALERT (Placeholder Resume Setup)
    const resumeBtns = document.querySelectorAll('.resume-btn');
    resumeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert("Manoj V's Resume is being prepared! In a production deployment, this link can connect directly to a resume PDF file hosted on your repository.");
        });
    });

    // 12. CURSOR GLOW FOLLOWER
    const cursorGlow = document.getElementById('cursor-glow');
    let glowX = 0, glowY = 0;
    let curGlowX = 0, curGlowY = 0;
    
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            glowX = e.clientX;
            glowY = e.clientY;
        });
        
        function animateGlow() {
            // Smooth interpolation
            curGlowX += (glowX - curGlowX) * 0.08;
            curGlowY += (glowY - curGlowY) * 0.08;
            
            cursorGlow.style.left = curGlowX + 'px';
            cursorGlow.style.top = curGlowY + 'px';
            
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    // 13. SCROLL PARALLAX FOR 3D GEOMETRIC SHAPES
    const geoShapesContainer = document.querySelector('.geo-shapes-container');
    const geoShapes = document.querySelectorAll('.geo-shape');
    
    if (geoShapesContainer && geoShapes.length > 0) {
        let scrollParallaxFrame;
        
        window.addEventListener('scroll', () => {
            if (scrollParallaxFrame) cancelAnimationFrame(scrollParallaxFrame);
            
            scrollParallaxFrame = requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const viewportHeight = window.innerHeight;
                const scrollProgress = scrollY / (document.body.scrollHeight - viewportHeight);
                
                geoShapes.forEach((shape, index) => {
                    // Each shape gets a different parallax speed
                    const speed = 0.3 + (index * 0.15);
                    const yOffset = scrollY * speed * 0.1;
                    const rotation = scrollProgress * 360 * (index % 2 === 0 ? 1 : -1);
                    
                    shape.style.transform = `translateY(${-yOffset}px) rotate(${rotation}deg)`;
                });
            });
        });
    }

    // 14. ENHANCED PARTICLE MOUSE REACTIVITY (Repulsion Effect)
    if (canvas && ctx) {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseCanvasX = e.clientX - rect.left;
            const mouseCanvasY = e.clientY - rect.top;
            
            particles3DArray.forEach(p => {
                const proj = p.project();
                const dx = proj.x - mouseCanvasX;
                const dy = proj.y - mouseCanvasY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Repel nearby particles
                if (dist < 100) {
                    const force = (100 - dist) / 100;
                    p.x += (dx / dist) * force * 2;
                    p.y += (dy / dist) * force * 2;
                }
            });
        });
    }

    // 15. SMOOTH SECTION SCROLL WITH NAVBAR
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 16. ANIMATED SECTION TITLE GLOW (data-text attribute sync)
    document.querySelectorAll('.section-title').forEach(title => {
        title.setAttribute('data-text', title.textContent);
    });

    // 17. THREE.JS 3D HERO ELEMENT - Interactive Geometric Lattice
    function initThreeHero() {
        console.log('Initializing Three.js...');
        try {
            const canvas = document.getElementById('three-hero-canvas');
            if (!canvas) {
                console.warn('Three.js canvas not found');
                return;
            }
            
            if (typeof THREE === 'undefined') {
                console.warn('Three.js library not loaded - skipping 3D effects');
                // Hide the canvas if Three.js is not available
                canvas.style.display = 'none';
                // Show fallback message
                const fallback = document.getElementById('threejs-fallback');
                if (fallback) fallback.style.display = 'block';
                return;
            }

            console.log('Three.js is available, creating scene...');
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            console.log('Three.js renderer created successfully');

        // Create main geometric sphere with wireframe
        const geometry = new THREE.IcosahedronGeometry(2, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0x06B6D4,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Create inner glowing core
        const coreGeometry = new THREE.IcosahedronGeometry(1, 1);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: 0x3B82F6,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        scene.add(core);

        // Create floating particles around sphere
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 200;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 8;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x06B6D4,
            transparent: true,
            opacity: 0.6
        });
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // Position camera
        camera.position.z = 5;

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);

            // Smooth mouse following
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            // Rotate sphere based on mouse
            sphere.rotation.x += 0.002 + targetY * 0.01;
            sphere.rotation.y += 0.003 + targetX * 0.01;

            // Rotate core in opposite direction
            core.rotation.x -= 0.003;
            core.rotation.y -= 0.002;

            // Rotate particles slowly
            particles.rotation.y += 0.001;
            particles.rotation.x += 0.0005;

            // Gentle floating animation
            const time = Date.now() * 0.001;
            sphere.position.y = Math.sin(time) * 0.1;
            core.position.y = Math.sin(time * 1.5) * 0.05;

            // Update colors based on theme
            const isLight = document.body.classList.contains('light-theme');
            if (isLight) {
                material.color.setHex(0x0891B2);
                coreMaterial.color.setHex(0x3B82F6);
                particlesMaterial.color.setHex(0x0891B2);
            } else {
                material.color.setHex(0x06B6D4);
                coreMaterial.color.setHex(0x3B82F6);
                particlesMaterial.color.setHex(0x06B6D4);
            }

            renderer.render(scene, camera);
        }

        animate();
        } catch (error) {
            console.error('Three.js initialization error:', error);
        }
    }

    // Initialize Three.js after a short delay
    setTimeout(initThreeHero, 500);

    // 18. CURSOR PARTICLE TRAIL EFFECT
    function initCursorTrail() {
        try {
            const canvas = document.getElementById('cursor-trail-canvas');
            if (!canvas) {
                console.warn('Cursor trail canvas not found');
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.warn('Could not get 2D context for cursor trail');
                return;
            }
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

        const trail = [];
        const maxTrailLength = 20;

        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        function animateTrail() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Add new point
            trail.push({ x: mouseX, y: mouseY, age: 0 });

            // Remove old points
            if (trail.length > maxTrailLength) {
                trail.shift();
            }

            // Draw trail
            const isLight = document.body.classList.contains('light-theme');
            const baseColor = isLight ? '8, 145, 178' : '6, 182, 212';

            for (let i = 0; i < trail.length; i++) {
                const point = trail[i];
                point.age++;

                const alpha = (i / trail.length) * 0.5;
                const size = (i / trail.length) * 8;

                ctx.beginPath();
                ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${baseColor}, ${alpha})`;
                ctx.fill();
            }

            // Connect trail points with lines
            if (trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(trail[0].x, trail[0].y);
                for (let i = 1; i < trail.length; i++) {
                    ctx.lineTo(trail[i].x, trail[i].y);
                }
                ctx.strokeStyle = `rgba(${baseColor}, 0.2)`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            requestAnimationFrame(animateTrail);
        }

        animateTrail();
        } catch (error) {
            console.error('Cursor trail initialization error:', error);
        }
    }

    // Initialize cursor trail
    setTimeout(initCursorTrail, 500);

    // 19. SCROLL PROGRESS INDICATOR
    function initScrollProgress() {
        try {
            const scrollProgress = document.getElementById('scroll-progress');
            if (!scrollProgress) {
                console.warn('Scroll progress element not found');
                return;
            }

            window.addEventListener('scroll', () => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                scrollProgress.style.width = scrollPercent + '%';
            });
        } catch (error) {
            console.error('Scroll progress initialization error:', error);
        }
    }

    initScrollProgress();

    // 20. MAGNETIC BUTTON EFFECT
    function initMagneticButtons() {
        try {
            const buttons = document.querySelectorAll('.btn-primary, .btn-outline');
            
            buttons.forEach(btn => {
                btn.classList.add('magnetic-btn');
                
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translate(0, 0)';
                });
            });
        } catch (error) {
            console.error('Magnetic buttons initialization error:', error);
        }
    }

    initMagneticButtons();

    // 21. ENHANCED PARALLAX EFFECT
    function initParallax() {
        try {
            const parallaxElements = document.querySelectorAll('.geo-shape, .blob');
            
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                
                parallaxElements.forEach((el, index) => {
                    const speed = 0.1 + (index * 0.05);
                    const yPos = scrollY * speed;
                    el.style.transform = `translateY(${yPos}px)`;
                });
            });
        } catch (error) {
            console.error('Parallax initialization error:', error);
        }
    }

    initParallax();
    
    console.log('All portfolio features initialized successfully');
});

