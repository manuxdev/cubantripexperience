# Servicios

- **Origen:** http://localhost:8080/servicios/
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
      - `title`: Servicios
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
    - **widget:button**
      - `text`: Reservar
      - _style_: _element_width=auto; _margin=0px 0px 0px 20px; _margin_mobile=0px 0px 0px 0px; align=center; background_color=#F8F43D85; button_background_hover_color=#F8F43DCC; button_text_color=#FFFFFF; hover_color=#000000; link=http://localhost:8080/reservar; text_shadow_text_shadow_type=yes
    - **widget:polylang-language-switcher**
      - _style_: _element_vertical_align_mobile=center; _element_width=auto; _margin=0px 0px 0px 40px; _margin_mobile=0px 0px 0px 0px; align_items=left; color_menu_item=#F5F5F5; color_menu_item_hover=#E3EBE4; dropdown_icon_indent=12px; layout=dropdown; padding_horizontal_menu_item=5px; padding_vertical_menu_item=1px

### Section 3

- **section**
  - _style_: background_background=gradient; background_color=#E3F4F570; background_color_b=#67B3E8; background_color_stop=43%; background_gradient_position=bottom right
  - **column [100%]**
    - _style_: _column_size=100
    - **widget:spacer**
      - _style_: space=27px
    - **section**
      - **column [100%]**
        - _style_: _column_size=100
        - **widget:heading**
          - `title`: Tipos de Vehículos
          - _style_: align=center; title_color=#000000; typography_font_family=Poppins; typography_font_size=38px; typography_font_size_mobile=31px; typography_font_weight=600; typography_typography=custom
    - **section**
      - _style_: content_position=middle; content_width=500px; gap=narrow
      - **column [100%]**
        - _style_: _column_size=100; _inline_size_mobile=100; align=space-around; align_mobile=space-around; content_position=center; content_position_mobile=center
        - **widget:button**
          - `text`: Estándar
          - _style_: _element_width=auto; _element_width_mobile=auto; _margin_mobile=0px 0px 0px 0px; _margin_tablet=0px 10px 0px 0px; align=left; align_mobile=left; background_color=#61CE7000; border_border=solid; border_color=#F8F43D; border_radius=7px 7px 7px 7px; border_width=1px 1px 1px 1px; border_width_mobile=03px 03px 03px 03px; button_background_hover_color=#F8F43DED; button_box_shadow_box_shadow={"horizontal": 4, "vertical": 2, "blur": 7, "spread": 0, "color": "rgba(0,0,0,0.5)"}; button_hover_border_color=#02010100; button_text_color=#000000; hover_color=#000000; link=#servicio; text_padding_mobile=10px 03px 10px 0px
        - **widget:button**
          - `text`: Van
          - _style_: _element_width=auto; _element_width_mobile=auto; _margin_mobile=0px 0px 0px 0px; _margin_tablet=0px 10px 0px 0px; align=left; align_mobile=left; background_color=#61CE7000; border_border=solid; border_color=#F8F43D; border_radius=7px 7px 7px 7px; border_width=1px 1px 1px 1px; border_width_mobile=03px 03px 03px 03px; button_background_hover_color=#F8F43DED; button_box_shadow_box_shadow={"horizontal": 4, "vertical": 2, "blur": 7, "spread": 0, "color": "rgba(0,0,0,0.5)"}; button_hover_border_color=#02010100; button_text_color=#000000; hover_color=#000000; link=#servicio; text_padding_mobile=10px 20px 10px 20px
        - **widget:button**
          - `text`: Clásico
          - _style_: _element_width=auto; _element_width_mobile=auto; _margin_mobile=0px 0px 0px 0px; _margin_tablet=0px 10px 0px 0px; align=left; align_mobile=left; background_color=#61CE7000; border_border=solid; border_color=#F8F43D; border_radius=7px 7px 7px 7px; border_width=1px 1px 1px 1px; border_width_mobile=03px 03px 03px 03px; button_background_hover_color=#F8F43DED; button_box_shadow_box_shadow={"horizontal": 4, "vertical": 2, "blur": 7, "spread": 0, "color": "rgba(0,0,0,0.5)"}; button_hover_border_color=#02010100; button_text_color=#000000; hover_color=#000000; link=#servicio; text_padding_mobile=10px 10px 10px 10px
    - **section**
      - _style_: background_color=#FDF2F2; background_color_b=#272727; background_color_b_stop=79%
      - **column [50%]**
        - _style_: _column_size=50; margin=20px 0px 0px 0px; margin_mobile=0px 0px 0px 0px
        - **widget:icon-box**
          - `description_text`: Descubre la comodidad y eficiencia de nuestro taxi estándar de 4 puertas. Perfecto para viajes cortos en la ciudad o para traslados al aeropuerto. Disfrute de un viaje seguro y cómodo con nuestra flota de taxis modernos y bien mantenidos.
          - `title_text`: Estándar
          - _style_: _animation_mobile=none; _margin=0px 0px 0px 0px; _margin_mobile=20px 0px 0px 0px; description_color=#000000; description_typography_font_family=Poppins; description_typography_font_size_mobile=13px; description_typography_font_weight=400; description_typography_typography=custom; hover_secondary_color=#FFFFFF; icon_padding=16px; icon_padding_mobile=16px; icon_size=38px; icon_size_mobile=31px; icon_space=5px; primary_color=#F8F43D; selected_icon={"value": "fas fa-bolt", "library": "fa-solid"}; title_color=#272722; title_typography_font_family=Poppins; title_typography_font_size_mobile=20px; title_typography_font_weight=600; title_typography_typography=custom
        - **widget:icon-box**
          - `description_text`: ¿Viajas en grupo? Nuestro taxi van es ideal para ti. Con capacidad para hasta 9 pasajeros, es perfecto para excursiones familiares o de negocios. Disfruta de un viaje amplio y cómodo con nuestro servicio de taxi van.
          - `title_text`: Van
          - _style_: _animation_mobile=none; _margin=0px 0px 0px 0px; _margin_mobile=20px 0px 0px 0px; description_color=#000000; description_typography_font_family=Poppins; description_typography_font_size_mobile=13px; description_typography_font_weight=400; description_typography_typography=custom; hover_secondary_color=#FFFFFF; icon_padding=16px; icon_padding_mobile=16px; icon_size=38px; icon_size_mobile=31px; icon_space=5px; primary_color=#F8F43D; selected_icon={"value": "fas fa-bus-alt", "library": "fa-solid"}; title_color=#272722; title_typography_font_family=Poppins; title_typography_font_size_mobile=20px; title_typography_font_weight=600; title_typography_typography=custom
        - **widget:icon-box**
          - `description_text`: ¿Quieres vivir el encanto de Cuba de una manera única? Nuestro taxi clásico es perfecto para ti. Viaje en un auto antiguo restaurado y acondicionado para turismo. Descubre la historia y la belleza de Cuba en un viaje inolvidable en nuestro taxi clásico.
          - `title_text`: Clásico
          - _style_: _animation_mobile=none; _margin=0px 0px 0px 0px; _margin_mobile=20px 0px 0px 0px; description_color=#000000; description_typography_font_family=Poppins; description_typography_font_size_mobile=13px; description_typography_font_weight=400; description_typography_typography=custom; hover_secondary_color=#FFFFFF; icon_padding=16px; icon_padding_mobile=16px; icon_size=38px; icon_size_mobile=31px; icon_space=5px; primary_color=#F8F43D; title_color=#272722; title_typography_font_family=Poppins; title_typography_font_size_mobile=20px; title_typography_font_weight=600; title_typography_typography=custom
        - **widget:html**
          - `html`: var $ = jQuery $(document).ready(function(){ $('[data-show]').on('click', function(){ var showme = $(this).attr('data-show') $('.all-data').hide() $('#' + showme).show() }) })
      - **column [50%]**
        - _style_: _column_size=50
        - **widget:image**
          - _style_: _animation=fadeInRight; _animation_mobile=fadeInRight; _margin=0px 0px 0px 0px; _margin_mobile=-58px 0px 0px 0px; image=http://localhost:8080/wp-content/uploads/2023/07/replicate-prediction-v3yn5zbbaanuia5fq7u553zzw4-removebg-preview-2-e1689204954148.webp
        - **widget:image**
          - _style_: _animation=fadeInRight; _animation_mobile=fadeInRight; _margin=0px 0px 0px 0px; _margin_mobile=-30px 0px 0px 0px; image=http://localhost:8080/wp-content/uploads/2023/07/replicate-prediction-25fscjzb4ju557qmxo4mmzhbdy-removebg-preview-1-e1689205842131.webp
        - **widget:image**
          - _style_: _animation=fadeInRight; _animation_mobile=fadeInRight; _margin=0px 0px 20px 0px; _margin_mobile=-71px 0px 0px 0px; image=http://localhost:8080/wp-content/uploads/2023/07/Pink_Car_in_Havana_Cuba-removebg-preview-removebg-preview-1-e1689205010333.webp
        - **widget:html**
          - `html`: var $ = jQuery $(document).ready(function(){ $('[data-showme]').on('click', function(){ var showme = $(this).attr('data-showme') $('.all-images').hide() $('#' + showme).show() }) })
    - **widget:spacer**
      - _style_: space=35px; space_mobile=102px

