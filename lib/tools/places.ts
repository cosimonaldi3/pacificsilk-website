import type { CnPort, DestPort, Destination, Origin } from "./types.ts";

// Coordinates are [longitude, latitude].

export const CN_PORTS: Record<string, CnPort> = {
  shenzhen:  { name: "Shenzhen (Yantian)", short: "Shenzhen",  coord: [114.27, 22.57] },
  guangzhou: { name: "Guangzhou (Nansha)", short: "Guangzhou", coord: [113.62, 22.75] },
  xiamen:    { name: "Xiamen",             short: "Xiamen",    coord: [118.07, 24.47] },
  ningbo:    { name: "Ningbo-Zhoushan",    short: "Ningbo",    coord: [121.88, 29.93] },
  shanghai:  { name: "Shanghai (Yangshan)", short: "Shanghai", coord: [122.07, 30.63] },
  qingdao:   { name: "Qingdao",            short: "Qingdao",   coord: [120.32, 36.05] },
  tianjin:   { name: "Tianjin (Xingang)",  short: "Tianjin",   coord: [117.79, 38.98] },
  dalian:    { name: "Dalian",             short: "Dalian",    coord: [121.65, 38.93] },
};

// Production regions: a representative manufacturing city and its usual export port.
export const ORIGINS: Origin[] = [
  { id: "guangdong", region: "Guangdong", city: "Dongguan",     coord: [113.75, 23.02], port: "shenzhen",  known: "electronics, furniture, toys" },
  { id: "zhejiang",  region: "Zhejiang",  city: "Yiwu",         coord: [120.07, 29.31], port: "ningbo",    known: "small commodities, textiles, hardware" },
  { id: "jiangsu",   region: "Jiangsu",   city: "Suzhou",       coord: [120.62, 31.30], port: "shanghai",  known: "textiles, machinery, solar" },
  { id: "shanghai",  region: "Shanghai",  city: "Shanghai",     coord: [121.47, 31.23], port: "ningbo",    known: "machinery, auto parts" },
  { id: "fujian",    region: "Fujian",    city: "Quanzhou",     coord: [118.59, 24.91], port: "xiamen",    known: "footwear, sportswear, ceramics" },
  { id: "shandong",  region: "Shandong",  city: "Weifang",      coord: [119.16, 36.71], port: "qingdao",   known: "tyres, machinery, food" },
  { id: "hebei",     region: "Hebei",     city: "Shijiazhuang", coord: [114.51, 38.04], port: "tianjin",   known: "steel, glass, bicycles" },
  { id: "tianjin",   region: "Tianjin",   city: "Tianjin",      coord: [117.20, 39.08], port: "tianjin",   known: "steel pipes, bicycles" },
  { id: "beijing",   region: "Beijing",   city: "Beijing",      coord: [116.40, 39.90], port: "tianjin",   known: "electronics, medical devices" },
  { id: "liaoning",  region: "Liaoning",  city: "Shenyang",     coord: [123.43, 41.80], port: "dalian",    known: "machinery, steel" },
  { id: "henan",     region: "Henan",     city: "Zhengzhou",    coord: [113.63, 34.75], port: "qingdao",   known: "machinery, aluminium" },
  { id: "anhui",     region: "Anhui",     city: "Hefei",        coord: [117.23, 31.82], port: "shanghai",  known: "home appliances, EV parts" },
  { id: "hubei",     region: "Hubei",     city: "Wuhan",        coord: [114.31, 30.59], port: "shanghai",  known: "auto parts, optics" },
  { id: "jiangxi",   region: "Jiangxi",   city: "Nanchang",     coord: [115.86, 28.68], port: "ningbo",    known: "ceramics, copper, solar" },
  { id: "hunan",     region: "Hunan",     city: "Changsha",     coord: [112.94, 28.23], port: "shenzhen",  known: "construction machinery" },
  { id: "guangxi",   region: "Guangxi",   city: "Nanning",      coord: [108.37, 22.82], port: "guangzhou", known: "aluminium, building materials" },
  { id: "chongqing", region: "Chongqing", city: "Chongqing",    coord: [106.55, 29.56], port: "shanghai",  known: "laptops, motorcycles" },
  { id: "sichuan",   region: "Sichuan",   city: "Chengdu",      coord: [104.07, 30.67], port: "shanghai",  known: "electronics, furniture" },
];

