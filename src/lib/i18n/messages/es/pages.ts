import type { Content } from '../../content';

/*
 * Las palabras de las cinco páginas que solo son palabras: about, contact y las tres legales.
 *
 * `src/lib/pages.ts` guarda lo que una página *es* —su id, su dirección y la fecha que declaran
 * las tres legales— y este archivo guarda lo que una página *dice*. La misma razón por la que el
 * reparto existe en todo lo demás: una ruta es igual en cinco lenguas y un párrafo no.
 *
 * Con la clave de `StaticPageId`, así que una página añadida a la unión sin sus palabras rompe la
 * compilación en vez de renderizar una pantalla en blanco.
 *
 * Las tres legales son política. Aquí están traducidas y no reescritas: ni un párrafo más, ni un
 * párrafo menos, ni una excepción que el inglés no haga.
 */

export const pages: Content['pages'] = {
  about: {
    label: 'Acerca de',
    title: 'Acerca de TransformPipe',
    lede: 'Un conversor que hace el trabajo en tu navegador y no se pone en medio.',
    sections: [
      {
        heading: 'Qué es',
        body: [
          'TransformPipe convierte documentos en otros documentos. Markdown en una página HTML terminada, y HTML, archivos de Word, hojas de cálculo y JSON en Markdown. Suelta un archivo, mira en qué se ha convertido y llévatelo como Markdown, HTML, texto plano o PDF.',
          'Todo se normaliza a Markdown, porque Markdown es un formato que se puede leer, comparar y conservar veinte años sin tener el programa que lo hizo.',
        ],
      },
      {
        heading: 'Por qué funciona así',
        body: [
          'La conversión ocurre en tu navegador. Sin la sesión iniciada no se envía ningún archivo a ningún sitio — no hay una subida en la que confiar, porque no hay subida. Inicia sesión y el Markdown se guarda en tu cuenta para que un documento te siga a otra máquina, y sigue siendo privado hasta que lo compartas.',
          'El HTML exportado es un solo archivo con los estilos incrustados. No le pide nada a la red, lo que significa que dentro de cinco años se abrirá en un portátil sin conexión igual que hoy.',
        ],
      },
      {
        heading: 'Más allá de la aplicación',
        body: [
          'Las mismas conversiones están al alcance desde un terminal, desde un pull request y desde un asistente: hay una API pública, un cliente de línea de comandos sin dependencias, una GitHub Action que publica el Markdown que ha cambiado un pull request y un servidor MCP para que un modelo pueda convertir y compartir documentos en tu nombre. La documentación lo cubre todo.',
        ],
      },
      {
        heading: 'Quién lo hace',
        body: [
          'TransformPipe está hecho por Raudar Labs.',
        ],
      },
    ],
    seo: {
      title: 'Acerca de TransformPipe',
      description:
        'TransformPipe convierte documentos Markdown, HTML, Word, CSV y JSON en tu navegador, con API, CLI, GitHub Action y servidor MCP. Hecho por Raudar Labs.',
    },
  },
  contact: {
    label: 'Contacto',
    title: 'Contacto',
    lede: 'Un fallo, un formato que necesitas o algo que no debería estar publicado.',
    sections: [
      {
        heading: 'Fallos y peticiones',
        body: [
          'Abre una issue en el repositorio. Un archivo que se ha convertido mal es lo más útil que puedes enviar: adjúntalo si puedes compartirlo y di qué esperabas en su lugar.',
          'Un formato que todavía no convertimos es una petición que vale la pena hacer. Varios de los que hay aquí empezaron así.',
        ],
      },
      {
        heading: 'Algo compartido que no debería estarlo',
        body: [
          'Cada documento compartido lleva un enlace «Denunciar este documento» al pie de la página que abre. Ese enlace es la vía más rápida: identifica el documento sin que tengas que describirlo.',
        ],
      },
      {
        heading: 'Privacidad y asuntos legales',
        body: [
          'Las preguntas sobre qué se guarda, o la petición de eliminar una cuenta y todo lo que contiene, van al mismo sitio. Con la sesión iniciada también puedes eliminar tú cualquier documento — eso quita la fila y el original guardado a la vez.',
        ],
      },
    ],
    seo: {
      title: 'Contacto — TransformPipe',
      description:
        'Informa de un fallo, pide un formato, denuncia un documento compartido o pregunta qué se guarda y pide que se elimine.',
    },
  },
  privacy: {
    label: 'Privacidad',
    title: 'Privacidad',
    lede: 'Qué se guarda, dónde, y qué no se recoge en absoluto.',
    sections: [
      {
        heading: 'Sin la sesión iniciada, no nos llega nada',
        body: [
          'Convertir ocurre en tu navegador. El archivo se lee, se convierte y se muestra en tu propia máquina, y no se envía ninguna parte de él a un servidor. El historial que ves es el almacenamiento del propio navegador, no una cuenta.',
        ],
      },
      {
        heading: 'Con la sesión iniciada, esto y nada más',
        body: [
          'Una cuenta existe para que los documentos puedan seguirte entre dispositivos y compartirse. Contiene:',
        ],
        items: [
          'Tu identidad, a través de nuestro proveedor de autenticación: una dirección de correo, un nombre cuando se ha dado uno y un identificador de cuenta. Al entrar con Google vienen de Google; al registrarte con una dirección y una contraseña, la contraseña queda en el proveedor de autenticación, como hash. En ninguno de los dos casos vemos ni guardamos una contraseña.',
          'De cada documento que conservas: su nombre, qué conversión lo hizo, su tamaño, los recuentos de palabras, encabezados, enlaces, bloques de código, tablas e imágenes, y cuándo se creó.',
          'El Markdown en sí, en un almacén de blobs privado — privado quiere decir que no tiene ninguna URL pública y solo se lee mediante una petición que autorizamos.',
          'Las claves API como hashes, nunca la clave. Una clave se muestra una vez, al crearla, y después no se puede recuperar — ni tú ni nosotros.',
          'Los ajustes de compartición: si un documento es privado, abierto por enlace o dirigido a direcciones de correo concretas, y el token que lleva un enlace.',
        ],
      },
      {
        heading: 'Lo que no hacemos',
        body: [
          'No hay analítica, ni publicidad, ni píxel de seguimiento, ni ningún script de terceros en este sitio — no un conjunto reducido: ninguno. Nada se vende, y nada se comparte con nadie salvo con la infraestructura que hace funcionar el servicio: la base de datos, el almacén de blobs, el proveedor de autenticación, el proveedor de correo y el alojamiento.',
          'Nosotros no leemos tus documentos, y no se usan para entrenar nada.',
        ],
      },
      {
        heading: 'El correo electrónico',
        body: [
          'Se envía correo en cuatro casos y en ninguno más: para confirmar tu dirección, para restablecer una contraseña, para darte la bienvenida una vez tras el registro y para avisar a alguien de que se ha compartido un documento con él. Los dos primeros los envía el proveedor de autenticación; los otros dos, el proveedor de correo. No hay boletín, y no hay nada de lo que darse de baja.',
          'Al proveedor de correo se le da la dirección de quien recibe el mensaje, la de quien comparte cuando la hay, y el mensaje mismo. Nunca se le da un documento.',
        ],
      },
      {
        heading: 'Cookies y almacenamiento del navegador',
        body: [
          'Una cookie de sesión, que pone nuestro proveedor de autenticación cuando inicias sesión, propia y HttpOnly. Existe otra de vida corta durante el ida y vuelta del inicio de sesión, que caduca en diez minutos. Esas son todas — no hay nada opcional que desactivar. La página de cookies tiene el detalle.',
          'Tu tema y, sin la sesión iniciada, tu historial viven en el almacenamiento local de tu navegador. Nunca salen de ahí.',
        ],
      },
      {
        heading: 'Eliminar cosas',
        body: [
          'Eliminar un documento elimina la fila y el Markdown guardado a la vez, en el momento y no según un calendario. Revocar una compartición descarta el token, así que un enlace ya enviado deja de funcionar.',
          'Para eliminar una cuenta y todo lo que contiene, pídelo — mira la página de contacto. Llegar a un límite de almacenamiento rechaza la escritura; nunca elimina algo que decidiste conservar para hacer sitio.',
        ],
      },
      {
        heading: 'Menores',
        body: [
          'Esto es una herramienta de trabajo, no un servicio para niños, y no está dirigido a nadie menor de 16 años.',
        ],
      },
      {
        heading: 'Cambios',
        body: [
          'Si esta página cambia de una forma que afecte a lo que se recoge, la fecha de arriba cambia con ella.',
        ],
      },
    ],
    seo: {
      title: 'Privacidad — TransformPipe',
      description:
        'Sin sesión iniciada, ningún archivo sale de tu navegador. Con sesión guardamos el documento, sus metadatos y tu identidad de cuenta: sin analítica ni seguimiento.',
    },
  },
  terms: {
    label: 'Términos',
    title: 'Términos de uso',
    lede: 'La versión corta, porque una larga no se leería.',
    sections: [
      {
        heading: 'Usar el servicio',
        body: [
          'TransformPipe se ofrece gratis, tal cual está. Úsalo para cualquier cosa que tengas derecho a convertir, desde la aplicación, la API, la línea de comandos o un asistente.',
          'Una cuenta es tuya para conservarla o eliminarla. Eres responsable de lo que hagas con una clave API, así que trátala como una contraseña: cualquiera que la tenga puede leer y escribir tus documentos.',
        ],
      },
      {
        heading: 'Tus documentos siguen siendo tuyos',
        body: [
          'Conservas todos los derechos que tenías sobre un documento antes de convertirlo. No reclamamos ninguna propiedad ni ninguna licencia más allá de lo que exige hacer funcionar el servicio: guardarlo para que puedas volver a abrirlo y servirlo a las personas con las que lo hayas compartido deliberadamente.',
        ],
      },
      {
        heading: 'Qué no poner aquí',
        body: [
          'No uses el servicio para contenido ilícito, que no tengas derecho a distribuir o que exista para hacer daño a alguien: malware, material que explote sexualmente a menores, acoso dirigido. No uses un enlace compartido para montar una página de phishing.',
          'Cualquiera que abra un documento compartido puede denunciarlo. Un documento que incumpla esta sección puede dejar de publicarse o eliminarse, y una cuenta reincidente cerrarse.',
        ],
      },
      {
        heading: 'Límites y disponibilidad',
        body: [
          'Se aplican límites de ritmo y de almacenamiento, publicados en la documentación. Existen para mantener el servicio en pie y pueden cambiar.',
          'No hay ninguna promesa de disponibilidad. El servicio puede interrumpirse, y las funciones pueden cambiar o retirarse. Guarda tu propia copia de todo lo que no puedas perder — la descarga existe exactamente para eso, y no necesita nada nuestro para abrirse.',
        ],
      },
      {
        heading: 'Sin garantía, y el límite de lo que debemos',
        body: [
          'El servicio se presta sin garantía de ningún tipo, expresa o implícita. En la mayor medida que permita la ley, Raudar Labs no responde por la pérdida de datos, por el lucro cesante ni por ningún daño indirecto o consecuente derivado de su uso.',
          'Nada de lo que aquí se dice limita un derecho que tengas y que no pueda limitarse por acuerdo.',
        ],
      },
      {
        heading: 'Cambios y fin',
        body: [
          'Estos términos pueden cambiar; la fecha de arriba dice cuándo lo hicieron por última vez, y seguir usando el servicio es la forma de aceptarlos. Puedes dejarlo en cualquier momento eliminando tus documentos y tu cuenta.',
        ],
      },
    ],
    seo: {
      title: 'Términos de uso — TransformPipe',
      description:
        'TransformPipe es gratis y se ofrece tal cual está. Tus documentos siguen siendo tuyos, los límites están publicados y no hay ninguna garantía.',
    },
  },
  cookies: {
    label: 'Cookies',
    title: 'Cookies',
    lede: 'Hay dos, las dos necesarias para iniciar sesión, y nada que configurar.',
    sections: [
      {
        heading: 'Nada que desactivar',
        body: [
          'La mayoría de las páginas de cookies existen para que puedas rechazar la analítica y la publicidad. Este sitio no tiene ni una ni otra, así que esta página no tiene interruptores — rechazar es el único ajuste, y ya es así como funciona el sitio.',
          'Sin la sesión iniciada, este sitio no pone ninguna cookie.',
        ],
      },
      {
        heading: 'Las dos que existen',
        body: [
          'Las dos las pone nuestro proveedor de autenticación, son propias y están marcadas como HttpOnly y Secure, de modo que ningún script de la página puede leerlas:',
        ],
        items: [
          '__Secure-neon-auth.session_token — mantiene la sesión iniciada. Sin ella, cada carga de página volvería a pedirte que inicies sesión. Desaparece al cerrar sesión.',
          '__Secure-neon-auth.session_challenge — existe durante los diez minutos del ida y vuelta del inicio de sesión, para que la respuesta de Google pueda emparejarse con la petición que la originó. Es lo que evita que el inicio de sesión de otra persona acabe en tu sesión.',
        ],
      },
      {
        heading: 'Almacenamiento del navegador, que no es una cookie',
        body: [
          'Dos cosas viven en el almacenamiento local de tu navegador y nunca se envían a ningún sitio: el tema que elegiste y —cuando no tienes la sesión iniciada— tus conversiones recientes, para que el historial tenga algo dentro. Borrar los datos del sitio en el navegador elimina las dos, y la aplicación sigue funcionando sin ellas.',
        ],
      },
      {
        heading: 'Si eso cambia',
        body: [
          'Si alguna vez se añade algo opcional, esta página tendrá un control de verdad antes de que se ponga, no después. La fecha de arriba dirá cuándo.',
        ],
      },
    ],
    seo: {
      title: 'Cookies — TransformPipe',
      description:
        'Dos cookies de sesión propias, las dos necesarias para iniciar sesión. Sin analítica, sin publicidad y sin nada opcional que configurar.',
    },
  },
};