### Section 4

- **section**
  - **column [100%]**
    - _style_: _column_size=100
    - **widget:spacer**
      - _style_: space=23px

### Section 5

- **section**
  - _style_: background_color=#BEBCBC; background_color_b=#F8F3F3
  - **column [100%]**
    - _style_: _column_size=100; align=space-around; background_color=#F0E9E9; background_color_b=#FFFFFF; content_position=center
    - **widget:heading**
      - `title`: TE LLEVAMOS A TIEMPO AL LUGAR CORRECTO
      - _style_: _element_custom_width=63.968%; _element_width=initial; _padding=30px 30px 30px 30px; align=left; title_color=#3A3A3A; typography_font_family=Poppins; typography_font_weight=600; typography_typography=custom
    - **widget:button**
      - `text`: RESERVA AHORA
      - _style_: _element_custom_width=33.701%; _element_width=initial; align=center; background_color=#F8F43DDB; button_background_hover_color=#F8F43D8C; button_text_color=#202020; hover_color=#000000; link=http://localhost:8080/reservar; text_padding=015px 20px 15px 20px

### Section 6

- **section**
  - **column [100%]**
    - _style_: _column_size=100
    - **widget:spacer**
      - _style_: space=10px
    - **widget:heading**
      - `title`: ¡Profesionalismo!
      - _style_: align=center; title_color=#F7CF1A

