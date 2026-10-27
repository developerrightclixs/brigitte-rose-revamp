<?php
/**
 * Customizer: site-wide text, contact details, shop settings and fonts.
 * Everything here is editable under Appearance → Customize → Brigitte Rose.
 *
 * @package BrigitteRose
 */

defined( 'ABSPATH' ) || exit;

/**
 * Default values for every theme option.
 */
function br_defaults() {
	return array(
		// Header.
		'announce_text'      => 'A portion of every order supports fire-relief efforts in Pacific Palisades & Altadena',
		'announce_link'      => '',
		// Contact.
		'contact_email'      => 'ex@domain.com',
		'contact_location'   => 'Pacific Palisades, California',
		'instagram_url'      => 'https://www.instagram.com/',
		// Newsletter band.
		'newsletter_enabled' => true,
		'newsletter_eyebrow' => 'Newsletter',
		'newsletter_title'   => 'Sign Up Here',
		'newsletter_text'    => 'Be first to hear about new sets, limited drops and the stories behind the sparkle.',
		// Footer.
		'footer_heading'     => 'Pacific Palisades, California',
		'footer_tagline'     => 'Bringing beauty and sparkle to everyday comfort.',
		'footer_art'         => '',
		'footer_credit'      => 'Design &amp; developed by <a href="https://premiumwebagency.com/" target="_blank" rel="noopener">Premium Web Agency</a>.',
		// Shop.
		'free_shipping'      => 150,
		'pdp_brand_line'     => 'Brigitte Rose · Debut Collection',
		'pdp_promo'          => 'A portion of proceeds supports the Los Angeles County Relief Fund for Palisades & Eaton fire relief.',
		'pdp_stock_line'     => 'In stock · Ships in 24–48 hours',
		'pdp_ship_title'     => 'Ship To You',
		'pdp_ship_text'      => 'Enjoy the convenience of shopping from home! Your favorite Brigitte Rose pieces will be carefully packaged and shipped directly to your doorstep, making your shopping experience simple and effortless.',
		'pdp_delivery_title' => 'Delivery',
		'pdp_delivery_note'  => '24–48 hours',
		'pdp_delivery_text'  => '24–48 hours, arriving at your doorstep.',
		'pdp_give_title'     => 'A Portion of Proceeds',
		'pdp_give_text'      => 'A portion of proceeds supports the Los Angeles County Relief Fund for Palisades & Eaton fire relief.',
		'pdp_designed_in'    => 'Designed in Pacific Palisades, California',
		'pdp_returns'        => 'Orders ship within 24–48 hours. Complimentary standard shipping on orders over {free_shipping}; express delivery available at checkout.',
		'pdp_returns_2'      => 'Not completely happy? Contact us within 14 days of delivery for returns and exchanges.',
		'size_guide'         => "S | 4–6 | 34–35\" | 26–27\" | 36–37\"\nM | 8–10 | 36–37\" | 28–29\" | 38–39\"\nL | 12–14 | 38–40\" | 30–32\" | 40–42\"",
		'size_guide_note'    => 'Standard US sizing. Between sizes? We suggest sizing up for a looser, lounge-ready fit.',
		// Fonts (Google Fonts URL or a self-hosted family name).
		'font_display'       => 'MADE Saonara',
		'font_para'          => 'https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,400;0,500;0,600;1,400&display=swap',
		'font_label'         => 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500&display=swap',
		'font_script'        => 'https://fonts.googleapis.com/css2?family=Parisienne&display=swap',
		'font_ui'            => 'https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap',
	);
}

/**
 * Read a theme option with its default.
 */
function br_opt( $key ) {
	$defaults = br_defaults();
	$default  = isset( $defaults[ $key ] ) ? $defaults[ $key ] : '';
	return get_theme_mod( 'br_' . $key, $default );
}

