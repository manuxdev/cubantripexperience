/**
 * Booking-page copy for the three editions, read out of each page's Elementor
 * JSON by `reference/tools/gen-booking.py`. Leading spaces are the source's own.
 *
 * `moreHeadingOwnSection` is real structure, not styling: Spanish gives the
 * "More information" heading a section of its own, English and Russian keep it
 * in the same section as the copy below it, which is worth 20px of wrap padding.
 */
import type { SiteLang } from "../i18n/site";

export type BookingContent = {
  title: string;
  hero: string;
  howHeading: string;
  moreHeading: string;
  moreHeadingOwnSection: boolean;
  moreBody: string;
  /** English closes with an empty section; Elementor still renders 1px of it. */
  trailingSection: boolean;
  contactButton: string;
  /** The four explainer tabs; `body` is verbatim widget HTML. */
  tabs: { title: string; body: string }[];
};

export const BOOKING: Record<SiteLang, BookingContent> = {
  es: {
    "title": "Reservar | Cuban Trip Experience",
    "hero": "Reservar",
    "howHeading": "¿Cómo funciona?",
    "moreHeading": "Más Información:",
    "moreHeadingOwnSection": true,
    "moreBody": "Si tiene algún problema o necesita cancelar o modificar su reserva, no dude en ponerse en contacto con nosotros y estaremos encantados de ayudarle. Nuestra misión es brindar un servicio de taxi seguro, confiable y conveniente a nuestros clientes, y siempre estamos disponibles para responder cualquier pregunta o inquietud que pueda tener. ¡Gracias por elegir nuestro sitio web de reserva de taxis!",
    "contactButton": "Contáctanos",
    "trailingSection": false,
    "tabs": [
      {
        "title": "Servicios",
        "body": "<p>Seleccione el tipo de vehículo a solicitar, entre estos vehículos se encuentran:</p><p><strong>Estándar:</strong> De 1 a 4 Personas</p><p><strong>Vans:</strong> Para grupos de 4 a 9</p><p><strong> Clásico:</strong> De 1 a 4 personas</p>"
      },
      {
        "title": "Fecha",
        "body": "Seleccione el día y la hora en que ocupará la reserva del vehículo.\n- Puede elegir el formato de la fecha."
      },
      {
        "title": "Opciones",
        "body": "<ol>\n \t<li>Ingrese su nombre y apellido, así como su correo electrónico, número de teléfono y seleccione su país de procedencia.</li>\n \t<li>Selecciona la cantidad de personas que viajarán con usted así como la ubicación de recogida.</li>\n</ol>\n<ul>\n \t<li>Si selecciona el campo \"Aeoropuerto\" deberá introducir su número de vuelo y seleccionar el aeropuerto donde lo recibiremos.</li>\n \t<li>De seleccionar el campo \"Otro\" deberá intruducir la dirección de recogida.</li>\n</ul>"
      },
      {
        "title": "Confirmación",
        "body": "<ul>\n \t<li>Una vez realizada la reserva, aparecerá un mensaje de agradecimiento y su reserva pasará a estado pendiente.</li>\n \t<li>Usted recibira un correo con los datos de su reserva, guárdelo bien ya que esta es la comprobación de su reserva.</li>\n \t<li>Su reserva será revisada por nuestros operadores y nos pondremos en contacto con usted vía WhatsApp o correo electrónico para confirmar su reserva.</li>\n</ul>"
      }
    ]
  },
  en: {
    "title": "Bookings | Cuban Trip Experience",
    "hero": "BOOKING",
    "howHeading": "How does it work?",
    "moreHeading": "More information",
    "moreHeadingOwnSection": false,
    "moreBody": "If you have any problems or need to cancel or modify your reservation, do not hesitate to contact us and we will be happy to help you. Our mission is to provide a safe, reliable and convenient taxi service to our customers, and we are always available to answer any questions or concerns you may have. Thank you for choosing our taxi booking website!",
    "contactButton": "CONTACT US",
    "trailingSection": true,
    "tabs": [
      {
        "title": "Services",
        "body": "<p>Select the type of vehicle to request, among these vehicles are:</p><p><strong>Standard:</strong> For 1 to 4 people</p><p><strong>Vans:</strong> For groups of 4 to 12</p><p><strong> Classic:</strong> For 1 to 4 people</p>"
      },
      {
        "title": "Time",
        "body": "\nSelect the day and time that you will occupy the vehicle reservation.\n- You can choose the date format."
      },
      {
        "title": "Options",
        "body": "<ol>\n <li>Enter your first and last name, as well as your email, phone number and select your country of origin.</li>\n <li>Select the number of people traveling with you as well as the pickup location.</li>\n</ol>\n<ul>\n <li>If you select the \"Airport\" field, you must enter your flight number and select the airport where we will receive you.</li>\n <li>If you select the \"Other\" field, you must enter the pickup address.</li>\n</ul>"
      },
      {
        "title": "Confirmation",
        "body": "<ul>\n <li>Once the reservation is made, a thank you message will appear and your reservation will go to pending status.</li>\n <li>You will receive an email with the details of your reservation, keep it well as this is the verification of your reservation.</li>\n <li>Your reservation will be reviewed by our operators and we will contact you via WhatsApp or email to confirm your reservation.</li>\n</ul>"
      }
    ]
  },
  ru: {
    "title": "Бронировать | Cuban Trip Experience",
    "hero": "\nБронировать",
    "howHeading": "Как это работает?",
    "moreHeading": "Больше информации:",
    "moreHeadingOwnSection": false,
    "moreBody": "Если у вас есть какие-либо проблемы или вам нужно отменить или изменить бронирование, не стесняйтесь обращаться к нам, и мы будем рады вам помочь. Наша миссия состоит в том, чтобы предоставить нашим клиентам безопасную, надежную и удобную услугу такси, и мы всегда готовы ответить на любые вопросы или проблемы, которые могут у вас возникнуть. Спасибо, что выбрали наш сайт заказа такси!",
    "contactButton": " связаться с нами",
    "trailingSection": false,
    "tabs": [
      {
        "title": " Услуги",
        "body": "<p>Выберите тип транспортного средства для запроса, среди этих транспортных средств:</p><p><strong>Стандартный:</strong> от 1 до 4 человек</p><p><strong>Фургоны:</strong> для групп от 4 до 12 человек.</p><p><strong> Классический: </strong> от 1 до 4 человек.</p>"
      },
      {
        "title": " Дата",
        "body": "<p>Выберите день и время, когда вы будете занимать бронирование автомобиля.</p><p>- Вы можете выбрать формат даты.</p>"
      },
      {
        "title": "Параметры",
        "body": "<ol>\n <li>Введите свое имя и фамилию, а также адрес электронной почты, номер телефона и выберите страну происхождения.</li>\n <li>Выберите количество людей, путешествующих с вами, а также место встречи.</li>\n</ol>\n<ul>\n <li>Если вы выбираете поле \"Аэропорт\", вы должны ввести номер своего рейса и выбрать аэропорт, в котором мы вас встретим.</li>\n <li>Если вы выберете поле \"Другое\", вы должны ввести адрес получения.</li>\n</ul>"
      },
      {
        "title": "Подтверждение",
        "body": "<ul>\n <li>После оформления бронирования появится сообщение с благодарностью, и ваше бронирование перейдет в состояние ожидания.</li>\n <li>Вы получите электронное письмо с подробной информацией о бронировании. Сохраните его, так как это подтверждение вашего бронирования.</li>\n <li>Ваше бронирование будет рассмотрено нашими операторами, и мы свяжемся с вами через WhatsApp или по электронной почте, чтобы подтвердить бронирование.</li>\n</ul>"
      }
    ]
  },
};
