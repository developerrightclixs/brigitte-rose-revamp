<?php
/**
 * Theme supports, menus, image sizes and plugin integration flags.
 *
 * @package BrigitteRose
 */

defined( 'ABSPATH' ) || exit;

add_action( 'after_setup_theme', function () {
	load_theme_textdomain( 'brigitte-rose', BR_DIR . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
	add_theme_support( 'custom-logo', array( 'height' => 120, 'width' => 120, 'flex-width' => true, 'flex-height' => true ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );

	add_theme_support( 'woocommerce', array(
		'thumbnail_image_width' => 640,
		'single_image_width'    => 1024,
	) );

	register_nav_menus( array(
		'primary'        => __( 'Primary (header + mobile menu)', 'brigitte-rose' ),
		'footer_explore' => __( 'Footer: Explore', 'brigitte-rose' ),
		'footer_care'    => __( 'Footer: Customer Care', 'brigitte-rose' ),
		'footer_legal'   => __( 'Footer: Bottom bar', 'brigitte-rose' ),
	) );

	// Product images are 2:3 portraits; gallery images keep their own ratio.
	add_image_size( 'br-product-sm', 640, 960, true );
	add_image_size( 'br-product-lg', 1024, 1536, true );
	add_image_size( 'br-gallery-sm', 800, 9999, false );
	add_image_size( 'br-gallery-lg', 1600, 1600, false );
} );

$GLOBALS['content_width'] = 1320;

/**
 * Elementor Pro Theme Builder: let header/footer/single/archive templates
 * replace the theme's own markup when the client builds them.
 */
add_action( 'elementor/theme/register_locations', function ( $manager ) {
	$manager->register_all_core_location();
} );

/**
 * Keep Elementor from overriding the theme's fonts and colours with its
 * defaults; the design system in styles.css is the source of truth.
 */
add_action( 'after_switch_theme', function () {
	update_option( 'elementor_disable_color_schemes', 'yes' );
	update_option( 'elementor_disable_typography_schemes', 'yes' );
	// Let Elementor work on pages and products out of the box.
	$cpt = (array) get_option( 'elementor_cpt_support', array( 'page', 'post' ) );
	update_option( 'elementor_cpt_support', array_values( array_unique( array_merge( $cpt, array( 'page', 'post' ) ) ) ) );
	flush_rewrite_rules();
} );

/** Body classes used by the stylesheet and scripts. */
add_filter( 'body_class', function ( $classes ) {
	if ( is_front_page() ) {
		$classes[] = 'page-index';
	}
	if ( function_exists( 'is_product' ) && is_product() ) {
		$classes[] = 'page-product';
	}
	if ( br_is_elementor_page() ) {
		$classes[] = 'br-elementor-page';
	}
	return $classes;
} );

/**
 * Is the current singular page built with Elementor?
 */
function br_is_elementor_page( $post_id = null ) {
	if ( ! did_action( 'elementor/loaded' ) ) {
		return false;
	}
	if ( ! $post_id ) {
		if ( ! is_singular() ) {
			return false;
		}
		$post_id = get_queried_object_id();
	}
	if ( ! $post_id ) {
		return false;
	}
	return (bool) get_post_meta( $post_id, '_elementor_edit_mode', true );
}

/** Admin notice when the required plugins are missing. */
add_action( 'admin_notices', function () {
	if ( ! current_user_can( 'install_plugins' ) ) {
		return;
	}
	$missing = array();
	if ( ! class_exists( 'WooCommerce' ) ) {
		$missing[] = 'WooCommerce';
	}
	if ( ! did_action( 'elementor/loaded' ) ) {
		$missing[] = 'Elementor';
	}
	if ( ! $missing ) {
		return;
	}
	printf(
		'<div class="notice notice-warning"><p><strong>Brigitte Rose:</strong> %s <a href="%s">%s</a></p></div>',
		esc_html( sprintf( __( 'This theme needs %s. Install and activate them, then run Appearance → Brigitte Rose Setup.', 'brigitte-rose' ), implode( ' & ', $missing ) ) ),
		esc_url( admin_url( 'plugin-install.php?s=' . rawurlencode( implode( ' ', $missing ) ) . '&tab=search&type=term' ) ),
		esc_html__( 'Install plugins', 'brigitte-rose' )
	);
} );

/** Favicon fallback: the lips mark, unless a Site Icon is set. */
add_action( 'wp_head', function () {
	if ( has_site_icon() ) {
		return;
	}
	$icon = esc_url( BR_URI . '/assets/img/lips.png' );
	echo '<link rel="icon" type="image/png" href="' . $icon . '">' . "\n";
	echo '<link rel="apple-touch-icon" href="' . $icon . '">' . "\n";
}, 2 );

add_action( 'wp_head', function () {
	echo '<meta name="theme-color" content="#c8102e">' . "\n";
}, 3 );
