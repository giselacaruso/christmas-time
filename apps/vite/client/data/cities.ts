export type Climate = "snow" | "sun"
export type Ground = "snow" | "grass" | "sand"

export interface City {
  id: string
  name: string
  country: string
  temp: string
  weather: string
  coords: string
  climate: Climate
  ground: Ground
  density: number
  blurb: string
}

export const CITIES: City[] = [
  {
    id: "nueva-york",
    name: "Nueva York",
    country: "Estados Unidos",
    temp: "−2 °C",
    weather: "Nevada en Manhattan",
    coords: "40.71° N · 74.00° O",
    climate: "snow",
    ground: "snow",
    density: 1,
    blurb:
      "El árbol del Rockefeller Center encendido, el Empire State en porcelana y una nieve que cae sin apuro sobre la Quinta Avenida.",
  },
  {
    id: "londres",
    name: "Londres",
    country: "Reino Unido",
    temp: "4 °C",
    weather: "Escarcha y llovizna fría",
    coords: "51.50° N · 0.12° O",
    climate: "snow",
    ground: "snow",
    density: 0.6,
    blurb:
      "El Big Ben marca la medianoche mientras un autobús rojo dobla por Westminster bajo una escarcha fina.",
  },
  {
    id: "paris",
    name: "París",
    country: "Francia",
    temp: "3 °C",
    weather: "Nieve ligera sobre el Sena",
    coords: "48.85° N · 2.35° E",
    climate: "snow",
    ground: "snow",
    density: 0.8,
    blurb:
      "La torre Eiffel en oro bruñido, cafés con toldos rojos y la primera nevada de diciembre sobre los tejados.",
  },
  {
    id: "tokio",
    name: "Tokio",
    country: "Japón",
    temp: "9 °C",
    weather: "Cielo seco e iluminaciones",
    coords: "35.68° N · 139.69° E",
    climate: "sun",
    ground: "grass",
    density: 0.8,
    blurb:
      "La Tokyo Tower en rojo y crema frente al Fuji nevado. En Tokio no nieva en Navidad: la ciudad brilla con luces doradas.",
  },
  {
    id: "buenos-aires",
    name: "Buenos Aires",
    country: "Argentina",
    temp: "31 °C",
    weather: "Sol pleno de verano",
    coords: "34.60° S · 58.38° O",
    climate: "sun",
    ground: "grass",
    density: 1,
    blurb:
      "Navidad en pleno verano: el Obelisco bajo un sol dorado, palmeras sobre la 9 de Julio y brindis al aire libre.",
  },
  {
    id: "roma",
    name: "Roma",
    country: "Italia",
    temp: "12 °C",
    weather: "Sol tibio de invierno",
    coords: "41.90° N · 12.49° E",
    climate: "sun",
    ground: "grass",
    density: 0.7,
    blurb:
      "El Coliseo entre cipreses y el árbol de Piazza Venezia: el invierno romano es templado y luminoso.",
  },
  {
    id: "sidney",
    name: "Sídney",
    country: "Australia",
    temp: "26 °C",
    weather: "Verano junto a la bahía",
    coords: "33.86° S · 151.20° E",
    climate: "sun",
    ground: "sand",
    density: 0.9,
    blurb:
      "La Ópera y el Harbour Bridge en pleno verano austral: una Navidad de playa, palmeras y sol.",
  },
  {
    id: "moscu",
    name: "Moscú",
    country: "Rusia",
    temp: "−9 °C",
    weather: "Nevada intensa",
    coords: "55.75° N · 37.61° E",
    climate: "snow",
    ground: "snow",
    density: 1.4,
    blurb:
      "Las cúpulas de San Basilio cubiertas de nieve: el invierno más profundo de toda la colección.",
  },
  {
    id: "dubai",
    name: "Dubái",
    country: "Emiratos Árabes",
    temp: "24 °C",
    weather: "Desierto despejado",
    coords: "25.20° N · 55.27° E",
    climate: "sun",
    ground: "sand",
    density: 0.8,
    blurb:
      "El Burj Khalifa se eleva entre dunas doradas y palmeras: un diciembre cálido y sin una nube.",
  },
  {
    id: "rio",
    name: "Río de Janeiro",
    country: "Brasil",
    temp: "30 °C",
    weather: "Calor tropical",
    coords: "22.90° S · 43.17° O",
    climate: "sun",
    ground: "grass",
    density: 1,
    blurb:
      "El Cristo Redentor abraza la bahía desde el Corcovado, con el Pan de Azúcar y la playa al sol.",
  },
]
