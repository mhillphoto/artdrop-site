/**
 * ArtDrop — i18n translation system
 * Lightweight client-side EN/ES toggle. No dependencies.
 * Usage: window.i18n.toggle() | window.i18n.setLang('es')
 */
(function () {
  'use strict';

  // ── TRANSLATION TABLE ────────────────────────────────────────────────────
  // Keys map to data-i18n attributes in the HTML.
  // English values are the source-of-truth fallback (never actually applied
  // since the DOM already has them); they're here for reference only.
  // Only Spanish ('es') entries are applied at runtime.

  var translations = {
    es: {

      // ── NAV ──────────────────────────────────────────────────────────────
      'nav.about':      'Nosotros',
      'nav.faq':        'Preguntas',
      'nav.docs':       'Docs',
      'nav.changelog':  'Cambios',
      'nav.earnings':   'Ganancias',
      'nav.cta':        'Unirse al Beta',

      // ── HERO ─────────────────────────────────────────────────────────────
      'hero.label':     '// Publicación Automatizada de Print-on-Demand',
      'hero.headline':  'Sube un archivo.<br><em>Listo.</em>',
      'hero.sub':       'Sube una imagen. Eso es todo. ArtDrop analiza tu obra — colores, composición, estado de ánimo, tema — luego escribe el copy, crea cada formato de producto que vendes, publica todo en tu tienda y lo comparte en tus redes. Organización de tienda, SEO, texto alternativo — todo. Configúralo una vez. Cada subida después es automática. Funciona en cualquier navegador y dispositivo — sin instalación.',
      'hero.cta':       'Obtener ArtDrop™',
      'hero.price':     '<strong>$197</strong> &nbsp;pago único · Funciona en cualquier dispositivo',

      // ── HOW IT WORKS ─────────────────────────────────────────────────────
      'how.label':      '// Cómo funciona',
      'how.title':      'Sube un archivo. Todo lo demás es automático.',

      'step.01.num':    '01 / DETECTAR',
      'step.01.title':  'Sube tus archivos',
      'step.01.desc':   'ArtDrop vigila tu carpeta de entrada. Sube un archivo o cien — PNG, JPG o TIF. ArtDrop los procesa todos, de forma secuencial y confiable, sin supervisión. Eso es todo lo que tienes que hacer.',

      'step.02.num':    '02 / ANALIZAR',
      'step.02.title':  'La IA lee la imagen',
      'step.02.desc':   'La IA estudia tu obra — colores, composición, estado de ánimo, temática. Analiza lo que realmente hay en la pieza, no solo adivina a partir del nombre del archivo.',

      'step.03.num':    '03 / ESCRIBIR',
      'step.03.title':  'Copy generado',
      'step.03.desc':   'Título, descripción, etiquetas SEO — todo escrito para coincidir con la voz de tu marca. Usa el Entrenador de Voz incorporado para enseñarle a ArtDrop cómo hablas de tu trabajo — sin ingeniería de prompts. Sin contenido genérico de IA. Sin duplicados.',

      'step.04.num':    '04 / CREAR',
      'step.04.title':  'Cada producto creado',
      'step.04.desc':   'Tus proveedores de impresión crean cada formato de producto que configuraste — todos ejecutándose simultáneamente. Cualquier plantilla que hayas configurado: pósters, lienzos, fundas de teléfono — todo desde tu configuración. Nada que tocar.',

      'step.05.num':    '05 / PUBLICAR',
      'step.05.title':  'Tu tienda en vivo',
      'step.05.desc':   'Todos los productos publicados en las categorías correctas de tu tienda — con título SEO, descripción, texto alternativo y etiquetas. Registro de auditoría completo para que sepas exactamente qué se creó.',

      'step.06.num':    '06 / COMPLETAR',
      'step.06.title':  'Completamente automatizado',
      'step.06.desc':   'Cada archivo toma unos minutos. Sube todo tu portafolio antes de dormir, despierta con un catálogo completo — cada producto en vivo en la categoría correcta de tu tienda con copy profesional, SEO y etiquetas. No queda nada por hacer.',

      // ── ONE-TIME SETUP ───────────────────────────────────────────────────
      'setup.label':    '// Configuración única',
      'setup.title':    'Configúralo una vez',
      'setup.desc':     'Configura tus productos, conecta tu tienda y entrena tu voz — una sola vez. Cada subida después es completamente automática. Sube un archivo o un portafolio entero. Sin tocar plantillas, sin reingresar configuraciones, sin supervisión.',

      // ── WHAT GETS CREATED ────────────────────────────────────────────────
      'products.label': '// Qué se crea',
      'products.title': 'Una subida.<br>Cada formato que vendes.',

      // ── FEATURES ─────────────────────────────────────────────────────────
      'features.label': '// Qué se automatiza',
      'features.title': 'Todo esto ocurre<br>después de subir tu obra.',

      'feature.copy.title':    'Copy de producto con IA',
      'feature.copy.desc':     'Título, descripción y SEO — escritos para coincidir con el lenguaje visual específico de cada pieza. Sin plantillas genéricas.',

      'feature.exif.title':    'Especificaciones técnicas del EXIF',
      'feature.exif.desc':     'Cámara, lente, distancia focal, obturador, apertura, ISO, resolución, DPI — extraídos del propio archivo. Sin entrada manual.',

      'feature.seo.title':     'SEO completo de tienda',
      'feature.seo.desc':      'Título SEO, meta descripción, texto alternativo, etiquetas de producto — todo configurado automáticamente para cada producto.',

      'feature.org.title':     'Organización de tienda',
      'feature.org.desc':      'Cada producto colocado en la categoría correcta — pósters en Arte Mural, fundas en Accesorios. Tu tienda permanece organizada sin que la toques.',

      'feature.tags.title':    'Etiquetado completo',
      'feature.tags.desc':     'Estilo, color, estado de ánimo, categoría, formato — cada producto etiquetado automáticamente para filtrado y búsqueda en tu tienda.',

      'feature.log.title':     'Registro de auditoría en Excel',
      'feature.log.desc':      'Cada producto registrado con miniatura, todos los metadatos y marcas de tiempo. Registro completo y rastreable de todo lo creado.',

      'feature.wizard.title':  'Asistente de configuración guiada',
      'feature.wizard.desc':   'La configuración paso a paso te guía para conectar tus cuentas, configurar plantillas y personalizar tu voz de marca. Valida todo en tiempo real antes de guardar.',

      'feature.voice.title':   'Entrenador de Voz interactivo',
      'feature.voice.desc':    'No escribas reglas de prompts — solo reacciona. Sube una imagen, ve el copy de la IA, di qué cambiarías en inglés sencillo. ArtDrop aprende tu estilo y guarda las reglas por ti.',

      'feature.browser.title': 'Interfaz basada en navegador',
      'feature.browser.desc':  'Todo funciona desde una interfaz de navegador limpia. Inicia/detén el procesador, mira registros en vivo, sube archivos — todo con clics.',

      'feature.batch.title':   'Procesamiento en lote',
      'feature.batch.desc':    'Sube un archivo o cien. ArtDrop los procesa todos de forma secuencial y confiable. Carga tu portafolio antes de dormir, despierta con un catálogo completo.',

      // ── SEE IT IN ACTION ─────────────────────────────────────────────────
      'demo.label':     '// Míralo en acción',
      'demo.title':     'Un archivo. <em>Cada producto</em> que vendes.',
      'demo.prose':     'Sube una imagen y ArtDrop crea cada formato de producto que configuraste — pósters en Arte Mural, fundas en Accesorios, tazas en Bebidas — cada uno publicado en la categoría correcta de tu tienda con SEO completo, texto alternativo y etiquetas. Tus clientes navegan por tipo de producto. Tu tienda permanece organizada. Tú no la tocaste.',

      'demo.cap1.title': 'Organizado por tipo de producto',
      'demo.cap1.desc':  'Cada producto aterriza automáticamente en la categoría correcta. Pósters en Arte Mural, fundas en Accesorios — organizado como los clientes realmente compran.',

      'demo.cap2.title': 'Panel de ArtDrop',
      'demo.cap2.desc':  'Mira todo en tiempo real. Sube un archivo, ve la IA analizarlo, mira cómo se crean los productos y cómo se publican — todo desde una pantalla.',

      'demo.cap3.title': 'Listado de producto escrito por IA',
      'demo.cap3.desc':  'Cada producto recibe un título y descripción únicos escritos específicamente para lo que hay en la imagen. Título SEO, meta descripción, texto alternativo y etiquetas — todo listo.',

      // ── BUILT BY AN ARTIST ───────────────────────────────────────────────
      'artist.label':   '// Creado por un artista en activo',
      'artist.title':   'Sin esto, me habría vuelto loco.',
      'artist.p1':      'Cientos de fotografías guardadas en un disco duro. Cada una necesitaba listados de producto — título, descripción, etiquetas SEO, texto alternativo, variantes, precios — para cada formato que vendo. Una obra de arte en diez tipos de producto son diez listados separados. Cada uno toma 30-45 minutos cuando se hace bien — escribir copy real, configurar el SEO, etiquetarlo, organizarlo. Eso son seis horas de entrada de datos por fotografía. Diez fotografías, sesenta horas. Y eso es solo con un proveedor — hazlo con tres y estás mirando meses de trabajo a tiempo completo que no tiene nada que ver con hacer arte.',
      'artist.p2':      'Y las "herramientas masivas" no te salvan. Tu proveedor de impresión toma tu imagen y la pone en un servidor al que no puedes acceder — sin control sobre dónde vive o si se recomprime. Su exportación CSV requiere URLs de imágenes que no tienes. El editor masivo de Shopify te hace desplazarte por productos de diez en diez — con 800 listados, perderás la cabeza antes de encontrar el que necesitas. Nada de esto fue construido para artistas trabajando a escala. Fue construido para alguien que lista doce tazas de café.',
      'artist.p3':      'ArtDrop existe porque choqué con esa pared. Pasé meses creando productos a mano — buscando en catálogos, configurando plantillas, subiendo obras, luego cambiando a Shopify para reescribir cada título, cada descripción, cada etiqueta, para cada producto, desde cero. Una y otra vez. Eso es lo que me obligó a construir esto. Cada función de ArtDrop provino de un problema real que encontré haciéndolo a la manera difícil.',
      'artist.link':    'Leer la historia completa →',

      // ── STACK ────────────────────────────────────────────────────────────
      'stack.label':    '// La tecnología',
      'stack.title':    'Construido sobre servicios en los que ya confías.',
      'stack.prose':    'ArtDrop conecta los servicios que ya usas. Tu proveedor de impresión cumple y envía a todo el mundo. Tu tienda gestiona las ventas. Backblaze almacena tus archivos. ArtDrop es el pegamento — y la automatización. Construido y vendido por StanHattie LLC.',
      'stack.integrates': 'Se integra con',

      // ── AI ENGINE ────────────────────────────────────────────────────────
      'ai.label':       '// Motor de IA',
      'ai.title':       'Impulsado por Claude de Anthropic.',
      'ai.prose':       'El motor de IA detrás de cada título, descripción y etiqueta SEO que genera ArtDrop. Sin contenido genérico de IA. Sin ingeniería de prompts. Entrena tu voz una vez — Claude escribe como tú para cada producto, cada plataforma, siempre.',

      // ── ROADMAP ──────────────────────────────────────────────────────────
      'roadmap.label':        '// Qué sigue',
      'roadmap.title':        'Nunca dejamos de construir.',
      'roadmap.prose':        'ArtDrop está en desarrollo constante. Nuevos proveedores, nuevas tiendas, nuevas funciones de inteligencia — todo incluido al mismo precio fijo. Sin tarifas de actualización. Sin crecimiento de suscripción. Compras una vez, obtienes todo lo que viene después.',
      'roadmap.shipped':      'Enviado recientemente',
      'roadmap.providers':    'Proveedores de impresión',
      'roadmap.storefronts':  'Tiendas',
      'roadmap.products':     'Nuevos productos',
      'roadmap.features':     'Funciones',

      // ── SOCIAL PUBLISHING ────────────────────────────────────────────────
      'social.label':   '// Publicación en redes sociales',
      'social.title':   'Publica en todas partes.<br>Suena como tú mismo.',
      'social.intro':   'Cada subida genera publicaciones únicas adaptadas a tu voz para cada plataforma — no la misma leyenda copiada y pegada cinco veces. ArtDrop adapta tu voz a la cultura de cada plataforma para que se lea como si tú lo escribiste, porque suena como si lo hiciste. Elige en qué plataformas publicar, o desactiva la publicación social completamente — es completamente opcional.',
      'social.footer':  'Todas las publicaciones se generan automáticamente después de cada subida — sin pasos adicionales. Activa las plataformas que usas, desactiva las que no. La publicación social es completamente opcional.',

      'social.ig.desc':   'Leyendas centradas en la voz con bloques inteligentes de hashtags. Personal, atractivo, no robótico.',
      'social.pin.desc':  'Pines ricos en palabras clave optimizados para descubrimiento en búsquedas. Pinterest es un motor de búsqueda — ArtDrop escribe para él.',
      'social.fb.desc':   'Publicaciones conversacionales con llamadas a la acción directas. Habla a compradores de arte, no a algoritmos.',
      'social.threads.desc': 'Publicaciones breves, primero la personalidad. Tono casual, voz genuina. Sin lenguaje corporativo.',
      'social.bsky.desc': 'Publicaciones cortas y contundentes con personalidad. La plataforma en crecimiento para creadores independientes.',

      // ── PRIVACY ──────────────────────────────────────────────────────────
      'privacy.label':  '// Privacidad',
      'privacy.title':  'Tus datos son tuyos.',
      'privacy.pledge': 'Nunca venderemos tu información, la compartiremos con terceros ni usaremos los datos de tu compra para hacerte marketing. ArtDrop fue construido por alguien que odia eso tanto como tú.',
      'privacy.link':   'Lee nuestra política de privacidad completa →',

      'privacy.b1': 'Se ejecuta completamente en tu navegador — sin instalación',
      'privacy.b2': 'Claves API almacenadas en tu sesión cifrada, nunca transmitidas a nosotros',
      'privacy.b3': 'Sin panel en la nube ni cuenta requerida',
      'privacy.b4': 'Sin análisis, telemetría ni seguimiento en la app — tus subidas son privadas',
      'privacy.b5': 'Sin recolección de datos — jamás',
      'privacy.b6': 'No tenemos servidores — tus archivos van directamente de tu navegador a tus proveedores',

      // ── TESTIMONIALS / STATS STRIP ───────────────────────────────────────
      'stats.label':    '// Construido para artistas, por un artista',
      'stats.title':    'Un flujo de trabajo. Cero listados manuales.',
      'stats.prose':    'ArtDrop fue construido por un fotógrafo en activo que se cansó de pasar más tiempo en listados de productos que haciendo arte. Sube una imagen y el flujo de trabajo gestiona cada título, descripción y etiqueta SEO automáticamente.',

      'stat.products':  'tipos de producto en todos los proveedores',
      'stat.providers': 'proveedores POD integrados',
      'stat.price':     'pago único · sin suscripción',

      // ── PRICING ──────────────────────────────────────────────────────────
      'pricing.label':  '// Precios',
      'pricing.title':  'Un precio. Sin suscripción.',
      'pricing.once':   'compra única · licencia de por vida',

      'pi.browser':   'App web — funciona en cualquier navegador y dispositivo',
      'pi.unlimited': 'Subidas de obra ilimitadas — sin tarifas por subida',
      'pi.formats':   'Formatos de producto ilimitados — tú configuras las plantillas',
      'pi.guide':     'Guía de configuración incluida',
      'pi.devices':   'Activa en hasta 2 dispositivos',
      'pi.support':   'Soporte por correo electrónico',

      'vs.label':     'vs. suscribirse a herramientas separadas',
      'vs.automation':'Herramientas de automatización',
      'vs.listing':   'Formateadores de listados',
      'vs.mockup':    'Generadores de mockups con IA',
      'vs.total':     'Total del paquete',
      'vs.total.val': '$97/mes · <strong>$1,164/año</strong>',
      'vs.artdrop':   'ArtDrop: $197 una vez. Estás por delante en el mes 3.',

      'pricing.beta':      'Beta — Próximo lanzamiento',
      'pricing.placeholder': 'Ingresa tu email para acceso anticipado',
      'pricing.waitlist':  'Unirse a la Lista de Espera',
      'pricing.note':      'Sé el primero cuando ArtDrop lance · Sin tarjeta de crédito',
      'pricing.demo':      '<strong>3 drops de demo gratuitos</strong> — prueba ArtDrop antes de comprar · Sin compromiso',
      'pricing.guarantee': 'Garantía de satisfacción de 14 días. Si ArtDrop no funciona para ti, escríbenos para un reembolso completo.',
    }
  };

  // ── TOGGLE STATE ──────────────────────────────────────────────────────────
  var STORAGE_KEY = 'artdrop-lang';
  var currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

  // ── APPLY TRANSLATIONS ────────────────────────────────────────────────────
  function applyLang(lang) {
    var t = translations[lang] || {};
    var isEs = lang === 'es';

    // Update html[lang]
    document.documentElement.lang = isEs ? 'es' : 'en';

    // Swap all data-i18n text nodes
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!isEs) {
        // Restore English from data-i18n-en cache
        var cached = el.getAttribute('data-i18n-en');
        if (cached !== null) el.innerHTML = cached;
      } else {
        var val = t[key];
        if (val !== undefined) {
          // Cache English original on first swap
          if (el.getAttribute('data-i18n-en') === null) {
            el.setAttribute('data-i18n-en', el.innerHTML);
          }
          el.innerHTML = val;
        }
      }
    });

    // Swap placeholder attributes (email inputs etc.)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (!isEs) {
        var cached = el.getAttribute('data-i18n-placeholder-en');
        if (cached !== null) el.placeholder = cached;
      } else {
        var val = t[key];
        if (val !== undefined) {
          if (el.getAttribute('data-i18n-placeholder-en') === null) {
            el.setAttribute('data-i18n-placeholder-en', el.placeholder);
          }
          el.placeholder = val;
        }
      }
    });

    // Update toggle button visual state
    var btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', isEs ? 'true' : 'false');
      btn.classList.toggle('lang-toggle--es', isEs);
    }
  }

  // ── PUBLIC API ────────────────────────────────────────────────────────────
  window.i18n = {
    toggle: function () {
      currentLang = currentLang === 'en' ? 'es' : 'en';
      localStorage.setItem(STORAGE_KEY, currentLang);
      applyLang(currentLang);
    },
    setLang: function (lang) {
      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      applyLang(lang);
    },
    getLang: function () {
      return currentLang;
    },
    // Called by nav.js after nav HTML is injected into the DOM
    init: function () {
      if (currentLang !== 'en') {
        applyLang(currentLang);
      }
    }
  };

})();
