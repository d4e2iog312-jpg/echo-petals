export type LyricLine = { t: number; text: string };

/** Tiempos extraídos del video oficial de la letra (segundos). */
export const LYRICS: LyricLine[] = [
  { t: 0.0, text: "Girasol" },
  { t: 6.0, text: "" },
  { t: 15.5, text: "Mi girasol no para de llorar" },
  { t: 19.5, text: "Pues sabe que se está muriendo" },
  { t: 23.0, text: "Lento, muy lento" },
  { t: 26.5, text: "Pero sus pétalos se van cayendo" },
  { t: 31.0, text: "Y yo no puedo evitar sentirme culpable" },
  { t: 36.5, text: "" },
  { t: 38.0, text: "De esta muerte anunciada" },
  { t: 40.0, text: "Tan cruel y despiadada" },
  { t: 42.0, text: "Que acongoja a mi flor" },
  { t: 44.5, text: "" },
  { t: 45.5, text: "De esta muerte anunciada" },
  { t: 47.5, text: "Tan cruel y despiadada" },
  { t: 49.5, text: "Que acongoja a mi flor" },
  { t: 53.5, text: "Lo siento, hoy por fin entiendo" },
  { t: 59.0, text: "" },
  { t: 60.5, text: "Me robaste el aliento, yo te robé la vida" },
  { t: 66.5, text: "" },
  { t: 69.0, text: "Lo siento, hoy por fin entiendo, mi amor" },
  { t: 75.5, text: "Me robaste el aliento, yo te robé la vida" },
  { t: 81.5, text: "" },
  { t: 84.5, text: "Mi girasol no quiere sonreír" },
  { t: 88.0, text: "Pues se están marchitando" },
  { t: 91.0, text: "Sus hojas, sus sueños" },
  { t: 95.0, text: "Sus pistilos risueños" },
  { t: 98.0, text: "" },
  { t: 99.5, text: "Y yo no puedo evitar sentirme culpable" },
  { t: 105.0, text: "" },
  { t: 106.5, text: "De esta muerte anunciada" },
  { t: 108.5, text: "Tan cruel y despiadada" },
  { t: 110.5, text: "Que acongoja a mi flor" },
  { t: 113.5, text: "" },
  { t: 114.0, text: "De esta muerte anunciada" },
  { t: 116.0, text: "Tan cruel y despiadada" },
  { t: 118.0, text: "Que acongoja a mi flor" },
  { t: 122.0, text: "Lo siento, hoy por fin entiendo" },
  { t: 128.0, text: "" },
  { t: 129.0, text: "Me robaste el aliento, yo te robé la vida" },
  { t: 136.0, text: "" },
  { t: 137.5, text: "Lo siento, hoy por fin entiendo, mi amor" },
  { t: 144.0, text: "Me robaste el aliento, yo te robé la vida" },
  { t: 150.0, text: "" },
  { t: 177.5, text: "Y aunque tiene un lindo florero" },
  { t: 181.0, text: "No deja de ser una jaula, un agujero" },
  { t: 184.0, text: "Pero es que yo la quiero, yo la quiero tanto" },
  { t: 187.0, text: "Que me arriesgué a robármela del campo" },
  { t: 190.0, text: "Y lo siento, hoy por fin entiendo" },
  { t: 195.5, text: "Me robaste el aliento, yo te robé la vida" },
  { t: 201.0, text: "" },
  { t: 202.5, text: "Lo siento, hoy por fin entiendo, mi amor" },
  { t: 208.0, text: "Me robaste el aliento, yo te robé la vida" },
  { t: 213.0, text: "" },
];

export function lineIndexAt(time: number): number {
  let idx = -1;
  for (let i = 0; i < LYRICS.length; i++) {
    if (LYRICS[i]!.t <= time) idx = i;
    else break;
  }
  return idx;
}
