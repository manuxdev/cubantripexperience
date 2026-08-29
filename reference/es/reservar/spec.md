# Reservar

- **Origen:** http://localhost:8080/reservar/
- **Fuente:** `_elementor_data` (Elementor + Astra + Polylang)
- **Capturas:** `desktop.png` (1440) · `tablet.png` (768) · `mobile.png` (390)
- **Breakpoints Elementor:** tablet <1025px · mobile <768px

> Los sufijos `_tablet` / `_mobile` en `_style_` son overrides de ese breakpoint.


### Section 1

- **section**
  - _style_: background_background=classic; background_image=http://localhost:8080/wp-content/uploads/2023/07/cover-image-about-cuba-for-a-trav-01.webp; background_overlay_background=classic; background_overlay_color=#503607; background_position=bottom center; background_position_mobile=bottom center; background_position_tablet=center right; background_repeat=no-repeat; background_size=cover; content_position=middle; custom_height=328px; custom_height_mobile=213px; height=min-height; layout=full_width
  - **column [100%]**
    - _style_: _column_size=100; _inline_size=100; align_tablet=center; content_position_tablet=center
    - **widget:heading**
      - `title`: Reservar
      - _style_: _margin_mobile=80px 0px 0px 0px; align=center; title_color=#FFFFFF; typography_font_family=Poppins; typography_font_size=47px; typography_font_size_mobile=24px; typography_font_size_tablet=45px; typography_font_weight=600; typography_typography=custom
    - **widget:spacer**
      - _style_: hide_desktop=hidden-desktop; space=10px

### Section 2

- **section**
  - _style_: background_background=classic; background_color=#FFFFFF00; margin=-76px 0px 0px 0px; margin_mobile=-60px 0px 0px 0px; padding_mobile=0px 0px 0px 0px; sticky=top
  - **column [100%]**
    - _style_: _column_size=100; align=center; align_mobile=space-between; animation=fadeInUp; background_background=gradient; background_color=#3F3F3FCF; background_color_b=#5F5F5F; background_color_stop=43%; border_radius=08px 08px 08px 08px; box_shadow_box_shadow={"horizontal": 3, "vertical": 4, "blur": 10, "spread": 0, "color": "rgba(0,0,0,0.5)"}; box_shadow_box_shadow_type=yes; content_position=center; content_position_mobile=top
    - **widget:nav-menu**
      - _style_: _element_width=auto; _element_width_mobile=auto; _margin_mobile=0px 0px 0px 0px; _padding_mobile=0px 0px 0px 0px; align_items=left; animation_line=slide; background_color_dropdown_item=#DADADA; color_menu_item=#FFFFFF; color_menu_item_active=#CFC725; color_menu_item_hover=#CFC725; dropdown_border_radius=0px 0px 10px 10px; dropdown_typography_font_family=Poppins; dropdown_typography_font_weight=500; dropdown_typography_text_decoration=none; dropdown_typography_typography=custom; full_width=stretch; menu_typography_font_family=Poppins; menu_typography_font_weight=600; menu_typography_text_decoration=none; menu_typography_typography=custom; padding_horizontal_menu_item=13px; padding_vertical_menu_item=2px; pointer_color_menu_item_active=#CFC725; pointer_color_menu_item_hover=#CFC725; pointer_width=2px; sticky=top; sticky_offset=1; toggle_align=left; toggle_color=#C3C96D; toggle_color_hover=#CBDA1FB5
    - **widget:polylang-language-switcher**
      - _style_: _element_vertical_align_mobile=center; _element_width=auto; _margin=0px 0px 0px 40px; _margin_mobile=0px 0px 0px 0px; align_items=left; color_menu_item=#F5F5F5; color_menu_item_hover=#E3EBE4; dropdown_icon_indent=12px; layout=dropdown; padding_horizontal_menu_item=5px; padding_vertical_menu_item=1px

### Section 3

