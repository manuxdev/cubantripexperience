/**
 * The three-step booking form's strings, per edition, read out of Fluent Forms
 * 3 / 5 / 7 by `reference/tools/gen-booking-form.py`. Leading spaces are the
 * source's own — several labels carry one.
 *
 * The Russian edition's step counter is NOT translated by the plugin: the source
 * renders "Step 1 of 3" there too.
 */
import type { SiteLang } from "../i18n/site";

export type Field = { label: string; placeholder: string; options: string[] };

export type BookingForm = {
  stepPrefix: string;
  stepTitles: string[];
  buttons: { next: string; prev: string; submit: string };
  firstName: { label: string; placeholder: string };
  lastName: { label: string; placeholder: string };
  taxi: Field;
  date: Field;
  hour: Field;
  hour12: Field;
  format: Field;
  country: Field;
  email: Field;
  phone: Field;
  passengers: Field;
  passengersVan: Field;
  pickup: Field;
  flight: Field;
  airport: Field;
  address: Field;
  terms: Field;
};

export const BOOKING_FORM: Record<SiteLang, BookingForm> = {
  es: {
    "stepPrefix": "Paso {n} de 3 - ",
    "stepTitles": [
      "Selecciona de Reserva",
      "Datos Personales",
      "Datos de reserva"
    ],
    "buttons": {
      "next": "Siguiente",
      "prev": "Anterior",
      "submit": "Enviar"
    },
    "firstName": {
      "label": "Nombre:",
      "placeholder": "Nombre"
    },
    "lastName": {
      "label": "Apellido:",
      "placeholder": "Apellido"
    },
    "taxi": {
      "label": "Taxi:",
      "placeholder": "",
      "options": [
        "Estándar",
        "Van",
        "Clásico"
      ]
    },
    "date": {
      "label": "Fecha:",
      "placeholder": "m/d/A",
      "options": []
    },
    "hour": {
      "label": "Hora:",
      "placeholder": "",
      "options": []
    },
    "hour12": {
      "label": "Hora:",
      "placeholder": "",
      "options": []
    },
    "format": {
      "label": "Cambiar formato Fecha",
      "placeholder": "",
      "options": [
        "Sistema 12 Horas"
      ]
    },
    "country": {
      "label": "País:",
      "placeholder": "Selecciona",
      "options": [
        "United States of America"
      ]
    },
    "email": {
      "label": "Correo:",
      "placeholder": "Dirección de Correo",
      "options": []
    },
    "phone": {
      "label": "Teléfono:",
      "placeholder": "Teléfono",
      "options": []
    },
    "passengers": {
      "label": "Cantidad de Pasajeros:",
      "placeholder": "",
      "options": [
        "1",
        "2",
        "3"
      ]
    },
    "passengersVan": {
      "label": "Cantidad de Pasajeros:",
      "placeholder": "",
      "options": [
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
      ]
    },
    "pickup": {
      "label": "Lugar de Recogida:",
      "placeholder": "",
      "options": [
        "Aeropuerto",
        "Otro"
      ]
    },
    "flight": {
      "label": "Número de Vuelo:",
      "placeholder": "Agregue su número de vuelo",
      "options": []
    },
    "airport": {
      "label": "Aeropuerto:",
      "placeholder": "",
      "options": [
        "Aeropuerto Internacional José Martí (La Habana)",
        "Aeropuerto Internacional Juan Gualberto Gómez (Varadero)",
        "Aeropuerto Internacional Abel Santamaría (Santa Clara)",
        "Aeropuerto Internacional Frank País (Holguín)",
        "Aeropuerto Internacional Antonio Maceo (Santiago de Cuba)",
        "Aeropuerto Internacional Jardines del Rey (Cayo Coco)",
        "Aeropuerto Internacional Ignacio Agramonte (Camagüey)",
        "Aeropuerto Internacional Sierra Maestra (Manzanillo)",
        "Aeropuerto Internacional Vilo Acuña (Cayo Largo del Sur)"
      ]
    },
    "address": {
      "label": "Dirección:",
      "placeholder": "Introduce Dirección",
      "options": []
    },
    "terms": {
      "label": "Condiciones de uso",
      "placeholder": "",
      "options": [
        "Esta usted de acuerdo en que nos pongamos en contacto via whatsapp o email para ultimar detalles?"
      ]
    }
  },
  en: {
    "stepPrefix": "Step {n} of 3 - ",
    "stepTitles": [
      "Booking Selection",
      " Personal information",
      "Booking data"
    ],
    "buttons": {
      "next": "Next",
      "prev": " Previous",
      "submit": "Submit"
    },
    "firstName": {
      "label": "Name:",
      "placeholder": "Name"
    },
    "lastName": {
      "label": "Last Name:",
      "placeholder": "Last Name"
    },
    "taxi": {
      "label": "Taxi:",
      "placeholder": "",
      "options": [
        "Standar",
        "Van",
        "Classic"
      ]
    },
    "date": {
      "label": "Date:",
      "placeholder": "m/d/Y",
      "options": []
    },
    "hour": {
      "label": "Hour:",
      "placeholder": "",
      "options": []
    },
    "hour12": {
      "label": "Hour:",
      "placeholder": "",
      "options": []
    },
    "format": {
      "label": " Change date format",
      "placeholder": "",
      "options": [
        "12 Hour System"
      ]
    },
    "country": {
      "label": "Country:",
      "placeholder": "Select",
      "options": [
        "United States of America"
      ]
    },
    "email": {
      "label": "Email:",
      "placeholder": "Email Address",
      "options": []
    },
    "phone": {
      "label": "Phone:",
      "placeholder": "Phone",
      "options": []
    },
    "passengers": {
      "label": " Number of Passengers:",
      "placeholder": "",
      "options": [
        "1",
        "2",
        "3"
      ]
    },
    "passengersVan": {
      "label": " Number of Passengers:",
      "placeholder": "",
      "options": [
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
      ]
    },
    "pickup": {
      "label": "Pick up location:",
      "placeholder": "",
      "options": [
        "Aeroport",
        "Other"
      ]
    },
    "flight": {
      "label": "Flight number:",
      "placeholder": " Add your flight number",
      "options": []
    },
    "airport": {
      "label": "Aeroport:",
      "placeholder": "",
      "options": [
        "José Martí International Airport (Havana)",
        " Juan Gualberto Gómez International Airport (Varadero)",
        " Abel Santamaría International Airport (Santa Clara)",
        " Frank Pais International Airport (Holguin)",
        "Antonio Maceo International Airport (Santiago de Cuba)",
        "Jardines del Rey International Airport (Cayo Coco)",
        "Ignacio Agramonte International Airport (Camaguey)",
        "Sierra Maestra International Airport (Manzanillo)",
        "Vilo Acuña International Airport (Cayo Largo del Sur)"
      ]
    },
    "address": {
      "label": "Address:",
      "placeholder": "Enter Address",
      "options": []
    },
    "terms": {
      "label": " Terms of use",
      "placeholder": "",
      "options": [
        " Do you agree that we contact you via whatsapp or email to finalize details?"
      ]
    }
  },
  ru: {
    "stepPrefix": "Step {n} of 3 - ",
    "stepTitles": [
      "Выбрать из резерва",
      " Персональная информация",
      " данные бронирования"
    ],
    "buttons": {
      "next": " Следующий",
      "prev": "Бывший",
      "submit": "Oтправлять"
    },
    "firstName": {
      "label": " Имя:",
      "placeholder": " Имя"
    },
    "lastName": {
      "label": " Фамилия:",
      "placeholder": " Фамилия"
    },
    "taxi": {
      "label": " Такси:",
      "placeholder": "",
      "options": [
        "Стандарт",
        " Ван",
        " Классический"
      ]
    },
    "date": {
      "label": " Дата:",
      "placeholder": "",
      "options": []
    },
    "hour": {
      "label": " Час:",
      "placeholder": "",
      "options": []
    },
    "hour12": {
      "label": " Час:",
      "placeholder": "",
      "options": []
    },
    "format": {
      "label": " Изменить формат даты",
      "placeholder": "",
      "options": [
        "12-часовая система"
      ]
    },
    "country": {
      "label": " Страна:",
      "placeholder": " Выбирать",
      "options": [
        "United States of America"
      ]
    },
    "email": {
      "label": " Почта:",
      "placeholder": "Почта Адрес",
      "options": []
    },
    "phone": {
      "label": " Телефон:",
      "placeholder": " Телефон",
      "options": []
    },
    "passengers": {
      "label": " Количество пассажиров:",
      "placeholder": "",
      "options": [
        "1",
        "2",
        "3"
      ]
    },
    "passengersVan": {
      "label": "Количество пассажиров:",
      "placeholder": "",
      "options": [
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
      ]
    },
    "pickup": {
      "label": " Выбрать место:",
      "placeholder": "",
      "options": [
        " аэропорт",
        " Другой"
      ]
    },
    "flight": {
      "label": "Номер рейса:",
      "placeholder": "Добавьте номер вашего рейса",
      "options": []
    },
    "airport": {
      "label": " Аэропорт:",
      "placeholder": "",
      "options": [
        "Международный аэропорт Хосе Марти (Гавана)",
        "Международный аэропорт имени Хуана Гуальберто Гомеса (Варадеро)",
        " Международный аэропорт Абель Сантамария (Санта-Клара)",
        "Международный аэропорт Франк Паис (Ольгин)",
        "Международный аэропорт Антонио Масео (Сантьяго-де-Куба)",
        "Международный аэропорт Хардинес-дель-Рей (Кайо-Коко)",
        " Международный аэропорт Игнасио Аграмонте (Камагуэй)",
        " Международный аэропорт Сьерра-Маэстра (Мансанильо)",
        "Международный аэропорт Вило-Акунья (Кайо-Ларго-дель-Сур)"
      ]
    },
    "address": {
      "label": "Адрес:",
      "placeholder": " Введите адрес",
      "options": []
    },
    "terms": {
      "label": " Условия эксплуатации",
      "placeholder": "",
      "options": [
        " Согласны ли вы с тем, что мы свяжемся с вами через WhatsApp или по электронной почте для уточнения деталей?"
      ]
    }
  },
};
