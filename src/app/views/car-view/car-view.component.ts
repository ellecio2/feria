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

  // Variables para hacer oferta
  private offerFormVisible = false;
  private isSubmittingOffer = false;

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializePlugins();
    }, 100); // Reducido de 500ms a 100ms para carga más rápida
  }

  ngOnDestroy() {
    this.destroyPlugins();
  }

  private initializePlugins() {
    console.log('🚀 Inicializando plugins...');
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
    }, 300); // Reducido de 1000ms a 300ms
  }

  // =================== CALCULADORA DE PRÉSTAMOS ===================

  private initLoanCalculator() {
    console.log('💰 Inicializando calculadora de préstamos...');
    
    this.detectVehicleCurrency();
    this.setupLoanInputs();
    this.setupClosingCosts();
    this.setupOfferButton(); // ← Sin delay para que aparezca rápido
    
    console.log('✅ Calculadora inicializada');
  }

  private detectVehicleCurrency() {
    const priceElement = document.querySelector('.money.pricetxt');
    if (priceElement) {
      const priceText = priceElement.textContent || '';
      console.log('🔍 Precio encontrado:', priceText);
      
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
      
      console.log(`💰 Detectado: ${this.carPrice} ${this.carCurrency}`);
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

        console.log('✅ Inputs configurados');
      }
    }, 500); // Reducido de 1500ms a 500ms
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
        console.log('✅ Campo gastos de cierre agregado');
      }
    }, 800); // Reducido de 2000ms a 800ms
  }

  // ← FUNCIÓN MODIFICADA PARA CONFIGURAR BOTÓN DE OFERTA
  private setupOfferButton() {
    // Intentar múltiples veces con intervalos cortos hasta encontrar el elemento
    const maxAttempts = 20;
    let attempts = 0;

    const trySetupButton = () => {
      attempts++;
      // Buscar el contenedor price-wrap en lugar del elemento money
      const priceWrapElement = document.querySelector('.price-wrap');
      
      if (priceWrapElement && !document.getElementById('offerButton')) {
        console.log(`✅ Elemento price-wrap encontrado en intento ${attempts}, creando botón...`);
        this.createOfferButton(priceWrapElement);
        return;
      }
      
      if (attempts < maxAttempts) {
        setTimeout(trySetupButton, 100); // Intentar cada 100ms
      } else {
        console.log('❌ No se pudo encontrar el elemento price-wrap después de 20 intentos');
      }
    };

    // Iniciar inmediatamente
    trySetupButton();
  }

  // ← FUNCIÓN MODIFICADA PARA CREAR EL BOTÓN
  private createOfferButton(priceWrapElement: Element) {
    // Crear el botón de hacer oferta
    const offerButton = document.createElement('button');
    offerButton.id = 'offerButton';
    offerButton.className = 'offer-btn';
    offerButton.innerHTML = '💰 Hacer una Oferta';
    
    // Estilos del botón para que coincida con el ancho del contenedor de precio
    offerButton.style.cssText = `
      background: linear-gradient(45deg, #28a745, #20c997);
      color: white;
      border: none;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 15px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
      display: block;
      width: 100%;
      text-align: center;
      line-height: 1.2;
      min-height: 48px;
    `;

    // Hover effects
    offerButton.addEventListener('mouseenter', () => {
      offerButton.style.transform = 'translateY(-2px)';
      offerButton.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.4)';
      offerButton.style.background = 'linear-gradient(45deg, #218838, #1e7e34)';
    });

    offerButton.addEventListener('mouseleave', () => {
      offerButton.style.transform = 'translateY(0)';
      offerButton.style.boxShadow = '0 2px 8px rgba(40, 167, 69, 0.3)';
      offerButton.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
    });

    // Click event
    offerButton.addEventListener('click', () => {
      this.toggleOfferForm();
    });

    // Insertar el botón DESPUÉS del price-wrap
    const parentContainer = priceWrapElement.parentNode as HTMLElement;
    
    if (parentContainer) {
      // Insertar directamente después del price-wrap
      parentContainer.insertBefore(offerButton, priceWrapElement.nextSibling);
    }

    // Crear el formulario de oferta (inicialmente oculto)
    this.createOfferForm(offerButton);

    console.log('✅ Botón de oferta creado exitosamente');
  }

  // ← CREAR FORMULARIO DE OFERTA SIMPLIFICADO
  private createOfferForm(buttonElement: HTMLElement) {
    const offerForm = document.createElement('div');
    offerForm.id = 'offerForm';
    offerForm.className = 'offer-form-container';
    offerForm.style.cssText = `
      display: none;
      background: #ffffff;
      border: 2px solid #28a745;
      border-radius: 12px;
      padding: 20px;
      margin-top: 12px;
      animation: slideDown 0.3s ease-out;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 100%;
    `;

    offerForm.innerHTML = `
      <div class="offer-form-content">
        <div class="input-group" style="margin-bottom: 16px;">
          <label style="display: block; color: #495057; font-weight: 600; margin-bottom: 8px; font-size: 16px;">
            Tu Oferta (${this.carCurrency}):
          </label>
          <input type="number" id="offerAmount" class="offer-input" 
                 placeholder="Ingresa tu oferta" 
                 min="1" 
                 max="${this.carPrice * 0.95}"
                 style="width: 100%; padding: 16px; border: 2px solid #dee2e6; border-radius: 8px; font-size: 18px; font-weight: 500; transition: all 0.3s ease; box-sizing: border-box;">
          <div class="offer-validation" style="color: #dc3545; font-size: 12px; margin-top: 4px; display: none;"></div>
        </div>

        <div class="offer-form-buttons" style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 20px;">
          <button type="button" id="submitOffer" class="submit-offer-btn" 
                  style="flex: 1; min-width: 120px; background: #28a745; color: white; border: none; padding: 16px 20px; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; transition: all 0.3s ease;">
            Enviar Oferta
          </button>
          <button type="button" id="cancelOffer" class="cancel-offer-btn" 
                  style="background: #6c757d; color: white; border: none; padding: 16px 20px; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; transition: all 0.3s ease;">
            Cancelar
          </button>
        </div>
      </div>

      <div id="offerSuccess" style="display: none; text-align: center; padding: 30px 20px;">
        <div style="color: #28a745; font-size: 48px; margin-bottom: 16px;">✅</div>
        <h4 style="color: #28a745; margin: 0 0 8px 0; font-size: 18px;">¡Oferta Enviada!</h4>
        <p style="color: #6c757d; margin: 0; font-size: 14px;">
          Tu oferta ha sido enviada al vendedor. Te contactaremos pronto.
        </p>
      </div>
    `;

    // CSS mejorado
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
          max-height: 0;
        }
        to {
          opacity: 1;
          transform: translateY(0);
          max-height: 600px;
        }
      }
      
      .offer-input:focus {
        border-color: #28a745 !important;
        outline: none;
        box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
      }
      
      .submit-offer-btn:hover {
        background: #218838 !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      
      .cancel-offer-btn:hover {
        background: #5a6268 !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      
      .offer-btn:active {
        transform: translateY(1px) !important;
      }
      
      @media (max-width: 768px) {
        .offer-form-buttons {
          flex-direction: column !important;
        }
        
        .offer-form-buttons button {
          width: 100% !important;
          flex: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Insertar formulario DESPUÉS del botón
    const buttonParent = buttonElement.parentNode;
    if (buttonParent) {
      buttonParent.insertBefore(offerForm, buttonElement.nextSibling);
    }

    // Configurar event listeners del formulario
    this.setupOfferFormListeners();
  }

  // ← CONFIGURAR EVENT LISTENERS DEL FORMULARIO
  private setupOfferFormListeners() {
    setTimeout(() => {
      const submitBtn = document.getElementById('submitOffer');
      const cancelBtn = document.getElementById('cancelOffer');
      const offerAmountInput = document.getElementById('offerAmount') as HTMLInputElement;

      // Validación en tiempo real del monto
      if (offerAmountInput) {
        offerAmountInput.addEventListener('input', () => {
          this.validateOfferAmount();
        });
      }

      // Botón enviar
      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          this.submitOffer();
        });
      }

      // Botón cancelar
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          this.toggleOfferForm();
        });
      }

      console.log('✅ Event listeners del formulario configurados');
    }, 100);
  }

  // ← TOGGLE FORMULARIO DE OFERTA
  private toggleOfferForm() {
    const offerForm = document.getElementById('offerForm');
    const offerButton = document.getElementById('offerButton');
    
    if (!offerForm || !offerButton) return;

    this.offerFormVisible = !this.offerFormVisible;

    if (this.offerFormVisible) {
      offerForm.style.display = 'block';
      offerButton.textContent = '❌ Cancelar Oferta';
      offerButton.style.background = 'linear-gradient(45deg, #dc3545, #c82333)';
      
      // Focus en el primer input
      setTimeout(() => {
        const firstInput = document.getElementById('offerAmount') as HTMLInputElement;
        if (firstInput) firstInput.focus();
      }, 300);
    } else {
      offerForm.style.display = 'none';
      offerButton.textContent = '💰 Hacer una Oferta';
      offerButton.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
      
      // Limpiar formulario
      this.clearOfferForm();
    }
  }

  // ← VALIDAR MONTO DE OFERTA
  private validateOfferAmount(): boolean {
    const offerAmountInput = document.getElementById('offerAmount') as HTMLInputElement;
    const validationDiv = document.querySelector('.offer-validation') as HTMLElement;
    
    if (!offerAmountInput || !validationDiv) return false;

    const offerAmount = parseFloat(offerAmountInput.value);
    const minOffer = this.carPrice * 0.5; // Mínimo 50% del precio
    const maxOffer = this.carPrice * 0.95; // Máximo 95% del precio

    validationDiv.style.display = 'none';
    offerAmountInput.style.borderColor = '#dee2e6';

    if (!offerAmount || offerAmount <= 0) {
      validationDiv.textContent = 'Por favor ingresa un monto válido';
      validationDiv.style.display = 'block';
      offerAmountInput.style.borderColor = '#dc3545';
      return false;
    }

    if (offerAmount < minOffer) {
      validationDiv.textContent = `La oferta mínima es ${this.formatCurrency(minOffer)}`;
      validationDiv.style.display = 'block';
      offerAmountInput.style.borderColor = '#dc3545';
      return false;
    }

    if (offerAmount >= this.carPrice) {
      validationDiv.textContent = 'La oferta debe ser menor al precio actual';
      validationDiv.style.display = 'block';
      offerAmountInput.style.borderColor = '#dc3545';
      return false;
    }

    // Oferta válida
    offerAmountInput.style.borderColor = '#28a745';
    return true;
  }

  // ← ENVIAR OFERTA
  private async submitOffer() {
    if (this.isSubmittingOffer) return;

    // Validar formulario
    if (!this.validateOfferForm()) return;

    this.isSubmittingOffer = true;

    const submitBtn = document.getElementById('submitOffer') as HTMLButtonElement;
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.style.background = '#6c757d';
    submitBtn.disabled = true;

    try {
      // Recopilar datos del formulario simplificado
      const offerData = {
        vehicleId: this.getVehicleId(),
        offerAmount: parseFloat((document.getElementById('offerAmount') as HTMLInputElement).value),
        currency: this.carCurrency,
        originalPrice: this.carPrice,
        timestamp: new Date().toISOString()
      };

      console.log('📤 Enviando oferta:', offerData);

      // Llamar a la API
      const response = await this.sendOfferToAPI(offerData);

      if (response.success) {
        this.showOfferSuccess();
      } else {
        throw new Error(response.message || 'Error al enviar la oferta');
      }

    } catch (error) {
      console.error('Error enviando oferta:', error);
      this.showOfferError('Error al enviar la oferta. Por favor intenta nuevamente.');
    } finally {
      this.isSubmittingOffer = false;
      submitBtn.textContent = originalText;
      submitBtn.style.background = '#28a745';
      submitBtn.disabled = false;
    }
  }

  // ← VALIDAR FORMULARIO SIMPLIFICADO
  private validateOfferForm(): boolean {
    // Solo validar el monto de la oferta
    return this.validateOfferAmount();
  }

  // ← MOSTRAR ERROR EN CAMPO
  private showFieldError(input: HTMLInputElement, message: string) {
    input.style.borderColor = '#dc3545';
    input.focus();
    
    // Crear o actualizar mensaje de error
    let errorDiv = input.nextElementSibling as HTMLElement;
    if (!errorDiv || !errorDiv.classList.contains('field-error')) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'field-error';
      errorDiv.style.cssText = 'color: #dc3545; font-size: 12px; margin-top: 4px;';
      input.parentNode?.insertBefore(errorDiv, input.nextSibling);
    }
    
    errorDiv.textContent = message;
    
    // Limpiar error al escribir
    input.addEventListener('input', () => {
      input.style.borderColor = '#dee2e6';
      if (errorDiv) errorDiv.remove();
    }, { once: true });
  }

  // ← ENVIAR A API
  private async sendOfferToAPI(offerData: any): Promise<any> {
    try {
      const response = await fetch('/api/vehicle-offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en API:', error);
      
      // Simular respuesta exitosa para desarrollo
      console.log('📝 Simulando envío exitoso para desarrollo...');
      return { success: true, message: 'Oferta enviada correctamente' };
    }
  }

  // ← MOSTRAR ÉXITO
  private showOfferSuccess() {
    const formContent = document.querySelector('.offer-form-content') as HTMLElement;
    const successDiv = document.getElementById('offerSuccess') as HTMLElement;
    
    if (formContent && successDiv) {
      formContent.style.display = 'none';
      successDiv.style.display = 'block';
      
      // Cerrar automáticamente después de 3 segundos
      setTimeout(() => {
        this.toggleOfferForm();
      }, 3000);
    }
  }

  // ← MOSTRAR ERROR
  private showOfferError(message: string) {
    alert(message); // Mejorar con un modal más elegante si es necesario
  }

  // ← OBTENER ID DEL VEHÍCULO
  private getVehicleId(): string {
    // Implementar lógica para obtener el ID del vehículo actual
    // Puede ser desde la URL, un atributo del DOM, etc.
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('vehicleId') || 'vehicle-001';
  }

  // ← LIMPIAR FORMULARIO SIMPLIFICADO
  private clearOfferForm() {
    const offerInput = document.getElementById('offerAmount') as HTMLInputElement;
    if (offerInput) {
      offerInput.value = '';
      offerInput.style.borderColor = '#dee2e6';
    }
    
    // Limpiar mensajes de error
    const errorDivs = document.querySelectorAll('.field-error');
    errorDivs.forEach(div => div.remove());
    
    // Limpiar validación
    const validationDiv = document.querySelector('.offer-validation') as HTMLElement;
    if (validationDiv) {
      validationDiv.style.display = 'none';
    }
    
    // Mostrar formulario y ocultar éxito
    const formContent = document.querySelector('.offer-form-content') as HTMLElement;
    const successDiv = document.getElementById('offerSuccess') as HTMLElement;
    
    if (formContent && successDiv) {
      formContent.style.display = 'block';
      successDiv.style.display = 'none';
    }
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

    console.log('💰 Cálculos:', {
      currency: this.carCurrency,
      initial: initialValue,
      finance: financeAmount,
      monthly: monthlyPayment,
      closing: closingCosts
    });
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
        console.log('✅ Pago mensual actualizado:', valueDiv.textContent);
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
              console.log('✅ Pago mensual actualizado (fallback):', valueDiv.textContent);
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
      console.log('🏦 Bancos encontrados:', bankItems.length);

      bankItems.forEach((item, index) => {
        let mouseDownTime = 0;
        let hasMoved = false;

        const handleEnd = (e: Event) => {
          const clickDuration = Date.now() - mouseDownTime;

          if (!hasMoved && clickDuration < 300 && !this.isSliderDragging) {
            e.preventDefault();
            e.stopPropagation();

            const bankName = item.getAttribute('data-bank') || `Banco ${index + 1}`;
            console.log(`${bankName} seleccionado`);

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

      console.log('✅ Clicks de bancos configurados');
    }, 1600);
  }

  selectBank(bankName: string) {
    console.log(`🏦 Banco seleccionado: ${bankName}`);
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
        console.log('❌ termSelector no encontrado');
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
      
      console.log('✅ Selector de términos inicializado');
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

        console.log('✅ Término seleccionado:', term.label);
        
        setTimeout(() => {
          this.calculateLoanValues();
        }, 100);
      };

      termsList.appendChild(li);
    });

    termSelector.style.opacity = '1';
    console.log(`✅ ${terms.length} términos cargados`);
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