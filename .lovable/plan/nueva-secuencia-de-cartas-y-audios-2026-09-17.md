# Nueva secuencia de cartas y audios

## Resultado
El sitio quedará organizado así:

1. Presentación de flores amarillas.
2. Primera carta ilustrada a pantalla completa.
3. Limpieza de 10 personajes dibujados.
4. Carta tipo “rasca y gana”.
5. Carta musical interactiva.
6. Cierre con el personaje de mochila y el mensaje final.

Las nuevas etapas se insertarán antes del cierre para que este siga siendo siempre la última parte.

## Interacciones

### Primera carta ampliada
- Al abrir el sobre, la carta ocupará toda la pantalla y podrá desplazarse verticalmente.
- Se usará la versión corregida de la carta, sin la frase “también me alegra que podamos seguir conociéndonos”.
- El botón **salir** estará fijo y claramente visible abajo.
- Al salir, la carta se encogerá hacia el sobre y terminará deshaciéndose como ceniza antes de habilitar “siguiente”.

### Limpieza de personajes
- Se recortarán los dos dibujos entregados, sin generar ni reinterpretar imágenes.
- Aparecerán 10 copias repartidas sobre la pantalla, en posiciones incómodas pero accesibles.
- Cada figura se podrá arrastrar independientemente.
- Al acercarla a cualquier borde, el borde la absorberá y desaparecerá.
- Solo al retirar las 10 figuras aparecerá el avance hacia la carta para rascar.

### Carta para rascar
- La carta en blanco y negro será visible a tamaño grande.
- Una cubierta opaca se retirará con el dedo o mouse, siguiendo el trazo, para ir descubriendo la carta mientras se lee.
- El avance se desbloqueará al descubrir una porción suficiente, sin exigir limpiar cada píxel.

### Carta musical
- Se mostrará la carta “My Last Love” completa y ampliable.
- Los tableros y símbolos musicales visibles se convertirán en controles reales superpuestos en su posición.
- Orden de audio: **505**, **Chachacha / último baile**, **My One and Only Love**.
- Cada control tendrá reproducción, pausa, progreso y barras animadas por la frecuencia real del audio.
- Cuando uno de estos audios se reproduzca, “Girasol” se pausará; al terminar o pausar, volverá de forma suave.
- El tablero de 505 también permitirá abrir el enlace de Spotify entregado.

### Cierre
- Usará la imagen oscura del personaje con mochila como fondo de pantalla completo.
- “yoshiki” se verá integrado en la mochila, pero suficientemente claro sin lentes.
- El mensaje final tendrá letra grande, alto contraste y el texto ampliado que ya pediste.
- El crédito dirá exactamente **creador:over_lord.7**.
- Se mantendrá el botón para repetir todo el sitio.

## Accesibilidad visual
- Cartas y textos principales usarán casi toda la pantalla en móvil.
- Controles grandes, contraste fuerte y texto legible sin depender de zoom.
- Ningún control importante quedará cubierto por flores, dibujos o la barra de la canción.

## Detalles técnicos
- Los tres MP3 y las dos imágenes nuevas se guardarán como recursos del proyecto mediante Lovable Assets.
- La frecuencia del audio se visualizará con Web Audio API y canvas, sin servidores ni servicios externos.
- El raspado se implementará con canvas y borrado táctil/puntero.
- El arrastre admitirá mouse y tacto mediante Pointer Events.
- Se verificará en móvil 369×612 y escritorio, incluyendo reproducción, pausa de la música de fondo, arrastre, raspado y repetición.
