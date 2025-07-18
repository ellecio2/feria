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

  // Variables existentes
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private dragThreshold = 5;

  // Variables para información del banco
  private bankDataCache: { [key: string]: BankData } = {};
  private selectedTerm: TermOption | null = null;
  private currentBankData: BankData | null = null;

  // Variables para el slider de bancos
  private currentSlide = 0;
  private slideWidth = 160;
  private isSliderDragging = false;

  // Variables para la calculadora
  private carPrice = 21900;
  private carCurrency = 'USD';
  private exchangeRate = 60;
  private closingCostBaseUSD = 183.33;
  private closingCostBaseRD = 11000;
  private closingCostPercentage = 0.05;

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializePlugins();
    }, 500);
  }

  ngOnDestroy() {
    this.destroyPlugins();
  }

  private initializePlugins() {
    // console.log('🚀 Inicializando plugins...');
    this.initSwiper();
    this.initFancybox();
    this.initNiceSelect();
    this.initScrollspy();
    this.initMobileToggles();
    
    setTimeout(() => {
      this.initLoanCalculator();
      this.initSmoothBankSlider();
      this.initBankClicks();
      this.initSimpleTermSelector();
    }, 1000);
  }

  // =================== CALCULADORA DE PRÉSTAMOS ===================

  private initLoanCalculator() {
    // console.log('💰 Inicializando calculadora de préstamos...');
    
    this.detectVehicleCurrency();
    this.setupLoanInputs();
    this.setupClosingCosts();
    
    // console.log('✅ Calculadora inicializada');
  }

  private detectVehicleCurrency() {
    const priceElement = document.querySelector('.money.pricetxt');
    if (priceElement) {
      const priceText = priceElement.textContent || '';
      // console.log('🔍 Precio encontrado:', priceText);
      
      if (priceText.includes('US$') || priceText.includes('USD')) {
        this.carCurrency = 'USD';
      } else if (priceText.includes('RD$') || priceText.includes('RD')) {
        this.carCurrency = 'RD';
      } else if (priceText.includes('$') && !priceText.includes('RD')) {
        this.carCurrency = 'USD';
      }
      
      const match = priceText.match(/[\d,]+\.?\d*/);
      if (match) {
        this.carPrice = parseFloat(match[0].replace(/,/g, ''));
      }
      
      // console.log(`💰 Detectado: ${this.carPrice} ${this.carCurrency}`);
    }
  }

  private setupLoanInputs() {
    setTimeout(() => {
      const initialInput = document.querySelector('fieldset.name-wrap input[type="number"]') as HTMLInputElement;
      const financeInput = document.querySelector('.grid-sw-2 fieldset:first-child input') as HTMLInputElement;
      const interestInput = document.querySelector('input[placeholder="0%"]') as HTMLInputElement;

      if (initialInput) {
        initialInput.placeholder = '0';
        
        if (financeInput) {
          financeInput.placeholder = '0';
          financeInput.readOnly = true;
          financeInput.style.backgroundColor = '#f8f9fa';
        }
        
        if (interestInput) {
          interestInput.readOnly = true;
          interestInput.style.backgroundColor = '#f8f9fa';
        }

        initialInput.addEventListener('input', () => {
          this.calculateLoanValues();
        });

        initialInput.addEventListener('blur', () => {
          const value = this.parseInputValue(initialInput.value);
          if (value > 0) {
            initialInput.value = value.toString();
          }
        });

        // console.log('✅ Inputs configurados');
      }
    }, 1500);
  }

  private setupClosingCosts() {
    setTimeout(() => {
      const secondRow = document.querySelector('.grid-sw-2');
      
      if (secondRow && !document.getElementById('closingCostInput')) {
        const closingCostFieldset = document.createElement('fieldset');
        closingCostFieldset.className = 'email-wrap style-text';
        closingCostFieldset.innerHTML = `
          <label class="font-1 fs-14 fw-5">Gastos de Cierre (${this.carCurrency}):</label>
          <input type="text" class="tb-my-input" id="closingCostInput" readonly 
                 placeholder="0.00" style="background-color: #f8f9fa; cursor: not-allowed;">
        `;

        secondRow.appendChild(closingCostFieldset);
        // console.log('✅ Campo gastos de cierre agregado');
      }
    }, 2000);
  }

  private calculateLoanValues() {
    if (!this.currentBankData || !this.selectedTerm) {
      return;
    }

    const initialInput = document.querySelector('fieldset.name-wrap input[type="number"]') as HTMLInputElement;
    const initialValue = this.parseInputValue(initialInput?.value || '0');

    if (initialValue > this.carPrice) {
      return;
    }

    const financeAmount = Math.max(0, this.carPrice - initialValue);
    const closingCosts = this.calculateClosingCosts(financeAmount);
    const monthlyPayment = this.calculateMonthlyPayment(financeAmount);

    this.updateLoanDisplays(initialValue, financeAmount, monthlyPayment, closingCosts);

    // console.log('💰 Cálculos:', {
    //   currency: this.carCurrency,
    //   initial: initialValue,
    //   finance: financeAmount,
    //   monthly: monthlyPayment,
    //   closing: closingCosts
    // });
  }

  private calculateClosingCosts(financeAmount: number): number {
    const baseCost = this.carCurrency === 'USD' ? this.closingCostBaseUSD : this.closingCostBaseRD;
    return baseCost + (financeAmount * this.closingCostPercentage);
  }

  private calculateMonthlyPayment(financeAmount: number): number {
    if (!this.currentBankData || !this.selectedTerm || financeAmount <= 0) {
      return 0;
    }

    const annualRate = this.parsePercentage(this.currentBankData.interestRate);
    const monthlyRate = annualRate / 12 / 100;
    const months = this.selectedTerm.months;

    if (monthlyRate === 0) {
      return financeAmount / months;
    }

    const monthlyPayment = financeAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
      (Math.pow(1 + monthlyRate, months) - 1);

    return monthlyPayment;
  }

  private updateLoanDisplays(initial: number, finance: number, monthly: number, closing: number) {
    // Buscar por ID específico primero
    const monthlySummary = document.getElementById('monthlySummary');
    if (monthlySummary) {
      const valueDiv = monthlySummary.querySelector('div:last-child');
      if (valueDiv) {
        valueDiv.textContent = this.formatCurrency(monthly);
        // console.log('✅ Pago mensual actualizado:', valueDiv.textContent);
      }
    } else {
      // Fallback: buscar por contenido
      const totalsList = document.querySelector('.list-total ul');
      if (totalsList) {
        const items = totalsList.querySelectorAll('li');
        for (let i = 0; i < items.length; i++) {
          const titleDiv = items[i].querySelector('.title-total');
          if (titleDiv && titleDiv.textContent?.includes('Pago Mensual')) {
            const valueDiv = items[i].querySelector('div:last-child');
            if (valueDiv) {
              valueDiv.textContent = this.formatCurrency(monthly);
              // console.log('✅ Pago mensual actualizado (fallback):', valueDiv.textContent);
              break;
            }
          }
        }
      }
    }

    // Actualizar otros campos
    const totalsList = document.querySelector('.list-total ul');
    if (totalsList) {
      const items = totalsList.querySelectorAll('li');
      
      // Inicial (primer elemento)
      if (items[0]) {
        const valueDiv = items[0].querySelector('div:last-child');
        if (valueDiv) valueDiv.textContent = this.formatCurrency(initial);
      }
      
      // Monto a financiar (segundo elemento)
      if (items[1]) {
        const valueDiv = items[1].querySelector('div:last-child');
        if (valueDiv) valueDiv.textContent = this.formatCurrency(finance);
      }
    }

    // Actualizar inputs readonly
    const financeInput = document.querySelector('.grid-sw-2 fieldset:first-child input') as HTMLInputElement;
    if (financeInput) {
      financeInput.value = finance.toFixed(2);
    }

    const closingInput = document.getElementById('closingCostInput') as HTMLInputElement;
    if (closingInput) {
      closingInput.value = closing.toFixed(2);
    }
  }

  // =================== FUNCIONES UTILITARIAS ===================

  private parseInputValue(value: string): number {
    const cleanValue = value.replace(/[^\d.]/g, '');
    return parseFloat(cleanValue) || 0;
  }

  private parsePercentage(percentage: string): number {
    return parseFloat(percentage.replace('%', '')) || 0;
  }

  private formatCurrency(amount: number): string {
    if (this.carCurrency === 'USD') {
      return `US$${amount.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    } else {
      return `RD$${amount.toLocaleString('es-DO', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`;
    }
  }

  // =================== MANEJO DE BANCOS ===================

  private initBankClicks() {
    setTimeout(() => {
      const bankItems = document.querySelectorAll('.bank-item');
      // console.log('🏦 Bancos encontrados:', bankItems.length);

      bankItems.forEach((item, index) => {
        let mouseDownTime = 0;
        let hasMoved = false;

        const handleEnd = (e: Event) => {
          const clickDuration = Date.now() - mouseDownTime;

          if (!hasMoved && clickDuration < 300 && !this.isSliderDragging) {
            e.preventDefault();
            e.stopPropagation();

            const bankName = item.getAttribute('data-bank') || `Banco ${index + 1}`;
            // console.log(`${bankName} seleccionado`);

            bankItems.forEach(bank => bank.classList.remove('selected'));
            item.classList.add('selected');

            this.selectBank(bankName);
          }
        };

        item.addEventListener('mousedown', (e) => {
          mouseDownTime = Date.now();
          hasMoved = false;
        });

        item.addEventListener('mousemove', () => {
          hasMoved = true;
        });

        item.addEventListener('mouseup', handleEnd);
        item.addEventListener('touchend', handleEnd);

        item.addEventListener('click', (e) => {
          if (hasMoved || this.isSliderDragging) {
            e.preventDefault();
            e.stopPropagation();
          }
        });
      });

      // console.log('✅ Clicks de bancos configurados');
    }, 1600);
  }

  selectBank(bankName: string) {
    // console.log(`🏦 Banco seleccionado: ${bankName}`);
    this.showBankInfo(bankName);
    this.loadBankData(bankName);
  }

  private showBankInfo(bankName: string) {
    const bankInfoElement = document.getElementById('bankInfo');
    const bankNameElement = document.getElementById('selectedBankName');

    if (bankInfoElement && bankNameElement) {
      bankInfoElement.style.display = 'block';
      bankInfoElement.classList.add('show');
      bankNameElement.textContent = bankName;
      this.clearBankDetails();
      this.showLoadingIndicator(true);
    }
  }

  private async loadBankData(bankName: string) {
    try {
      if (this.bankDataCache[bankName]) {
        this.displayBankData(this.bankDataCache[bankName]);
        return;
      }

      const bankData = await this.fetchBankDataFromAPI(bankName);
      this.bankDataCache[bankName] = bankData;
      this.displayBankData(bankData);

    } catch (error) {
      console.error('Error cargando datos del banco:', error);
      this.showErrorMessage('Error al cargar información del banco');
    } finally {
      this.showLoadingIndicator(false);
    }
  }

  private async fetchBankDataFromAPI(bankName: string): Promise<BankData> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockData: { [key: string]: BankData } = {
      'Confisa': {
        name: 'Confisa',
        interestRate: '16.95%',
        financingTotal: '80%',
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
        interestRate: '17.8%',
        financingTotal: '80%',
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
        interestRate: '19.2%',
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
        interestRate: '17.5%',
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
        interestRate: '18.1%',
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
        interestRate: '18.8%',
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
        interestRate: '19.5%',
        financingTotal: '80%',
        availableTerms: [
          { value: '12-months', label: '12 meses', months: 12 },
          { value: '24-months', label: '24 meses', months: 24 },
          { value: '36-months', label: '36 meses', months: 36 },
          { value: '48-months', label: '48 meses', months: 48 }, 
          { value: '60-months', label: '60 meses', months: 60 }
       
        ]
      },
      'Scotia': {
        name: 'Scotia',
        interestRate: '17.9%',
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

    this.currentBankData = bankData;
    this.updateBankDataInInputs(bankData);
    this.updateTermsSelector(bankData.availableTerms);
    
    setTimeout(() => {
      this.calculateLoanValues();
    }, 200);
  }

  private updateBankDataInInputs(bankData: BankData) {
    const interestInput = document.querySelector('input[placeholder="0%"]') as HTMLInputElement;
    if (interestInput) {
      interestInput.value = bankData.interestRate;
    }
  }

  // =================== SELECTOR DE TÉRMINOS ===================

  private initSimpleTermSelector() {
    setTimeout(() => {
      const termSelector = document.getElementById('termSelector');
      
      if (!termSelector) {
        return;
      }
      
      termSelector.addEventListener('click', (e) => {
        if (termSelector.style.opacity === '0.5') return;
        e.stopPropagation();
        termSelector.classList.toggle('open');
      });
      
      document.addEventListener('click', (e) => {
        if (!termSelector.contains(e.target as Node)) {
          termSelector.classList.remove('open');
        }
      });
      
      // console.log('✅ Selector de términos inicializado');
    }, 1000);
  }

  private updateTermsSelector(terms: TermOption[]) {
    const termSelector = document.getElementById('termSelector');
    const currentTerm = document.getElementById('currentTerm');
    const termsList = document.getElementById('termsList');

    if (!termSelector || !currentTerm || !termsList) {
      return;
    }

    termSelector.style.display = 'block';
    termsList.innerHTML = '';

    if (terms.length === 0) {
      currentTerm.textContent = 'No disponible';
      termSelector.style.opacity = '0.5';
      this.selectedTerm = null;
      return;
    }

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
        
        termsList.querySelectorAll('.option').forEach(opt =>
          opt.classList.remove('selected')
        );

        li.classList.add('selected');
        currentTerm.textContent = term.label;
        this.selectedTerm = term;
        termSelector.classList.remove('open');

        // console.log('✅ Término seleccionado:', term.label);
        
        setTimeout(() => {
          this.calculateLoanValues();
        }, 100);
      };

      termsList.appendChild(li);
    });

    termSelector.style.opacity = '1';
    // console.log(`✅ ${terms.length} términos cargados`);
  }

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

  // =================== FUNCIONES API ===================

  async updateExchangeRate() {
    try {
      const response = await fetch('/api/exchange-rate');
      const data = await response.json();
      this.exchangeRate = data.rate || 60;
      
      this.calculateLoanValues();
    } catch (error) {
      console.error('Error actualizando tasa de cambio:', error);
    }
  }

  async updateClosingCosts() {
    try {
      const response = await fetch('/api/closing-costs');
      const data = await response.json();
      
      if (this.carCurrency === 'USD') {
        this.closingCostBaseUSD = data.baseCostUSD || 183.33;
      } else {
        this.closingCostBaseRD = data.baseCostRD || 11000;
      }
      this.closingCostPercentage = data.percentage || 0.05;
      
      this.calculateLoanValues();
    } catch (error) {
      console.error('Error actualizando gastos de cierre:', error);
    }
  }

  async loadVehicleData() {
    try {
      const response = await fetch('/api/vehicle/current');
      const data = await response.json();
      
      this.carPrice = data.price || 21900;
      this.carCurrency = data.currency || 'USD';
      
      this.calculateLoanValues();
    } catch (error) {
      console.error('Error cargando datos del vehículo:', error);
    }
  }

  // =================== FUNCIONES EXISTENTES ===================

  private initMobileToggles() {
    setTimeout(() => {
      const mobileHeaders = document.querySelectorAll('.footer-heading-mobie');

      mobileHeaders.forEach((header, index) => {
        header.addEventListener('click', (e) => {
          e.preventDefault();

          const parent = header.closest('.footer-col-block');
          if (parent) {
            const content = parent.querySelector('.tf-collapse-content');

            if (content) {
              if (content.classList.contains('show')) {
                content.classList.remove('show');
                header.classList.remove('active');
              } else {
                content.classList.add('show');
                header.classList.add('active');
              }
            }
          }
        });
      });

      // console.log('✅ Toggles móviles configurados');
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
        // console.log('Swiper initialization skipped:', error);
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
        // console.log('Fancybox initialization skipped:', error);
      }
    }
  }

  private initNiceSelect() {
    if (typeof (window as any).$ !== 'undefined' && (window as any).$.fn.niceSelect) {
      try {
        (window as any).$('.nice-select').niceSelect();
      } catch (error) {
        // console.log('NiceSelect initialization skipped:', error);
      }
    }
  }

  private initScrollspy() {
    setTimeout(() => {
      const nav = document.getElementById('navbar-example2');
      const scrollContainer = document.querySelector('[data-bs-spy="scroll"]');

      if (nav && scrollContainer) {
        this.setupSimpleScrollSpy();
      }
    }, 2000);
  }

  private setupSimpleScrollSpy() {
    const links = document.querySelectorAll('#navbar-example2 .nav-link');

    for (let i = 0; i < links.length; i++) {
      const link = links[i] as HTMLElement;

      link.onclick = (e) => {
        e.preventDefault();

        const href = link.getAttribute('href');

        if (href) {
          const target = document.querySelector(href);

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
          }
        }
      };
    }
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

  private initSmoothBankSlider() {
    const container = document.getElementById('banksContainer');
    if (!container) return;

    let startX = 0;
    let currentX = 0;
    let isMouseDown = false;
    let hasDragged = false;

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

      startX = 0;
      currentX = 0;
      hasDragged = false;

      setTimeout(() => {
        this.isSliderDragging = false;
        container.style.transition = 'none';
      }, 350);
    });

    container.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startX = e.clientX;
      currentX = startX;
      isMouseDown = true;
      hasDragged = false;
      this.isSliderDragging = false;
      container.style.transition = 'none';
      container.style.cursor = 'grabbing';

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

        startX = 0;
        currentX = 0;
        hasDragged = false;

        setTimeout(() => {
          this.isSliderDragging = false;
          container.style.transition = 'none';
        }, 350);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });

    container.addEventListener('mouseleave', () => {
      if (isMouseDown) {
        isMouseDown = false;
        this.isSliderDragging = false;
        container.style.cursor = 'grab';
        container.style.transition = 'none';
        this.updateSlidePosition();

        startX = 0;
        currentX = 0;
        hasDragged = false;
      }
    });

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
}