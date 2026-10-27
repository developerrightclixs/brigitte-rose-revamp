<?php
/**
 * Brigitte Rose theme bootstrap.
 *
 * @package BrigitteRose
 */

defined( 'ABSPATH' ) || exit;

define( 'BR_VERSION', '1.0.0' );
define( 'BR_DIR', get_template_directory() );
define( 'BR_URI', get_template_directory_uri() );

require BR_DIR . '/inc/setup.php';
require BR_DIR . '/inc/template-tags.php';
require BR_DIR . '/inc/customizer.php';
require BR_DIR . '/inc/assets.php';
require BR_DIR . '/inc/ajax.php';
require BR_DIR . '/inc/admin.php';

if ( class_exists( 'WooCommerce' ) ) {
	require BR_DIR . '/inc/woocommerce.php';
	require BR_DIR . '/inc/product-meta.php';
}

require BR_DIR . '/inc/elementor/loader.php';
require BR_DIR . '/inc/importer.php';
