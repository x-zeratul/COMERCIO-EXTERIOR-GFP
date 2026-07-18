/**
 * Datos REALES de comercio exterior — Grupo Friopacking.
 * Fuente: importaciones_master.xlsx (hojas: Resumen por Año, País, Modalidad,
 * Resumen 2026 Empresa, Top Proveedores 2026). Extraídos el 2026-07-18.
 * Estos datos NO son de ejemplo: provienen del maestro de importaciones.
 * @typedef {import('./types.js')}
 */

export const TRADE_SOURCE = 'importaciones_master.xlsx';

/** Serie anual de importaciones (real). */
export const importsByYear = [
  { year: 2020, n: 136, fleteTotal: 1707,   valorMercancia: 21559,   paises: 1,  proveedores: 44 },
  { year: 2021, n: 225, fleteTotal: 480718,  valorMercancia: 2582000, paises: 15, proveedores: 59 },
  { year: 2022, n: 231, fleteTotal: 167404,  valorMercancia: 1433336, paises: 12, proveedores: 43 },
  { year: 2023, n: 236, fleteTotal: 29823,   valorMercancia: 115862,  paises: 5,  proveedores: 34 },
  { year: 2024, n: 215, fleteTotal: 132619,  valorMercancia: 1774834, paises: 13, proveedores: 33 },
  { year: 2025, n: 288, fleteTotal: 160155,  valorMercancia: 2791143, paises: 17, proveedores: 25 },
  { year: 2026, n: 83,  fleteTotal: 39225,   valorMercancia: 847525,  paises: 8,  proveedores: 38 },
];

/** Importaciones por país de origen (real, top). */
export const importsByCountry = [
  { pais: 'Italia',         n: 111, valor: 796173,  modalidad: 'maritimo' },
  { pais: 'China',          n: 72,  valor: 2664495, modalidad: 'maritimo' },
  { pais: 'Estados Unidos', n: 65,  valor: 521867,  modalidad: 'aereo' },
  { pais: 'España',         n: 54,  valor: 1193435, modalidad: 'maritimo' },
  { pais: 'Chile',          n: 47,  valor: 252131,  modalidad: 'maritimo' },
  { pais: 'Brasil',         n: 35,  valor: 1134950, modalidad: 'aereo' },
  { pais: 'Alemania',       n: 30,  valor: 290572,  modalidad: 'maritimo' },
  { pais: 'México',         n: 14,  valor: 249565,  modalidad: 'maritimo' },
  { pais: 'Bélgica',        n: 10,  valor: 312367,  modalidad: 'maritimo' },
  { pais: 'Argentina',      n: 9,   valor: 251930,  modalidad: 'terrestre' },
];

/** Modalidad de transporte (real). */
export const importsByMode = [
  { modalidad: 'Marítimo',  n: 487, valor: 7836066 },
  { modalidad: 'Aéreo',     n: 321, valor: 1054414 },
  { modalidad: 'Courier',   n: 20,  valor: 0 },
  { modalidad: 'Terrestre', n: 19,  valor: 66830 },
];

/** 2026 por empresa del grupo (real). */
export const trade2026ByCompany = [
  { empresa: 'FRIOPACKING', n: 47, flete: 4971,  valorMercancia: 185670, total: 193626, proveedores: 24 },
  { empresa: 'SMARTCOLD',   n: 15, flete: 8484,  valorMercancia: 143601, total: 74245,  proveedores: 7 },
  { empresa: 'HERMETICA',   n: 12, flete: 22937, valorMercancia: 468412, total: 521641, proveedores: 9 },
  { empresa: 'FRIOTEAM',    n: 9,  flete: 2834,  valorMercancia: 49843,  total: 49337,  proveedores: 4 },
];

/** Top proveedores 2026 (real). */
export const topSuppliers2026 = [
  { proveedor: 'DANFOSS',    n: 8, total: 181934 },
  { proveedor: 'BMP',        n: 2, total: 187896 },
  { proveedor: 'INKEMA',     n: 4, total: 164456 },
  { proveedor: 'AMARR',      n: 1, total: 60933 },
  { proveedor: 'CONDOOR',    n: 2, total: 58122 },
  { proveedor: 'DUNLI',      n: 1, total: 29072 },
  { proveedor: 'CHANGZHOU',  n: 1, total: 25402 },
  { proveedor: 'KFL',        n: 1, total: 21107 },
  { proveedor: 'JOHNSON',    n: 3, total: 20740 },
  { proveedor: 'KINGSPAN',   n: 2, total: 17881 },
];

/** Totales agregados 2026 YTD (real). */
export const trade2026Totals = {
  importaciones: 83,
  paises: 8,
  proveedores: 38,
  valorMercanciaUsd: 847525,
  totalImportacionUsd: 838848,
  fleteTotalUsd: 39225,
};
