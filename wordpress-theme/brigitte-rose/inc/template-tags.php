<?php
/**
 * Template helpers shared by templates, WooCommerce overrides and Elementor widgets.
 *
 * @package BrigitteRose
 */

defined( 'ABSPATH' ) || exit;

/**
 * Inline SVG icons (same set as the static site).
 */
function br_icon( $name ) {
	static $icons = null;
	if ( null === $icons ) {
		$s      = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
		$icons  = array(
			'heart'    => '<svg ' . $s . ' stroke-width="1.5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
			'bag'      => '<svg ' . $s . ' stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
			'close'    => '<svg ' . $s . ' stroke-width="1.5"><path d="M18 6 6 18M6 6l12 12"/></svg>',
			'menu'     => '<svg ' . $s . ' stroke-width="1.5"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
			'chevron'  => '<svg ' . $s . ' stroke-width="1.5"><path d="m9 6 6 6-6 6"/></svg>',
			'plus'     => '<svg ' . $s . ' stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>',
			'instagram'=> '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
			'mail'     => '<svg ' . $s . ' stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
			'phone'    => '<svg ' . $s . ' stroke-width="1.5"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
			'pin'      => '<svg ' . $s . ' stroke-width="1.5"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
			'alert'    => '<svg ' . $s . ' stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>',
			'search'   => '<svg ' . $s . ' stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
			// Value icons (stroke 1.3).
			'sparkle'  => '<svg ' . $s . ' stroke-width="1.3"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/><path d="M19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9z"/></svg>',
			'eye'      => '<svg ' . $s . ' stroke-width="1.3"><path d="M3 12c3-5 6-7 9-7s6 2 9 7c-3 5-6 7-9 7s-6-2-9-7z"/><path d="M8 12c1.5-2 2.8-3 4-3s2.5 1 4 3c-1.5 2-2.8 3-4 3s-2.5-1-4-3z"/></svg>',
			'truck'    => '<svg ' . $s . ' stroke-width="1.3"><path d="M1 6h13v10H1zM14 10h4l4 4v2h-8z"/><circle cx="5.5" cy="18.5" r="1.5"/><circle cx="17.5" cy="18.5" r="1.5"/></svg>',
			'heart-lg' => '<svg ' . $s . ' stroke-width="1.3"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
			'gift'     => '<svg ' . $s . ' stroke-width="1.3"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7a3 3 0 1 1 3-3c0 2-3 3-3 3zM12 7a3 3 0 1 0-3-3c0 2 3 3 3 3z"/></svg>',
			'star'     => '<svg ' . $s . ' stroke-width="1.3"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
		);
	}
	return isset( $icons[ $name ] ) ? $icons[ $name ] : '';
}

/** Icons offered in the Values widget. */
function br_value_icons() {
	return array(
		''         => __( 'None', 'brigitte-rose' ),
		'sparkle'  => __( 'Sparkle', 'brigitte-rose' ),
		'eye'      => __( 'Fabric / eye', 'brigitte-rose' ),
		'truck'    => __( 'Delivery truck', 'brigitte-rose' ),
		'heart-lg' => __( 'Heart', 'brigitte-rose' ),
		'gift'     => __( 'Gift', 'brigitte-rose' ),
		'star'     => __( 'Star', 'brigitte-rose' ),
	);
}

/**
 * Allow the light inline markup used in headings (<em>, <strong>, <br>, <a>).
 */
function br_kses_inline( $text ) {
	return wp_kses( (string) $text, array(
		'em'     => array(),
		'strong' => array(),
		'br'     => array(),
		'span'   => array( 'class' => true ),
		'a'      => array( 'href' => true, 'class' => true, 'target' => true, 'rel' => true ),
	) );
}

/**
 * Menu items for a location as a flat list of [title, url, current].
 * Falls back to the given defaults when no menu is assigned.
 */
function br_menu_items( $location, $fallback = array() ) {
	$locations = get_nav_menu_locations();
	$items     = array();
	if ( ! empty( $locations[ $location ] ) ) {
		$menu_items = wp_get_nav_menu_items( $locations[ $location ] );
		if ( $menu_items ) {
			_wp_menu_item_classes_by_context( $menu_items );
			foreach ( $menu_items as $item ) {
				if ( (int) $item->menu_item_parent ) {
					continue; // Flat menus only, matching the design.
				}
				$classes = (array) $item->classes;
				$items[] = array(
					'title'   => $item->title,
					'url'     => $item->url,
					'target'  => $item->target,
					'current' => in_array( 'current-menu-item', $classes, true ) || in_array( 'current-menu-ancestor', $classes, true ) || in_array( 'current_page_parent', $classes, true ),
				);
			}
			return $items;
		}
	}
	return $fallback;
}

