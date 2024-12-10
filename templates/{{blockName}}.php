<?php
/**
 * Plugin Name: {{title}}
 * Description: {{description}}
 * Version: 1.0.0
 * Namespace: klx
 */

function create_block_klx_{{blockName}}_block_init() {
    register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'klx_{{blockName}}_block_init' ); 