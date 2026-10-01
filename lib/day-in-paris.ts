export type DayImage = {
  src: string;
  alt: string;
};

export type DayMoment = {
  time: string;
  title: string;
  text: string;
  image: DayImage;
};

export type DayIntro = {
  titleTop: string;
  titleBottom: string;
  subtitle: string;
  image: DayImage;
};

export type DayClosing = {
  title: string;
  cta: { label: string; href: string };
};

export type DaySlide =
  | {
      id: string;
      type: "intro";
      intro: DayIntro;
    }
  | {
      id: string;
      type: "momentos";
      moments: DayMoment[];
      closing?: DayClosing;
    };

/**
 * Datos de los slides del "Día en París con Ahimsa".
 *
 * Para añadir o quitar un slide basta con editar este array:
 *  - La sección mide (SLIDES.length × 100vh) de alto automáticamente.
 *  - El track se recalcula; el trazo decorativo se reposiciona en función
 *    del ancho medido con ResizeObserver.
 *  - Las imágenes van en /public/media/day/ con el mismo nombre indicado
 *    en `src`. Si una imagen falta, el <RevealImage> muestra un bloque
 *    de color con el nombre del archivo (no rompe el layout).
 */
export const SLIDES: DaySlide[] = [
  {
    id: "intro",
    type: "intro",
    intro: {
      titleTop: "Experimenta",
      titleBottom: "Ahimsa",
      subtitle: "Así se ve un día en París cuando yo lo diseño.",
      image: {
        src: "/media/day/picnic-eiffel.jpg",
        alt: "Mantel de picnic con pan, quesos y copa de vino sobre el césped del Campo de Marte, con la Torre Eiffel al fondo.",
      },
    },
  },
  {
    id: "manana",
    type: "momentos",
    moments: [
      {
        time: "08:30",
        title: "Desayuno parisino",
        text: "Empezamos sin prisa, en un café de barrio que no sale en las guías.",
        image: {
          src: "/media/day/desayuno.jpg",
          alt: "Mesa de café parisino con croissant, taza de café y jugo de naranja sobre mármol.",
        },
      },
      {
        time: "10:00",
        title: "Louvre sin filas",
        text: "Entrada con horario reservado y la ruta exacta para ver lo importante sin cansar a los niños.",
        image: {
          src: "/media/day/louvre.jpg",
          alt: "Pirámide del Louvre iluminada por la luz de la mañana, con pocos visitantes alrededor.",
        },
      },
    ],
  },
  {
    id: "tarde",
    type: "momentos",
    moments: [
      {
        time: "13:30",
        title: "Picnic frente a la Torre Eiffel",
        text: "Pan, quesos y vino del mercado, en el mejor rincón del Campo de Marte.",
        image: {
          src: "/media/day/picnic-eiffel-2.jpg",
          alt: "Pareja compartiendo una tabla de quesos sobre una manta a cuadros frente a la Torre Eiffel.",
        },
      },
      {
        time: "16:00",
        title: "Libros y arte junto al Sena",
        text: "Caminata por los puestos de los bouquinistes hasta Notre Dame.",
        image: {
          src: "/media/day/bouquinistes.jpg",
          alt: "Puestos verdes de los bouquinistes a orillas del Sena con libros antiguos y grabados a la vista.",
        },
      },
    ],
  },
  {
    id: "noche",
    type: "momentos",
    moments: [
      {
        time: "20:00",
        title: "París de noche",
        text: "Cena con vista y la torre iluminada para cerrar el día.",
        image: {
          src: "/media/day/paris-noche.jpg",
          alt: "Torre Eiffel iluminada por la noche vista desde una terraza, con mesa servida en primer plano.",
        },
      },
    ],
    closing: {
      title: "Este es solo un día. ¿Diseñamos el tuyo?",
      cta: {
        label: "Cotiza tu viaje",
        href: "/contacto?tipo=family-europe",
      },
    },
  },
];
