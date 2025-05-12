<?php
/**
 * Separation Agreement Generator Shortcode for WordPress
 * 
 * Copy this code to your theme's functions.php or use a custom plugin to add this functionality.
 */

// Register the shortcode [separation_agreement_generator]
function separation_agreement_generator_shortcode($atts) {
    // Parse attributes
    $atts = shortcode_atts(
        array(
            'height' => '900px',
            'mobile_height' => '1500px',
            'src' => 'https://terms.law/template-generator/Separation-Agreement-Generator/iframe.html'
        ),
        $atts,
        'separation_agreement_generator'
    );
    
    // Generate a unique ID for this instance
    $instance_id = 'separation_agreement_generator_' . mt_rand(1000, 9999);
    
    // CSS for responsive iframe
    $custom_css = "
        <style>
            #{$instance_id}_wrapper {
                width: 100%;
                height: {$atts['height']};
                margin: 20px 0;
                position: relative;
                overflow: hidden;
            }
            #{$instance_id} {
                width: 100%;
                height: 100%;
                border: none;
                overflow: hidden;
            }
            @media screen and (max-width: 768px) {
                #{$instance_id}_wrapper {
                    height: {$atts['mobile_height']};
                }
            }
        </style>
    ";
    
    // JavaScript for responsive handling
    $custom_js = "
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                var wrapper = document.getElementById('{$instance_id}_wrapper');
                var iframe = document.getElementById('{$instance_id}');
                
                // Handle iframe messages
                window.addEventListener('message', function(event) {
                    if (event.data && event.data.type === 'loaded' && event.source === iframe.contentWindow) {
                        // Adjust height based on content if needed
                        if (event.data.height) {
                            wrapper.style.height = (event.data.height + 50) + 'px';
                        }
                    }
                });
                
                // Adjust on resize
                window.addEventListener('resize', function() {
                    if (window.innerWidth < 768) {
                        wrapper.style.height = '{$atts['mobile_height']}';
                    } else {
                        wrapper.style.height = '{$atts['height']}';
                    }
                });
            });
        </script>
    ";
    
    // HTML output
    $output = $custom_css;
    $output .= "<div id='{$instance_id}_wrapper' class='separation-agreement-generator-wrapper'>";
    $output .= "<iframe id='{$instance_id}' src='{$atts['src']}' title='Separation Agreement Generator' scrolling='no' allowfullscreen></iframe>";
    $output .= "</div>";
    $output .= $custom_js;
    
    return $output;
}
add_shortcode('separation_agreement_generator', 'separation_agreement_generator_shortcode');

/**
 * ALTERNATIVE: If you prefer to use a Gutenberg block instead of a shortcode,
 * you can register a custom block that embeds the generator.
 * 
 * This is more advanced and requires more WordPress development knowledge.
 */

function register_separation_agreement_generator_block() {
    // Skip if Gutenberg isn't active
    if (!function_exists('register_block_type')) {
        return;
    }
    
    // Register block script
    wp_register_script(
        'separation-agreement-generator-block',
        plugins_url('separation-agreement-generator-block.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-editor'),
        filemtime(plugin_dir_path(__FILE__) . 'separation-agreement-generator-block.js')
    );
    
    // Register the block
    register_block_type('terms-law/separation-agreement-generator', array(
        'editor_script' => 'separation-agreement-generator-block',
        'render_callback' => 'separation_agreement_generator_shortcode',
        'attributes' => array(
            'height' => array(
                'type' => 'string',
                'default' => '900px',
            ),
            'mobile_height' => array(
                'type' => 'string',
                'default' => '1500px',
            ),
            'src' => array(
                'type' => 'string',
                'default' => 'https://terms.law/template-generator/Separation-Agreement-Generator/iframe.html',
            ),
        ),
    ));
}
add_action('init', 'register_separation_agreement_generator_block');
