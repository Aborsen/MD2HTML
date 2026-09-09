import type { Content } from '../../content';

/*
 * Cómo se llama cada conversión y qué dice su página.
 *
 * Qué conversiones existen sigue estando en `shared/conversions.ts`, y tiene que seguir ahí: el
 * servidor importa ese archivo para el parámetro `kind` de la API, y el servidor no tiene locale,
 * así que una lista que él lee no puede llevar idioma. Allí queda solo lo que es igual en todas
 * las lenguas — el id, el destino, la dirección, las extensiones.
 *
 * `seo` no es prosa traducida: es lo que la página prerrenderizada dice a un rastreador y lo que
 * se lee en un resultado de búsqueda, así que está escrito alrededor de la frase que alguien
 * teclea de verdad en español.
 */

export const conversions: Content['conversions'] = {
  'markdown-to-html': {
    label: 'Markdown → HTML',
    short: 'MD → HTML',
    title: 'Markdown a HTML',
    blurb:
      'Sube un archivo Markdown — mira el HTML renderizado al instante y descárgalo como un documento listo para usar.',
    hint: 'Sube un archivo .md y mira exactamente cómo va a quedar en HTML. Suelta varios y se enlazan en un solo documento, en el orden en que los elijas.',
    seo: {
      title: 'TransformPipe — convertir Markdown a HTML',
      description:
        'Sube un archivo Markdown y obtén el documento renderizado y un .html autónomo para descargar. Convierte en tu navegador; inicia sesión para guardar y compartir.',
    },
  },
  'html-to-markdown': {
    label: 'HTML → Markdown',
    short: 'HTML → MD',
    title: 'HTML a Markdown',
    blurb:
      'Sube un archivo HTML —o una página que hayas guardado— y recibe Markdown, con los encabezados, los enlaces, las listas y las tablas intactos.',
    hint: 'Sube un archivo .html y obtén Markdown. Las tablas, las listas de tareas y los bloques de código sobreviven; los estilos no, porque Markdown no tiene ninguno.',
    seo: {
      title: 'Convertir HTML a Markdown — TransformPipe',
      description:
        'Convierte un archivo HTML o una página guardada en Markdown limpio, con tablas y bloques de código. Todo en tu navegador: el archivo no se envía a ningún sitio.',
    },
  },
  'word-to-markdown': {
    label: 'Word → Markdown',
    short: 'DOCX → MD',
    title: 'Word a Markdown',
    blurb:
      'Sube un .docx y obtén Markdown: los encabezados, las listas, los enlaces y las tablas llegan; las fuentes y los márgenes no.',
    hint: 'Sube un .docx de Word, Google Docs o LibreOffice. Lo que vuelve es la estructura del documento en Markdown, no su maquetación.',
    seo: {
      title: 'Convertir Word a Markdown — TransformPipe',
      description:
        'Convierte un documento de Word (.docx) a Markdown en el navegador: encabezados, listas, enlaces y tablas se conservan y el formato se descarta. Nada se sube.',
    },
  },
  'csv-to-markdown': {
    label: 'CSV → tabla Markdown',
    short: 'CSV → MD',
    title: 'CSV a tabla Markdown',
    blurb:
      'Sube un CSV o un TSV y obtén una tabla Markdown, con la primera fila como encabezado y las columnas alineadas.',
    hint: 'Sube un .csv o un .tsv. Los campos entre comillas, las comas que llevan dentro y los saltos de línea dentro de una celda se resuelven todos.',
    seo: {
      title: 'Convertir CSV a tabla Markdown — TransformPipe',
      description:
        'Convierte un archivo CSV o TSV en una tabla Markdown, con los campos entre comillas y las comas de dentro resueltos. Convierte en tu navegador; nada se sube.',
    },
  },
  'json-to-markdown': {
    label: 'JSON → Markdown',
    short: 'JSON → MD',
    title: 'JSON a Markdown',
    blurb:
      'Sube un archivo JSON y léelo como un documento: una lista de registros se vuelve una tabla; un objeto, secciones con sus campos encima.',
    hint: 'Sube un archivo .json. Una lista de registros se vuelve una tabla; los objetos anidados se vuelven encabezados. Un valor por línea —un volcado de log— también se entiende.',
    seo: {
      title: 'Convertir JSON a Markdown — TransformPipe',
      description:
        'Convierte un archivo JSON en Markdown legible: los arrays de registros se vuelven tablas y los objetos, secciones. Convierte en tu navegador; nada se sube.',
    },
  },
};
