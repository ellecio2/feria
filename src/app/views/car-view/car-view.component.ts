import { Component, AfterViewInit, OnDestroy } from '@angular/core';

// Interface para los datos del banco
interface BankData {
  name: string;
  interestRate: string;
  financingTotal: string;
  availableTerms: TermOption[];
}

interface TermOption {
  value: string;
  label: string;
  months: number;
}

@Component({
  selector: 'app-car-view',
  imports: [],
  templateUrl: './car-view.component.html',
  styleUrl: './car-view.component.scss'
})
export class CarViewComponent implements AfterViewInit, OnDestroy {

  ngAfterViewInit() {
    // Esperar a que Angular termine de renderizar
    setTimeout(() => {
      this.initializePlugins();
    }, 500);
  }

  ngOnDestroy() {
    // Limpiar eventos cuando se destruya el componente
    this.destroyPlugins();
  }

  private initializePlugins() {
    console.log('🚀 Inicializando plugins...');
    this.initSwiper();
    this.initFancybox();
    this.initNiceSelect();
    this.initScrollspy();
    this.initMobileToggles();
    // En initializePlugins, cambiar a:
    setTimeout(() => {
      this.initSmoothBankSlider();
      this.initBankClicks();
      this.initSimpleTermSelector(); // ← Cambiar aquí
    }, 1000);

  }

  // Variables para controlar drag vs click
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private dragThreshold = 5; // píxeles mínimos para considerar drag

  // Variables para información del banco
  private bankDataCache: { [key: string]: BankData } = {};
  private selectedTerm: TermOption | null = null;

  // ← FUNCIÓN MEJORADA PARA MANEJAR CLICKS SIN INTERFERENCIA CON SCROLL
  private initBankClicks() {
    setTimeout(() => {
      console.log('🏦 Configurando clicks de bancos...');
      const bankItems = document.querySelectorAll('.bank-item');
      console.log('Bancos encontrados:', bankItems.length);

      bankItems.forEach((item, index) => {
        let mouseDownTime = 0;
        let mouseDownX = 0;
        let mouseDownY = 0;
        let hasMoved = false;

        // Mouse/Touch down
        const handleStart = (e: Event) => {
          mouseDownTime = Date.now();
          hasMoved = false;

          if (e.type === 'mousedown') {
            const mouseEvent = e as MouseEvent;
            mouseDownX = mouseEvent.clientX;
            mouseDownY = mouseEvent.clientY;
          } else if (e.type === 'touchstart') {
            const touchEvent = e as TouchEvent;
            mouseDownX = touchEvent.touches[0].clientX;
            mouseDownY = touchEvent.touches[0].clientY;
          }
        };

        // Mouse/Touch move
        const handleMove = (e: Event) => {
          let currentX = 0;
          let currentY = 0;

          if (e.type === 'mousemove') {
            const mouseEvent = e as MouseEvent;
            currentX = mouseEvent.clientX;
            currentY = mouseEvent.clientY;
          } else if (e.type === 'touchmove') {
            const touchEvent = e as TouchEvent;
            currentX = touchEvent.touches[0].clientX;
            currentY = touchEvent.touches[0].clientY;
          }

          const deltaX = Math.abs(currentX - mouseDownX);
          const deltaY = Math.abs(currentY - mouseDownY);

          // Si se movió más del threshold, es drag
          if (deltaX > this.dragThreshold || deltaY > this.dragThreshold) {
            hasMoved = true;
          }
        };

        // Mouse/Touch up - aquí decidimos si es click o drag
        const handleEnd = (e: Event) => {
          const clickDuration = Date.now() - mouseDownTime;

          // Solo procesar como click si:
          // 1. No se movió mucho (no es drag)
          // 2. Duración corta (no es long press)
          // 3. No está en modo dragging del slider
          if (!hasMoved && clickDuration < 300 && !this.isSliderDragging) {
            e.preventDefault();
            e.stopPropagation();

            const bankName = item.getAttribute('data-bank') || `Banco ${index + 1}`;
            console.log(`${bankName} seleccionado`);

            // Remover selección anterior
            bankItems.forEach(bank => bank.classList.remove('selected'));

            // Agregar selección actual
            item.classList.add('selected');

            // Llamar función de selección
            this.selectBank(bankName);
          }
        };

        // Agregar event listeners
        item.addEventListener('mousedown', handleStart);
        item.addEventListener('mousemove', handleMove);
        item.addEventListener('mouseup', handleEnd);
        item.addEventListener('touchstart', handleStart);
        item.addEventListener('touchmove', handleMove);
        item.addEventListener('touchend', handleEnd);

        // Prevenir el click si es drag
        item.addEventListener('click', (e) => {
          if (hasMoved || this.isSliderDragging) {
            e.preventDefault();
            e.stopPropagation();
          }
        });
      });

      console.log('✅ Clicks de bancos configurados');
    }, 1600);
  }