export const DEST_PORTS: Record<string, DestPort> = {
  valencia:   { name: "Valencia",    coord: [-0.32, 39.44] },
  barcelona:  { name: "Barcelona",   coord: [2.20, 41.30] },
  genoa:      { name: "Genoa",       coord: [8.90, 44.38] },
  piraeus:    { name: "Piraeus",     coord: [23.62, 37.94] },
  koper:      { name: "Koper",       coord: [13.73, 45.55] },
  trieste:    { name: "Trieste",     coord: [13.75, 45.62] },
  lisbon:     { name: "Lisbon",      coord: [-9.13, 38.69] },
  lehavre:    { name: "Le Havre",    coord: [0.11, 49.48] },
  antwerp:    { name: "Antwerp",     coord: [4.30, 51.30] },
  rotterdam:  { name: "Rotterdam",   coord: [4.05, 51.95] },
  hamburg:    { name: "Hamburg",     coord: [9.95, 53.54] },
  gothenburg: { name: "Gothenburg",  coord: [11.85, 57.70] },
  copenhagen: { name: "Copenhagen",  coord: [12.60, 55.70] },
  gdansk:     { name: "Gdańsk",      coord: [18.68, 54.40] },
  dublin:     { name: "Dublin",      coord: [-6.20, 53.35] },
  ambarli:    { name: "Ambarlı",     coord: [28.69, 40.95] },
  constanta:  { name: "Constanța",   coord: [28.66, 44.16] },
  callao:     { name: "Callao",      coord: [-77.15, -12.05] },
  caucedo:    { name: "Caucedo",     coord: [-69.63, 18.43] },
};

// isoN matches the numeric ids in world-atlas, used to tint the country on the globe.
export const DESTINATIONS: Destination[] = [
  { id: "es", country: "Spain",          city: "Madrid",     coord: [-3.70, 40.42], port: "valencia",   vat: 21,  eu: true,  isoN: "724", area: "Europe" },
  { id: "it", country: "Italy",          city: "Milan",      coord: [9.19, 45.46],  port: "genoa",      vat: 22,  eu: true,  isoN: "380", area: "Europe" },
  { id: "fr", country: "France",         city: "Paris",      coord: [2.35, 48.86],  port: "lehavre",    vat: 20,  eu: true,  isoN: "250", area: "Europe" },
  { id: "de", country: "Germany",        city: "Frankfurt",  coord: [8.68, 50.11],  port: "hamburg",    vat: 19,  eu: true,  isoN: "276", area: "Europe" },
  { id: "nl", country: "Netherlands",    city: "Amsterdam",  coord: [4.90, 52.37],  port: "rotterdam",  vat: 21,  eu: true,  isoN: "528", area: "Europe" },
  { id: "be", country: "Belgium",        city: "Brussels",   coord: [4.35, 50.85],  port: "antwerp",    vat: 21,  eu: true,  isoN: "056", area: "Europe" },
  { id: "pt", country: "Portugal",       city: "Lisbon",     coord: [-9.14, 38.72], port: "lisbon",     vat: 23,  eu: true,  isoN: "620", area: "Europe" },
  { id: "pl", country: "Poland",         city: "Warsaw",     coord: [21.01, 52.23], port: "gdansk",     vat: 23,  eu: true,  isoN: "616", area: "Europe" },
  { id: "at", country: "Austria",        city: "Vienna",     coord: [16.37, 48.21], port: "trieste",    vat: 20,  eu: true,  isoN: "040", area: "Europe" },
  { id: "gr", country: "Greece",         city: "Athens",     coord: [23.73, 37.98], port: "piraeus",    vat: 24,  eu: true,  isoN: "300", area: "Europe" },
  { id: "cz", country: "Czechia",        city: "Prague",     coord: [14.42, 50.08], port: "hamburg",    vat: 21,  eu: true,  isoN: "203", area: "Europe" },
  { id: "hu", country: "Hungary",        city: "Budapest",   coord: [19.04, 47.50], port: "koper",      vat: 27,  eu: true,  isoN: "348", area: "Europe" },
  { id: "ro", country: "Romania",        city: "Bucharest",  coord: [26.10, 44.43], port: "constanta",  vat: 21,  eu: true,  isoN: "642", area: "Europe" },
  { id: "se", country: "Sweden",         city: "Stockholm",  coord: [18.07, 59.33], port: "gothenburg", vat: 25,  eu: true,  isoN: "752", area: "Europe" },
  { id: "dk", country: "Denmark",        city: "Copenhagen", coord: [12.57, 55.68], port: "copenhagen", vat: 25,  eu: true,  isoN: "208", area: "Europe" },
  { id: "ie", country: "Ireland",        city: "Dublin",     coord: [-6.26, 53.35], port: "dublin",     vat: 23,  eu: true,  isoN: "372", area: "Europe" },
  { id: "ch", country: "Switzerland",    city: "Zurich",     coord: [8.54, 47.38],  port: "genoa",      vat: 8.1, eu: false, isoN: "756", area: "Europe" },
  { id: "pe", country: "Peru",           city: "Lima",       coord: [-77.04, -12.05], port: "callao",     vat: 18,  eu: false, isoN: "604", area: "Rest of the world" },
  { id: "do", country: "Dominican Republic", city: "Santo Domingo", coord: [-69.93, 18.49], port: "caucedo", vat: 18, eu: false, isoN: "214", area: "Rest of the world" },
];

export const originById = (id: string): Origin | null => ORIGINS.find((o) => o.id === id) ?? null;
export const destById = (id: string): Destination | null => DESTINATIONS.find((d) => d.id === id) ?? null;