add_action( 'customize_register', function ( WP_Customize_Manager $wp ) {
	$wp->add_panel( 'br_panel', array(
		'title'    => __( 'Brigitte Rose', 'brigitte-rose' ),
		'priority' => 25,
	) );

	$sections = array(
		'br_header'     => __( 'Announcement bar', 'brigitte-rose' ),
		'br_contact'    => __( 'Contact details', 'brigitte-rose' ),
		'br_newsletter' => __( 'Newsletter band', 'brigitte-rose' ),
		'br_footer'     => __( 'Footer', 'brigitte-rose' ),
		'br_shop'       => __( 'Shop & product page', 'brigitte-rose' ),
		'br_fonts'      => __( 'Fonts', 'brigitte-rose' ),
	);
	foreach ( $sections as $id => $title ) {
		$wp->add_section( $id, array( 'title' => $title, 'panel' => 'br_panel' ) );
	}

	$fields = array(
		array( 'announce_text', 'br_header', __( 'Announcement text', 'brigitte-rose' ), 'text' ),
		array( 'announce_link', 'br_header', __( 'Announcement link (optional)', 'brigitte-rose' ), 'url' ),

		array( 'contact_email', 'br_contact', __( 'Email', 'brigitte-rose' ), 'email' ),
		array( 'contact_location', 'br_contact', __( 'Location', 'brigitte-rose' ), 'text' ),
		array( 'instagram_url', 'br_contact', __( 'Instagram URL', 'brigitte-rose' ), 'url' ),

		array( 'newsletter_enabled', 'br_newsletter', __( 'Show the newsletter band above the footer', 'brigitte-rose' ), 'checkbox' ),
		array( 'newsletter_eyebrow', 'br_newsletter', __( 'Eyebrow', 'brigitte-rose' ), 'text' ),
		array( 'newsletter_title', 'br_newsletter', __( 'Heading', 'brigitte-rose' ), 'text' ),
		array( 'newsletter_text', 'br_newsletter', __( 'Text', 'brigitte-rose' ), 'textarea' ),

		array( 'footer_heading', 'br_footer', __( 'Script heading', 'brigitte-rose' ), 'text' ),
		array( 'footer_tagline', 'br_footer', __( 'Tagline', 'brigitte-rose' ), 'textarea' ),
		array( 'footer_credit', 'br_footer', __( 'Credit line (HTML allowed)', 'brigitte-rose' ), 'textarea' ),

		array( 'free_shipping', 'br_shop', __( 'Free shipping threshold (store currency). Match it to your WooCommerce Free Shipping minimum.', 'brigitte-rose' ), 'number' ),
		array( 'pdp_brand_line', 'br_shop', __( 'Line above product name', 'brigitte-rose' ), 'text' ),
		array( 'pdp_promo', 'br_shop', __( 'Line below price', 'brigitte-rose' ), 'textarea' ),
		array( 'pdp_stock_line', 'br_shop', __( 'Stock line', 'brigitte-rose' ), 'text' ),
		array( 'pdp_ship_title', 'br_shop', __( 'Tab 1 title', 'brigitte-rose' ), 'text' ),
		array( 'pdp_ship_text', 'br_shop', __( 'Tab 1 text', 'brigitte-rose' ), 'textarea' ),
		array( 'pdp_delivery_title', 'br_shop', __( 'Tab 2 title', 'brigitte-rose' ), 'text' ),
		array( 'pdp_delivery_note', 'br_shop', __( 'Tab 2 highlight', 'brigitte-rose' ), 'text' ),
		array( 'pdp_delivery_text', 'br_shop', __( 'Tab 2 text', 'brigitte-rose' ), 'textarea' ),
		array( 'pdp_give_title', 'br_shop', __( 'Tab 3 title', 'brigitte-rose' ), 'text' ),
		array( 'pdp_give_text', 'br_shop', __( 'Tab 3 text', 'brigitte-rose' ), 'textarea' ),
		array( 'pdp_designed_in', 'br_shop', __( 'Last line of the Details list', 'brigitte-rose' ), 'text' ),
		array( 'pdp_returns', 'br_shop', __( 'Shipping & Returns paragraph 1 ({free_shipping} = threshold)', 'brigitte-rose' ), 'textarea' ),
		array( 'pdp_returns_2', 'br_shop', __( 'Shipping & Returns paragraph 2', 'brigitte-rose' ), 'textarea' ),
		array( 'size_guide', 'br_shop', __( 'Size guide rows: Size | US | Bust | Waist | Hips (one row per line)', 'brigitte-rose' ), 'textarea' ),
		array( 'size_guide_note', 'br_shop', __( 'Size guide note', 'brigitte-rose' ), 'textarea' ),

		array( 'font_display', 'br_fonts', __( 'Headings', 'brigitte-rose' ), 'text' ),
		array( 'font_para', 'br_fonts', __( 'Paragraphs', 'brigitte-rose' ), 'text' ),
		array( 'font_label', 'br_fonts', __( 'Labels & buttons', 'brigitte-rose' ), 'text' ),
		array( 'font_script', 'br_fonts', __( 'Script accent', 'brigitte-rose' ), 'text' ),
		array( 'font_ui', 'br_fonts', __( 'Navigation, prices & forms', 'brigitte-rose' ), 'text' ),
	);

	$defaults = br_defaults();
	foreach ( $fields as $f ) {
		list( $key, $section, $label, $type ) = $f;
		$sanitize = array(
			'url'      => 'esc_url_raw',
			'email'    => 'sanitize_email',
			'number'   => 'absint',
			'checkbox' => 'rest_sanitize_boolean',
			'textarea' => 'wp_kses_post',
		);
		$wp->add_setting( 'br_' . $key, array(
			'default'           => $defaults[ $key ],
			'sanitize_callback' => isset( $sanitize[ $type ] ) ? $sanitize[ $type ] : 'sanitize_text_field',
			'transport'         => 'refresh',
		) );
		$args = array( 'label' => $label, 'section' => $section, 'type' => $type );
		if ( 'br_fonts' === $section ) {
			$args['description'] = __( 'Paste a Google Fonts URL (from the font\'s "Get embed code" page) or the name of a self-hosted family.', 'brigitte-rose' );
		}
		$wp->add_control( 'br_' . $key, $args );
	}

	$wp->add_setting( 'br_footer_art', array( 'default' => '', 'sanitize_callback' => 'absint' ) );
	$wp->add_control( new WP_Customize_Media_Control( $wp, 'br_footer_art', array(
		'label'     => __( 'Footer wordmark image', 'brigitte-rose' ),
		'section'   => 'br_footer',
		'mime_type' => 'image',
	) ) );
} );

/**
 * Size guide rows parsed from the textarea option.
 */
function br_size_guide() {
	$rows = array();
	foreach ( preg_split( '/\r\n|\r|\n/', (string) br_opt( 'size_guide' ) ) as $line ) {
		$cells = array_map( 'trim', explode( '|', $line ) );
		if ( count( $cells ) >= 2 && '' !== $cells[0] ) {
			$rows[] = array(
				'size'  => $cells[0],
				'us'    => isset( $cells[1] ) ? $cells[1] : '',
				'bust'  => isset( $cells[2] ) ? $cells[2] : '',
				'waist' => isset( $cells[3] ) ? $cells[3] : '',
				'hips'  => isset( $cells[4] ) ? $cells[4] : '',
			);
		}
	}
	return $rows;
}
