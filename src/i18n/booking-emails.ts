/**
 * The two emails a booking sends: one confirmation to the traveller in their own
 * edition's language, one notification to the team.
 *
 * The team's copy is Spanish only — it goes to one inbox, not to visitors.
 */
import type { SiteLang } from "./site";

export type EmailStrings = {
  subject: string;
  greeting: (name: string) => string;
  intro: string;
  detailsHeading: string;
  labels: {
    reference: string;
    car: string;
    date: string;
    passengers: string;
    pickup: string;
    country: string;
    email: string;
    phone: string;
  };
  closing: string;
  signature: string;
};

export const BOOKING_EMAIL: Record<SiteLang, EmailStrings> = {
  es: {
    subject: "Tu reserva con Cuban Trip Experience",
    greeting: (name) => `Hola ${name},`,
    intro:
      "Recibimos tu solicitud de reserva. Nuestro equipo la revisará y se pondrá en contacto contigo para confirmarla.",
    detailsHeading: "Detalles de tu reserva",
    labels: {
      reference: "Referencia",
      car: "Vehículo",
      date: "Fecha y hora",
      passengers: "Pasajeros",
      pickup: "Recogida",
      country: "País",
      email: "Correo",
      phone: "Teléfono",
    },
    closing:
      "Si algún dato no es correcto, responde a este correo y lo corregimos.",
    signature: "Cuban Trip Experience",
  },
  en: {
    subject: "Your booking with Cuban Trip Experience",
    greeting: (name) => `Hi ${name},`,
    intro:
      "We have received your booking request. Our team will review it and get in touch to confirm.",
    detailsHeading: "Your booking details",
    labels: {
      reference: "Reference",
      car: "Vehicle",
      date: "Date and time",
      passengers: "Passengers",
      pickup: "Pick-up",
      country: "Country",
      email: "Email",
      phone: "Phone",
    },
    closing: "If anything looks wrong, reply to this email and we will fix it.",
    signature: "Cuban Trip Experience",
  },
  ru: {
    subject: "Ваше бронирование в Cuban Trip Experience",
    greeting: (name) => `Здравствуйте, ${name}!`,
    intro:
      "Мы получили вашу заявку на бронирование. Наша команда рассмотрит её и свяжется с вами для подтверждения.",
    detailsHeading: "Детали бронирования",
    labels: {
      reference: "Номер",
      car: "Автомобиль",
      date: "Дата и время",
      passengers: "Пассажиры",
      pickup: "Место подачи",
      country: "Страна",
      email: "Электронная почта",
      phone: "Телефон",
    },
    closing:
      "Если какие-то данные неверны, ответьте на это письмо, и мы их исправим.",
    signature: "Cuban Trip Experience",
  },
};