- **section**
  - **column [100%]**
    - _style_: _column_size=100
    - **widget:spacer**
      - _style_: space=10px

### Section 4

- **section**
  - **column [100%]**
    - _style_: _column_size=100
    - **widget:heading**
      - `title`: ¿Cómo funciona?
      - _style_: align=center; title_color=#000000; typography_font_family=Poppins; typography_font_weight=600; typography_typography=custom

### Section 5

- **section**
  - _style_: content_width=604px
  - **column [100%]**
    - _style_: _column_size=100; _inline_size=100
    - **widget:tabs**
      - `tabs` (4 items):
        1. tab_content=Seleccione el tipo de vehículo a solicitar, entre estos vehículos se encuentran:Estándar: De 1 a 4 PersonasVans: Para grupos de 4 a 9 Clásico: De 1 a 4 personas; tab_title=Servicios
        2. tab_content=Seleccione el día y la hora en que ocupará la reserva del vehículo. - Puede elegir el formato de la fecha.; tab_title=Fecha
        3. tab_content=Ingrese su nombre y apellido, así como su correo electrónico, número de teléfono y seleccione su país de procedencia. Selecciona la cantidad de personas que viajarán con usted así como la ubicación de recogida. Si selecciona el campo "Aeoropuerto" deberá introducir su número de vuelo y seleccionar el aeropuerto donde lo recibiremos. De seleccionar el campo "Otro" deberá intruducir la dirección de recogida.; tab_title=Opciones
        4. tab_content=Una vez realizada la reserva, aparecerá un mensaje de agradecimiento y su reserva pasará a estado pendiente. Usted recibira un correo con los datos de su reserva, guárdelo bien ya que esta es la comprobación de su reserva. Su reserva será revisada por nuestros operadores y nos pondremos en contacto con usted vía WhatsApp o correo electrónico para confirmar su reserva.; tab_title=Confirmación
      - _style_: background_color=#F8F7F7; border_color=#FFE684; border_width=3px; tab_active_color=#3A3937; tab_color=#F8CA46

### Section 6

- **section**
  - **column [100%]**
    - _style_: _column_size=100
    - **widget:spacer**

### Section 7

- **section**
  - _style_: content_width=810px
  - **column [100%]**
    - _style_: _column_size=100
    - **widget:fluent-form-widget**
      - _style_: form_container_border_border=solid; form_container_border_color=#0201012B; form_container_border_radius=8px 8px 8px 8px; form_container_border_width=1px 1px 1px 1px; form_container_box_shadow_box_shadow={"horizontal": 8, "vertical": 6, "blur": 10, "spread": 0, "color": "rgba(0, 0, 0, 0.33)"}; form_container_box_shadow_box_shadow_type=yes; form_container_padding=40px 40px 40px 40px; form_field_radius=10px 10px 10px 10px; form_field_typography_typography=custom; form_success_message_border_border=none; form_title_margin=0px 0px 30px 0px; heading_alignment=left; input_alignment=left

### Section 8

- **section**
  - **column [100%]**
    - _style_: _column_size=100
    - **widget:spacer**

### Section 9

- **section**
  - **column [100%]**
    - _style_: _column_size=100
    - **widget:heading**
      - `title`: Más Información:
      - _style_: _margin=10px 0px 0px 0px; title_color=#1A1B1B; typography_font_family=Poppins; typography_font_size=20px; typography_font_weight=600; typography_typography=custom

### Section 10

