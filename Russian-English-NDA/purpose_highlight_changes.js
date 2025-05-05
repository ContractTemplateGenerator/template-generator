// Add this case to the highlightChanges function:
else if (elementId === 'purpose' || elementId === 'purpose-ru' || 
          elementId === 'custom-purpose' || elementId === 'custom-purpose-ru') {
    // Find purpose text in the corresponding column
    const isEnglish = elementId === 'purpose' || elementId === 'custom-purpose';
    const column = isEnglish ? 
                 previewDoc.querySelector('.left-column') : 
                 previewDoc.querySelector('.right-column');
    
    // Get the actual value to highlight
    let actualValue;
    if (elementId === 'purpose' || elementId === 'purpose-ru') {
        if (elementValue === 'other') {
            actualValue = isEnglish ? 
                        document.getElementById('custom-purpose').value : 
                        document.getElementById('custom-purpose-ru').value;
        } else {
            actualValue = elementValue;
        }
    } else { // custom-purpose or custom-purpose-ru
        actualValue = elementValue;
    }
    
    const sectionTitles = column.querySelectorAll('.section-title');
    sectionTitles.forEach(section => {
        if ((isEnglish && section.textContent.includes('PERMITTED USE')) || 
            (!isEnglish && section.textContent.includes('ДОПУСТИМОЕ ИСПОЛЬЗОВАНИЕ'))) {
            const parent = section.parentElement;
            if (parent && parent.textContent.includes(actualValue)) {
                // Create a text node with the highlighted purpose
                const text = parent.innerHTML;
                parent.innerHTML = text.replace(
                    actualValue,
                    `<span class="highlight">${actualValue}</span>`
                );
                targetElement = parent.querySelector('.highlight');
            }
        }
    });
}