### Section 7

- **section**
  - **column [100%]**
    - _style_: _column_size=100
    - **section**
      - **column [50%]**
        - _style_: _column_size=50
        - **widget:text-editor**
          - `editor`: Nuestros conductores son verdaderos conocedores de su trabajo y estarán a su servicio para satisfacer sus necesidades de viajar a los sitios de historia, cultura y tradiciones que usted les solicite, permitiéndole cumplir su deseo de experimentar la esencia misma de la isla.
        - **widget:text-editor**
          - `editor`: Nuestros taxis están cuidadosamente mantenidos y equipados para brindar el máximo confort durante el viaje. Además, nuestros conductores son profesionales altamente capacitados que le ofrecerán un viaje seguro y tranquilo, garantizando la llegada a su destino sin preocupaciones.
      - **column [50%]**
        - _style_: _column_size=50
        - **widget:text-editor**
          - `editor`: Nos adaptamos a sus preferencias y necesidades, ofreciéndoles recomendaciones, música de su elección y un ambiente agradable dentro del vehículo, que le proporcionará la oportunidad de disfrutar, aprender y crear un vínculo con nuestro servicio perdurable y que estamos seguros que lo repetirá en cada visita a la isla.

### Section 8

- **section**
  - **column [100%]**
    - _style_: _column_size=100
    - **widget:spacer**
      - _style_: space=19px; space_mobile=32px

### Section 9

- **section**
  - _style_: background_background=classic; background_image=http://localhost:8080/wp-content/uploads/2023/07/replicate-prediction-ybhft4zbay5qwwbbnclzouhvxy-1024x559.webp; background_image_mobile=http://localhost:8080/wp-content/uploads/2023/07/replicate-prediction-ybhft4zbay5qwwbbnclzouhvxy.webp; background_overlay_background=gradient; background_overlay_color=#FCFCFC; background_overlay_color_b=#0C0205; background_overlay_color_stop=5%; background_position=initial; background_position_mobile=center center; background_repeat=no-repeat; background_size=initial; background_size_mobile=cover; background_ypos=-96px; background_ypos_mobile=48px; custom_height=292px; custom_height_mobile=216px; height=min-height; layout=full_width
  - **column [100%]**
    - _style_: _column_size=100; align=center; content_position=center
    - **widget:heading**
      - `title`: Descubre los mejores lugares de Cuba
      - _style_: align=center; title_color=#000000; typography_font_family=Poppins; typography_font_size=34px; typography_font_size_mobile=23px; typography_font_weight=700; typography_typography=custom
    - **widget:button**
      - `text`: DESTINOS
      - _style_: _element_width=auto; _margin=0px 0px 0px 0px; align=center; background_color=#61CE7000; hover_color=#E1E22F; icon_align=right; link=http://localhost:8080/destinos; selected_icon={"value": "far fa-compass", "library": "fa-regular"}; text_padding=0px 0px 0px 0px; typography_font_family=Poppins; typography_font_size=20px; typography_font_size_mobile=16px; typography_font_weight=500; typography_typography=custom

### Section 10

- **section**
  - **column [100%]**
    - _style_: _column_size=100
    - **widget:spacer**
      - _style_: space=94px

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
      - `title`: © 2023 CubanTripExperience | Todos los Derechos Reservados.
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
