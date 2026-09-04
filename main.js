/**
 * ==========================================================================
 * MAIN SCRIPT & 3D ENGINE
 * Ashish ku. Das - Portfolio Interactive Logic
 * ==========================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Interactive 3D Three.js Hero Scene
  // --------------------------------------------------------------------------
  const initHero3D = () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const container = canvas.parentElement;
    let width = container.clientWidth || 450;
    let height = container.clientHeight || 450;

    // Scene, Camera & Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Master Group for 3D Rig
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Core Tech Sphere: Wireframe Icosahedron
    const coreGeometry = new THREE.IcosahedronGeometry(1.6, 2);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      wireframe: true,
      wireframeLinewidth: 1.5,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x005577,
      emissiveIntensity: 0.4
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    masterGroup.add(coreMesh);

    // Inner Glowing Core (solid pulsating center)
    const innerGeometry = new THREE.OctahedronGeometry(0.85, 0);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.8
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    masterGroup.add(innerMesh);

    // Orbital Ring 1 (Cyan)
    const ring1Geometry = new THREE.TorusGeometry(2.3, 0.025, 16, 100);
    const ring1Material = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.75
    });
    const ring1 = new THREE.Mesh(ring1Geometry, ring1Material);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    masterGroup.add(ring1);

    // Orbital Ring 2 (Purple / Violet)
    const ring2Geometry = new THREE.TorusGeometry(2.7, 0.02, 16, 100);
    const ring2Material = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.6
    });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 3;
    masterGroup.add(ring2);

    // Orbiting Satellites / Nodes
    const nodeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const nodeMaterial1 = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const nodeMaterial2 = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const nodeMaterial3 = new THREE.MeshBasicMaterial({ color: 0xa855f7 });

    const node1 = new THREE.Mesh(nodeGeometry, nodeMaterial1);
    const node2 = new THREE.Mesh(nodeGeometry, nodeMaterial2);
    const node3 = new THREE.Mesh(nodeGeometry, nodeMaterial3);

    masterGroup.add(node1);
    masterGroup.add(node2);
    masterGroup.add(node3);

    // Floating Ambient Star Particles
    const particlesCount = 140;
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.8
    });
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 3, 20);
    cyanLight.position.set(4, 4, 4);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 3, 20);
    purpleLight.position.set(-4, -4, 2);
    scene.add(purpleLight);

    // Interactive Mouse / Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

      // Normalized coordinates (-1 to 1)
      mouseX = (clientX / window.innerWidth) * 2 - 1;
      mouseY = -(clientY / window.innerHeight) * 2 + 1;

      targetX = mouseX * 0.45;
      targetY = mouseY * 0.45;

      if (isDragging) {
        const deltaX = clientX - previousMousePosition.x;
        const deltaY = clientY - previousMousePosition.y;
        masterGroup.rotation.y += deltaX * 0.008;
        masterGroup.rotation.x += deltaY * 0.008;
        previousMousePosition = { x: clientX, y: clientY };
      }
    };

    const onPointerDown = (e) => {
      isDragging = true;
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);

    // Touch support for mobile devices
    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Handle Window Resize
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // Performance Optimization: Pause rendering when Hero is off-screen
    let isHeroVisible = true;
    const heroSection = document.getElementById('hero');
    if (heroSection && 'IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isHeroVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      heroObserver.observe(heroSection);
    }

    // Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isHeroVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Autonomous rotation
      coreMesh.rotation.y = elapsedTime * 0.15;
      coreMesh.rotation.x = elapsedTime * 0.08;

      innerMesh.rotation.y = -elapsedTime * 0.25;
      innerMesh.rotation.z = elapsedTime * 0.18;

      // Subtle breathing scale on inner core
      const pulseScale = 1 + Math.sin(elapsedTime * 2.5) * 0.08;
      innerMesh.scale.set(pulseScale, pulseScale, pulseScale);

      // Rings rotation
      ring1.rotation.z = elapsedTime * 0.2;
      ring2.rotation.z = -elapsedTime * 0.15;

      // Orbiting Satellites positioning
      const angle1 = elapsedTime * 0.8;
      node1.position.x = Math.cos(angle1) * 2.3;
      node1.position.y = Math.sin(angle1) * Math.sin(Math.PI / 3) * 2.3;
      node1.position.z = Math.sin(angle1) * Math.cos(Math.PI / 3) * 2.3;

      const angle2 = -elapsedTime * 0.6 + Math.PI;
      node2.position.x = Math.cos(angle2) * 2.7;
      node2.position.y = Math.sin(angle2) * Math.sin(-Math.PI / 4) * 2.7;
      node2.position.z = Math.sin(angle2) * Math.cos(-Math.PI / 4) * 2.7;

      const angle3 = elapsedTime * 0.4 + Math.PI / 2;
      node3.position.x = Math.sin(angle3) * 2.1;
      node3.position.y = Math.cos(angle3) * 2.1;
      node3.position.z = Math.sin(angle3 * 0.5) * 0.8;

      // Slow drift of particle system
      particleSystem.rotation.y = elapsedTime * 0.02;

      // Smooth lerped mouse follow / tilt parallax
      if (!isDragging) {
        masterGroup.rotation.y += (targetX - masterGroup.rotation.y * 0.2) * 0.05;
        masterGroup.rotation.x += (-targetY - masterGroup.rotation.x * 0.2) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();
  };

  // --------------------------------------------------------------------------
  // 2. 3D Tilt Effect on Project Cards
  // --------------------------------------------------------------------------
  const initProjectCardTilt = () => {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      let rect = card.getBoundingClientRect();

      const handleMouseMove = (e) => {
        rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      };

      const handleMouseLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    });
  };

  // --------------------------------------------------------------------------
  // 3. Navigation: Sticky Styling, Scrollspy & Mobile Menu Toggle
  // --------------------------------------------------------------------------
  const initNavigation = () => {
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Navbar scroll background change
    const onScroll = () => {
      if (window.scrollY > 40) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }

      // Scrollspy active indicator
      let currentSectionId = '';
      const scrollPosition = window.scrollY + 120;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
          }
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile Hamburger Toggle
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        mobileToggle.classList.toggle('is-active', isOpen);
        mobileToggle.setAttribute('aria-expanded', isOpen);
      });

      // Close menu when a link is clicked
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
          mobileToggle.classList.remove('is-active');
          mobileToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  };

  // --------------------------------------------------------------------------
  // 4. Scroll Reveal Animations (IntersectionObserver)
  // --------------------------------------------------------------------------
  const initScrollReveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      reveals.forEach((el) => revealObserver.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('active'));
    }
  };

  // --------------------------------------------------------------------------
  // 5. Interactive Contact Form Handler
  // --------------------------------------------------------------------------
  const initContactForm = () => {
    const form = document.getElementById('portfolio-contact-form');
    const toast = document.getElementById('contact-toast');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-linecap="round"/>
          </svg>
          Sending...
        `;
      }

      // Simulate asynchronous send
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        if (toast) {
          toast.classList.add('success');
          toast.textContent = '✓ Thank you! Your message has been sent successfully.';
          setTimeout(() => {
            toast.classList.remove('success');
          }, 5000);
        }

        form.reset();
      }, 1000);
    });
  };

  // --------------------------------------------------------------------------
  // Initialization on DOM Content Loaded
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initHero3D();
    initProjectCardTilt();
    initNavigation();
    initScrollReveal();
    initContactForm();
  });
})();
