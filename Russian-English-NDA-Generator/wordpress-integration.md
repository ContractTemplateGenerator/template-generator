# WordPress Integration Guide for Dual Language NDA Generator

## Quick Start - Basic Embed

To embed the NDA generator in a WordPress page or post, use this code:

```html
<iframe 
  src="https://template.terms.law/Russian-English-NDA-aligned/" 
  width="100%" 
  height="900px" 
  frameborder="0" 
  style="border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px;"
  allowfullscreen>
</iframe>
```

## Installation Methods

### Method 1: WordPress Block Editor (Gutenberg)

1. Create or edit a page/post in WordPress
2. Add a "Custom HTML" block
3. Paste the iframe code above
4. Preview and publish

### Method 2: Classic Editor

1. Switch to "Text" mode in the editor
2. Paste the iframe code where you want the generator to appear
3. Switch back to "Visual" mode to see the preview
4. Update/publish the page

### Method 3: Page Builder (Elementor, Divi, etc.)

1. Add an HTML widget/module
2. Paste the iframe code
3. Adjust widget settings as needed
4. Save and preview

## Advanced Options

### Responsive Embed with Container

```html
<div style="width: 100%; max-width: 1400px; margin: 0 auto; padding: 20px;">
  <iframe 
    src="https://template.terms.law/Russian-English-NDA-aligned/" 
    width="100%" 
    height="900px" 
    frameborder="0" 
    style="border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px;"
    allowfullscreen>
  </iframe>
</div>
```

### Full-Width Embed

```html
<div style="width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw;">
  <iframe 
    src="https://template.terms.law/Russian-English-NDA-aligned/" 
    width="100%" 
    height="900px" 
    frameborder="0" 
    style="border: none;"
    allowfullscreen>
  </iframe>
</div>
```

### With Loading Indicator

```html
<div style="position: relative; width: 100%; max-width: 1400px; margin: 0 auto;">
  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1; font-size: 18px; color: #666;">
    Loading NDA Generator...
  </div>
  <iframe 
    src="https://template.terms.law/Russian-English-NDA-aligned/" 
    width="100%" 
    height="900px" 
    frameborder="0" 
    style="border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px; position: relative; z-index: 2; background: white;"
    onload="this.previousElementSibling.style.display='none'"
    allowfullscreen>
  </iframe>
</div>
```

## WordPress Shortcode (Optional)

To create a reusable shortcode, add this to your theme's `functions.php`:

```php
function nda_generator_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '900px',
        'width' => '100%',
        'max-width' => '1400px'
    ), $atts);
    
    return '<div style="width: 100%; max-width: ' . esc_attr($atts['max-width']) . '; margin: 0 auto;">
              <iframe 
                src="https://template.terms.law/Russian-English-NDA-aligned/" 
                width="' . esc_attr($atts['width']) . '" 
                height="' . esc_attr($atts['height']) . '" 
                frameborder="0" 
                style="border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px;"
                allowfullscreen>
              </iframe>
            </div>';
}
add_shortcode('nda_generator', 'nda_generator_shortcode');
```

Then use in your content:
```
[nda_generator height="900px" width="100%" max-width="1400px"]
```

## Customization Options

### Adjust Height
Change the `height` attribute to fit your needs:
- `height="700px"` - Compact view
- `height="900px"` - Standard view (recommended)
- `height="1200px"` - Extended view

### Style Options
Modify the `style` attribute for different appearances:

**No Border:**
```html
style="border: none;"
```

**With Border:**
```html
style="border: 1px solid #ddd; border-radius: 8px;"
```

**With Shadow:**
```html
style="border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px;"
```

## Troubleshooting

### Common Issues

1. **Generator not loading:**
   - Check if the URL is correct
   - Ensure your site uses HTTPS
   - Verify there are no content security policies blocking iframes

2. **Height issues:**
   - Adjust the height attribute
   - Consider using a responsive wrapper
   - Check for CSS conflicts in your theme

3. **Mobile responsiveness:**
   - Use percentage widths
   - Consider reducing height on mobile devices
   - Test on different screen sizes

### WordPress Security

Some WordPress security plugins may block iframes. If you encounter issues:

1. Add the generator domain to your allowed iframe sources
2. Temporarily disable security plugins to test
3. Check your Content Security Policy headers

## SEO Considerations

When embedding the generator:

1. Add descriptive text above/below the iframe
2. Include relevant keywords in the surrounding content
3. Consider adding a text link to the full generator page

Example:
```html
<h2>Create a Bilingual NDA Agreement</h2>
<p>Use our free Dual Language NDA Generator to create professional Non-Disclosure Agreements in English and Russian. Perfect for international business relationships.</p>

[iframe code here]

<p>Need help? <a href="https://terms.law/call/">Schedule a consultation</a> with our legal team.</p>
```

## Performance Tips

1. **Lazy Loading** (WordPress 5.5+):
```html
<iframe 
  src="https://template.terms.law/Russian-English-NDA-aligned/" 
  width="100%" 
  height="900px" 
  loading="lazy"
  frameborder="0">
</iframe>
```

2. **Conditional Loading:**
Only load on specific pages by using WordPress conditionals in your theme.

3. **Caching:**
Ensure your caching plugin doesn't interfere with the iframe functionality.

## Support

For technical support or custom integration needs:
- Website: https://terms.law
- Schedule a call: https://terms.law/call/
