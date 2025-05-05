// Modified generateDocument function for purpose handling
// Replace the following section in generateDocument function:

let purpose;
if (currentLanguage === 'english') {
    if (document.getElementById('purpose').value === 'other') {
        purpose = document.getElementById('custom-purpose').value || '[Custom Purpose]';
    } else {
        purpose = document.getElementById('purpose').value || '[Purpose of Disclosure]';
    }
} else {
    if (document.getElementById('purpose-ru').value === 'other') {
        purpose = document.getElementById('custom-purpose-ru').value || '[Пользовательская Цель]';
    } else {
        purpose = document.getElementById('purpose-ru').value || '[Цель Раскрытия]';
    }
}
