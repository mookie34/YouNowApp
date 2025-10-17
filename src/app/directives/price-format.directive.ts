import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appPriceFormat]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PriceFormatDirective),
      multi: true
    }
  ]
})

export class PriceFormatDirective implements ControlValueAccessor {
  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef) {}

  // Formatea el valor con separador de miles mientras se escribe
  private formatValueWhileTyping(value: string): string {
    if (!value) return '';

    // Separa parte entera y decimal
    const parts = value.split(',');
    const integerPart = parts[0].replace(/\./g, ''); // Elimina puntos existentes
    const decimalPart = parts[1] || '';

    // Agrega separador de miles a la parte entera
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Retorna con la parte decimal si existe
    return decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger;
  }

  // Formatea el valor final con decimales
  private formatValueFinal(value: number | null): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }
    return value.toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Limpia el formato y convierte a número
  private parseValue(value: string): number | null {
    if (!value) return null;

    // Elimina puntos (separadores de miles) y reemplaza coma por punto decimal
    const cleanValue = value.replace(/\./g, '').replace(',', '.');
    const numericValue = parseFloat(cleanValue);

    return isNaN(numericValue) ? null : numericValue;
  }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = this.el.nativeElement;
    const cursorPosition = input.selectionStart;
    const oldValue = input.value;

    // Permite solo números, punto y coma
    let value = oldValue.replace(/[^\d.,]/g, '');

    // Permite solo una coma decimal
    const commaCount = (value.match(/,/g) || []).length;
    if (commaCount > 1) {
      value = value.substring(0, value.lastIndexOf(','));
    }

    // Limita a 2 decimales después de la coma
    if (value.includes(',')) {
      const parts = value.split(',');
      if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
        value = parts.join(',');
      }
    }

    // Formatea con separador de miles mientras escribe
    const formattedValue = this.formatValueWhileTyping(value);

    // Calcula la nueva posición del cursor
    const addedDots = (formattedValue.match(/\./g) || []).length - (oldValue.match(/\./g) || []).length;
    const newCursorPosition = cursorPosition + addedDots;

    // Actualiza el valor en el input
    input.value = formattedValue;

    // Restaura la posición del cursor
    input.setSelectionRange(newCursorPosition, newCursorPosition);

    // Actualiza el modelo con el valor numérico
    const numericValue = this.parseValue(formattedValue);
    this.onChange(numericValue);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
    const value = this.el.nativeElement.value;

    if (value) {
      const numericValue = this.parseValue(value);
      // Formatea el valor final con 2 decimales al perder el foco
      this.el.nativeElement.value = this.formatValueFinal(numericValue);
    }
  }

  @HostListener('focus')
  onFocus(): void {
    const value = this.el.nativeElement.value;

    if (value) {
      // Al hacer foco, mantiene el formato con separador de miles
      const numericValue = this.parseValue(value);
      if (numericValue !== null) {
        // Muestra sin los .00 al final para facilitar edición
        const formatted = numericValue.toLocaleString('es-CO', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        });
        this.el.nativeElement.value = formatted;
      }
    }
  }

  // Implementación de ControlValueAccessor
  writeValue(value: number | null): void {
    // Formatea el valor inicial
    this.el.nativeElement.value = this.formatValueFinal(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }
}