/**
 * Print menu links with a class, marking the current page.
 */
function br_menu_links( $location, $class = '', $after = '', $fallback = array() ) {
	foreach ( br_menu_items( $location, $fallback ) as $item ) {
		printf(
			'<a%s href="%s"%s%s>%s%s</a>',
			$class ? ' class="' . esc_attr( $class ) . '"' : '',
			esc_url( $item['url'] ),
			$item['current'] ? ' aria-current="page"' : '',
			! empty( $item['target'] ) ? ' target="' . esc_attr( $item['target'] ) . '" rel="noopener"' : '',
			esc_html( $item['title'] ),
			$after // Trusted SVG markup.
		);
	}
}

/** Default primary menu used before menus are set up. */
function br_default_menu() {
	$items = array( array( 'title' => __( 'Home', 'brigitte-rose' ), 'url' => home_url( '/' ), 'current' => is_front_page() ) );
	foreach ( array( 'about', 'products', 'gallery', 'contact' ) as $slug ) {
		$page = get_page_by_path( $slug );
		if ( $page ) {
			$items[] = array( 'title' => get_the_title( $page ), 'url' => get_permalink( $page ), 'current' => is_page( $page->ID ) );
		}
	}
	return $items;
}

/**
 * URL of a page by slug with a fallback.
 */
function br_page_url( $slug, $fallback = '' ) {
	$map = array(
		'shop'     => (int) get_theme_mod( 'br_products_page' ),
		'wishlist' => (int) get_theme_mod( 'br_wishlist_page' ),
	);
	if ( ! empty( $map[ $slug ] ) && get_post_status( $map[ $slug ] ) === 'publish' ) {
		return get_permalink( $map[ $slug ] );
	}
	if ( 'shop' === $slug && function_exists( 'wc_get_page_permalink' ) ) {
		return wc_get_page_permalink( 'shop' );
	}
	if ( 'cart' === $slug && function_exists( 'wc_get_cart_url' ) ) {
		return wc_get_cart_url();
	}
	if ( 'checkout' === $slug && function_exists( 'wc_get_checkout_url' ) ) {
		return wc_get_checkout_url();
	}
	if ( 'products' === $slug ) {
		return br_page_url( 'shop' );
	}
	$page = get_page_by_path( $slug );
	if ( $page ) {
		return get_permalink( $page );
	}
	return $fallback ? $fallback : home_url( '/' );
}

/**
 * Breadcrumb markup used in page heroes.
 *
 * @param array $trail List of [label, url] before the current page.
 */
function br_breadcrumb( $current, $trail = array(), $class = 'breadcrumb' ) {
	$html = '<ol class="' . esc_attr( $class ) . '"><li><a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Home', 'brigitte-rose' ) . '</a></li>';
	foreach ( $trail as $crumb ) {
		$html .= '<li><a href="' . esc_url( $crumb[1] ) . '">' . esc_html( $crumb[0] ) . '</a></li>';
	}
	$html .= '<li aria-current="page">' . esc_html( $current ) . '</li></ol>';
	return $html;
}

/**
 * Section wrapper classes from the shared "Section style" controls.
 */
function br_section_class( $base, $settings ) {
	$classes = array( $base );
	$bg      = isset( $settings['section_bg'] ) ? $settings['section_bg'] : '';
	$space   = isset( $settings['section_space'] ) ? $settings['section_space'] : '';
	if ( 'none' !== $space ) {
		$classes[] = 'section';
	}
	if ( 'sm' === $space ) {
		$classes[] = 'section--sm';
	}
	if ( 'tight' === $space ) {
		$classes[] = 'section--tight-top';
	}
	if ( $bg && 'none' !== $bg ) {
		$classes[] = 'section--' . $bg;
	}
	return implode( ' ', array_filter( $classes ) );
}

/**
 * Image URL for an Elementor media control or attachment ID.
 */
function br_img_url( $media, $size = 'full' ) {
	$id  = is_array( $media ) && ! empty( $media['id'] ) ? (int) $media['id'] : ( is_numeric( $media ) ? (int) $media : 0 );
	$url = is_array( $media ) && ! empty( $media['url'] ) ? $media['url'] : '';
	if ( $id ) {
		$src = wp_get_attachment_image_src( $id, $size );
		if ( $src ) {
			return $src[0];
		}
	}
	return $url;
}

