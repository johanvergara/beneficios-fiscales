import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import jsPDF from 'jspdf';
import { jsPDF as PDF } from 'jspdf'


@Component({
  selector: 'app-formulario-contable',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatButtonToggleModule,
  ],
  templateUrl: './formulario-contable.html',
  styleUrl: './formulario-contable.css'
})
export class FormularioContable {
  // Logo en formato SVG para el PDF
  private readonly logoSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>`;
  // --- Estructura de Datos para Beneficios (Bloque 3) ---
  preguntasBeneficios = [
    { id: 'p1', titulo: 'Deducción del 50% del GMF (4x1000)', pregunta: '¿Durante el año gravable realizaste movimientos financieros sujetos al Gravamen a los Movimientos Financieros (GMF – 4x1000)?', tooltip: 'El GMF corresponde al impuesto del 0,4 % que se cobra por cada retiro o transferencia realizada desde cuentas bancarias.\n*puedes deducir el 50 % del GMF total pagado siempre que cuentes con los soportes emitidos por la entidad financiera.* (Art. 115 E.T.).' },
    { id: 'p2', titulo: 'Deducción de intereses por crédito hipotecario o leasing habitacional', pregunta: '¿Tienes actualmente un crédito hipotecario o un contrato de leasing habitacional por el cual pagaste intereses durante el año gravable?', tooltip: 'Aplica para créditos o contratos de leasing habitacional con garantía hipotecaria, destinados a la adquisición de vivienda para uso propio. Puedes deducir los intereses pagados hasta un máximo de 1.200 UVT anuales (equivalentes a $56.478.000 para el año gravable 2024), siempre que cuentes con la certificación bancaria o del fondo de vivienda.\n(Art. 119 del Estatuto Tributario).' },
    { id: 'p3', titulo: 'Deducción de intereses por créditos educativos (ICETEX)', pregunta: '¿Tienes o tuviste un crédito educativo con el ICETEX por el cual pagaste intereses durante el año gravable?', tooltip: 'Aplica para personas naturales que sean titulares de créditos educativos con el ICETEX y hayan pagado intereses durante el año. Puedes deducir los intereses pagados hasta 100 UVT anuales (aproximadamente $4.706.500 para el año gravable 2024), siempre que cuentes con la certificación oficial del ICETEX. (Art. 119 del Estatuto Tributario, modificado por la Ley 2010 de 2019).' },
    { id: 'p4', titulo: 'Deducción por dependientes económicos', pregunta: '¿Tienes personas a cargo (hijos, padres, pareja, hermanos o familiares con discapacidad) que dependan económicamente de ti?', tooltip: 'Aplica para asalariados que sostienen económicamente a dependientes. Desde 2023 se permiten hasta 5 dependientes, solo en formulario 210 o sea residentes fiscales en Colombia. (Art. 387 del Estatuto Tributario y Concepto DIAN 416 de 2023).' },
    { id: 'p5', titulo: 'Deducción por medicina prepagada o seguros de salud', pregunta: '¿Pagas medicina prepagada, una póliza de salud o un plan complementario para ti o tus dependientes?', tooltip: 'Aplica para asalariados que realizan pagos voluntarios a planes de salud adicionales al régimen obligatorio, ya sea a través de EPS, seguros médicos o medicina prepagada. Puedes deducir estos pagos hasta un máximo de 192 UVT anuales ($9.036.480 para el año gravable 2024). Debes contar con la certificación emitida por la entidad de salud o aseguradora. (Art. 387 del Estatuto Tributario).' },
    { id: 'p6', titulo: 'Deducción por aportes voluntarios a cesantías', pregunta: '¿Realizas aportes voluntarios a fondos de cesantías además de los obligatorios?', tooltip: 'Aplica para personas naturales que, de forma voluntaria, realizan aportes adicionales a su fondo de cesantías, ya sea como asalariados o independientes. Puedes deducir estos aportes hasta un máximo de 2.500 UVT anuales ($117.662.500 para el año gravable 2024). Debes contar con la certificación expedida por el fondo de cesantías y los comprobantes de pago correspondientes.\n(Art. 126-1 del Estatuto Tributario).' },
    { id: 'p7', titulo: 'Deducción por aportes a pensiones voluntarias o cuentas AFC/AVC', pregunta: '¿Realizas aportes voluntarios a fondos de pensiones o cuentas AFC/AVC para ahorro o compra de vivienda?', tooltip: 'Aplica para personas naturales que ahorran voluntariamente en fondos de pensión o cuentas AFC (Ahorro para Fomento a la Construcción) / AVC (Ahorro Voluntario Contractual). Puedes deducir hasta el 30 % de tus ingresos laborales o 3.800 UVT anuales ($178.044.500 para el año gravable 2024), siempre que cuentes con la certificación del fondo o entidad financiera.\n(Art. 126-1 del Estatuto Tributario y Decreto 1625 de 2016).' },
    { id: 'p8', titulo: 'Deducción por inversiones en energías renovables', pregunta: '¿Has invertido en proyectos de energía renovable o sostenibilidad ambiental certificados por la UPME (por ejemplo, paneles solares, vehículos eléctricos)?', tooltip: 'Aplica para personas naturales que realizan inversiones en proyectos de energías limpias o tecnologías sostenibles, previamente certificados por la Unidad de Planeación Minero Energética (UPME). Puedes deducir el 50 % del valor invertido, aplicable durante un periodo de 15 años. Debes contar con la certificación oficial de la UPME que acredite la inversión.\n(Art. 11 de la Ley 2099 de 2021).' }
  ];

  // Umbrales para la declaración de renta
  private readonly UMBRAL_CAMPO1 = 211792500;
  private readonly UMBRAL_GENERAL = 65891000;

  // Modelos para los campos del formulario
  campo1: number | undefined;
  campo2: number | undefined;
  campo3: number | undefined;
  campo4: number | undefined;
  opcionSiNo: string | undefined;

  // Mensaje de declaración
  mensajeDeclaracion: string | null = null;
  debeDeclarar: boolean = false;
  razonesParaDeclarar: string[] = [];

  // Alertas para cada campo
  alertaCampo1: string | null = null;
  alertaCampo2: string | null = null;
  alertaCampo3: string | null = null;
  alertaCampo4: string | null = null;

  // Propiedad para habilitar/deshabilitar el botón de cálculo
  formValido: boolean = false;

  // Propiedad para controlar la visibilidad del siguiente formulario
  mostrarSiguienteFormulario: boolean = false;

  // --- Lógica para el Bloque 2 y 3 ---
  respuestaBloque2: string | undefined;
  mostrarBloque3: boolean = false;
  mensajeBloque2: string | null = null;

  // Modelos para las 8 preguntas del bloque 3 (puedes expandir esto)
  respuestasBloque3: { [key: string]: string | undefined } = {};
  beneficiosAplicables: any[] = [];
  mostrarResumenBloque3 = false;



  // --- Lógica para la barra de progreso ---
  pasoActual = 1;
  readonly totalPasos = 3;
  progreso = 0;

  constructor() {
    this.preguntasBeneficios.forEach(p => {
      this.respuestasBloque3[p.id] = undefined;
    });
    this.actualizarProgreso();
  }

  private actualizarProgreso(): void {
    this.progreso = (this.pasoActual / this.totalPasos) * 100;
  }

  /**
   * Valida en tiempo real si el formulario está completo para habilitar el botón
   * y muestra las alertas de topes superados por campo.
   */
  verificarEstadoFormulario(): void {
    // Validar si el formulario está completo para habilitar el botón
    this.formValido =
      this.campo1 !== undefined && this.campo1 !== null &&
      this.campo2 !== undefined && this.campo2 !== null &&
      this.campo3 !== undefined && this.campo3 !== null &&
      this.campo4 !== undefined && this.campo4 !== null &&
      this.opcionSiNo !== undefined;

    // Lógica para las alertas individuales de cada campo
    const superaTope1 = this.campo1 && this.campo1 >= this.UMBRAL_CAMPO1;
    const superaTope2 = this.campo2 && this.campo2 >= this.UMBRAL_GENERAL;
    const superaTope3 = this.campo3 && this.campo3 >= this.UMBRAL_GENERAL;
    const superaTope4 = this.campo4 && this.campo4 >= this.UMBRAL_GENERAL;
    const formatoMoneda = { style: 'currency' as const, currency: 'COP', minimumFractionDigits: 0 };
    this.alertaCampo1 = superaTope1 ? `Superaste el tope de ${this.UMBRAL_CAMPO1.toLocaleString('es-CO', formatoMoneda)}` : null;
    this.alertaCampo2 = superaTope2 ? `Superaste el tope de ${this.UMBRAL_GENERAL.toLocaleString('es-CO', formatoMoneda)}` : null;
    this.alertaCampo3 = superaTope3 ? `Superaste el tope de ${this.UMBRAL_GENERAL.toLocaleString('es-CO', formatoMoneda)}` : null;
    this.alertaCampo4 = superaTope4 ? `Superaste el tope de ${this.UMBRAL_GENERAL.toLocaleString('es-CO', formatoMoneda)}` : null;

    // Oculta el resultado si el usuario cambia un valor después de calcular
    this.mensajeDeclaracion = null;
    this.debeDeclarar = false;
    this.razonesParaDeclarar = [];
  }

  /**
   * Método ejecutado por el botón para mostrar el resultado final.
   */
  calcularBeneficios(): void {
    const superaTope1 = this.campo1 && this.campo1 >= this.UMBRAL_CAMPO1;
    const superaTope2 = this.campo2 && this.campo2 >= this.UMBRAL_GENERAL;
    const superaTope3 = this.campo3 && this.campo3 >= this.UMBRAL_GENERAL;
    const superaTope4 = this.campo4 && this.campo4 >= this.UMBRAL_GENERAL;
    const esResponsableIva = this.opcionSiNo === 'si';

    this.razonesParaDeclarar = [];
    const formatoMoneda = { style: 'currency' as const, currency: 'COP', minimumFractionDigits: 0 };

    if (superaTope1) {
      this.razonesParaDeclarar.push(`Superaste el tope de patrimonio bruto de ${this.UMBRAL_CAMPO1.toLocaleString('es-CO', formatoMoneda)}.`);
    }
    if (superaTope2) {
      this.razonesParaDeclarar.push(`Superaste el tope de ingresos brutos de ${this.UMBRAL_GENERAL.toLocaleString('es-CO', formatoMoneda)}.`);
    }
    if (superaTope3) {
      this.razonesParaDeclarar.push(`Superaste el tope de compras y gastos de ${this.UMBRAL_GENERAL.toLocaleString('es-CO', formatoMoneda)}.`);
    }
    if (superaTope4) {
      this.razonesParaDeclarar.push(`Superaste el tope de consumo con tarjeta de crédito de ${this.UMBRAL_GENERAL.toLocaleString('es-CO', formatoMoneda)}.`);
    }
    if (esResponsableIva) {
      this.razonesParaDeclarar.push('Eres responsable de IVA.');
    }

    this.debeDeclarar = superaTope1 || superaTope2 || superaTope3 || superaTope4 || esResponsableIva;

    if (this.debeDeclarar) {
      this.mensajeDeclaracion = 'Cumpliste con una o más condiciones, por lo cual debes declarar renta:';
    } else {
      this.mensajeDeclaracion = 'No cumples con los requisitos para declarar renta.';
    }
  }

  /**
   * Método para mostrar el siguiente formulario.
   */
  mostrarSiguientePaso(): void {
    this.mostrarSiguienteFormulario = true;
    this.pasoActual = 2;
    this.actualizarProgreso();
  }

  /**
   * Evalúa la respuesta del segundo bloque de preguntas.
   */
  evaluarRespuestaBloque2(): void {
    this.pasoActual = 3;
    this.actualizarProgreso();
    if (this.respuestaBloque2 === 'si') {
      this.mostrarBloque3 = true;
      this.mensajeBloque2 = null;
    } else if (this.respuestaBloque2 === 'no') {
      this.mostrarBloque3 = false;
      this.mensajeBloque2 = 'De acuerdo con la informacion suministrada, usted no percibe ingresos provenientes de una relacion laboral ni de la prestacion de servicios bajo la modalidad de honorarios. En consecuencia, el presente checklist no aplica en su caso, dado que fue disenado especificamente para personas naturales que obtienen rentas de trabajo o rentas por honorarios, conforme a lo establecido en el articulo 103 del Estatuto Tributario.';
    } else {
      this.mostrarBloque3 = false;
      this.mensajeBloque2 = null;
    }
  }

  /**
   * Regresa desde el bloque 2 al bloque 1.
   */
  regresarABloque1(): void {
    this.mostrarSiguienteFormulario = false;
    this.mensajeDeclaracion = null; // Oculta el resultado del bloque 1 para forzar el recálculo.
    this.pasoActual = 1;
    this.actualizarProgreso();
  }

  /**
   * Regresa desde el bloque 3 (o desde el mensaje de 'No') a la pregunta del bloque 2.
   */
  regresarAPreguntaBloque2(): void {
    this.respuestaBloque2 = undefined;
    this.mostrarBloque3 = false;
    this.mensajeBloque2 = null;
    this.pasoActual = 2;
    this.actualizarProgreso();
  }

  /**
   * Verifica si todas las preguntas del bloque 3 han sido respondidas.
   */
  get bloque3Valido(): boolean {
    return this.preguntasBeneficios.every(p => this.respuestasBloque3[p.id] !== undefined);
  }

  /**
   * Procesa las respuestas del bloque 3 y muestra el resumen de beneficios.
   */
  calcularBeneficiosBloque3(): void {
    this.beneficiosAplicables = this.preguntasBeneficios.filter(
      p => this.respuestasBloque3[p.id] === 'si'
    );
    this.mostrarResumenBloque3 = true;
  }

  /**
   * Regresa desde el resumen del bloque 3 a las preguntas.
   */
  regresarAPreguntasBloque3(): void {
    this.mostrarResumenBloque3 = false;
    this.beneficiosAplicables = [];
  }

  /**
   * Reinicia todo el formulario a su estado inicial.
   */
  reiniciarProceso(): void {
    // Reset Bloque 1
    this.campo1 = undefined;
    this.campo2 = undefined;
    this.campo3 = undefined;
    this.campo4 = undefined;
    this.opcionSiNo = undefined;
    this.mensajeDeclaracion = null;
    this.debeDeclarar = false;
    this.razonesParaDeclarar = [];
    this.alertaCampo1 = null;
    this.alertaCampo2 = null;
    this.alertaCampo3 = null;
    this.alertaCampo4 = null;
    this.formValido = false;
    this.mostrarSiguienteFormulario = false;

    // Reset Bloque 2
    this.respuestaBloque2 = undefined;
    this.mostrarBloque3 = false;
    this.mensajeBloque2 = null;

    // Reset Bloque 3
    this.preguntasBeneficios.forEach(p => { this.respuestasBloque3[p.id] = undefined; });
    this.beneficiosAplicables = [];
    this.mostrarResumenBloque3 = false;

    // Reset progreso
    this.pasoActual = 1;
    this.actualizarProgreso();
  }

  /**
   * Genera un archivo PDF con el resumen de los beneficios fiscales.
   */
  async generarPDF(): Promise<void> {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const usableWidth = pdfWidth - margin * 2;
    let yPos = margin; // Posición inicial Y

    // --- Título ---
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Resumen de Beneficios Fiscales', pdfWidth / 2, yPos + 10, { align: 'center' });
    yPos += 15;

    // --- Línea separadora ---
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPos, pdfWidth - margin, yPos);
    yPos += 10;

    // --- Contenido ---
    if (this.beneficiosAplicables.length === 0) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const noBeneficiosText = 'Según tus respuestas, no has seleccionado opciones que generen beneficios fiscales directos de esta lista.';
      const textLines = pdf.splitTextToSize(noBeneficiosText, usableWidth);
      pdf.text(textLines, margin, yPos);
    } else {
      this.beneficiosAplicables.forEach(beneficio => {
        // Espacio antes de cada beneficio
        yPos += 5;

        // Título del beneficio
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        const tituloLines = pdf.splitTextToSize(beneficio.titulo, usableWidth);
        pdf.text(tituloLines, margin, yPos);
        yPos += (tituloLines.length * 7); // Ajustar el espaciado basado en las líneas del título

        // Descripción del beneficio
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        const descripcionLines = pdf.splitTextToSize(beneficio.tooltip, usableWidth);
        pdf.text(descripcionLines, margin, yPos);
        yPos += (descripcionLines.length * 5) + 5; // Ajustar espaciado y añadir un extra

        // Comprobar si se necesita una nueva página
        if (yPos > pdfHeight - 25) { // 25mm de margen inferior
          pdf.addPage();
          yPos = margin; // Reiniciar posición en la nueva página
        }
      });
    }

    // --- Agregar pie de página y marca de agua a todas las páginas ---
    const pageCount = pdf.getNumberOfPages();
    const logoBase64 = await this.getBase64ImageFromURL('assets/logo-removebg-preview.png').catch(e => {
      console.error("Error al cargar el logo:", e);
      return null;
    });

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);

      // Marca de Agua
      if (logoBase64) {
        const logoWidth = 120; // Hacemos la marca de agua un poco más grande
        const logoHeight = (logoWidth * 15) / 40; // Mantener proporción
        pdf.saveGraphicsState();
        // Opacidad muy baja para que no interfiera con el texto
        pdf.setGState(pdf.GState({ opacity: 0.15 }));
        pdf.addImage(logoBase64, 'PNG', (pdfWidth - logoWidth) / 2, (pdfHeight - logoHeight) / 2, logoWidth, logoHeight);
        pdf.restoreGraphicsState();
      }

      // Pie de página
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      const fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
      pdf.text(`Generado el ${fecha}`, margin, pdfHeight - 10);
      pdf.text(`Página ${i} de ${pageCount}`, pdfWidth - margin, pdfHeight - 10, { align: 'right' });
    }

    // Guardar el PDF
    pdf.save('Resumen-Beneficios-Fiscales.pdf');
  }

  // La función agregarLogo ya no es necesaria, su lógica se ha integrado en generarPDF.
  /*
  private async agregarLogo(pdf: jsPDF, x: number, y: number, width: number, height: number): Promise<void> {
    try {
      const logoBase64 = await this.getBase64ImageFromURL('assets/logo-removebg-preview.png');
      // Añade la imagen.
      // Parámetros: imagen, formato, x, y, ancho, alto
      pdf.addImage(logoBase64, 'PNG', x, y, width, height);
    } catch (error) {
      console.error("Error al cargar el logo:", error);
      // Si el logo no se carga, el PDF se generará sin él.
    }
  }
  */

  /**
   * Convierte una imagen de una URL a formato base64.
   */
  private getBase64ImageFromURL(url: string): Promise<string> {
    return fetch(url)
      .then(res => res.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
  }
}
