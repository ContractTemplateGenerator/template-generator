# Word Redline Processor Add-in

A Microsoft Word add-in that processes redline instructions and applies them as native Word track changes.

## Features

- **Enable Track Changes**: Automatically enables Word's track changes mode
- **Parse Redline Instructions**: Supports common redline instruction formats
- **Apply as Track Changes**: All modifications appear as proper Word track changes that can be accepted/rejected
- **Simple Interface**: Clean task pane UI for easy use

## Supported Redline Instructions

The add-in can process these types of instructions:

```
Change "Company" to "Contractor"
Replace "shall" with "will" throughout
Delete "liquidated damages provision"
Add "governed by California law" at the end
Change "60 days" to "30 days" in section 5
```

## Installation & Setup

### Prerequisites
- Microsoft Word (2016 or later, Office 365)
- Node.js (for development server)

### Quick Start

1. **Clone/Download** this repository
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm start
   ```
4. **Install in Word**:
   - Open Microsoft Word
   - Go to `Insert` > `My Add-ins` > `Upload My Add-in`
   - Browse to the `manifest.xml` file in this folder
   - Click "Upload"

### Alternative Installation (Shared Folder)

For easier development, you can use the shared folder method:

1. Set up a shared network folder or use your local folder
2. In Word: `Insert` > `My Add-ins` > `Shared Folder`
3. Browse to this folder and select `manifest.xml`

## Usage

1. **Open Word** and create or open a document
2. **Click "Process Redlines"** in the Home tab ribbon
3. **Enable Track Changes** using the button in the task pane
4. **Enter your redline instructions** in the text area
5. **Click "Apply Redlines as Track Changes"**

The add-in will:
- Parse your instructions
- Apply changes to the document
- Show all modifications as native Word track changes
- Display a results log of what was processed

## Technical Details

### Architecture
- **Frontend**: HTML/CSS/JavaScript task pane
- **API**: Office.js Word API
- **Track Changes**: Uses `context.document.changeTrackingMode = Word.ChangeTrackingMode.trackAll`
- **Search & Replace**: Leverages Word's native search functionality

### Key Functions
- `enableTrackChanges()`: Enables Word's track changes mode
- `processRedlines()`: Main processing function
- `parseRedlineInstructions()`: Parses text instructions into structured commands
- `processInstruction()`: Applies individual changes with track changes

### File Structure
```
word-redline-addin/
├── manifest.xml          # Add-in manifest
├── taskpane.html         # Main UI
├── taskpane.css          # Styling
├── taskpane.js           # Core functionality
├── commands.html         # Command functions page
├── commands.js           # Command handlers
├── server.js             # Development server
├── package.json          # Dependencies
└── assets/               # Icons and images
```

## Development

### Running Locally
```bash
npm start
```
This starts a server on `http://localhost:3000`

### Testing
1. Make changes to the code
2. Refresh the task pane in Word (right-click > Reload)
3. Test with sample redline instructions

### Debugging
- Open Developer Tools in the task pane (right-click > Inspect)
- Check console for errors
- Use `console.log()` for debugging

## Limitations (Current Version)

- **Basic parsing**: Simple instruction formats only
- **Context support**: Limited support for "in section X" type contexts
- **Error handling**: Basic error reporting
- **UI**: Simple interface without advanced features

## Future Enhancements

- [ ] More sophisticated instruction parsing
- [ ] Support for complex document navigation
- [ ] Batch processing of multiple documents
- [ ] Integration with document comparison tools
- [ ] Advanced search patterns and regular expressions
- [ ] Undo/redo functionality for applied changes

## Troubleshooting

### Add-in Won't Load
- Check that the development server is running
- Verify the manifest.xml URLs point to the correct server
- Try refreshing Word and reloading the add-in

### Track Changes Not Working
- Make sure Word supports track changes in your document format
- Check that you clicked "Enable Track Changes" first
- Verify you have edit permissions on the document

### Instructions Not Parsing
- Check the instruction format matches the supported patterns
- Ensure text is enclosed in quotes: `"text to find"`
- Look at the results log for specific error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with Word
5. Submit a pull request

## License

MIT License - see LICENSE file for details