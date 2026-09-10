import type { Content } from '../../content';

/*
 * La versión española de `messages/en/ui.ts`: mismas claves, mismo orden, mismos marcadores.
 *
 * El registro es impersonal siempre que se puede («Convertir», «Guardado en tu cuenta») y tutea
 * cuando no hay forma de evitar dirigirse al lector, que es lo que hace el software en español.
 *
 * Las claves las manda el inglés y nombran el sitio donde aparece la frase, no lo que dice, así
 * que reescribir una frase nunca obliga a renombrar una clave.
 */

export const ui: Content['ui'] = {
  /* Palabras que no son de ninguna pantalla en concreto. */
  'common.copy': 'Copiar',
  'common.copied': 'Copiado',
  'common.loading': 'Cargando…',
  'common.clipboard.error': 'No se pudo acceder al portapapeles',
  'common.selectall': 'Seleccionar todo',
  'common.deselectall': 'Quitar selección',
  'common.selected': '{count} seleccionados',
  'common.exitselection': 'Salir de la selección',
  'common.scrolltotop': 'Ir arriba',

  /* Lo dice el conversor al soltar los archivos y el historial al unirlos — la misma frase. */
  'common.chained': '{count} archivos enlazados en un solo documento',
  /*
   * Cómo se llama un documento hecho de varios archivos: el primer nombre y cuántos vinieron
   * detrás.
   *
   * Es un nombre más que una etiqueta, y sigue siendo una frase: «más» es una palabra. El nombre
   * de un documento con un solo origen es el del propio archivo, y `merged.md` cuando no hay
   * ninguno no es un nombre de archivo, así que los dos se quedan en `src/lib/merge.ts`, donde
   * vive el resto de los nombres.
   */
  'common.merged.name': '{first} + {count} más',

  /*
   * El inicio de sesión, que falla de más maneras de las que acierta y tiene que decir de cuál.
   *
   * Las cuatro frases `auth.error` que siguen a la primera son los resultados que
   * `/api/auth/finish` puede devolver en la cadena de consulta —un conjunto cerrado, porque el
   * motivo llega en un enlace y un enlace lo escribe cualquiera—. `auth.incomplete` es el aviso
   * que lleva el que haya sido.
   */
  'dialog.mcp.lede':
    'Añade TransformPipe a un asistente y podrá convertir, guardar y compartir documentos de esta cuenta.',
  'dialog.mcp.address': 'Dirección del conector',
  'dialog.mcp.nokey':
    'En claude.ai: Ajustes → Conectores → Añadir conector personalizado. No hay ninguna clave que pegar: entra con tu cuenta y puedes desconectarlo aquí.',
  'dialog.mcp.command': 'Desde un terminal',
  'header.connector': 'Conector MCP',

  /* The sign-in dialog: three views — in, up, and asking for a reset link. */
  'auth.dialog.signin.title': 'Iniciar sesión',
  'auth.dialog.signup.title': 'Crea tu cuenta',
  'auth.dialog.reset.title': 'Restablece tu contraseña',
  'auth.dialog.reset.lede':
    'Escribe el correo de tu cuenta y te enviaremos un enlace para restablecerla.',
  'auth.dialog.email': 'Correo electrónico',
  'auth.dialog.password': 'Contraseña',
  'auth.dialog.forgot': '¿Olvidaste tu contraseña?',
  'auth.dialog.submit.signin': 'Iniciar sesión',
  'auth.dialog.submit.signup': 'Continuar',
  'auth.dialog.submit.reset': 'Enviar el enlace',
  'auth.dialog.tonew': '¿No tienes una cuenta?',
  'auth.dialog.tonew.action': 'Regístrate',
  'auth.dialog.toexisting': '¿Ya tienes una cuenta?',
  'auth.dialog.toexisting.action': 'Iniciar sesión',
  'auth.dialog.back': 'Volver a iniciar sesión',
  'auth.dialog.or': 'o',
  'auth.dialog.google': 'Continuar con Google',
  'auth.dialog.terms': 'Acepto los {terms}',
  'auth.dialog.terms.link': 'términos de uso',
  'auth.dialog.terms.required': 'Hay que aceptar los términos para crear una cuenta.',
  'auth.dialog.verify.title': 'Confirma tu correo',
  'auth.dialog.verify.lede':
    'Se ha enviado un código de seis dígitos a {email}. Caduca en diez minutos.',
  'auth.dialog.verify.code': 'Código de seis dígitos',
  'auth.dialog.verify.submit': 'Confirmar',
  'auth.dialog.verify.resend': 'Enviar otro código',
  'auth.dialog.verify.resent': 'Un código nuevo va en camino.',
  'auth.dialog.verify.done': 'La dirección está confirmada.',
  'auth.dialog.verify.later': 'Más tarde',
  'header.verify': 'Confirma tu correo',
  'auth.dialog.reset.sent': 'Si esa dirección tiene una cuenta, el enlace ya va en camino.',
  'auth.verify.sent':
    'La cuenta está creada. En tu correo está el enlace que confirma la dirección.',

  'auth.incomplete': 'El inicio de sesión no se completó',
  'auth.error.unfinished': 'El inicio de sesión no terminó. Vuelve a intentarlo.',
  'auth.error.link':
    'El enlace de inicio de sesión estaba incompleto. Vuelve a intentarlo.',
  'auth.error.unreachable':
    'No se pudo contactar con el servicio de inicio de sesión.',
  'auth.error.rejected': 'El servicio de inicio de sesión rechazó la petición.',
  'auth.error.nosession':
    'El servicio de inicio de sesión no devolvió ninguna sesión.',
  'auth.error.start': 'No se pudo iniciar la sesión',
  'auth.error.signout': 'No se pudo cerrar la sesión',

  /* La barra de arriba, en pantalla ancha y en el panel del móvil. */
  'header.home': 'Nuevo archivo',
  'header.tagline.conversion': 'conversor de {name}',
  'header.tagline.app': 'conversor de documentos',
  'header.nav.converter': 'Conversor',
  'header.nav.history': 'Historial',
  'header.nav.docs': 'Docs',
  'header.nav.documentation': 'Documentación',
  'header.nav.blog': 'Blog',
  'header.menu.open': 'Menú',
  'header.menu.title': 'Menú',
  'header.menu.close': 'Cerrar el menú',
  'header.menu.convert': 'Convertir',
  'header.menu.goto': 'Ir a',
  'header.account': 'Cuenta',
  'header.signin': 'Iniciar sesión',
  'header.logout': 'Cerrar sesión',
  'header.apikeys': 'Claves API',
  'header.theme.label': 'Tema',
  'header.theme.dark': 'Oscuro',
  'header.theme.light': 'Claro',
  'header.theme.toggle': 'Cambiar de tema',
  'header.theme.tolight': 'Cambiar a claro',
  'header.theme.todark': 'Cambiar a oscuro',

  /* La pantalla del conversor: la zona de arrastre, el documento que sale y las bandas de abajo. */
  'converter.dropzone.title': 'Suelta aquí archivos {extension}',
  'converter.dropzone.choose': 'Elegir archivos',
  'converter.dropzone.limits':
    '{extensions} · hasta 10 MB · procesado en tu navegador',
  /*
   * El mismo dato que `converter.dropzone.limits`, en forma de frase y no de fila de cláusulas:
   * esta es la de la página prerrenderizada, la que lee un rastreador y quien todavía no ha
   * recibido el bundle, donde una línea de puntos medios no es prosa. La rellena
   * `scripts/prerender.ts`.
   */
  'converter.accepts': 'Acepta {extensions}, hasta 10 MB, convertidos en tu navegador.',
  'converter.picker.label': 'O convertir otra cosa',
  'converter.blog.eyebrow': 'Blog',
  'converter.blog.title': 'Cómo domar Markdown',
  'converter.blog.blurb':
    'Sintaxis que se rompe, documentos que tienen que llegar a otras personas y cómo hacer que todo funcione sin ti.',
  'converter.blog.all': 'Todos los artículos',
  'converter.faq.eyebrow': 'Preguntas frecuentes',
  'converter.faq.title': 'Lo que la gente pregunta al llegar',
  'converter.faq.blurb':
    'Qué pasa con el archivo, qué contiene la descarga y qué añade una cuenta.',
  'converter.badge.converted': 'convertido',
  'converter.badge.merged': '{count} archivos unidos',
  'converter.newfile': 'Nuevo archivo',
  'converter.share': 'Compartir',
  'converter.share.hint': 'Compartir un enlace a este documento',
  'converter.share.hint.signedout':
    'Inicia sesión para compartir — hace falta el documento en tu cuenta',
  'converter.copy': 'Copiar {format}',
  'converter.copy.done': '{format} copiado al portapapeles',
  'converter.download': 'Descargar .{format}',
  'converter.download.more': 'Otros formatos',
  'converter.download.done': '{format} descargado',
  'converter.print': 'Imprimir o guardar como PDF',
  'converter.print.error': 'No se pudo abrir el diálogo de impresión',
  'converter.print.error.hint': 'Prueba a descargarlo.',
  'converter.tab.preview': 'Vista previa',
  'converter.tab.html': 'Código HTML',
  'converter.tab.markdown': 'Markdown',
  'converter.fullscreen.enter': 'Leer a pantalla completa',
  'converter.fullscreen.exit': 'Salir de pantalla completa',
  'converter.fullscreen.error': 'La pantalla completa no está disponible aquí',

  /*
   * Cuando un archivo no llega a pasar: qué se soltó, qué era demasiado grande, qué tuvo que decir
   * la conversión y qué es un documento que se convirtió pero no cabía.
   *
   * El motivo es siempre una segunda frase y no una cláusula pegada a la primera, porque el aviso
   * tiene dos líneas y un motivo es aquello con lo que alguien puede hacer algo. `{conversion}` es
   * el nombre que viene de `content.conversions`, así que el fallo dice «Word → Markdown no
   * funcionó» en todos los idiomas.
   */
  'converter.reject.title': 'Esto no es un archivo que se pueda convertir',
  'converter.reject.extension': '{name} — esta página acepta {extensions}.',
  'converter.reject.mixed':
    'Son {count} tipos de archivo distintos. Convierte un tipo a la vez.',
  'converter.toolarge.one': 'El archivo es demasiado grande',
  'converter.toolarge.many': 'Esos archivos son demasiado grandes',
  'converter.toolarge.detail': '{size} — el límite por documento es {limit}.',
  'converter.converted': 'Convertido a {format}',
  'converter.notkept.title': 'Convertido, pero no guardado en tu cuenta',
  'converter.notkept.detail':
    'Un documento guardado puede pesar {limit}; este pesa {size}. Descárgalo — ya está listo.',
  'converter.failed': '{conversion} no funcionó',
  'converter.failed.detail': 'No se pudo leer el archivo.',
  'converter.error.norows': 'Ese archivo no tiene ninguna fila.',
  /* `{why}` es lo que dice el propio conversor, que para un archivo Word es lo que dice mammoth. */
  'converter.error.empty': 'De ese documento no salió nada — {why}.',
  'converter.error.empty.why': 'el archivo no tiene texto',
  /* El marco desde el que se imprime un PDF: no se ve nunca, lo lee un lector de pantalla. */
  'converter.print.frame': '{name} para imprimir',
  'converter.print.unprepared':
    'No se pudo preparar el documento para imprimir.',

  /*
   * De qué está hecho el documento, un sustantivo por recuento. El número es su propio elemento
   * en la línea —va en un peso más grueso—, así que la palabra se traduce sola y no como parte de
   * una frase con un hueco.
   */
  'converter.stats.word': 'palabra',
  'converter.stats.words': 'palabras',
  'converter.stats.heading': 'encabezado',
  'converter.stats.headings': 'encabezados',
  'converter.stats.table': 'tabla',
  'converter.stats.tables': 'tablas',
  'converter.stats.codeblock': 'bloque de código',
  'converter.stats.codeblocks': 'bloques de código',
  'converter.stats.link': 'enlace',
  'converter.stats.links': 'enlaces',
  'converter.stats.image': 'imagen',
  'converter.stats.images': 'imágenes',

  /* La lista de todo lo convertido: su cabecera, sus filtros, sus filas y sus columnas. */
  'history.title': 'Historial',
  'history.synced': 'Guardado en tu cuenta',
  'history.local': 'Guardado en este navegador — inicia sesión para tenerlos en cualquier sitio',
  'history.usage':
    '· {bytes} de {maxBytes} · {documents} de {maxDocuments} documentos',
  'history.empty.title': 'Todavía no hay conversiones',
  'history.empty.synced':
    'Cada archivo que conviertes se guarda en tu cuenta: ábrelo desde cualquier dispositivo.',
  'history.empty.local':
    'Cada archivo que conviertes aparece aquí. Inicia sesión para conservar la lista en todos tus dispositivos.',
  'history.empty.action': 'Convertir un archivo',
  'history.drop.title': 'Suelta archivos',
  'history.drop.hint':
    'o haz clic para explorar — varios archivos se enlazan en un solo documento',
  'history.search.placeholder': 'Buscar por nombre',
  'history.search.label': 'Buscar en el historial por nombre de archivo',
  'history.search.clear': 'Borrar búsqueda',
  'history.chip.all': 'Todos los formatos',
  'history.chip.shared': 'Compartido conmigo',
  'history.shared.one': '{count} documento compartido contigo',
  'history.shared.many': '{count} documentos compartidos contigo',
  'history.count.one': '{count} archivo',
  'history.count.many': '{count} archivos',
  'history.count.filtered.one': '{found} de {total} archivo',
  'history.count.filtered.many': '{found} de {total} archivos',
  'history.merge': 'Unir',
  'history.merge.hint':
    'Enlazar los archivos seleccionados en un solo documento, del más antiguo al más reciente',
  'history.merge.hint.few': 'Elige al menos dos archivos para enlazarlos',
  'history.download': 'Descargar',
  'history.delete': 'Eliminar',
  'history.clear': 'Borrar historial',
  'history.column.file': 'Archivo',
  'history.column.type': 'Tipo',
  'history.column.sharedby': 'Compartido por',
  'history.column.size': 'Tamaño original',
  'history.column.content': 'Contenido',
  'history.column.converted': 'Convertido',
  'history.column.actions': 'Acciones',
  'history.row.someone': 'alguien',
  'history.row.select': 'Seleccionar {name}',
  'history.row.open': 'Abrir vista previa',
  'history.row.open.label': 'Abrir {name}',
  'history.row.unavailable': 'El original era demasiado grande para guardarlo aquí',
  'history.row.share': 'Compartir',
  'history.row.share.label': 'Compartir {name}',
  'history.row.download.label': 'Descargar {name}',
  'history.row.remove': 'Quitar del historial',
  'history.row.stats.one': '{words} palabras · {headings} encabezado',
  'history.row.stats.many': '{words} palabras · {headings} encabezados',

  /*
   * Lo que dice la lista cuando ha hecho algo, o cuando no ha podido.
   *
   * Los `history.error.*` son de `useHistory`: el hook no tiene palabras propias, así que la
   * pantalla le pasa una `t` y él informa en el idioma del lector. La negativa del servidor se
   * transmite como el `{reason}` de una de estas frases y no se muestra sola, porque llega en
   * inglés hable lo que hable el lector — y `history.error.delete.reason` es lo que ocupa su sitio
   * cuando no dice nada.
   */
  'history.error.load': 'No se pudo cargar el historial',
  'history.error.save': 'No se pudo guardar el archivo',
  'history.error.delete': 'No se pudo eliminar: {reason}',
  'history.error.delete.reason': 'el servidor se negó',
  'history.error.delete.some':
    'No se pudieron eliminar {failed} de {total} archivos',
  'history.error.clear': 'No se pudo borrar el historial',
  'history.source.missing': 'El original de este archivo ya no está disponible',
  'history.download.done': 'Archivo descargado',
  'history.download.none': 'No se pudo descargar nada',
  'history.download.one': 'Archivo {format} descargado',
  'history.download.many': '{count} archivos {format} descargados',
  'history.merge.none': 'No hay nada que unir',
  'history.merge.none.detail':
    'Los originales de estos archivos ya no están disponibles.',
  'history.removed.one': 'Archivo quitado',
  'history.removed.many': '{count} archivos quitados',
  'history.cleared': 'Historial borrado',

  /*
   * El índice del blog. Los artículos no están en el catálogo —ver `content.ts`—, así que el
   * título, la descripción y la etiqueta de una tarjeta son el inglés en que se escribió la pieza,
   * y aquí solo está el mobiliario que la rodea.
   */
  'blog.eyebrow': 'Blog',
  'blog.title': 'Markdown y qué hacer con él',
  'blog.blurb':
    'Conversión, sintaxis que se rompe, publicación y cómo hacer que todo funcione sin ti.',
  'blog.chip.all': 'Todo',
  'blog.empty': 'Todavía no hay nada con esa etiqueta.',
  'blog.card.meta': '{date} · {minutes} min de lectura',

  /* Un artículo: el mobiliario alrededor de una prosa que se queda en inglés. */
  'article.toc': 'En este artículo',
  'article.meta': '{date} · {minutes} min de lectura',
  'article.meta.updated': '{date} · actualizado el {updated} · {minutes} min de lectura',
  'article.share': 'Compartir',
  'article.cta.text':
    'Esta página se escribió en Markdown y la renderizó el conversor que describe.',
  'article.cta.button': 'Convertir un archivo',
  'article.more.eyebrow': 'Siguiente',
  'article.more.title': 'Seguir leyendo',
  'article.more.meta': '{minutes} min de lectura',
  'article.missing.title': 'No existe ese artículo',
  'article.missing.blurb':
    'Puede que haya cambiado de nombre. En el índice está todo lo que existe.',
  'article.missing.back': 'Volver al blog',

  /*
   * Las cinco páginas que solo son palabras. Su texto está en `pages.ts`, por página; estas dos
   * son lo que dice el renderizador a su alrededor.
   *
   * La frase de cierre está partida porque dentro va un enlace: `page.questions` es la frase hasta
   * el enlace y `page.questions.link` son las palabras que lleva el ancla. Quien necesite el
   * enlace antes en la frase no lo puede conseguir desde aquí, y ese es el precio del ancla.
   */
  'page.updated': 'Última actualización: {date}',
  'page.questions': 'Las dudas sobre todo esto van a',
  'page.questions.link': 'las issues del repositorio',

  /*
   * Un documento que alguien te ha enviado, en /open/<token>.
   *
   * Es una pantalla de la propia aplicación, así que sigue el idioma del lector como todas las
   * demás. El texto que el servidor renderiza en /s/<token> es otra página, para un lector del que
   * no sabemos nada, y sus palabras no están aquí — ver `src/lib/i18n/content.ts`.
   *
   * Su botón de descarga y su botón de inicio de sesión dicen lo que dicen esos botones en el
   * resto del sitio, así que leen `converter.download` y `header.signin` en vez de tener claves
   * propias.
   */
  'shared.loading': 'Abriendo el documento…',
  'shared.meta': 'compartido · convertido el {date}',
  'shared.signin.title': 'Este documento se compartió con personas concretas',
  'shared.signin.detail':
    'Inicia sesión con la dirección con la que se compartió.',
  'shared.missing.title': 'Este enlace no abre ningún documento',
  'shared.missing.action': 'Convertir tu propio archivo',

  /* Compartir un documento. */
  'dialog.share.title': 'Compartir',
  'dialog.share.mode.private': 'Privado',
  'dialog.share.mode.link': 'Cualquiera con el enlace',
  'dialog.share.mode.people': 'Personas concretas',
  'dialog.share.private.note':
    'Solo tú puedes abrir este documento. Elige arriba un modo para compartirlo.',
  'dialog.share.link': 'Enlace',
  'dialog.share.link.field': 'Enlace para compartir',
  'dialog.share.link.note': 'Cualquiera con este enlace puede leer el documento.',
  'dialog.share.people.note':
    'Solo las personas de abajo pueden abrirlo, tras iniciar sesión con esa dirección. A cada una se le envía el enlace por correo cuando la añades.',
  'dialog.share.people.empty': 'Todavía nadie — el enlace solo se abre para ti.',
  'dialog.share.email.label': 'Correo del destinatario',
  'dialog.share.add': 'Añadir',
  'dialog.share.remove.label': 'Quitar {email}',
  'dialog.share.error': 'No se pudo compartir',

  /* Las claves API, y los asistentes a los que se ha dejado entrar. */
  'dialog.keys.title': 'Claves API',
  'dialog.keys.blurb':
    'Convierte y comparte documentos desde un script, un terminal o CI — y los asistentes que has conectado.',
  'dialog.keys.name.placeholder': 'Qué la va a usar: «CI», «mi portátil»',
  'dialog.keys.name.label': 'Nombre de la clave',
  'dialog.keys.create': 'Crear',
  'dialog.keys.create.error': 'No se pudo crear la clave',
  'dialog.keys.fresh': 'Cópiala ahora — no se muestra otra vez',
  'dialog.keys.empty':
    'Todavía no hay claves. Una clave puede leer, escribir y compartir tus documentos; no puede tocar tu cuenta ni estas claves.',
  'dialog.keys.revoked': '{name} · revocada',
  'dialog.keys.meta': '{prefix}… · {used}',
  'dialog.keys.used': 'usada {when}',
  'dialog.keys.never': 'sin usar',
  'dialog.keys.forget': 'Quitar de la lista',
  'dialog.keys.forget.label': 'Quitar {name}',
  'dialog.keys.revoke': 'Revocar — deja de funcionar de inmediato',
  'dialog.keys.revoke.label': 'Revocar {name}',
  'dialog.keys.grants': 'Asistentes conectados',
  'dialog.keys.grant.meta': 'conectado {since} · {used}',
  'dialog.keys.disconnect': 'Desconectar — deja de actuar en tu nombre de inmediato',
  'dialog.keys.disconnect.label': 'Desconectar {name}',

  /* El pie del sitio. La columna de conversiones y los enlaces legales sacan sus palabras de otro sitio. */
  'footer.tagline':
    'Documentos Markdown, HTML, Word, CSV y JSON, convertidos en tu navegador.',
  /*
   * The changelog page, at /changelog and linked from the footer's Resources.
   *
   * Only the chrome is here. The entries are `src/lib/changelog.ts`, in English, for the reason
   * `ChangelogPage` gives: a changelog grows by an entry per release, and five translations per
   * entry is a cost that gets skipped after the second one.
   */
  'changelog.eyebrow': 'Registro de cambios',
  'changelog.title': 'Lo que se ha publicado',
  'changelog.lede':
    'Cada versión y, debajo, los cambios que alguien notaría. La más reciente primero; las versiones son las etiquetas del repositorio.',
  'changelog.years': 'Por año',
  'changelog.seo.title': 'Registro de cambios',
  'changelog.seo.description':
    'Cada versión de TransformPipe y los cambios que trae, la más reciente primero.',
  'footer.changelog': 'Registro de cambios',

  /*
   * The page for an address that is not a page.
   *
   * `notfound.note` is the one line here that is not navigation: a reader who mistyped something
   * knows they did, and a reader who followed a link from these pages has found a defect and is
   * the only person who can say so.
   */
  'notfound.eyebrow': '404',
  'notfound.title': 'Esa dirección no es una página',
  'notfound.lede':
    'Nada en este sitio responde a ella. O hay un carácter equivocado, o un enlace en otro lugar apunta a algo que se ha movido.',
  'notfound.converter': 'Convertir un archivo',
  'notfound.docs': 'Leer la documentación',
  'notfound.blog': 'Explorar el blog',
  'notfound.note':
    'Si un enlace de este sitio te ha traído aquí, es un fallo y no un error de escritura.',
  'notfound.seo.title': 'Página no encontrada',
  'notfound.seo.description':
    'Esta dirección no corresponde a ninguna página del sitio. El conversor, la documentación y el blog están a un clic.',

  'footer.builtby': 'Hecho por Raudar Labs.',
  'footer.note': '© Raudar Labs {year}',
  'footer.converter': 'Conversor',
  'footer.resources': 'Recursos',
  'footer.company': 'Empresa',
  'footer.legal': 'Legal',
  'footer.docs': 'Documentación',
  'footer.blog': 'Blog',
  'footer.git': 'Git',
  /* Se lee después del nombre del propio enlace, así que empieza con el espacio que los separa. */
  'footer.external': ' (se abre en una pestaña nueva)',
};