  private initMobileToggles() {
    setTimeout(() => {
      console.log('🔧 Configurando toggles móviles...');

      const mobileHeaders = document.querySelectorAll('.footer-heading-mobie');
      console.log('Headers móviles encontrados:', mobileHeaders.length);

      mobileHeaders.forEach((header, index) => {
        header.addEventListener('click', (e) => {
          e.preventDefault();
          console.log(`📱 Click en header móvil ${index + 1}:`, header);

          const parent = header.closest('.footer-col-block');
          if (parent) {
            const content = parent.querySelector('.tf-collapse-content');
            console.log('Contenido encontrado:', !!content);

            if (content) {
              if (content.classList.contains('show')) {
                content.classList.remove('show');
                header.classList.remove('active');
                console.log('✅ Contenido ocultado');
              } else {
                content.classList.add('show');
                header.classList.add('active');
                console.log('✅ Contenido mostrado');
              }
            }
          }
        });
      });

      console.log('✅ Toggles móviles configurados');
    }, 2000);
  }

  private initSwiper() {
    const swiperElement = document.querySelector('.mainslider');
    if (swiperElement && typeof (window as any).Swiper !== 'undefined') {
      try {
        new (window as any).Swiper('.mainslider', {
          slidesPerView: 1,
          spaceBetween: 0,
          loop: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          }
        });
      } catch (error) {
        console.log('Swiper initialization skipped:', error);
      }
    }
  }

  private initFancybox() {
    if (typeof (window as any).$ !== 'undefined' && (window as any).$.fancybox) {
      try {
        (window as any).$('[data-fancybox="gallery"]').fancybox({
          buttons: ['zoom', 'slideShow', 'fullScreen', 'close'],
          loop: true,
          protect: true
        });
      } catch (error) {
        console.log('Fancybox initialization skipped:', error);
      }
    }
  }

  private initNiceSelect() {
    if (typeof (window as any).$ !== 'undefined' && (window as any).$.fn.niceSelect) {
      try {
        (window as any).$('.nice-select').niceSelect();
      } catch (error) {
        console.log('NiceSelect initialization skipped:', error);
      }
    }
  }

  private initScrollspy() {
    setTimeout(() => {
      console.log('🔍 Buscando elementos...');

      const nav = document.getElementById('navbar-example2');
      const scrollContainer = document.querySelector('[data-bs-spy="scroll"]');

      console.log('Nav encontrado:', !!nav);
      console.log('Scroll container encontrado:', !!scrollContainer);

      if (nav && scrollContainer) {
        console.log('✅ Elementos encontrados, configurando scroll manual');
        this.setupSimpleScrollSpy();
      } else {
        console.log('❌ Elementos no encontrados');
      }
    }, 2000);
  }

  private setupSimpleScrollSpy() {
    const links = document.querySelectorAll('#navbar-example2 .nav-link');
    console.log('Links encontrados:', links.length);

    for (let i = 0; i < links.length; i++) {
      const link = links[i] as HTMLElement;

      link.onclick = (e) => {
        e.preventDefault();
        console.log(`📍 Click en link ${i + 1}`);

        const href = link.getAttribute('href');
        console.log('Href:', href);

        if (href) {
          const target = document.querySelector(href);
          console.log('Target encontrado:', !!target);

          if (target) {
            for (let j = 0; j < links.length; j++) {
              links[j].classList.remove('active');
            }
            link.classList.add('active');

            const offsetTop = (target as HTMLElement).offsetTop - 100;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });

            console.log('✅ Scroll ejecutado a:', offsetTop);
          }
        }
      };
    }

    console.log('✅ Setup completado con onclick directo');
  }

  private waitForElements(callback: () => void, maxAttempts: number = 10, attempt: number = 1) {
    const scrollElement = document.querySelector('[data-bs-spy="scroll"]');
    const navElement = document.querySelector('#navbar-example2');

    console.log(`Intento ${attempt}: scroll=${!!scrollElement}, nav=${!!navElement}`);

    if (scrollElement && navElement) {
      console.log('✅ Elementos encontrados, inicializando ScrollSpy');
      callback();
    } else if (attempt < maxAttempts) {
      setTimeout(() => {
        this.waitForElements(callback, maxAttempts, attempt + 1);
      }, 200);
    } else {
      console.log('❌ No se pudieron encontrar los elementos después de', maxAttempts, 'intentos');
    }
  }

  private setupManualScrollSpy() {
    const sections = [
      '#scrollspyHeading1',
      '#scrollspyHeading2',
      '#scrollspyHeading3',
      '#scrollspyHeading4',
      '#scrollspyHeading5'
    ];

    const navLinks = document.querySelectorAll('#navbar-example2 .nav-link');
    console.log('NavLinks encontrados:', navLinks.length);

    if (navLinks.length === 0) {
      console.log('❌ No se encontraron links de navegación');
      return;
    }

    const updateActiveNav = () => {
      let currentSection = '';

      sections.forEach(sectionId => {
        const section = document.querySelector(sectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 100) {
            currentSection = sectionId;
          }
        }
      });

      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentSection) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    updateActiveNav();

    console.log('✅ ScrollSpy manual configurado');
  }

  private initSmoothScroll() {
    const navLinks = document.querySelectorAll('#navbar-example2 .nav-link');

    navLinks.forEach((link, index) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const href = (e.target as HTMLElement).getAttribute('href');
        console.log(`Click en link ${index + 1}:`, href);

        if (href && href.startsWith('#')) {
          const targetElement = document.querySelector(href);
          console.log('Elemento target encontrado:', !!targetElement);

          if (targetElement) {
            const offsetTop = (targetElement as HTMLElement).offsetTop - 120;
            console.log('Scrolling to:', offsetTop);

            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    });

    console.log('✅ Smooth scroll configurado para', navLinks.length, 'links');
  }

  private updateActiveNavLink(activeHref: string) {
    const navLinks = document.querySelectorAll('#navbar-example2 .nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === activeHref) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  private destroyPlugins() {
    const swiperInstance = (document.querySelector('.mainslider') as any)?.swiper;
    if (swiperInstance) {
      swiperInstance.destroy();
    }

    if (typeof (window as any).$ !== 'undefined' && (window as any).$.fancybox) {
      (window as any).$.fancybox.close();
    }

    if (typeof (window as any).$ !== 'undefined' && (window as any).$.fn.niceSelect) {
      try {
        (window as any).$('.nice-select').niceSelect('destroy');
      } catch (error) {
        // Nice select ya fue destruido
      }
    }

    if (typeof (window as any).$ !== 'undefined' && (window as any).$.fn.scrollspy) {
      try {
        (window as any).$('[data-bs-spy="scroll"]').scrollspy('dispose');
      } catch (error) {
        // ScrollSpy ya fue destruido
      }
    }

    const navLinks = document.querySelectorAll('#navbar-example2 .nav-link');
    navLinks.forEach(link => {
      const newLink = link.cloneNode(true);
      link.parentNode?.replaceChild(newLink, link);
    });

    const mobileHeaders = document.querySelectorAll('.footer-heading-mobie');
    mobileHeaders.forEach(header => {
      const newHeader = header.cloneNode(true);
      header.parentNode?.replaceChild(newHeader, header);
    });

    const bankItems = document.querySelectorAll('.bank-item');
    bankItems.forEach(item => {
      const newItem = item.cloneNode(true);
      item.parentNode?.replaceChild(newItem, item);
    });
  }

  // Variables para el slider de bancos
  private currentSlide = 0;
  private slideWidth = 160;
  private isSliderDragging = false;

  private initSmoothBankSlider() {
    const container = document.getElementById('banksContainer');
    if (!container) return;

    let startX = 0;
    let currentX = 0;
    let isMouseDown = false;
    let hasDragged = false;

    // Eventos táctiles
    container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      currentX = startX;
      hasDragged = false;
      this.isSliderDragging = false;
      container.style.transition = 'none';
    });

    container.addEventListener('touchmove', (e) => {
      if (!startX) return;

      this.isSliderDragging = true;
      hasDragged = true;
      currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      const currentTransform = -this.currentSlide * this.slideWidth;

      container.style.transform = `translateX(${currentTransform + diffX}px)`;
    });

    container.addEventListener('touchend', (e) => {
      if (!startX) return;

      const diffX = currentX - startX;

      if (hasDragged && Math.abs(diffX) > 10) {
        container.style.transition = 'transform 0.3s ease-out';

        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            this.slideLeft();
          } else {
            this.slideRight();
          }
        } else {
          this.updateSlidePosition();
        }
      } else {
        this.updateSlidePosition();
      }

      // Reset variables
      startX = 0;
      currentX = 0;
      hasDragged = false;

      setTimeout(() => {
        this.isSliderDragging = false;
        container.style.transition = 'none';
      }, 350);
    });

    // Eventos de mouse para desktop
    container.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startX = e.clientX;
      currentX = startX;
      isMouseDown = true;
      hasDragged = false;
      this.isSliderDragging = false;
      container.style.transition = 'none';
      container.style.cursor = 'grabbing';

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown || !startX) return;

      e.preventDefault();
      this.isSliderDragging = true;
      hasDragged = true;
      currentX = e.clientX;
      const diffX = currentX - startX;
      const currentTransform = -this.currentSlide * this.slideWidth;

      container.style.transform = `translateX(${currentTransform + diffX}px)`;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isMouseDown) return;

      e.preventDefault();
      isMouseDown = false;

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      const diffX = currentX - startX;
      container.style.cursor = 'grab';

      if (hasDragged && Math.abs(diffX) > 10) {
        container.style.transition = 'transform 0.3s ease-out';

        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            this.slideLeft();
          } else {
            this.slideRight();
          }
        } else {
          this.updateSlidePosition();
        }
      } else {
        this.updateSlidePosition();
      }

      // Reset variables
      startX = 0;
      currentX = 0;
      hasDragged = false;

      setTimeout(() => {
        this.isSliderDragging = false;
        container.style.transition = 'none';
      }, 350);
    };

    container.addEventListener('mouseleave', () => {
      if (isMouseDown) {
        isMouseDown = false;
        this.isSliderDragging = false;
        container.style.cursor = 'grab';
        container.style.transition = 'none';
        this.updateSlidePosition();

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // Reset
        startX = 0;
        currentX = 0;
        hasDragged = false;
      }
    });

    // Prevenir drag de imágenes
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('dragstart', (e) => {
        e.preventDefault();
      });
      img.style.userSelect = 'none';
      img.style.pointerEvents = 'none';
    });
  }

  slideLeft() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateSlidePosition();
    }
  }

  slideRight() {
    const maxSlides = 8 - 2;
    if (this.currentSlide < maxSlides) {
      this.currentSlide++;
      this.updateSlidePosition();
    }
  }

  private updateSlidePosition() {
    const container = document.getElementById('banksContainer');
    if (container) {
      const translateX = -this.currentSlide * this.slideWidth;
      container.style.transform = `translateX(${translateX}px)`;
    }
  }

  // ← NUEVAS FUNCIONES PARA INFORMACIÓN DEL BANCO
  selectBank(bankName: string) {
    console.log(`🏦 BANCO FINAL SELECCIONADO: ${bankName}`);

    // Mostrar la sección de información
    this.showBankInfo(bankName);

    // Cargar datos del banco
    this.loadBankData(bankName);
  }

  private showBankInfo(bankName: string) {
    const bankInfoElement = document.getElementById('bankInfo');
    const bankNameElement = document.getElementById('selectedBankName');

    if (bankInfoElement && bankNameElement) {
      // Mostrar la sección
      bankInfoElement.style.display = 'block';
      bankInfoElement.classList.add('show');

      // Actualizar nombre del banco
      bankNameElement.textContent = bankName;

      // Limpiar datos anteriores
      this.clearBankDetails();

      // Mostrar indicador de carga
      this.showLoadingIndicator(true);
    }
  }

  private async loadBankData(bankName: string) {
    try {
      // Verificar si ya tenemos los datos en caché
      if (this.bankDataCache[bankName]) {
        this.displayBankData(this.bankDataCache[bankName]);
        return;
      }

      // Simular llamada a API (reemplazar con tu API real)
      const bankData = await this.fetchBankDataFromAPI(bankName);

      // Guardar en caché
      this.bankDataCache[bankName] = bankData;

      // Mostrar datos
      this.displayBankData(bankData);

    } catch (error) {
      console.error('Error cargando datos del banco:', error);
      this.showErrorMessage('Error al cargar la información del banco');
    } finally {
      this.showLoadingIndicator(false);
    }
  }

  // Datos simulados actualizados
  private async fetchBankDataFromAPI(bankName: string): Promise<BankData> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Datos simulados con términos disponibles - REEMPLAZAR CON TU API
    const mockData: { [key: string]: BankData } = {
      'Confisa': {
        name: 'Confisa',
        interestRate: '8.5%',
        financingTotal: '95%',
        availableTerms: [
          { value: '12-months', label: '12 meses', months: 12 },
          { value: '24-months', label: '24 meses', months: 24 },
          { value: '36-months', label: '36 meses', months: 36 },
          { value: '48-months', label: '48 meses', months: 48 },
          { value: '60-months', label: '60 meses', months: 60 }
        ]
      },
      'BACC': {
        name: 'BACC',
        interestRate: '7.8%',
        financingTotal: '90%',
        availableTerms: [
          { value: '12-months', label: '12 meses', months: 12 },
          { value: '24-months', label: '24 meses', months: 24 },
          { value: '36-months', label: '36 meses', months: 36 },
          { value: '48-months', label: '48 meses', months: 48 },
          { value: '60-months', label: '60 meses', months: 60 },
          { value: '72-months', label: '72 meses', months: 72 }
        ]
      },
      'Popular': {
        name: 'Popular',
        interestRate: '9.2%',
        financingTotal: '85%',
        availableTerms: [
          { value: '24-months', label: '24 meses', months: 24 },
          { value: '36-months', label: '36 meses', months: 36 },
          { value: '48-months', label: '48 meses', months: 48 },
          { value: '60-months', label: '60 meses', months: 60 },
          { value: '72-months', label: '72 meses', months: 72 },
          { value: '84-months', label: '84 meses', months: 84 }
        ]
      },
      'Reservas': {
        name: 'Reservas',
        interestRate: '7.5%',
        financingTotal: '92%',
        availableTerms: [
          { value: '12-months', label: '12 meses', months: 12 },
          { value: '24-months', label: '24 meses', months: 24 },
          { value: '36-months', label: '36 meses', months: 36 },
          { value: '48-months', label: '48 meses', months: 48 },
          { value: '60-months', label: '60 meses', months: 60 },
          { value: '72-months', label: '72 meses', months: 72 },
          { value: '84-months', label: '84 meses', months: 84 },
          { value: '96-months', label: '96 meses', months: 96 }
        ]
      },
      'BHD': {
        name: 'BHD',
        interestRate: '8.1%',
        financingTotal: '88%',
        availableTerms: [
          { value: '24-months', label: '24 meses', months: 24 },
          { value: '36-months', label: '36 meses', months: 36 },
          { value: '48-months', label: '48 meses', months: 48 },
          { value: '60-months', label: '60 meses', months: 60 },
          { value: '72-months', label: '72 meses', months: 72 }
        ]
      },
      'Caribe': {
        name: 'Caribe',
        interestRate: '8.8%',
        financingTotal: '87%',
        availableTerms: [
          { value: '12-months', label: '12 meses', months: 12 },
          { value: '24-months', label: '24 meses', months: 24 },
          { value: '36-months', label: '36 meses', months: 36 },
          { value: '48-months', label: '48 meses', months: 48 },
          { value: '60-months', label: '60 meses', months: 60 },
          { value: '72-months', label: '72 meses', months: 72 },
          { value: '84-months', label: '84 meses', months: 84 }
        ]
      },
      'Motor Crédito': {
        name: 'Motor Crédito',
        interestRate: '9.5%',
        financingTotal: '80%',
        availableTerms: [
          { value: '12-months', label: '12 meses', months: 12 },
          { value: '24-months', label: '24 meses', months: 24 },
          { value: '36-months', label: '36 meses', months: 36 },
          { value: '48-months', label: '48 meses', months: 48 }
        ]
      },
      'Scotia': {
        name: 'Scotia',
        interestRate: '7.9%',
        financingTotal: '91%',
        availableTerms: [
          { value: '12-months', label: '12 meses', months: 12 },
          { value: '24-months', label: '24 meses', months: 24 },
          { value: '36-months', label: '36 meses', months: 36 },
          { value: '48-months', label: '48 meses', months: 48 },
          { value: '60-months', label: '60 meses', months: 60 },
          { value: '72-months', label: '72 meses', months: 72 },
          { value: '84-months', label: '84 meses', months: 84 },
          { value: '96-months', label: '96 meses', months: 96 }
        ]
      }
    };

    return mockData[bankName] || {
      name: bankName,
      interestRate: 'N/A',
      financingTotal: 'N/A',
      availableTerms: []
    };
  }

  private displayBankData(bankData: BankData) {
    const interestRateElement = document.getElementById('interestRate');
    const financingTotalElement = document.getElementById('financingTotal');

    if (interestRateElement && financingTotalElement) {
      // Animación de entrada para los datos
      interestRateElement.style.opacity = '0';
      financingTotalElement.style.opacity = '0';

      setTimeout(() => {
        interestRateElement.textContent = bankData.interestRate;
        financingTotalElement.textContent = bankData.financingTotal;

        interestRateElement.style.transition = 'opacity 0.3s ease';
        financingTotalElement.style.transition = 'opacity 0.3s ease';

        interestRateElement.style.opacity = '1';
        financingTotalElement.style.opacity = '1';
      }, 100);
    }

    // ← AGREGAR DEBUG ANTES DE ACTUALIZAR
    this.debugTermSelector();

    // Actualizar selector de términos
    this.updateTermsSelector(bankData.availableTerms);
  }




  // Agregar esta función temporal para debug
  private debugTermSelector() {
    console.log('🔍 DEBUG: Verificando selector de términos...');

    const termSelector = document.getElementById('termSelector');
    const currentTerm = document.getElementById('currentTerm');
    const termsList = document.getElementById('termsList');

    console.log('termSelector encontrado:', !!termSelector);
    console.log('currentTerm encontrado:', !!currentTerm);
    console.log('termsList encontrado:', !!termsList);

    if (termSelector) {
      console.log('termSelector HTML:', termSelector.outerHTML);
    }

    if (currentTerm) {
      console.log('currentTerm texto actual:', currentTerm.textContent);
    }

    if (termsList) {
      console.log('termsList hijos:', termsList.children.length);
      console.log('termsList HTML:', termsList.innerHTML);
    }

    // Listar TODOS los elementos con ID en la página
    const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
    console.log('Todos los IDs en la página:', allIds);
  }

















  // ← FUNCIÓN PARA INICIALIZAR EL SELECTOR DE TÉRMINOS
  private initTermSelector() {
    setTimeout(() => {
      console.log('🔧 Inicializando selector de términos...');
      const termSelector = document.getElementById('termSelector');

      if (!termSelector) {
        console.log('❌ Selector de términos NO encontrado en DOM');
        // Listar todos los elementos con ID para debug
        const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
        console.log('IDs disponibles:', allIds);
        return;
      }

      console.log('✅ Selector encontrado:', termSelector);

      // Limpiar eventos previos
      const newSelector = termSelector.cloneNode(true) as HTMLElement;
      termSelector.parentNode?.replaceChild(newSelector, termSelector);

      // Agregar funcionalidad de toggle al nuevo elemento
      newSelector.addEventListener('click', (e) => {
        if (newSelector.style.pointerEvents === 'none') {
          console.log('Selector deshabilitado');
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        const isOpen = newSelector.classList.contains('open');
        newSelector.classList.toggle('open');

        console.log('Toggle selector:', !isOpen ? 'ABIERTO' : 'CERRADO');
      });

      // Cerrar al hacer click fuera
      document.addEventListener('click', (e) => {
        if (!newSelector.contains(e.target as Node)) {
          newSelector.classList.remove('open');
        }
      });

      console.log('✅ Selector de términos inicializado correctamente');
    }, 3000); // ← Tiempo extra para asegurar que todo esté listo
  }


  // Reemplaza updateTermsSelector con esto:
private updateTermsSelector(terms: TermOption[]) {
  console.log('🔄 Actualizando términos:', terms);
  
  const termSelector = document.getElementById('termSelector');
  const currentTerm = document.getElementById('currentTerm');
  const termsList = document.getElementById('termsList');
  
  if (!termSelector || !currentTerm || !termsList) return;
  
  // MOSTRAR el selector
  termSelector.style.display = 'block';
  termsList.innerHTML = '';
  
  if (terms.length === 0) {
    currentTerm.textContent = 'No disponible';
    termSelector.style.opacity = '0.5';
    return;
  }
  
  // Agregar términos (versión simple)
  terms.forEach((term, index) => {
    const li = document.createElement('li');
    li.className = 'option';
    li.setAttribute('data-value', term.value);
    li.textContent = term.label;
    
    if (index === 0) {
      li.classList.add('selected');
      currentTerm.textContent = term.label;
      this.selectedTerm = term;
    }
    
    li.onclick = (e) => {
      e.stopPropagation();
      
      // Remover selección anterior (sin cast necesario)
      termsList.querySelectorAll('.option').forEach(opt => 
        opt.classList.remove('selected')
      );
      
      // Seleccionar actual
      li.classList.add('selected');
      currentTerm.textContent = term.label;
      this.selectedTerm = term;
      termSelector.classList.remove('open');
      
      console.log('✅ Término seleccionado:', term.label);
    };
    
    termsList.appendChild(li);
  });
  
  termSelector.style.opacity = '1';
  console.log(`✅ ${terms.length} términos cargados`);
}

  // Función simple para el toggle
  // Función simple sin interferir con nice-select
private initSimpleTermSelector() {
  setTimeout(() => {
    const termSelector = document.getElementById('termSelector');
    
    if (!termSelector) {
      console.log('❌ termSelector no encontrado');
      return;
    }
    
    // Click para abrir/cerrar
    termSelector.addEventListener('click', (e) => {
      if (termSelector.style.opacity === '0.5') return;
      e.stopPropagation();
      termSelector.classList.toggle('open');
    });
    
    // Cerrar al click fuera
    document.addEventListener('click', (e) => {
      if (!termSelector.contains(e.target as Node)) {
        termSelector.classList.remove('open');
      }
    });
    
    console.log('✅ Selector personalizado inicializado');
  }, 1000);
}



  // ← FUNCIÓN PARA SELECCIONAR UN TÉRMINO
  private selectTerm(term: TermOption, selectedLi: HTMLElement) {
    const currentTerm = document.getElementById('currentTerm');
    const termsList = document.getElementById('termsList');
    const termSelector = document.getElementById('termSelector');

    if (!currentTerm || !termsList || !termSelector) return;

    // Actualizar selección visual
    termsList.querySelectorAll('.option').forEach(option => {
      option.classList.remove('selected');
    });
    selectedLi.classList.add('selected');

    // Actualizar texto actual
    currentTerm.textContent = term.label;
    this.selectedTerm = term;

    // Cerrar dropdown
    termSelector.classList.remove('open');

    console.log(`✅ Término seleccionado: ${term.label} (${term.months} meses)`);

    // Aquí puedes agregar lógica para recalcular pagos
    // this.recalculatePayments();
  }

  // ← FUNCIÓN PARA OBTENER EL TÉRMINO SELECCIONADO
  getSelectedTerm(): TermOption | null {
    return this.selectedTerm;
  }

  private clearBankDetails() {
    const interestRateElement = document.getElementById('interestRate');
    const financingTotalElement = document.getElementById('financingTotal');

    if (interestRateElement && financingTotalElement) {
      interestRateElement.textContent = '--';
      financingTotalElement.textContent = '--';
    }
  }

  private showLoadingIndicator(show: boolean) {
    const loadingElement = document.getElementById('loadingIndicator');
    if (loadingElement) {
      loadingElement.style.display = show ? 'block' : 'none';
    }
  }

  private showErrorMessage(message: string) {
    const interestRateElement = document.getElementById('interestRate');
    const financingTotalElement = document.getElementById('financingTotal');

    if (interestRateElement && financingTotalElement) {
      interestRateElement.textContent = 'Error';
      financingTotalElement.textContent = 'Error';
      interestRateElement.style.color = '#dc3545';
      financingTotalElement.style.color = '#dc3545';
    }
  }


private debugListStyles() {
  setTimeout(() => {
    const termsList = document.getElementById('termsList');
    if (termsList) {
      console.log('🔍 Estilos aplicados a la lista:');
      console.log('- classList:', termsList.classList.toString());
      console.log('- innerHTML:', termsList.innerHTML);
      console.log('- offsetHeight:', termsList.offsetHeight);
      console.log('- computedStyle:', window.getComputedStyle(termsList));
      
      const options = termsList.querySelectorAll('.option');
      console.log('- Opciones encontradas:', options.length);
      options.forEach((option, i) => {
        console.log(`  Opción ${i}:`, option.textContent, option.classList.toString());
      });
    }
  }, 2000);
}








}