/** Alt text for an Elementor media control, with fallback. */
function br_img_alt( $media, $fallback = '' ) {
	$id = is_array( $media ) && ! empty( $media['id'] ) ? (int) $media['id'] : 0;
	if ( $id ) {
		$alt = get_post_meta( $id, '_wp_attachment_image_alt', true );
		if ( $alt ) {
			return $alt;
		}
	}
	return $fallback;
}

/* --------------------------------------------------------------------------
 * Product data layer: one JSON shape shared by PHP cards and the JS store.
 * ------------------------------------------------------------------------ */

/**
 * All published products in the shape the front-end scripts expect.
 */
function br_products_data() {
	static $cache = null;
	if ( null !== $cache ) {
		return $cache;
	}
	$cache = array();
	if ( ! function_exists( 'wc_get_products' ) ) {
		return $cache;
	}
	$products = wc_get_products( array(
		'status'  => 'publish',
		'limit'   => 100,
		'orderby' => array( 'menu_order' => 'ASC', 'date' => 'ASC' ),
		'visibility' => 'catalog',
	) );
	foreach ( $products as $product ) {
		$cache[] = br_product_data( $product );
	}
	return $cache;
}

/**
 * One product in front-end shape.
 *
 * @param WC_Product $product Product.
 */
function br_product_data( $product ) {
	$id     = $product->get_id();
	$images = array();
	$ids    = array_filter( array_merge( array( $product->get_image_id() ), $product->get_gallery_image_ids() ) );
	foreach ( array_unique( $ids ) as $img_id ) {
		$lg = wp_get_attachment_image_src( $img_id, 'br-product-lg' );
		$sm = wp_get_attachment_image_src( $img_id, 'br-product-sm' );
		if ( $lg ) {
			$images[] = array(
				'lg'  => $lg[0],
				'sm'  => $sm ? $sm[0] : $lg[0],
				'alt' => (string) get_post_meta( $img_id, '_wp_attachment_image_alt', true ),
			);
		}
	}
	if ( ! $images ) {
		$ph       = wc_placeholder_img_src( 'woocommerce_single' );
		$images[] = array( 'lg' => $ph, 'sm' => $ph, 'alt' => '' );
	}

	$sizes = array();
	if ( $product->is_type( 'variable' ) ) {
		$attr_key = br_size_attribute_key( $product );
		foreach ( $product->get_children() as $child_id ) {
			$variation = wc_get_product( $child_id );
			if ( ! $variation || ! $variation->exists() || 'publish' !== $variation->get_status() ) {
				continue;
			}
			$attrs = $variation->get_attributes();
			$value = $attr_key && isset( $attrs[ $attr_key ] ) ? $attrs[ $attr_key ] : reset( $attrs );
			$label = $value;
			if ( $attr_key && taxonomy_exists( $attr_key ) ) {
				$term  = get_term_by( 'slug', $value, $attr_key );
				$label = $term ? $term->name : $value;
			}
			$sizes[] = array(
				'name'        => (string) $label,
				'variationId' => $child_id,
				'inStock'     => $variation->is_in_stock(),
				'price'       => (float) $variation->get_price(),
				'order'       => $attr_key && taxonomy_exists( $attr_key ) && ( $t = get_term_by( 'slug', $value, $attr_key ) ) ? (int) get_term_meta( $t->term_id, 'order', true ) : 0,
			);
		}
		usort( $sizes, function ( $a, $b ) {
			$rank = array( 'XXS' => 0, 'XS' => 1, 'S' => 2, 'M' => 3, 'L' => 4, 'XL' => 5, 'XXL' => 6 );
			$ra   = isset( $rank[ strtoupper( $a['name'] ) ] ) ? $rank[ strtoupper( $a['name'] ) ] : 50 + $a['order'];
			$rb   = isset( $rank[ strtoupper( $b['name'] ) ] ) ? $rank[ strtoupper( $b['name'] ) ] : 50 + $b['order'];
			return $ra - $rb;
		} );
		foreach ( $sizes as &$s ) {
			unset( $s['order'] );
		}
		unset( $s );
	}

	$fabric_key  = '';
	$fabric_term = get_the_terms( $id, 'pa_fabric' );
	if ( $fabric_term && ! is_wp_error( $fabric_term ) ) {
		$fabric_key = $fabric_term[0]->slug;
	}

	$lines = function ( $text ) {
		return array_values( array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', (string) $text ) ) ) );
	};

	$description = $product->get_short_description() ? $product->get_short_description() : $product->get_description();
	$categories  = wp_get_post_terms( $id, 'product_cat', array( 'fields' => 'slugs' ) );

	return array(
		'id'          => $product->get_slug(),
		'wcId'        => $id,
		'type'        => $product->get_type(),
		'name'        => html_entity_decode( $product->get_name(), ENT_QUOTES, 'UTF-8' ),
		'url'         => get_permalink( $id ),
		'price'       => (float) $product->get_price(),
		'priceHtml'   => $product->get_price_html(),
		'images'      => $images,
		'color'       => (string) get_post_meta( $id, '_br_color', true ),
		'swatch'      => (string) get_post_meta( $id, '_br_swatch', true ),
		'style'       => (string) get_post_meta( $id, '_br_style', true ),
		'bullets'     => $lines( get_post_meta( $id, '_br_bullets', true ) ),
		'badges'      => array_values( array_filter( array_map( 'trim', explode( ',', (string) get_post_meta( $id, '_br_badges', true ) ) ) ) ),
		'badge'       => (string) get_post_meta( $id, '_br_badge', true ),
		'fabric'      => (string) get_post_meta( $id, '_br_fabric', true ),
		'fabricKey'   => $fabric_key,
		'care'        => (string) get_post_meta( $id, '_br_care', true ),
		'description' => trim( wp_strip_all_tags( $description ) ),
		'sizes'       => $sizes,
		'inStock'     => $product->is_in_stock(),
		'purchasable' => $product->is_purchasable(),
		'rating'      => (float) $product->get_average_rating(),
		'reviewCount' => (int) $product->get_review_count(),
		'categories'  => is_wp_error( $categories ) ? array() : $categories,
	);
}

/**
 * The attribute key (e.g. "pa_size") used for sizes on a variable product.
 */
function br_size_attribute_key( $product ) {
	$attributes = $product->get_variation_attributes();
	if ( ! $attributes ) {
		return '';
	}
	foreach ( array_keys( $attributes ) as $key ) {
		if ( false !== stripos( $key, 'size' ) ) {
			return sanitize_title( $key );
		}
	}
	$keys = array_keys( $attributes );
	return sanitize_title( $keys[0] );
}

/** Format a price in the store currency. */
function br_money( $amount ) {
	return function_exists( 'wc_price' ) ? wp_strip_all_tags( wc_price( $amount ) ) : '$' . number_format( (float) $amount, 2 );
}

/**
 * Product card markup (mirrors BR.productCardHTML in main.js).
 */
function br_product_card( $p, $eager = false ) {
	$all   = br_products_data();
	$img   = $p['images'][0];
	$hover = isset( $p['images'][1] ) ? '<img class="is-hover" src="' . esc_url( $p['images'][1]['sm'] ) . '" alt="" loading="lazy" width="640" height="960">' : '';

	$badges = '';
	foreach ( $p['badges'] as $b ) {
		$badges .= '<span class="product-card__badge product-card__badge--red">' . esc_html( $b ) . '</span>';
	}
	if ( $p['badge'] ) {
		$badges .= '<span class="product-card__badge">' . esc_html( $p['badge'] ) . '</span>';
	}

	$quick = '';
	if ( $p['purchasable'] && $p['inStock'] ) {
		if ( $p['sizes'] ) {
			$btns = '';
			foreach ( $p['sizes'] as $s ) {
				$btns .= sprintf(
					'<button type="button" data-quick-add="%1$s" data-size="%2$s"%3$s aria-label="%4$s">%2$s</button>',
					esc_attr( $p['id'] ),
					esc_attr( $s['name'] ),
					$s['inStock'] ? '' : ' disabled',
					esc_attr( sprintf( __( 'Add %1$s size %2$s to bag', 'brigitte-rose' ), $p['name'], $s['name'] ) )
				);
			}
			$quick = '<div class="product-card__quick"><div class="quick-add"><div class="quick-add__label">' . esc_html__( 'Quick add · Select size', 'brigitte-rose' ) . '</div><div class="quick-add__sizes">' . $btns . '</div></div></div>';
		} elseif ( 'simple' === $p['type'] ) {
			$quick = '<div class="product-card__quick"><div class="quick-add"><div class="quick-add__sizes"><button type="button" data-quick-add="' . esc_attr( $p['id'] ) . '" data-size="">' . esc_html__( 'Add to bag', 'brigitte-rose' ) . '</button></div></div></div>';
		}
	}

	$rating = '';
	if ( $p['reviewCount'] ) {
		$rating = '<div class="product-card__rating">' . br_stars_html( $p['rating'], 'stars--sm' ) . '<span>(' . (int) $p['reviewCount'] . ')</span></div>';
	}

	$swatches = '';
	foreach ( $all as $x ) {
		$swatches .= '<span style="background:' . esc_attr( $x['swatch'] ? $x['swatch'] : '#ccc' ) . '" title="' . esc_attr( $x['color'] ? $x['color'] : $x['name'] ) . '"' . ( $x['id'] === $p['id'] ? ' class="is-active"' : '' ) . '></span>';
	}

	ob_start();
	?>
	<article class="product-card" data-product="<?php echo esc_attr( $p['id'] ); ?>">
		<a class="product-card__media" href="<?php echo esc_url( $p['url'] ); ?>" aria-label="<?php echo esc_attr( $p['name'] ); ?>">
			<img class="is-primary" src="<?php echo esc_url( $img['sm'] ); ?>" alt="<?php echo esc_attr( $p['name'] ); ?>" loading="<?php echo $eager ? 'eager' : 'lazy'; ?>" width="640" height="960"><?php echo $hover; // phpcs:ignore ?>
			<span class="product-card__badges"><?php echo $badges; // phpcs:ignore ?></span>
		</a>
		<button type="button" class="icon-btn product-card__wish" data-wish="<?php echo esc_attr( $p['id'] ); ?>" aria-pressed="false" aria-label="<?php esc_attr_e( 'Add to wishlist', 'brigitte-rose' ); ?>"><?php echo br_icon( 'heart' ); // phpcs:ignore ?></button>
		<?php echo $quick; // phpcs:ignore ?>
		<div class="product-card__body">
			<h3 class="product-card__title"><a href="<?php echo esc_url( $p['url'] ); ?>"><?php echo esc_html( $p['name'] ); ?></a></h3>
			<?php if ( $p['fabric'] ) : ?><div class="product-card__sub"><?php echo esc_html( $p['fabric'] ); ?></div><?php endif; ?>
			<?php echo $rating; // phpcs:ignore ?>
			<div class="product-card__price"><?php echo esc_html( br_money( $p['price'] ) ); ?></div>
			<div class="product-card__swatches" aria-hidden="true"><?php echo $swatches; // phpcs:ignore ?></div>
		</div>
	</article>
	<?php
	return ob_get_clean();
}

/**
 * Star rating markup (mirrors BR.starsHTML).
 */
function br_stars_html( $rating, $class = '' ) {
	$rating = max( 0, min( 5, (float) $rating ) );
	$path   = 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z';
	$out    = '';
	for ( $i = 1; $i <= 5; $i++ ) {
		$fill = $rating >= $i ? 100 : ( $rating > $i - 1 ? round( ( $rating - ( $i - 1 ) ) * 100 ) : 0 );
		$gid  = 'sg' . $i . '_' . $fill . '_' . wp_rand( 1, 999999 );
		$out .= '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="' . $gid . '"><stop offset="' . $fill . '%" stop-color="currentColor"/><stop offset="' . $fill . '%" stop-color="transparent"/></linearGradient></defs><path d="' . $path . '" fill="url(#' . $gid . ')" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>';
	}
	return '<span class="stars ' . esc_attr( $class ) . '" role="img" aria-label="' . esc_attr( sprintf( __( '%s out of 5 stars', 'brigitte-rose' ), $rating ) ) . '">' . $out . '</span>';
}

/**
 * Products for a grid widget, filtered by IDs or category.
 */
function br_query_products( $args = array() ) {
	$all = br_products_data();
	if ( ! empty( $args['ids'] ) ) {
		$ids = array_map( 'intval', (array) $args['ids'] );
		$all = array_values( array_filter( $all, function ( $p ) use ( $ids ) {
			return in_array( $p['wcId'], $ids, true );
		} ) );
		usort( $all, function ( $a, $b ) use ( $ids ) {
			return array_search( $a['wcId'], $ids, true ) - array_search( $b['wcId'], $ids, true );
		} );
	} elseif ( ! empty( $args['category'] ) ) {
		$cat = $args['category'];
		$all = array_values( array_filter( $all, function ( $p ) use ( $cat ) {
			return in_array( $cat, $p['categories'], true );
		} ) );
	}
	if ( ! empty( $args['limit'] ) ) {
		$all = array_slice( $all, 0, (int) $args['limit'] );
	}
	return $all;
}
