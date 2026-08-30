/**
 * Contact-page copy for the three editions, read out of each page's Elementor
 * JSON by `reference/tools/gen-contact.py`. The layout is identical across all
 * three — compared node by node — so only these strings differ.
 *
 * The leading spaces in the Russian headings are the source's own.
 */
import type { SiteLang } from "../i18n/site";

export type ContactContent = {
  title: string;
  hero: string;
  /** Heading over the desktop form column. */
  formHeading: string;
  /** The mobile column authors its own, differently cased. */
  formHeadingMobile: string;
  helpHeading: string;
  /** Verbatim `text-editor` HTML. */
  body: string;
  form: {
    name: string;
    email: string;
    message: string;
    submit: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
  };
};

export const CONTACT: Record<SiteLang, ContactContent> = {
  es: {
    title: "Contactos | Cuban Trip Experience",
    hero: "Contactos",
    formHeading: "Envianos un mensaje",
    helpHeading: "Estamos aquí para ayudarte",
    formHeadingMobile: "Envíanos un mensaje",
    body: "<p>Si tiene alguna pregunta, comentario o sugerencia, no dude en ponerse en contacto con nosotros. Aquí encontrarás toda la información que necesitas para contactar con nosotros:</p><p><strong>Correo electrónico:</strong> <span style=\"color: #800000;\">support@cubantripexperience.com</span></p><p><strong>Whatsapp: </strong><span style=\"color: #800000;\">+53 53788250</span></p><p><strong>Redes Sociales:</strong> Síguenos en nuestras redes sociales para estar al tanto de nuestras últimas novedades y promociones. Puedes encontrarnos en <a href=\"http://tripadvisor.es\">Trip Advisor</a>, <a href=\"http://facebook.com\">Facebook</a> e <a href=\"http://instagram.com\">Instagram</a>.</p>",
    form: {
      name: "Nombre",
      email: "Correo",
      message: "Mensaje",
      submit: "Enviar",
      nameLabel: "Nombre",
      emailLabel: "Correo",
      messageLabel: "Your Message",
    },
  },
  en: {
    title: "Contact us | Cuban Trip Experience",
    hero: "Contact Us",
    formHeading: "Send a message",
    helpHeading: "We are here to help you",
    formHeadingMobile: "Send a message",
    body: "<p>If you have any questions, comments or suggestions, please do not hesitate and contact us. Here you will find all the information you need to contact us:</p><p><strong>Email:</strong> <span style=\"color: #800000;\">support@cubantripexperience.com</span></p><p><strong>Whatsapp:</strong> <span style=\"color: #800000;\">+53 53788250</span></p><p><strong>Social Networks:</strong> Follow us on our social networks to be aware of our latest news and promotions. You can find us on <a href=\"http://tripadvisor.es\">Trip Advisor</a>, <a href=\"http://facebook.com\">Facebook</a> and <a href=\"http://instagram.com\">Instagram</a>.</p>",
    form: {
      name: "First Name",
      email: "Email Address",
      message: "Your Message",
      submit: "Submit",
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Your Message",
    },
  },
  ru: {
    title: "Контакты | Cuban Trip Experience",
    hero: "\nКонтакты",
    formHeading: "Отправьте нам сообщение",
    helpHeading: "\nМы здесь чтобы помочь вам",
    formHeadingMobile: "отправить нам сообщение",
    body: "<p>Если у вас есть какие-либо вопросы, комментарии или предложения, пожалуйста, не стесняйтесь обращаться к нам. Здесь вы найдете всю необходимую информацию для связи с нами:</p><p><strong>Электронная почта:</strong> <span style=\"color: #800000;\">support@cubantripexperience.com</span></p><p><strong>WhatsApp:</strong> <span style=\"color: #800000;\">+53 53788250</span></p><p><strong>Социальные сети:</strong> следите за нами в социальных сетях, чтобы быть в курсе наших последних новостей и рекламных акций. Вы можете найти нас в <a href=\"http://tripadvisor.es\">Trip Advisor</a>, <a href=\"http://facebook.com\">Facebook</a> и <a href=\"http://instagram.com\">Instagram.</a></p>",
    form: {
      name: "Имя",
      email: " Почта",
      message: "Менсаже",
      submit: "Отправлять",
      nameLabel: "Nombre",
      emailLabel: "Correo",
      messageLabel: "Mensaje",
    },
  },
};
