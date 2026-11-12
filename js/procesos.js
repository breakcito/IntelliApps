/* Catálogo de los 18 procesos de SCOM (fuente única para el catálogo y el modal). */
const CATEGORIAS = {
  personal: 'Personal',
  logistica: 'Logística',
  activos: 'Activos',
  produccion: 'Producción',
};

const PROCESOS = [
  { n: '01', file: '01-contratos', cat: 'personal', title: 'Contratos y Adendas', desc: 'Registra el ingreso de personal en planilla, jornada o a prueba, y formaliza adendas de cargo o sueldo en el sistema.' },
  { n: '02', file: '02-horarios', cat: 'personal', title: 'Programación de Horarios', desc: 'Define quién trabaja, dónde y en qué turno (día o noche), por grupos y guardias.' },
  { n: '03', file: '03-asistencia-planilla', cat: 'personal', title: 'Asistencia y Pre-Planilla', desc: 'Verifica el tareo diario con fotocheck o QR y genera la pre-planilla automáticamente con deducciones y días laborados.' },
  { n: '04', file: '04-inventario', cat: 'logistica', title: 'Inventario en Almacén', desc: 'Kardex en tiempo real, códigos QR para ítems y control preciso de niveles mínimos de repuestos y materiales.' },
  { n: '05', file: '05-pedidos', cat: 'logistica', title: 'Pedidos de Contratistas', desc: 'Vales digitales para despachar materiales a contratistas con validación de labor y firma de conformidad.' },
  { n: '06', file: '06-reabastecimiento', cat: 'logistica', title: 'Reabastecimiento', desc: 'Solicitudes de reposición al almacén central según consumo histórico y stock de seguridad.' },
  { n: '07', file: '07-prestamos', cat: 'logistica', title: 'Préstamos entre Almacenes', desc: 'Transferencias rápidas de repuestos y materiales entre almacenes de mina sin retrasar la guardia.' },
  { n: '08', file: '08-cotizaciones', cat: 'logistica', title: 'Cotizaciones a Proveedores', desc: 'Cuadro comparativo de precios, tiempos de entrega y condiciones para compras estratégicas.' },
  { n: '09', file: '09-ordenes-compra', cat: 'logistica', title: 'Órdenes de Compra', desc: 'Emisión formal y recepción con verificación contra guía de remisión e ingreso automático al kardex.' },
  { n: '10', file: '10-activos', cat: 'activos', title: 'Registro de Maquinaria', desc: 'Ficha técnica, número de serie, horómetro inicial y depreciación de cada equipo pesado.' },
  { n: '11', file: '11-maquinaria', cat: 'activos', title: 'Horómetros y Combustible', desc: 'Horas máquina por guardia y control de consumo de diésel para detectar desvíos.' },
  { n: '12', file: '12-mantenimiento', cat: 'activos', title: 'Mantenimiento Preventivo', desc: 'Alertas por horas cumplidas y órdenes de taller con repuestos descontados del almacén.' },
  { n: '13', file: '13-lotes', cat: 'produccion', title: 'Creación de Lotes', desc: 'Identificación de cada lote de mineral según labor de origen, contratista responsable y fecha.' },
  { n: '14', file: '14-despacho', cat: 'produccion', title: 'Pesaje en Balanza', desc: 'Registro de pesaje tara y bruto con emisión de ticket inviolable para cada camión.' },
  { n: '15', file: '15-analisis', cat: 'produccion', title: 'Leyes de Laboratorio', desc: 'Registro de ensayos químicos, humedad y porcentaje de mineral para sustentar la liquidación.' },
  { n: '16', file: '16-blending', cat: 'produccion', title: 'Blending de Mineral', desc: 'Simulador de mezclas de mineral de distintas leyes para optimizar el valor comercial final.' },
  { n: '17', file: '17-costos', cat: 'produccion', title: 'Costos Operativos por Lote', desc: 'Mano de obra, explosivos y maquinaria imputados a cada lote para conocer su rentabilidad real.' },
  { n: '18', file: '18-venta', cat: 'produccion', title: 'Liquidación y Venta', desc: 'Cálculo exacto con la comercializadora considerando cotización internacional, maquila, penalidades y valor neto.' },
];

const VIDEO_PRINCIPAL = {
  src: 'videos/erp-minero.mp4',
  title: 'SCOM · Menos papel, más control',
  desc: 'Personal, logística, maquinaria y producción: los cuatro frentes de tu operación en un solo sistema.',
};
