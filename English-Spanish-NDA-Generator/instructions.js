document.addEventListener('DOMContentLoaded', function() {
    const englishToggle = document.getElementById('english-toggle');
    const spanishToggle = document.getElementById('spanish-toggle');
    
    // Translations
    const translations = {
        // Header
        'instructions-title': {
            en: 'Understanding Your NDA',
            es: 'Entendiendo Su Acuerdo de Confidencialidad'
        },
        'instructions-subtitle': {
            en: 'Key considerations for creating an effective dual-language confidentiality agreement',
            es: 'Consideraciones clave para crear un acuerdo de confidencialidad bilingüe efectivo'
        },
        
        // Risk Card
        'risk-title': {
            en: 'Risk Spectrum',
            es: 'Espectro de Riesgo'
        },
        'risk-low': {
            en: 'Low Risk',
            es: 'Riesgo Bajo'
        },
        'risk-medium': {
            en: 'Medium Risk',
            es: 'Riesgo Medio'
        },
        'risk-high': {
            en: 'High Risk',
            es: 'Riesgo Alto'
        },
        'risk-low-desc': {
            en: 'Standard, well-defined terms with reasonable protection periods',
            es: 'Términos estándar bien definidos con períodos de protección razonables'
        },
        'risk-medium-desc': {
            en: 'Moderate protection periods, broad definitions, or jurisdictions with moderate enforcement',
            es: 'Períodos de protección moderados, definiciones amplias o jurisdicciones con aplicación moderada'
        },
        'risk-high-desc': {
            en: 'Very long protection periods, missing essential clauses, or uncertain enforcement',
            es: 'Períodos de protección muy largos, cláusulas esenciales ausentes o aplicación incierta'
        },
        
        // Scope Card
        'scope-title': {
            en: 'Confidentiality Scope',
            es: 'Alcance de Confidencialidad'
        },
        'scope-narrow': {
            en: 'Narrow',
            es: 'Limitado'
        },
        'scope-medium': {
            en: 'Medium',
            es: 'Medio'
        },
        'scope-broad': {
            en: 'Broad',
            es: 'Amplio'
        },
        'scope-medium-label': {
            en: '+ Oral info with<br>written confirmation',
            es: '+ Información oral con<br>confirmación escrita'
        },
        'scope-broad-label': {
            en: '+ Implied confidential<br>information',
            es: '+ Información confidencial<br>implícita'
        },
        
        // Period Card
        'period-title': {
            en: 'Protection Period',
            es: 'Período de Protección'
        },
        'timeline-years1': {
            en: 'years',
            es: 'años'
        },
        'timeline-years2': {
            en: 'years',
            es: 'años'
        },
        'timeline-years3': {
            en: 'years',
            es: 'años'
        },
        'timeline-safe': {
            en: 'Safe and generally enforceable',
            es: 'Seguro y generalmente aplicable'
        },
        'timeline-moderate': {
            en: 'Moderate risk, may be scrutinized',
            es: 'Riesgo moderado, puede ser examinado'
        },
        'timeline-risky': {
            en: 'High risk, often unenforceable',
            es: 'Alto riesgo, frecuentemente inaplicable'
        },
        
        // Jurisdiction Card
        'jurisdiction-title': {
            en: 'Jurisdiction Strength',
            es: 'Fortaleza de la Jurisdicción'
        },
        'strong-jurisdictions': {
            en: '<strong>Strong enforcement:</strong> United States, Spain, Mexico, Chile, Argentina, Costa Rica, Panama, Uruguay',
            es: '<strong>Aplicación fuerte:</strong> Estados Unidos, España, México, Chile, Argentina, Costa Rica, Panamá, Uruguay'
        },
        'moderate-jurisdictions': {
            en: '<strong>Moderate enforcement:</strong> Colombia, Peru, Dominican Republic',
            es: '<strong>Aplicación moderada:</strong> Colombia, Perú, República Dominicana'
        },
        'weak-jurisdictions': {
            en: '<strong>Challenging enforcement:</strong> El Salvador, Guatemala, Honduras, Nicaragua, Venezuela, Cuba, Bolivia, Paraguay, Ecuador',
            es: '<strong>Aplicación desafiante:</strong> El Salvador, Guatemala, Honduras, Nicaragua, Venezuela, Cuba, Bolivia, Paraguay, Ecuador'
        },
        
        // Provisions Card
        'provisions-title': {
            en: 'Essential Provisions',
            es: 'Disposiciones Esenciales'
        },
        'exclusions-title': {
            en: 'Exclusions',
            es: 'Exclusiones'
        },
        'warranties-title': {
            en: 'No Warranties',
            es: 'Sin Garantías'
        },
        'severability-title': {
            en: 'Severability',
            es: 'Divisibilidad'
        },
        'language-title': {
            en: 'Language Preference',
            es: 'Preferencia de Idioma'
        },
        'exclusions-desc': {
            en: 'Exempts public information and previously known information',
            es: 'Exime información pública e información previamente conocida'
        },
        'warranties-desc': {
            en: 'Limits liability for information accuracy',
            es: 'Limita la responsabilidad por la exactitud de la información'
        },
        'severability-desc': {
            en: 'Preserves agreement if one part is invalid',
            es: 'Preserva el acuerdo si una parte es inválida'
        },
        'language-desc': {
            en: 'Establishes which language version controls',
            es: 'Establece qué versión de idioma prevalece'
        },
        'legend-essential': {
            en: 'Essential',
            es: 'Esencial'
        },
        'legend-recommended': {
            en: 'Recommended',
            es: 'Recomendado'
        },
        
        // Tips Card
        'tips-title': {
            en: 'Expert Legal Tips',
            es: 'Consejos Legales de Expertos'
        },
        'tip1-title': {
            en: 'Verify Signatory Authority',
            es: 'Verificar Autoridad de Firmantes'
        },
        'tip2-title': {
            en: 'Cross-Border Considerations',
            es: 'Consideraciones Transfronterizas'
        },
        'tip3-title': {
            en: 'Customize for Specific Information',
            es: 'Personalizar para Información Específica'
        },
        'tip4-title': {
            en: 'Secure Storage',
            es: 'Almacenamiento Seguro'
        },
        'tip1-desc': {
            en: 'Ensure signatories have legal authority to bind their respective organizations. Request corporate resolutions or powers of attorney if necessary.',
            es: 'Asegúrese de que los firmantes tengan autoridad legal para obligar a sus respectivas organizaciones. Solicite resoluciones corporativas o poderes notariales si es necesario.'
        },
        'tip2-desc': {
            en: 'For international agreements, consult with counsel in both jurisdictions to ensure compliance with local requirements.',
            es: 'Para acuerdos internacionales, consulte con asesores legales en ambas jurisdicciones para garantizar el cumplimiento de los requisitos locales.'
        },
        'tip3-desc': {
            en: 'Consider adding specific examples of confidential information unique to your business relationship for maximum protection.',
            es: 'Considere agregar ejemplos específicos de información confidencial única para su relación comercial para una máxima protección.'
        },
        'tip4-desc': {
            en: 'Store fully executed copies securely and ensure both parties receive originals with all signatures.',
            es: 'Almacene copias completamente ejecutadas de forma segura y asegúrese de que ambas partes reciban originales con todas las firmas.'
        }
    };
    
    // Function to set language
    function setLanguage(lang) {
        // Update toggle buttons
        if (lang === 'en') {
            englishToggle.classList.add('active');
            spanishToggle.classList.remove('active');
        } else {
            englishToggle.classList.remove('active');
            spanishToggle.classList.add('active');
        }
        
        // Update all translated elements
        for (const [id, translation] of Object.entries(translations)) {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = translation[lang];
            }
        }
    }
    
    // Event listeners for toggle buttons
    englishToggle.addEventListener('click', function() {
        setLanguage('en');
    });
    
    spanishToggle.addEventListener('click', function() {
        setLanguage('es');
    });
    
    // Check if there's a language preference from the generator
    try {
        // Try to access parent window's language if iframe is on same domain
        const generatorLanguage = window.parent.document.querySelector('.flag-button.active');
        if (generatorLanguage) {
            // Extract language from parent's active button
            const lang = generatorLanguage.textContent.trim().toLowerCase().includes('english') ? 'en' : 'es';
            setLanguage(lang);
        } else {
            // Default to English
            setLanguage('en');
        }
    } catch (e) {
        // If cross-origin issues, default to English
        setLanguage('en');
    }
    
    // Listen for language change messages from parent window
    window.addEventListener('message', function(event) {
        if (event.data && event.data.language) {
            setLanguage(event.data.language);
        }
    });
});