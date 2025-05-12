// NDA Instructions Component
const NDAInstructions = () => {
  // Language state (separate from the main generator)
  const [instructionsLanguage, setInstructionsLanguage] = React.useState('en');
  
  // Translation function for instructions
  const t = (englishText, spanishText) => instructionsLanguage === 'en' ? englishText : spanishText;
  
  return (
    <div className="instructions-container">
      <div className="instructions-header">
        <h2>{t('NDA Guide & Best Practices', 'Guía de NDA y Mejores Prácticas')}</h2>
        <p>{t('Expert tips for creating effective dual-language NDAs', 'Consejos de expertos para crear NDAs bilingües efectivos')}</p>
        
        <div className="language-toggle instructions-toggle">
          <button
            className={`flag-button ${instructionsLanguage === 'en' ? 'active' : ''}`}
            onClick={() => setInstructionsLanguage('en')}
          >
            <img src="usa-flag.svg" alt="USA" width="24" height="16" />
            English
          </button>
          <button
            className={`flag-button ${instructionsLanguage === 'es' ? 'active' : ''}`}
            onClick={() => setInstructionsLanguage('es')}
          >
            <img src="mexico-flag.svg" alt="Mexico" width="24" height="16" />
            Español
          </button>
        </div>
      </div>
      
      <div className="instructions-section">
        <h3>{t('Risk Assessment Guide', 'Guía de Evaluación de Riesgo')}</h3>
        <div className="risk-cards">
          <div className="risk-card low-risk">
            <div className="risk-header">
              <Icon name="shield" />
              <h4>{t('Low Risk Provisions', 'Disposiciones de Bajo Riesgo')}</h4>
            </div>
            <ul>
              <li>{t('Basic identification of parties', 'Identificación básica de las partes')}</li>
              <li>{t('Standard exclusions', 'Exclusiones estándar')}</li>
              <li>{t('1-3 year protection period', 'Período de protección de 1-3 años')}</li>
              <li>{t('Jurisdiction in your home country', 'Jurisdicción en su país de origen')}</li>
            </ul>
          </div>
          
          <div className="risk-card medium-risk">
            <div className="risk-header">
              <Icon name="alert-triangle" />
              <h4>{t('Medium Risk Provisions', 'Disposiciones de Riesgo Medio')}</h4>
            </div>
            <ul>
              <li>{t('4-5 year protection period', 'Período de protección de 4-5 años')}</li>
              <li>{t('No language preference clause', 'Sin cláusula de preferencia de idioma')}</li>
              <li>{t('Broad definition of confidential information', 'Definición amplia de información confidencial')}</li>
              <li>{t('Foreign jurisdiction with similar legal system', 'Jurisdicción extranjera con sistema legal similar')}</li>
            </ul>
          </div>
          
          <div className="risk-card high-risk">
            <div className="risk-header">
              <Icon name="alert-octagon" />
              <h4>{t('High Risk Provisions', 'Disposiciones de Alto Riesgo')}</h4>
            </div>
            <ul>
              <li>{t('Protection period over 5 years', 'Período de protección superior a 5 años')}</li>
              <li>{t('No exclusions clause', 'Sin cláusula de exclusiones')}</li>
              <li>{t('No severability clause', 'Sin cláusula de divisibilidad')}</li>
              <li>{t('Contradictory language and law provisions', 'Disposiciones contradictorias de idioma y ley')}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="instructions-section">
        <h3>{t('Confidentiality Scope Selector', 'Selector de Alcance de Confidencialidad')}</h3>
        <div className="scope-diagram">
          <div className="scope-item broad">
            <div className="scope-circle"></div>
            <div className="scope-content">
              <h4>{t('Broad', 'Amplio')}</h4>
              <p>{t('Protects written, oral, electronic and implied confidential information', 'Protege información confidencial escrita, oral, electrónica e implícita')}</p>
              <div className="tag">{t('Favors Disclosing Party', 'Favorece a la Parte Divulgadora')}</div>
            </div>
          </div>
          
          <div className="scope-item medium">
            <div className="scope-circle"></div>
            <div className="scope-content">
              <h4>{t('Medium', 'Medio')}</h4>
              <p>{t('Protects written and electronic info clearly marked, oral if confirmed in writing', 'Protege información escrita y electrónica claramente marcada, oral si se confirma por escrito')}</p>
              <div className="tag">{t('Balanced Approach', 'Enfoque Equilibrado')}</div>
            </div>
          </div>
          
          <div className="scope-item narrow">
            <div className="scope-circle"></div>
            <div className="scope-content">
              <h4>{t('Narrow', 'Estrecho')}</h4>
              <p>{t('Only protects information explicitly marked as confidential', 'Solo protege información explícitamente marcada como confidencial')}</p>
              <div className="tag">{t('Favors Receiving Party', 'Favorece a la Parte Receptora')}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="instructions-section">
        <h3>{t('Protection Period Timeline', 'Cronología del Período de Protección')}</h3>
        <div className="timeline">
          <div className="timeline-point safe">
            <div className="timeline-marker"></div>
            <div className="timeline-label">1-2 {t('Years', 'Años')}</div>
            <div className="timeline-description">{t('Universally enforceable', 'Universalmente ejecutable')}</div>
          </div>
          
          <div className="timeline-point safe">
            <div className="timeline-marker"></div>
            <div className="timeline-label">3 {t('Years', 'Años')}</div>
            <div className="timeline-description">{t('Standard practice', 'Práctica estándar')}</div>
          </div>
          
          <div className="timeline-point moderate">
            <div className="timeline-marker"></div>
            <div className="timeline-label">4-5 {t('Years', 'Años')}</div>
            <div className="timeline-description">{t('May face scrutiny in some jurisdictions', 'Puede enfrentar escrutinio en algunas jurisdicciones')}</div>
          </div>
          
          <div className="timeline-point risky">
            <div className="timeline-marker"></div>
            <div className="timeline-label">5+ {t('Years', 'Años')}</div>
            <div className="timeline-description">{t('Potentially unenforceable', 'Potencialmente inejecutable')}</div>
          </div>
        </div>
      </div>
      
      <div className="instructions-section two-columns">
        <div className="column">
          <h3>{t('Address Format Guide', 'Guía de Formato de Dirección')}</h3>
          <div className="address-format">
            <div className="address-card">
              <h4>{t('US Format', 'Formato de EE.UU.')}</h4>
              <div className="address-example">
                <p>Company Name</p>
                <p>Street Address, Suite/Unit #</p>
                <p>City, State ZIP</p>
                <p>United States</p>
              </div>
              <div className="address-example">
                <p>Acme Corporation</p>
                <p>123 Main Street, Suite 100</p>
                <p>San Francisco, CA 94105</p>
                <p>United States</p>
              </div>
            </div>
            
            <div className="address-card">
              <h4>{t('Mexican Format', 'Formato Mexicano')}</h4>
              <div className="address-example">
                <p>Nombre de la Empresa</p>
                <p>Calle, Número Ext., Número Int.</p>
                <p>Colonia, Alcaldía/Municipio</p>
                <p>Ciudad, Estado, C.P.</p>
                <p>México</p>
              </div>
              <div className="address-example">
                <p>Corporación Acme</p>
                <p>Av. Insurgentes Sur 1602, Piso 4</p>
                <p>Col. Crédito Constructor, Benito Juárez</p>
                <p>Ciudad de México, CDMX, C.P. 03940</p>
                <p>México</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="column">
          <h3>{t('Law & Language Compatibility', 'Compatibilidad de Ley e Idioma')}</h3>
          <div className="compatibility-matrix">
            <div className="matrix-item safe">
              <div className="compatibility-icon">
                <Icon name="check-circle" />
              </div>
              <div className="compatibility-content">
                <h4>{t('US Law + English Prevails', 'Ley de EE.UU. + Prevalece Inglés')}</h4>
                <p>{t('Highly consistent and predictable enforcement', 'Aplicación altamente consistente y predecible')}</p>
              </div>
            </div>
            
            <div className="matrix-item safe">
              <div className="compatibility-icon">
                <Icon name="check-circle" />
              </div>
              <div className="compatibility-content">
                <h4>{t('Mexican Law + Spanish Prevails', 'Ley Mexicana + Prevalece Español')}</h4>
                <p>{t('Consistent with local legal expectations', 'Consistente con expectativas legales locales')}</p>
              </div>
            </div>
            
            <div className="matrix-item moderate">
              <div className="compatibility-icon">
                <Icon name="alert-triangle" />
              </div>
              <div className="compatibility-content">
                <h4>{t('US Law + No Language Preference', 'Ley de EE.UU. + Sin Preferencia de Idioma')}</h4>
                <p>{t('Potential interpretation challenges', 'Posibles desafíos de interpretación')}</p>
              </div>
            </div>
            
            <div className="matrix-item risky">
              <div className="compatibility-icon">
                <Icon name="x-circle" />
              </div>
              <div className="compatibility-content">
                <h4>{t('Mexican Law + English Prevails', 'Ley Mexicana + Prevalece Inglés')}</h4>
                <p>{t('May face enforcement challenges in Mexican courts', 'Puede enfrentar dificultades de aplicación en tribunales mexicanos')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="instructions-section">
        <h3>{t('Expert Tips', 'Consejos de Expertos')}</h3>
        <div className="tips-container">
          <div className="tip">
            <Icon name="file-text" size={20} />
            <div className="tip-content">
              <h4>{t('Document Both Versions', 'Documentar Ambas Versiones')}</h4>
              <p>{t('Ensure both parties receive signed copies in both languages', 'Asegúrese de que ambas partes reciban copias firmadas en ambos idiomas')}</p>
            </div>
          </div>
          
          <div className="tip">
            <Icon name="globe" size={20} />
            <div className="tip-content">
              <h4>{t('Legal Review in Both Jurisdictions', 'Revisión Legal en Ambas Jurisdicciones')}</h4>
              <p>{t('Have legal counsel from both countries review when possible', 'Haga que abogados de ambos países revisen cuando sea posible')}</p>
            </div>
          </div>
          
          <div className="tip">
            <Icon name="edit-3" size={20} />
            <div className="tip-content">
              <h4>{t('Professional Translation', 'Traducción Profesional')}</h4>
              <p>{t('Use certified legal translators for high-value agreements', 'Utilice traductores legales certificados para acuerdos de alto valor')}</p>
            </div>
          </div>
          
          <div className="tip">
            <Icon name="calendar" size={20} />
            <div className="tip-content">
              <h4>{t('Date Format Consistency', 'Consistencia en el Formato de Fecha')}</h4>
              <p>{t('Use yyyy-mm-dd format to avoid confusion between US and international formats', 'Use el formato aaaa-mm-dd para evitar confusiones entre formatos de EE.UU. e internacionales')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="instructions-footer">
        <p>
          {t(
            'Need help with more complex agreements? ', 
            '¿Necesita ayuda con acuerdos más complejos? '
          )}
          <a href="https://terms.law/call/">{t('Schedule a consultation', 'Programe una consulta')}</a>
        </p>
      </div>
    </div>
  );
};

// Render the instructions below the generator
document.addEventListener('DOMContentLoaded', function() {
  const instructionsContainer = document.createElement('div');
  instructionsContainer.id = 'instructions-root';
  document.getElementById('root').parentNode.insertBefore(instructionsContainer, document.getElementById('root').nextSibling);
  
  ReactDOM.render(<NDAInstructions />, document.getElementById('instructions-root'));
});