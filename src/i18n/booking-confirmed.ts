/**
 * The confirmation screen a submitted booking lands on.
 *
 * `reference` is shown large because it is the one thing the visitor needs to
 * quote back; everything else on the page exists to explain it.
 */
import type { SiteLang } from "./site";

export type ConfirmedStrings = {
  title: string;
  hero: string;
  heading: string;
  intro: string;
  referenceLabel: string;
  /** Shown when Notion has the booking but the confirmation email did not go out. */
  noEmail: string;
  emailSent: string;
  reviewNote: string;
  backHome: string;
  seeDestinations: string;
  /** Reached with no reference in the URL — nothing to confirm. */
  missing: string;
  missingCta: string;
};

export const BOOKING_CONFIRMED: Record<SiteLang, ConfirmedStrings> = {
  es: {
    title: "Reserva confirmada | Cuban Trip Experience",
    hero: "Reserva recibida",
    heading: "¡Gracias! Recibimos tu reserva",
    intro:
      "Tu solicitud ya está registrada. Nuestro equipo la revisará y se pondrá en contacto contigo para confirmar los detalles.",
    referenceLabel: "Tu número de reserva",
    noEmail:
      "No pudimos enviarte el correo de confirmación, pero tus datos están registrados. Guarda este número.",
    emailSent: "Te enviamos una copia de estos datos por correo.",
    reviewNote:
      "Las reservas se revisan manualmente. Si necesitas cambiar algo, escríbenos por WhatsApp al +53 5378 8250 indicando tu número de reserva.",
    backHome: "Volver al inicio",
    seeDestinations: "Ver destinos",
    missing: "No encontramos ninguna reserva en este enlace.",
    missingCta: "Hacer una reserva",
  },
  en: {
    title: "Booking confirmed | Cuban Trip Experience",
    hero: "Booking received",
    heading: "Thank you! We have your booking",
    intro:
      "Your request is on file. Our team will review it and get in touch to confirm the details.",
    referenceLabel: "Your booking number",
    noEmail:
      "We could not send your confirmation email, but your details are on file. Please keep this number.",
    emailSent: "We have emailed you a copy of these details.",
    reviewNote:
      "Bookings are reviewed by hand. If you need to change anything, message us on WhatsApp at +53 5378 8250 quoting your booking number.",
    backHome: "Back to home",
    seeDestinations: "See destinations",
    missing: "We could not find a booking behind this link.",
    missingCta: "Make a booking",
  },
  ru: {
    title: "Бронирование подтверждено | Cuban Trip Experience",
    hero: "Заявка получена",
    heading: "Спасибо! Мы получили вашу заявку",
    intro:
      "Ваша заявка зарегистрирована. Наша команда рассмотрит её и свяжется с вами для подтверждения деталей.",
    referenceLabel: "Номер вашего бронирования",
    noEmail:
      "Нам не удалось отправить письмо с подтверждением, но ваши данные сохранены. Сохраните этот номер.",
    emailSent: "Копию этих данных мы отправили вам на почту.",
    reviewNote:
      "Заявки проверяются вручную. Если нужно что-то изменить, напишите нам в WhatsApp: +53 5378 8250, указав номер бронирования.",
    backHome: "На главную",
    seeDestinations: "Направления",
    missing: "По этой ссылке бронирование не найдено.",
    missingCta: "Забронировать",
  },
};
