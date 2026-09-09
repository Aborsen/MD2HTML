import type { Content } from '../../content';

/*
 * Las secciones de la documentación en español: un título y la frase que dice a qué responde la
 * sección, con la clave del id de la sección.
 *
 * Los ids y el orden viven en `src/lib/docs-sections.ts`, porque un id es el ancla de la dirección
 * —`/docs#converting`— y una dirección es la misma en todas las lenguas.
 *
 * El resumen se lee solo en la página prerrenderizada, así que tiene que sostenerse sin la sección
 * debajo.
 */
export const docs: Content['docs'] = {
  start: {
    title: 'Empezar aquí',
    summary:
      'Suelta un archivo y ya tienes el documento convertido y su descarga; inicia sesión y esos mismos documentos te siguen de un dispositivo a otro, se pueden compartir y un script puede llegar a ellos.',
  },
  converting: {
    title: 'Convertir',
    summary:
      'Las cinco conversiones —Markdown a HTML, y HTML, Word, CSV y JSON a Markdown—: qué acepta cada una, cómo enlazar varios archivos en un solo documento, la pestaña de código y los formatos que puede entregar una descarga: Markdown, HTML, texto plano o un PDF impreso.',
  },
  history: {
    title: 'Historial',
    summary:
      'Búsqueda, columnas ordenables y un filtro por conversión para reducir una lista mezclada a un solo tipo. Las filas se pueden unir, descargar en cualquier formato o eliminar en bloque.',
  },
  sharing: {
    title: 'Compartir',
    summary:
      'Un enlace que cualquiera puede abrir, o direcciones concretas que piden al lector iniciar sesión. Revocar descarta el token, así que un enlace ya enviado deja de funcionar.',
  },
  account: {
    title: 'Cuenta',
    summary:
      'El inicio de sesión con Google, el tema y las claves API — que se muestran una vez, se guardan como hash y no pueden llegar a la cuenta ni a las claves mismas.',
  },
  api: {
    title: 'API',
    summary:
      'Todos los endpoints bajo /api/v1, qué devuelve cada uno y qué significan los estados de error.',
  },
  cli: {
    title: 'Línea de comandos',
    summary:
      'Un cliente sin dependencias: login, push, list, rm y usage, con --share, --merge y --json.',
  },
  action: {
    title: 'GitHub Action',
    summary:
      'Publica el Markdown que ha cambiado un pull request y comenta los enlaces en él. Todas sus entradas y los dos permisos que necesita.',
  },
  assistant: {
    title: 'En un asistente',
    summary:
      'Añade transformpipe a Claude como conector y podrá convertir, guardar, compartir y eliminar documentos de esta cuenta — en tu nombre y sin ninguna clave que pegar.',
  },
  limits: {
    title: 'Límites',
    summary:
      '10 MB por archivo para convertir y 4 MB para guardarlo en una cuenta, 100 MB y 500 documentos por cuenta, 60 peticiones por minuto. Llegar a uno rechaza la escritura en vez de eliminar nada.',
  },
  faq: {
    title: 'Preguntas',
    summary:
      'Las mismas respuestas que el conversor muestra bajo su zona de arrastre, en un solo sitio para que las dos no puedan separarse.',
  },
};
