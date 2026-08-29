/**
 * Validation copy for the booking form.
 *
 * Kept out of `src/data/booking-form.ts`: that file is generated from Fluent
 * Forms by `reference/tools/gen-booking-form.py` and would lose anything written
 * into it by hand. These messages are ours — the source form has no client-side
 * validation to copy.
 */
import type { SiteLang } from "./site";

export type FormMessages = {
  /** Shown when a required field is simply empty. */
  incomplete: string;
  datePast: string;
  email: string;
  phone: string;
  /** While the request is in flight. */
  sending: string;
  /** Nothing was filed — the visitor has lost nothing by trying again. */
  failure: string;
};

export const FORM_MESSAGES: Record<SiteLang, FormMessages> = {
  es: {
    incomplete: "Completa los campos marcados para continuar.",
    datePast: "Elige una fecha a partir de hoy.",
    email: "Escribe un correo válido, por ejemplo nombre@dominio.com.",
    phone: "Escribe un número de teléfono válido, solo dígitos.",
    sending: "Enviando tu reserva…",
    failure:
      "No pudimos registrar tu reserva. Vuelve a intentarlo, o escríbenos por WhatsApp al +53 5378 8250.",
  },
  en: {
    incomplete: "Fill in the highlighted fields to continue.",
    datePast: "Choose a date from today onwards.",
    email: "Enter a valid email address, for example name@domain.com.",
    phone: "Enter a valid phone number, digits only.",
    sending: "Sending your booking…",
    failure:
      "We could not register your booking. Please try again, or message us on WhatsApp at +53 5378 8250.",
  },
  ru: {
    incomplete: "Заполните отмеченные поля, чтобы продолжить.",
    datePast: "Выберите дату начиная с сегодняшнего дня.",
    email: "Введите корректный адрес электронной почты, например name@domain.com.",
    phone: "Введите корректный номер телефона, только цифры.",
    sending: "Отправляем вашу заявку…",
    failure:
      "Не удалось оформить заявку. Попробуйте ещё раз или напишите нам в WhatsApp: +53 5378 8250.",
  },
};
