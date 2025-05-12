// Instructions and Tips Component for English-Spanish NDA Generator
const NDAInstructions = () => {
  // Language state (independent from the generator)
  const [language, setLanguage] = React.useState('en');
  
  // Translation function
  const t = (englishText, spanishText) => language === 'en' ? englishText : spanishText;
  
  // Risk levels with colors for visualization
  const riskLevels = [
    {
      level: 'low',
      color: '#15803d',
      bgColor: '#dcfce7',
      title: t('Low Risk', 'Riesgo Bajo'),
      icon: 'shield',
      description: t(
        'These provisions are generally enforceable across jurisdictions and provide balanced protection.',
        'Estas disposiciones son generalmente ejecutables en todas las jurisdicciones y proporcionan una protección equilibrada.'
      )
    },
    {
      level: 'medium',
      color: '#d97706',
      bgColor: '#fef3c7',
      title: t('Medium Risk', 'Riesgo Medio'),
      icon: 'alert-triangle',
      description: t(
        'These provisions may face scrutiny in some courts but are generally acceptable with proper drafting.',
        'Estas disposiciones pueden enfrentar escrutinio en algunos tribunales, pero son generalmente aceptables con una redacción adecuada.'
      )
    },
    {
      level: 'high',
      color: '#dc2626',
      bgColor: '#fee2e2',
      title: t('High Risk', 'Riesgo Alto'),
      icon: 'alert-octagon',
      description: t(
        'These provisions may be unenforceable in many jurisdictions and could put the entire agreement at risk.',
        'Estas disposiciones pueden ser inejecutables en muchas jurisdicciones y podrían poner en riesgo todo el acuerdo.'
      )
    }
  ];
  
  // Confidentiality scope options with tips
  const confidentialityScopes = [
    {
      title: t('Broad Definition', 'Definición Amplia'),
      risk: 'medium',
      icon: 'maximize',
      description: t(
        'Includes written, oral, and implied confidential information. Strongest protection for the disclosing party.',
        'Incluye información confidencial escrita, oral e implícita. La protección más fuerte para la parte divulgadora.'
      ),
      tip: t(
        'Best for high-value trade secrets or when comprehensive protection is critical.',
        'Ideal para secretos comerciales de alto valor o cuando la protección integral es crítica.'
      )
    },
    {
      title: t('Medium Definition', 'Definición Media'),
      risk: 'low',
      icon: 'layers',
      description: t(
        'Includes written/electronic and oral information (if confirmed in writing within 30 days).',
        'Incluye información escrita/electrónica y oral (si se confirma por escrito dentro de 30 días).'
      ),
      tip: t(
        'Balanced approach that courts typically find reasonable and enforceable.',
        'Enfoque equilibrado que los tribunales suelen considerar razonable y ejecutable.'
      )
    },
    {
      title: t('Narrow Definition', 'Definición Limitada'),
      risk: 'low',
      icon: 'minimize',
      description: t(
        'Only includes information explicitly marked as "confidential" in writing.',
        'Solo incluye información explícitamente marcada como "confidencial" por escrito.'
      ),
      tip: t(
        'Easiest to enforce but provides least protection to the disclosing party.',
        'Más fácil de hacer cumplir pero proporciona menos protección a la parte divulgadora.'
      )
    }
  ];
  
  // Protection period guidance
  const protectionPeriods = [
    {
      range: '1-2 years',
      risk: 'low',
      icon: 'calendar',
      description: t(
        'Short-term protection suitable for information with limited shelf life.',
        'Protección a corto plazo adecuada para información con vida útil limitada.'
      ),
      examples: t(
        'Marketing plans, upcoming product releases, event planning.',
        'Planes de marketing, próximos lanzamientos de productos, planificación de eventos.'
      )
    },
    {
      range: '3-5 years',
      risk: 'low',
      icon: 'calendar',
      description: t(
        'Medium-term protection suitable for most business information.',
        'Protección a medio plazo adecuada para la mayoría de la información empresarial.'
      ),
      examples: t(
        'Customer lists, pricing strategies, business methods.',
        'Listas de clientes, estrategias de precios, métodos comerciales.'
      )
    },
    {
      range: '5-10 years',
      risk: 'medium',
      icon: 'calendar',
      description: t(
        'Long-term protection that may face some scrutiny but often enforceable.',
        'Protección a largo plazo que puede enfrentar cierto escrutinio pero a menudo es ejecutable.'
      ),
      examples: t(
        'Technical know-how, manufacturing processes, long-term strategic plans.',
        'Conocimientos técnicos, procesos de fabricación, planes estratégicos a largo plazo.'
      )
    },
    {
      range: '10+ years',
      risk: 'high',
      icon: 'calendar',
      description: t(
        'Extended protection that courts may find unreasonable and unenforceable.',
        'Protección extendida que los tribunales pueden considerar irrazonable e inejecutable.'
      ),
      examples: t(
        'Only justified for truly valuable, long-term trade secrets.',
        'Solo justificado para secretos comerciales verdaderamente valiosos y a largo plazo.'
      )
    }
  ];
  
  // Party type decision tree
  const partyTypes = [
    {
      type: t('Company to Company', 'Empresa a Empresa'),
      description: t(
        'Both parties are business entities with legal departments or access to counsel.',
        'Ambas partes son entidades comerciales con departamentos legales o acceso a asesoría legal.'
      ),
      considerations: [
        t('Can generally use more comprehensive language', 'Generalmente puede usar un lenguaje más completo'),
        t('Courts allow broader confidentiality scope', 'Los tribunales permiten un alcance de confidencialidad más amplio'),
        t('Longer protection periods often acceptable', 'Períodos de protección más largos a menudo aceptables')
      ]
    },
    {
      type: t('Company to Individual', 'Empresa a Individuo'),
      description: t(
        'A business entity and an individual person (consultant, contractor, etc.).',
        'Una entidad comercial y una persona física (consultor, contratista, etc.).'
      ),
      considerations: [
        t('More scrutiny from courts to protect individual', 'Mayor escrutinio de los tribunales para proteger al individuo'),
        t('Clearer definitions recommended', 'Se recomiendan definiciones más claras'),
        t('May need to consider employment laws', 'Puede ser necesario considerar las leyes laborales')
      ]
    },
    {
      type: t('Individual to Individual', 'Individuo a Individuo'),
      description: t(
        'Both parties are individuals without corporate structures.',
        'Ambas partes son personas físicas sin estructuras corporativas.'
      ),
      considerations: [
        t('Simplify language for clarity', 'Simplificar el lenguaje para mayor claridad'),
        t('Focus on specific information to be protected', 'Enfocarse en información específica a proteger'),
        t('Shorter protection periods recommended', 'Se recomiendan períodos de protección más cortos')
      ]
    }
  ];
  
  // Jurisdiction risks
  const jurisdictionRisks = {
    safe: [
      'United States', 'Canada', 'United Kingdom', 'European Union', 
      'Japan', 'Australia', 'New Zealand', 'Singapore', 'South Korea',
      'Spain', 'Mexico', 'Chile', 'Argentina', 'Uruguay', 'Costa Rica'
    ],
    moderate: [
      'Colombia', 'Peru', 'Panama', 'Brazil', 'South Africa', 
      'India', 'China', 'Russia', 'Turkey', 'Thailand'
    ],
    risky: [
      'Venezuela', 'Cuba', 'Nicaragua', 'El Salvador', 'Guatemala',
      'Honduras', 'Bolivia', 'Paraguay', 'Ecuador', 'Countries with political instability'
    ]
  };
  
  // Essential elements of a valid NDA
  const essentialElements = [
    {
      element: t('Clear Party Identification', 'Identificación Clara de las Partes'),
      description: t(
        'Full legal names and addresses of all parties involved.',
        'Nombres legales completos y direcciones de todas las partes involucradas.'
      )
    },
    {
      element: t('Defined Confidential Information', 'Información Confidencial Definida'),
      description: t(
        'Clear scope of what is considered confidential.',
        'Alcance claro de lo que se considera confidencial.'
      )
    },
    {
      element: t('Specific Obligations', 'Obligaciones Específicas'),
      description: t(
        'Detailed duties of the receiving party regarding protection and non-disclosure.',
        'Deberes detallados de la parte receptora con respecto a la protección y no divulgación.'
      )
    },
    {
      element: t('Exclusions', 'Exclusiones'),
      description: t(
        'Information that falls outside confidentiality obligations.',
        'Información que queda fuera de las obligaciones de confidencialidad.'
      )
    },
    {
      element: t('Time Period', 'Período de Tiempo'),
      description: t(
        'Duration of confidentiality obligations.',
        'Duración de las obligaciones de confidencialidad.'
      )
    },
    {
      element: t('Governing Law', 'Ley Aplicable'),
      description: t(
        'Jurisdiction that will interpret and enforce the agreement.',
        'Jurisdicción que interpretará y hará cumplir el acuerdo.'
      )
    }
  ];
  
  // Best practices tips
  const bestPractices = [
    {
      title: t('Use Clear, Specific Language', 'Use Lenguaje Claro y Específico'),
      description: t(
        'Avoid vague terms that could be interpreted differently by the parties or courts.',
        'Evite términos vagos que puedan ser interpretados de manera diferente por las partes o los tribunales.'
      )
    },
    {
      title: t('Include Standard Exclusions', 'Incluya Exclusiones Estándar'),
      description: t(
        'Always exclude public domain information, previously known information, and independently developed information.',
        'Excluya siempre la información de dominio público, la información previamente conocida y la información desarrollada independientemente.'
      )
    },
    {
      title: t('Balance Protection Needs', 'Equilibre las Necesidades de Protección'),
      description: t(
        'Consider whether a shorter protection period with clearer terms might be more enforceable than a very long period.',
        'Considere si un período de protección más corto con términos más claros podría ser más ejecutable que un período muy largo.'
      )
    },
    {
      title: t('Specify Return/Destruction', 'Especifique Devolución/Destrucción'),
      description: t(
        'Include procedures for returning or destroying confidential information when the agreement ends.',
        'Incluya procedimientos para devolver o destruir la información confidencial cuando finalice el acuerdo.'
      )
    },
    {
      title: t('Address Digital Information', 'Aborde la Información Digital'),
      description: t(
        'Explicitly cover digital formats, cloud storage, and electronic copies in modern NDAs.',
        'Cubra explícitamente formatos digitales, almacenamiento en la nube y copias electrónicas en los NDA modernos.'
      )
    },
    {
      title: t('Consider Dual-Language Implications', 'Considere las Implicaciones del Idioma Dual'),
      description: t(
        'Always specify which language version prevails in case of discrepancies in interpretation.',
        'Especifique siempre qué versión del idioma prevalece en caso de discrepancias en la interpretación.'
      )
    }
  ];
  
  return (
    <div className="nda-instructions-container">
      <div className="instructions-header">
        <h2>{t('NDA Guide & Best Practices', 'Guía de NDA y Mejores Prácticas')}</h2>
        <p>{t('Expert tips for creating enforceable confidentiality agreements across borders', 'Consejos de expertos para crear acuerdos de confidencialidad ejecutables a través de fronteras')}</p>
        
        <div className="language-toggle-instructions">
          <button
            className={`flag-button ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            <img src="usa-flag.svg" alt="USA" width="24" height="16" />
            English
          </button>
          <button
            className={`flag-button ${language === 'es' ? 'active' : ''}`}
            onClick={() => setLanguage('es')}
          >
            <img src="mexico-flag.svg" alt="Mexico" width="24" height="16" />
            Español
          </button>
        </div>
      </div>
      
      {/* Risk Levels Section */}
      <div className="instructions-section">
        <h3>{t('Understanding Risk Levels', 'Comprendiendo los Niveles de Riesgo')}</h3>
        <div className="risk-cards">
          {riskLevels.map((risk, index) => (
            <div 
              key={index} 
              className="risk-card" 
              style={{ backgroundColor: risk.bgColor, borderColor: risk.color }}
            >
              <div className="risk-card-header" style={{ color: risk.color }}>
                <i data-feather={risk.icon}></i>
                <h4>{risk.title}</h4>
              </div>
              <p>{risk.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Visual Timeline for Protection Periods */}
      <div className="instructions-section">
        <h3>{t('Protection Period Timeline', 'Cronología del Período de Protección')}</h3>
        <div className="timeline-container">
          {protectionPeriods.map((period, index) => {
            const getRiskColor = (risk) => {
              switch(risk) {
                case 'low': return '#15803d';
                case 'medium': return '#d97706';
                case 'high': return '#dc2626';
                default: return '#6b7280';
              }
            };
            
            return (
              <div 
                key={index} 
                className="timeline-item"
                style={{ 
                  '--timelineColor': getRiskColor(period.risk),
                  '--timelineBg': index === protectionPeriods.length - 1 ? getRiskColor(period.risk) + '33' : 'transparent'
                }}
              >
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>{period.range}</h4>
                  <p>{period.description}</p>
                  <p className="timeline-examples">{t('Examples:', 'Ejemplos:')} {period.examples}</p>
                </div>
              </div>
            );
          })}
          <div className="timeline-line"></div>
        </div>
      </div>
      
      {/* Confidentiality Scope Selector */}
      <div className="instructions-section">
        <h3>{t('Confidentiality Scope Guide', 'Guía de Alcance de Confidencialidad')}</h3>
        <div className="scope-cards">
          {confidentialityScopes.map((scope, index) => {
            const getRiskClass = (risk) => {
              switch(risk) {
                case 'low': return 'scope-card-safe';
                case 'medium': return 'scope-card-moderate';
                case 'high': return 'scope-card-risky';
                default: return '';
              }
            };
            
            return (
              <div key={index} className={`scope-card ${getRiskClass(scope.risk)}`}>
                <div className="scope-card-header">
                  <i data-feather={scope.icon}></i>
                  <h4>{scope.title}</h4>
                </div>
                <p>{scope.description}</p>
                <div className="scope-card-tip">
                  <i data-feather="lightbulb"></i>
                  <p>{scope.tip}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Jurisdiction Guidance */}
      <div className="instructions-section">
        <h3>{t('Jurisdiction Considerations', 'Consideraciones de Jurisdicción')}</h3>
        <div className="jurisdiction-map">
          <div className="jurisdiction-categories">
            <div className="jurisdiction-category jurisdiction-safe">
              <h4>{t('Strong Judicial Enforcement', 'Ejecución Judicial Fuerte')}</h4>
              <div className="jurisdiction-list">
                {jurisdictionRisks.safe.map((jurisdiction, i) => (
                  <span key={i} className="jurisdiction-tag">{jurisdiction}</span>
                ))}
              </div>
            </div>
            <div className="jurisdiction-category jurisdiction-moderate">
              <h4>{t('Moderate Enforcement', 'Ejecución Moderada')}</h4>
              <div className="jurisdiction-list">
                {jurisdictionRisks.moderate.map((jurisdiction, i) => (
                  <span key={i} className="jurisdiction-tag">{jurisdiction}</span>
                ))}
              </div>
            </div>
            <div className="jurisdiction-category jurisdiction-risky">
              <h4>{t('Challenging Enforcement', 'Ejecución Desafiante')}</h4>
              <div className="jurisdiction-list">
                {jurisdictionRisks.risky.map((jurisdiction, i) => (
                  <span key={i} className="jurisdiction-tag">{jurisdiction}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="jurisdiction-tip">
            <i data-feather="alert-circle"></i>
            <p>
              {t(
                'Tip: When dealing with cross-border agreements, consider specifying a neutral third-country jurisdiction with strong rule of law and experience in international commercial matters.',
                'Consejo: Cuando se trata de acuerdos transfronterizos, considere especificar una jurisdicción neutral de un tercer país con un fuerte estado de derecho y experiencia en asuntos comerciales internacionales.'
              )}
            </p>
          </div>
        </div>
      </div>
      
      {/* Essential Elements Checklist */}
      <div className="instructions-section">
        <h3>{t('Essential Elements Checklist', 'Lista de Elementos Esenciales')}</h3>
        <div className="elements-checklist">
          {essentialElements.map((element, index) => (
            <div key={index} className="checklist-item">
              <div className="checklist-item-header">
                <i data-feather="check-circle"></i>
                <h4>{element.element}</h4>
              </div>
              <p>{element.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Party Type Decision Tree */}
      <div className="instructions-section">
        <h3>{t('Party Type Considerations', 'Consideraciones según Tipo de Partes')}</h3>
        <div className="party-types">
          {partyTypes.map((party, index) => (
            <div key={index} className="party-type-card">
              <h4>{party.type}</h4>
              <p>{party.description}</p>
              <ul>
                {party.considerations.map((consideration, i) => (
                  <li key={i}>{consideration}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      {/* Best Practices */}
      <div className="instructions-section">
        <h3>{t('Expert Tips for Stronger NDAs', 'Consejos de Expertos para NDAs más Sólidos')}</h3>
        <div className="best-practices">
          {bestPractices.map((practice, index) => (
            <div key={index} className="practice-card">
              <div className="practice-card-header">
                <i data-feather="award"></i>
                <h4>{practice.title}</h4>
              </div>
              <p>{practice.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer section with disclaimer */}
      <div className="instructions-footer">
        <p className="disclaimer">
          {t(
            'Disclaimer: This guide provides general information only and should not be considered legal advice. Always consult with a qualified attorney for advice specific to your situation.',
            'Aviso legal: Esta guía proporciona información general únicamente y no debe considerarse asesoramiento legal. Siempre consulte con un abogado calificado para obtener asesoramiento específico para su situación.'
          )}
        </p>
        <div className="consult-lawyer">
          <button className="consult-button" onClick={() => window.location.href = 'https://terms.law/call/'}>
            <i data-feather="user"></i>
            {t('Schedule a Consultation', 'Programar una Consulta')}
          </button>
          <p>
            {t(
              'Need personalized advice? Schedule a 30-minute consultation to discuss your specific NDA requirements.',
              '¿Necesita asesoramiento personalizado? Programe una consulta de 30 minutos para discutir sus requisitos específicos de NDA.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

// Initialize the component
document.addEventListener("DOMContentLoaded", function() {
  const instructionsContainer = document.getElementById('nda-instructions');
  if (instructionsContainer) {
    ReactDOM.render(<NDAInstructions />, instructionsContainer);
    
    // Initialize Feather icons
    if (window.feather) {
      window.feather.replace();
    }
  }
});