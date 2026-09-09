import type { Content } from '../../content';

/*
 * Las preguntas frecuentes en español: una pregunta y su respuesta por entrada.
 *
 * El orden es el que declara `FAQ_ENTRIES` en `src/lib/faq.ts`, y la posición es lo que ata una
 * entrada de aquí con su bandera de allí — una pregunta no tiene id, así que la lista es el id.
 *
 * Cadenas planas, no nodos: la misma lista la lee el servidor, que no lleva React dentro.
 */
export const faq: Content['faq'] = [
  {
    question: '¿Qué puede convertir?',
    answer:
      'Cinco cosas, cada una con su página bajo Conversor, en la cabecera: Markdown a HTML, y HTML, Word (.docx), CSV o TSV, y JSON a Markdown. Todo menos la primera acaba en Markdown, que es la forma en que aquí se guarda, se previsualiza y se comparte un documento — así, un archivo de Word, una hoja de cálculo y la respuesta de una API se vuelven la misma cosa una vez dentro.',
  },
  {
    question: '¿Se sube mi archivo a algún sitio?',
    answer:
      'Sin la sesión iniciada, no. El archivo lo lee este navegador, se convierte aquí y nunca se envía a un servidor: cierra la pestaña y no queda nada de él en ningún sitio que no sea tu propia máquina. Con la sesión iniciada, el Markdown de origen se guarda en tu cuenta para que el documento pueda seguirte a otro dispositivo, y sigue siendo privado hasta que lo compartas.',
  },
  {
    question: '¿Qué Markdown entiende?',
    answer:
      'GitHub Flavored Markdown, en los dos sentidos: tablas, listas de tareas, tachado, enlaces automáticos y bloques de código delimitados, encima de todo lo que define CommonMark. El HTML crudo que haya dentro del documento pasa primero por un saneador, así que una etiqueta script en un archivo que te haya enviado alguien no puede ejecutarse.',
  },
  {
    question: '¿Qué obtengo exactamente al descargar?',
    answer:
      'Lo primero, lo que haya producido la conversión: un archivo .html si la conversión fue a HTML, un .md si fue a Markdown. La flecha que hay al lado del botón guarda los demás — Markdown, HTML, texto plano o el diálogo de impresión para un PDF. El HTML es un solo archivo con los estilos incrustados: sin scripts, sin fuentes que descargar, sin peticiones de ningún tipo, así que se abre igual en una máquina sin red. En papel siempre pasa a la paleta clara, porque una página oscura impresa es un muro de tinta.',
  },
  {
    question: '¿Puedo enviarle a alguien un documento convertido?',
    answer:
      'Inicia sesión y compártelo, como un enlace que cualquiera puede abrir o dirigido a personas concretas, que entonces inician sesión con esa dirección. Una página compartida es de solo lectura: el documento y su descarga, nada más. Revocar descarta el enlace, así que uno que ya hayas enviado deja de funcionar.',
  },
  {
    question: '¿Hay un límite de tamaño?',
    answer:
      '10 MB por archivo para convertir —unos 1,5 millones de palabras— porque convertir ocurre en tu propia máquina. Guardarlo en una cuenta está limitado a 4 MB, y ese número no es nuestro: la plataforma rechaza de plano una petición mayor. Un archivo más grande se convierte, se previsualiza y se descarga igual; solo se queda fuera del historial, y la aplicación lo dice en vez de fingir que lo ha guardado. Una cuenta admite 500 documentos o 100 MB, lo que llegue primero. Llegar a un límite rechaza la escritura y lo dice; nada de lo que hayas guardado se elimina en silencio para hacer sitio.',
  },
  {
    question: '¿Puedo convertir archivos desde un script?',
    answer:
      'Sí. Crea una clave API desde el menú de la cuenta y envía Markdown a /api/v1/documents; también hay un cliente de línea de comandos y una GitHub Action que publica el Markdown que ha cambiado un pull request y comenta los enlaces en él. La documentación tiene los endpoints y los flags.',
  },
  {
    question: '¿Cuánto cuesta?',
    answer:
      'Nada. Convertir y descargar funcionan sin ninguna cuenta; una cuenta añade el historial, la compartición y la API, dentro de los límites de arriba.',
  },
];
