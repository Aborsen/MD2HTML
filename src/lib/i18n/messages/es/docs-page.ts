/*
 * La prosa del manual: todo lo que dice la página /docs por su cuenta.
 *
 * Archivo propio, y no un rincón de `ui.ts`, porque es de largo la pantalla más grande del
 * producto: unas 1.700 palabras en setenta y cinco entradas, más que el resto de la interfaz
 * junta, que en `ui.ts` sepultaría cualquier otra pantalla. Aun así se vuelca en `ui` desde
 * `index.ts`, para que `useT()` llegue a estas claves como a cualquier otra frase de la interfaz.
 *
 * Las claves siguen la convención de `index.ts` — `docs.<sección>.<cosa>` —, así que una clave
 * dice dónde aparece la frase y reescribirla nunca obliga a renombrarla.
 *
 * Una frase que envuelve un fragmento de código, una etiqueta en negrita o una palabra enfatizada
 * es UNA entrada con un `{marcador}` donde va el elemento, nunca tres fragmentos: los fragmentos
 * no se pueden reordenar y cada lengua ordena la frase a su manera.
 */

export const docsPage = {
  /* La cabecera de la página. */
  'docs.eyebrow': 'Documentación',
  /* The contents column beside the manual. Not 'In this article' — this is not one. */
  'docs.toc': 'En esta página',

  'docs.title': 'Todo lo que hace transformpipe',
  'docs.lede':
    'Entra Markdown, HTML, Word, CSV o JSON — sale un documento en HTML, Markdown, texto plano o impreso. Desde esta página, desde un terminal, desde un pull request o desde un asistente. Esto es todo; nada de lo que hay aquí depende de un plan de pago.',

  /* Debajo de cada captura, después del pie. */
  'docs.shot.enlarge': '— clic para ampliar',

  /* El filtro que aparece en dos secciones, Historial y Compartir, y tiene que decir lo mismo en las dos. */
  'docs.chip.shared': 'Compartido conmigo',

  'docs.start.signedOut':
    'Suelta un archivo en el conversor y ya tienes el documento convertido y su descarga. Sin la sesión iniciada no se guarda nada y no se envía nada a ningún sitio — la conversión ocurre en este navegador, en tu propia máquina.',
  'docs.start.signedIn':
    'Inicia sesión con Google y esos mismos documentos te siguen de un dispositivo a otro, se pueden compartir por enlace o por dirección, y un script puede llegar a ellos con una clave API. Lo que hubieras convertido antes de iniciar sesión pasa a la cuenta por el camino.',

  /** `{menu}` es la entrada Conversor de la propia cabecera, en negrita. */
  'docs.converting.intro':
    '{menu}, en la cabecera, enumera lo que convierte esta aplicación. Cada conversión tiene su página, su zona de arrastre y su dirección, así que se puede enlazar y guardar en favoritos en vez de volver a prepararla:',
  'docs.converting.menu': 'Conversor',
  /** `{docx}` es la extensión misma. */
  'docs.converting.sizes':
    'Hasta 10 MB por archivo. Suelta varios archivos Markdown a la vez y se enlazan en un único documento, en el orden en que llegan y separados por una línea. Suelta un archivo que la página no acepte —un {docx} en la página de Markdown, por ejemplo— y va a la conversión que sí lo acepta en lugar de rechazarse; una mezcla de tipos sí se rechaza, porque enlazar una hoja de cálculo con un documento de Word no es algo que nadie pretendiera.',
  'docs.converting.oneShape':
    'Todo acaba siendo Markdown, y es deliberado: es la forma en que un documento se guarda, se previsualiza, se comparte y se alcanza desde un script, así que toda la aplicación se sostiene sobre una sola forma en vez de cuatro.',
  'docs.converting.shot.converter.alt':
    'El conversor de transformpipe con la zona de arrastre vacía',
  'docs.converting.shot.converter.caption':
    'El conversor. El logotipo sirve también de «empezar de nuevo».',
  'docs.converting.flavour':
    'Lo que sale es GitHub Flavored Markdown: tablas, listas de tareas, tachado, enlaces automáticos y bloques de código delimitados. La vista previa es el documento en sí, con los mismos tokens de estilo que la aplicación, así que una aplicación oscura entrega una página oscura — y al imprimir siempre se pasa a claro, porque una página oscura en papel es un muro de tinta.',
  'docs.converting.shot.preview.alt':
    'Un documento convertido en la pestaña de vista previa',
  'docs.converting.shot.preview.caption':
    'Vista previa, con los recuentos que el documento tiene de verdad.',
  /** `{to}` es la palabra de abajo, enfatizada en medio de la frase. */
  'docs.converting.source':
    'La pestaña de código no es un resumen de la salida. Es exactamente lo que entrega la descarga — el HTML autónomo si la conversión fue {to} HTML, el Markdown si fue a Markdown: un solo documento, con los estilos incrustados, sin scripts y sin red.',
  'docs.converting.source.emphasis': 'a',
  /** `{html}` y `{md}` son las dos extensiones. */
  'docs.converting.download':
    'El botón de descarga lleva el formato que produjo la conversión —{html} en la página de Markdown, {md} en las demás— y la flecha que hay al lado guarda el resto: Markdown, HTML, texto plano e impresión. Imprimir construye el archivo exportado en un marco aparte y abre el diálogo del navegador, así que un PDF es el documento y no una captura de la aplicación que lo rodea; en papel la exportación pasa a una paleta clara, sea cual sea el tema de la aplicación.',
  'docs.converting.shot.source.alt':
    'La pestaña de código HTML con el documento autónomo',
  'docs.converting.shot.source.caption':
    'La pestaña de código HTML: lo que vas a obtener, antes de obtenerlo.',
  'docs.converting.reading':
    'Para leer, más que para revisar, la vista previa pasa a pantalla completa y mantiene un ancho de lectura cómodo; Escape vuelve atrás. Un documento largo gana un botón para volver arriba, en las dos vistas.',

  'docs.history.intro':
    'Cada conversión aterriza en el historial — en tu cuenta con la sesión iniciada, en este navegador si no. La búsqueda recorre los nombres de archivo, las columnas se ordenan y una fila abre el documento.',
  'docs.history.shot.history.alt':
    'La lista del historial con búsqueda, filtros y columnas ordenables',
  'docs.history.shot.history.caption':
    'HTML o Markdown, búsqueda y columnas ordenables.',
  /**
   * `{all}` y `{shared}` son los dos filtros que están siempre, `{badge}` la etiqueta de formato
   * de una fila — los códigos de formato se quedan en la página.
   */
  'docs.history.chips':
    'Los filtros separan según de dónde viene cada documento: {all} al principio, luego uno por cada conversión que tenga filas de verdad, y {shared} para los archivos que te ha enviado alguien. La etiqueta de la fila dice lo mismo —{badge} en un archivo de Word—, así que una lista de treinta documentos sigue dejando claro cuál es cuál.',
  'docs.history.chip.all': 'Todos los formatos',
  'docs.history.downloading':
    'Descargar es un menú y no un filtro: solo se guarda el Markdown, y el HTML y el texto plano se construyen al momento, así que una misma fila puede entregar cualquiera de los tres sin guardar tres copias.',
  'docs.history.selection':
    'Marca filas y aparece la barra de selección: unirlas en un solo documento, descargarlas o eliminarlas. Al unirlas se respeta el orden de la lista.',
  'docs.history.shot.selection.alt':
    'Dos filas seleccionadas, con la barra de acciones en bloque',
  'docs.history.shot.selection.caption': 'Unir, descargar y eliminar en bloque.',

  /** `{anyone}` y `{only}` son los dos modos, en negrita; `{path}` es la dirección que recibe lo compartido. */
  'docs.sharing.modes':
    '{anyone} publica el documento en {path} — una página de solo lectura con el documento y su descarga, nada más. {only} pide al lector que inicie sesión con una dirección de la lista.',
  'docs.sharing.mode.link': 'Cualquiera con el enlace',
  'docs.sharing.mode.people': 'Solo estas direcciones',
  'docs.sharing.revoking':
    'Revocar descarta el token, así que un enlace ya enviado deja de funcionar; volver a compartir acuña otro distinto. No se envía ningún correo — el enlace lo pasas tú.',
  /** `{shared}` es el filtro que nombra `docs.chip.shared`. */
  'docs.sharing.incoming':
    'Los documentos que otras personas te han dirigido aparecen bajo el filtro {shared}, con quién ha compartido cada uno. Son de solo lectura: abrir y descargar, sin eliminar y sin volver a compartir. Un enlace compartido pertenece a quien lo tenga, así que no aparece en la lista de nadie.',
  /** `{csp}` es la propia directiva Content-Security-Policy. */
  'docs.sharing.safety':
    'Una página compartida lleva contenido de alguien en nuestro dominio, así que se sirve con {csp} y no se puede meter en un marco, y todas ellas enlazan con un formulario de denuncia que no necesita JavaScript. Nada se revoca automáticamente: una denuncia es lo que un desconocido afirma sobre el documento de otra persona, y los dos errores —dejar en pie una página dañina, matar un enlace inocente— merecen que alguien lo lea primero.',

  'docs.account.signIn':
    'La sesión se inicia con Google, a través de Neon Auth. El menú de la cuenta guarda el tema (oscuro por defecto, recordado en cada navegador), las claves API y la salida.',
  'docs.account.keys':
    'Una clave se muestra una vez y solo se guarda como hash. Llega a los documentos y a lo compartido, nunca a la cuenta ni a las claves mismas, así que una clave filtrada no puede acuñar su reemplazo ni dejarte fuera. Revocar una surte efecto en la petición siguiente.',

  /** `{auth}` es la cabecera Authorization, tal como se envía. */
  'docs.api.intro':
    'Todo lo que hace la aplicación lo puede hacer un script. Envía la clave como {auth}; una sesión de navegador también sirve, así que los mismos endpoints se pueden probar con la sesión iniciada.',
  /*
   * La tabla de endpoints. Los términos son los endpoints, que se quedan en la página; esto son
   * las explicaciones de al lado. Los marcadores son parámetros de consulta y formas de JSON.
   */
  'docs.api.post':
    'Markdown en el cuerpo ({name}) o JSON {json}. {share} lo publica en la misma llamada. {kindHtml}, {kindCsv} o {kindJson} convierten antes el cuerpo, así que una página, una hoja de cálculo o la respuesta de una API se pueden enviar tal cual; {word} se rechaza aquí, porque leer un {docx} ocurre en el navegador.',
  'docs.api.list': 'Los 500 más recientes, con tamaños, recuentos y estado de lo compartido.',
  'docs.api.one': 'Los metadatos y el Markdown de origen.',
  'docs.api.html': 'El documento autónomo. {theme} es opcional.',
  'docs.api.delete': 'Elimina la fila y el original guardado.',
  'docs.api.share': '{modes}. {private} descarta el token.',
  'docs.api.usage': 'Lo que está usando la cuenta, frente a los límites.',
  /** `{shape}` es el cuerpo del error mismo. */
  'docs.api.errors':
    'Los errores son {shape} con un estado que significa lo que dice: 401 clave desconocida, 404 no es tuyo, 413 el documento pasa de 4 MB, 403 la cuenta se ha quedado sin espacio, 429 demasiado rápido, 410 el original ya no está.',

  /** `{cli}` es la ruta del cliente dentro del repositorio. */
  'docs.cli.intro':
    '{cli}, en el repositorio, es la misma API con una cara más amable y sin dependencias — una herramienta que se ejecuta en CI no debería arrastrar un árbol de paquetes detrás.',
  /** Los marcadores son las cuatro extensiones que convierte, la que rechaza y el flag. */
  'docs.cli.extensions':
    'Un {html}, {csv}, {tsv} o {json} enviado lo convierte el endpoint en vez de guardarse como si ya fuera Markdown; un {docx} se rechaza, indicando la página que sí sabe leerlo. {merge} solo enlaza Markdown.',
  /** Los marcadores son el flag, la variable, la ruta de configuración, la variable del host y el flag. */
  'docs.cli.key':
    'La clave sale de {key}, luego de {env} y luego de {config}. {host} lo apunta a otro despliegue y {json} imprime la respuesta de la propia API.',

  'docs.action.intro':
    'Si no se le da una lista de archivos, la acción publica el Markdown que ha cambiado un pull request y comenta los enlaces en él — de modo que quien revisa abre el documento renderizado en vez de leer un diff de asteriscos.',
  /** `{example}` es el archivo del workflow; `{depth}` y `{permission}` son los dos ajustes de YAML. */
  'docs.action.workflow':
    '{example} es un workflow completo para copiar. El checkout necesita {depth} para el commit base con el que se compara la lista de archivos, y el comentario necesita {permission}.',
  /* La tabla de entradas. Los términos son los nombres de las entradas, que se quedan en la página. */
  'docs.action.input.apiKey': 'Obligatoria. Guárdala en un secreto del repositorio.',
  'docs.action.input.files':
    'Rutas separadas por espacios. Por defecto, lo que haya cambiado el pull request.',
  /** Los marcadores son los tres valores que admite la entrada. */
  'docs.action.input.share':
    '{link} (por defecto), {people} o {none} para publicar en privado.',
  'docs.action.input.merge':
    'Enlazar los archivos en un solo documento en vez de uno por archivo.',
  'docs.action.input.comment': 'Comentar los enlaces en el pull request.',
  'docs.action.input.host': 'Otro despliegue de transformpipe.',
  'docs.action.pushes':
    'Un push publica documentos nuevos en vez de sobrescribir los antiguos, así que un enlace de un comentario anterior sigue mostrando lo que decía aquel commit.',

  /** `{path}` es la dirección del conector, que viene de `mcp-facts.ts`. */
  'docs.assistant.intro':
    'transformpipe es un servidor MCP, así que se puede añadir a Claude como conector. La dirección es este despliegue más {path}:',
  'docs.assistant.adding':
    'En claude.ai eso va en Configuración → Conectores → Añadir conector personalizado. Desde un terminal:',
  'docs.assistant.auth':
    'No hay ninguna clave que pegar. La primera llamada vuelve sin autorizar, tu asistente sigue ese camino hasta una página de aquí, e inicias sesión con la misma cuenta que ya usas y apruebas un cliente con nombre — por eso la página te dice en nombre de qué dirección va a actuar. Lo que obtiene es un token nuestro, válido para tus documentos y para nada más: no para tu cuenta, ni para tu inicio de sesión, ni para tus claves API. Desconéctalo desde el menú de la cuenta, en Conector MCP, y deja de funcionar en la llamada siguiente.',
  'docs.assistant.tools':
    'Las herramientas son el mismo código de la API de arriba, llamado en el mismo proceso, así que una conversación y un script obtienen la misma respuesta. Dos de ellas están pensadas por el daño que pueden hacer: compartir publica una página en la web abierta, y eliminar exige una confirmación explícita y quita exactamente un documento.',

  /* La tabla de límites: cada término y la cifra de al lado. */
  'docs.embed.intro':
    'Un iframe. Ningún script que cargar, nada que instalar y ninguna cuenta: la incrustación es anónima a propósito, porque una página de otro dominio capaz de alcanzar los documentos de alguien sería un cambio peor de lo que vale la comodidad.',
  'docs.embed.params':
    '{conversion} elige cuál de las cinco, {theme} deja que la página anfitriona escoja la paleta en lugar de seguir al sistema del visitante, y el prefijo de idioma funciona como en todas partes — {locale}.',
  'docs.embed.messages':
    'El resultado sale por {post}: {ready} al cargar, luego {converted} con el nombre, el Markdown, el HTML y los recuentos, o {error}. Cada mensaje lleva {source}, porque una página que escucha en {window} oye a todos sus marcos y a sus propios scripts — y comprueba {origin} contra este sitio, que es la parte que nadie puede hacer por ti.',
  'docs.embed.frames':
    'Solo {embed} puede incrustarse. Todas las demás páginas de este sitio responden {ancestors}, para que nada de aquí pueda hacerse pasar por otra cosa.',

  'docs.limits.account.term': 'Por cuenta',
  'docs.limits.account.text': '100 MB de Markdown, 500 documentos',
  'docs.limits.convert.term': 'Por conversión',
  'docs.limits.convert.text':
    '10 MB — alrededor de 1,5 millones de palabras. Varios archivos soltados juntos cuentan como el único documento en que se convierten',
  'docs.limits.document.term': 'Por documento guardado',
  'docs.limits.document.text':
    '4 MB, y no por decisión nuestra: una Vercel Function rechaza una petición o un cuerpo de respuesta de más de 4,5 MB antes de que se ejecute nada de este código, así que un documento mayor no podría ni guardarse ni volver a leerse. Se convierte, se previsualiza y se descarga igual — solo se queda fuera del historial, y la aplicación lo dice en vez de informar de un guardado que no ha ocurrido',
  'docs.limits.caller.term': 'Por solicitante',
  'docs.limits.caller.text':
    '60 peticiones por minuto, contadas por clave o por sesión',
  'docs.limits.refusal':
    'Llegar a un límite es un rechazo, no un desalojo silencioso. Esta aplicación solía descartar el documento más antiguo para mantenerse por debajo de su tope, lo que destruía sin avisar algo que su dueño había decidido conservar; ahora dice qué eliminar.',

  'docs.faq.intro':
    'Las mismas respuestas que el conversor muestra bajo su zona de arrastre — un solo juego, para que las dos páginas no puedan separarse.',

  'docs.footer.source': 'Código e issues:',
};