- **section**
  - _style_: content_width=1132px
  - **column [100%]**
    - _style_: _column_size=100
    - **widget:text-editor**
      - `editor`: Si tiene algún problema o necesita cancelar o modificar su reserva, no dude en ponerse en contacto con nosotros y estaremos encantados de ayudarle. Nuestra misión es brindar un servicio de taxi seguro, confiable y conveniente a nuestros clientes, y siempre estamos disponibles para responder cualquier pregunta o inquietud que pueda tener. ¡Gracias por elegir nuestro sitio web de reserva de taxis!
      - _style_: _element_custom_width=96.031%; _element_custom_width_mobile=274.984px; _element_width_mobile=inherit; align=left; align_mobile=left; typography_font_family=Poppins; typography_font_weight=400; typography_typography=custom
    - **widget:button**
      - `text`: Contáctanos
      - _style_: _margin=0px 0px 0px 0px; _padding=0px 0px 0px 0px; background_color=#CECC6100; button_background_hover_color=#E6AE3200; button_text_color=#070606; hover_color=#ECC21D; icon_align=right; link=http://localhost:8080/contactos; selected_icon={"value": "fas fa-angle-right", "library": "fa-solid"}; text_padding=0px 0px 0px 0px; typography_font_family=Poppins; typography_font_size=15px; typography_font_weight=500; typography_typography=custom
    - **widget:spacer**
      - _style_: space=68px

### Section 11

- **section**
  - _style_: background_background=classic; background_color=#F2EDED
  - **column [9.208%]**
    - _style_: _column_size=33; _inline_size=9.208; _inline_size_mobile=20; _inline_size_tablet=35; align=flex-start; content_position=center
    - **widget:image**
      - _style_: _element_custom_width=7%; image=http://localhost:8080/wp-content/uploads/2023/07/my-project-1-5-removebg-preview-e1689543311722.webp
  - **column [57.124%]**
    - _style_: _column_size=33; _inline_size=57.124; _inline_size_mobile=80; align_mobile=flex-start; content_position=center; space_between_widgets=7
    - **widget:heading**
      - `title`: © 2023 CubanTripExperience | Todos los derechos reservados.
      - _style_: align=left; header_size=p; title_color=#414141; typography_font_family=Poppins; typography_font_size=12px; typography_font_weight=400; typography_typography=custom
    - **widget:navigation-menu**
      - _style_: _element_custom_width=71.604%; _element_custom_width_mobile=263.118px; _element_custom_width_tablet=223.328px; _element_vertical_align=center; _element_width=auto; _element_width_mobile=initial; _element_width_tablet=initial; _margin=0px 0px 0px 0px; _padding=0px 0px 0px 0px; color_menu_item=#313131; color_menu_item_active=#5F5E5C; color_menu_item_hover=#5F5E5C; menu_space_between_mobile=0px; menu_typography_font_family=Poppins; menu_typography_font_size=17px; menu_typography_font_size_mobile=13px; menu_typography_font_weight=600; menu_typography_text_decoration=underline; menu_typography_typography=custom; padding_horizontal_menu_item=7px; padding_vertical_menu_item=1px; padding_vertical_menu_item_mobile=6px; submenu_animation=slide_up
  - **column [33%]**
    - _style_: _column_size=33; align_mobile=flex-start; content_position=center; content_position_mobile=center
    - **widget:social-icons**
      - `social_icon_list` (4 items):
        1. link=mailto:cubantripexperience@gmail.com; social_icon={"value": "fas fa-envelope", "library": "fa-solid"}
        2. link=https://www.facebook.com/profile.php?id=61551441593993; social_icon={"value": "fab fa-facebook", "library": "fa-brands"}
        3. link=https://www.instagram.com/cubantripexperience/; social_icon={"value": "fab fa-instagram", "library": "fa-brands"}
        4. link=https://wa.me/+5353788250/; social_icon={"value": "fab fa-whatsapp", "library": "fa-brands"}
      - _style_: _margin_mobile=0px 0px 0px 10px; align_mobile=left; hover_animation=pulse; hover_secondary_color=#DFCB13; icon_color=custom; icon_padding=0em; icon_primary_color=#48343400; icon_secondary_color=#F5E234; icon_size=38px; icon_size_mobile=31px; icon_size_tablet=28px; icon_spacing=16px
