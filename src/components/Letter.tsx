import { useState } from "react";
import sobreAsset from "@/assets/sobre.png.asset.json";
import cartaIlustrada from "@/assets/carta-ilustrada.png.asset.json";

export function Letter() {
  const [open, setOpen] = useState(false);

  return (
    <div className="letter-zone">
      <svg width="0" height="0" aria-hidden className="absolute">
        <filter id="arrugado">
          <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="3" result="n">
            <animate
              attributeName="baseFrequency"
              from="0.07"
              to="0.002"
              dur="1.6s"
              begin="indefinite"
              fill="freeze"
              id="anim-freq"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="26">
            <animate
              attributeName="scale"
              from="26"
              to="0"
              dur="1.6s"
              begin="indefinite"
              fill="freeze"
              id="anim-scale"
            />
          </feDisplacementMap>
        </filter>
      </svg>

      {!open && (
        <button
          type="button"
          className="envelope"
          onClick={() => {
            setOpen(true);
            requestAnimationFrame(() => {
              document
                .querySelectorAll<SVGAnimateElement>("#anim-freq, #anim-scale")
                .forEach((a) => a.beginElement?.());
            });
          }}
        >
          <img src={sobreAsset.url} alt="Una carta cerrada con un sello" />
          <span className="envelope-hint">toca para abrir</span>
        </button>
      )}

      {open && (
        <div className="letter-open" key="carta-abierta">
          <img
            className="illustrated-letter"
            src={cartaIlustrada.url}
            alt="Carta ilustrada del Día de las Flores Amarillas"
          />
        </div>
      )}
    </div>
  );
}
