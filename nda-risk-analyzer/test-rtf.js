// Test RTF generation
function testRTF() {
    const rtfContent = `{\\rtf1\\ansi\\deff0 
{\\fonttbl {\\f0 Times New Roman;}}
{\\colortbl;\\red0\\green0\\blue0;\\red255\\green0\\blue0;\\red0\\green150\\blue0;\\red255\\green255\\blue0;}
\\f0\\fs24
\\qc\\b\\ul TEST REDLINED DOCUMENT\\b0\\ul0\\par
\\pard\\par
This is normal text.\\par\\par
{\\strike\\cf2 This text should be struck through} {\\cf3\\highlight4 This text should be highlighted}\\par\\par
Another normal paragraph.\\par
}`;

    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `test-redlined.rtf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Test this in browser console