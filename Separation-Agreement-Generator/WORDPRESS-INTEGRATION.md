# Embedding the Separation Agreement Generator in WordPress

This document provides instructions for adding the Separation Agreement Generator to your terms.law WordPress site.

## Option 1: Using the Custom HTML Block (Simplest)

1. Log in to your WordPress admin dashboard
2. Edit the page where you want to add the generator
3. Add a new Custom HTML block
4. Open the file `wordpress-embed.html` in this folder
5. Copy all the content and paste it into the Custom HTML block
6. Update the `src` attribute in the iframe element to point to the correct URL where you've uploaded the generator files
7. Save and publish the page

## Option 2: Using a Shortcode (More Flexible)

1. Open your theme's `functions.php` file or create a simple plugin file
2. Copy the PHP code from `wordpress-embed-code.php` into your functions.php or plugin file
3. Save the file
4. Edit the page where you want to add the generator
5. Add a Shortcode block
6. Insert the shortcode: `[separation_agreement_generator]`
7. Save and publish the page

### Customizing the Shortcode

The shortcode accepts these parameters:
- `height`: Height of the generator on desktop devices (default: "900px")
- `mobile_height`: Height on mobile devices (default: "1500px") 
- `src`: URL to the generator iframe.html file

Example with custom parameters:
```
[separation_agreement_generator height="1000px" mobile_height="1800px" src="https://custom-domain.com/generator/iframe.html"]
```

## File Structure

Make sure these files are uploaded to your server in the correct location:

```
/template-generator/Separation-Agreement-Generator/
├── iframe.html            - Special version for iframe embedding
├── styles.css             - Styling for the generator
├── docx-generator.js      - Word document generation functionality
├── separation-agreement-generator.js - Main React component code
```

## Troubleshooting

### Height Issues
If the generator appears cut off or has scrollbars, try adjusting the height values. The generator automatically attempts to resize based on content, but may need manual adjustment.

### Script Loading Issues
If you see errors in the browser console about script loading, make sure all files are properly uploaded and accessible.

### Word Document Generation Issues
If downloading Word documents doesn't work, check browser console for errors. The Word generation relies on browser capabilities to create and download files.

## Security Considerations

The generator runs entirely in the browser and doesn't require server-side processing. However, as it generates legal documents, ensure it's hosted securely using HTTPS.

## Customization

If you need to customize the generator for different clients or use cases:
1. Create a copy of the entire `Separation-Agreement-Generator` folder
2. Modify the `.js` files as needed for your specific requirements
3. Update the iframe src to point to your custom version
