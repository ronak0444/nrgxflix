document.addEventListener('DOMContentLoaded', () => {
  // ── Preloader ──
  const preloader = document.getElementById('preloader');
  const progress = document.getElementById('preloaderProgress');
  
  let p = 0;
  const interval = setInterval(() => {
    p += Math.random() * 30;
    if (p > 100) p = 100;
    progress.style.width = p + '%';
    
    if (p === 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 500);
    }
  }, 150);

  // ── Custom Cursor ──
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  const spotlight = document.getElementById('spotlight');

  document.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    
    // Spotlight effect
    if (spotlight) {
      spotlight.style.setProperty('--x', `${x}px`);
      spotlight.style.setProperty('--y', `${y}px`);
    }
    
    // Smooth delay for the ring
    setTimeout(() => {
      cursorRing.style.transform = `translate(${x}px, ${y}px)`;
    }, 50);
  });

  // Cursor Hover Effects
  const hoverElements = document.querySelectorAll('a, button, .srv-card, .port-card, .mosaic-item, .magnetic');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width = '80px';
      cursorRing.style.height = '80px';
      cursorRing.style.borderColor = 'var(--primary)';
      cursorRing.style.background = 'rgba(255, 30, 30, 0.05)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width = '40px';
      cursorRing.style.height = '40px';
      cursorRing.style.borderColor = 'var(--primary-glow)';
      cursorRing.style.background = 'transparent';
    });
  });

  // ── Scroll Progress & Navbar ──
  const progressBar = document.getElementById('scrollProgress');
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) progressBar.style.width = scrolled + "%";

    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ── Intersection Observer for Reveal ──
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Counter logic
        const counter = entry.target.querySelector('.counter');
        if (counter) startCounter(counter);
        
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up, .reveal-text').forEach(el => revealObserver.observe(el));

  // ── Mute Toggle Logic ──
  const muteBtn = document.getElementById('muteToggle');
  const heroVid = document.getElementById('heroVid');
  if (muteBtn && heroVid) {
    muteBtn.addEventListener('click', () => {
      heroVid.muted = !heroVid.muted;
      muteBtn.innerHTML = heroVid.muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
    });
  }

  // ── Counter Animation ──
  function startCounter(el) {
    const target = parseInt(el.getAttribute('data-t'));
    const suffix = el.getAttribute('data-s') || '';
    let count = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    function update() {
      count += increment;
      if (count < target) {
        el.innerText = Math.ceil(count) + suffix;
        requestAnimationFrame(update);
      } else {
        el.innerText = target + suffix;
      }
    }
    update();
  }

  // ── Supercharged 3D Tilt ──
  const tiltCards = document.querySelectorAll('.srv-card, .port-card, .mosaic-item, .magnetic-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // More aggressive tilt: divide by 8 instead of 15
      const rotateX = (y - centerY) / 8; 
      const rotateY = (centerX - x) / 8;
      
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      
      // Multi-layer depth for internal elements
      const num = card.querySelector('.srv-num');
      const ico = card.querySelector('.srv-ico');
      const h3 = card.querySelector('h3');
      const p = card.querySelector('p');
      const tag = card.querySelector('.srv-tag');
      
      if (num) num.style.transform = `translateZ(80px) translateX(10px)`;
      if (ico) ico.style.transform = `translateZ(50px) translateY(-5px)`;
      if (h3) h3.style.transform = `translateZ(30px)`;
      if (p) p.style.transform = `translateZ(20px)`;
      if (tag) tag.style.transform = `translateZ(40px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      
      // Reset depths
      const depthEls = card.querySelectorAll('.srv-num, .srv-ico, h3, p, .srv-tag');
      depthEls.forEach(el => el.style.transform = `translateZ(0)`);
    });
  });

  // ── Magnetic Elements (Buttons/Links) ──
  const magneticEls = document.querySelectorAll('.magnetic');
  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = `translate(0, 0)`;
    });
  });

  // ── Before After Slider ──
  const baSlider = document.getElementById('baSlider');
  const baAfter = document.getElementById('baAfter');
  const baHandle = document.getElementById('baHandle');

  if (baSlider) {
    const moveSlider = (e) => {
      const rect = baSlider.getBoundingClientRect();
      let x = (e.pageX || e.touches[0].pageX) - rect.left - window.scrollX;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      const percent = (x / rect.width) * 100;
      baAfter.style.width = percent + "%";
      baHandle.style.left = percent + "%";
    };
    baSlider.addEventListener('mousemove', moveSlider);
    baSlider.addEventListener('touchmove', moveSlider);
  }

  // ── Contact Form ──
  const form = document.getElementById('contactForm');
  const success = document.getElementById('fSuccess');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const originalBtnText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
      const formData = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          form.reset();
          success.style.display = 'block';
          btn.innerHTML = originalBtnText;
          btn.disabled = false;
          setTimeout(() => { success.style.display = 'none'; }, 5000);
        } else {
          throw new Error('Fail');
        }
      } catch (error) {
        if (window.location.protocol === 'file:') {
          form.submit(); 
        } else {
          alert("Problem submitting. Please try again.");
          btn.innerHTML = originalBtnText;
          btn.disabled = false;
        }
      }
    });
  }

  // ── Mobile Menu ──
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (burger) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      burger.classList.toggle('active');
    });
  }
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('active');
        burger.classList.remove('active');
      });
    });
  }

  // ── Back To Top ──
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      toTop.classList.add('visible');
    } else {
      toTop.classList.remove('visible');
    }
  });
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── FAQ Accordion ──
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
});
