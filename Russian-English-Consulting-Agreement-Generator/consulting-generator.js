// Main React component for the Dual-Language Consulting Agreement Generator
console.log('Loading consulting-generator.js...');
const App = () => {
  console.log('App component initializing...');
  // Define state
  const [currentLanguage, setCurrentLanguage] = React.useState('english');
  const [currentTab, setCurrentTab] = React.useState('parties');
  const [formData, setFormData] = React.useState({
    // Parties information
    companyName: '',
    companyAddress: '',
    consultantName: '',
    consultantAddress: '',
    effectiveDate: '',

    // Services
    servicesDescription: '',
    useStatementOfWork: true,

    // Payment terms
    paymentType: 'hourly', // hourly, fixed, milestone
    hourlyRate: '',
    fixedFee: '',
    maxHours: '',
    paymentTermsDays: '30',
    expensesReimbursed: false,

    // Legal terms
    governingLaw: 'california',
    governingCity: 'San Francisco',
    terminationNoticeDays: '10',
    includeNonCompete: false,
    includeNonSolicitation: true,
    nonSolicitationPeriod: '1',

    // Optional clauses
    includeReturnMaterials: true,
    includeLimitationLiability: true,
    includeSeverability: true,
    controllingLanguage: 'english',
  });

  // Track what was last changed for highlighting
  const [lastChanged, setLastChanged] = React.useState(null);

  // Preview section ref for scrolling
  const previewRef = React.useRef(null);

  // Initialize Feather icons after component mounts
  React.useEffect(() => {
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }, [currentTab]); // Re-run when tab changes to update icons

  // Define tabs
  const tabs = [
    { id: 'parties', labelEn: 'Parties', labelRu: 'Стороны' },
    { id: 'services', labelEn: 'Services', labelRu: 'Услуги' },
    { id: 'payment', labelEn: 'Payment', labelRu: 'Оплата' },
    { id: 'legal', labelEn: 'Legal Terms', labelRu: 'Условия' },
    { id: 'summary', labelEn: 'Summary', labelRu: 'Итог' }
  ];

  // Handle language toggle
  const toggleLanguage = (language) => {
    setCurrentLanguage(language);
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
  };

  // Handle form input changes with highlighting
  const handleChange = React.useCallback((e) => {
    const { name, value, type, checked } = e.target;

    setLastChanged(name);

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Trigger highlighting after state update
    setTimeout(() => {
      highlightChangedSection(name);
    }, 100);
  }, []);

  // Highlight and scroll to changed section
  const highlightChangedSection = (fieldName) => {
    const previewElement = document.getElementById('preview-document');
    if (!previewElement) return;

    // Remove any existing highlights
    const existingHighlights = previewElement.querySelectorAll('.highlight');
    existingHighlights.forEach(el => {
      el.classList.remove('highlight');
      el.classList.remove('fade-highlight');
    });

    // Determine which section to highlight based on field name
    let sectionToHighlight = null;

    // For simplicity, highlight entire preview on any change
    // You can make this more sophisticated later
    setTimeout(() => {
      if (previewElement) {
        previewElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle navigation (previous/next buttons)
  const handlePrevious = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1].id);
    }
  };

  // Copy document to clipboard function
  const copyToClipboard = async () => {
    const previewElement = document.getElementById('preview-document');
    if (!previewElement) return;

    try {
      // Create a new div to hold the formatted text
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = previewElement.innerHTML;

      // Copy to clipboard
      await navigator.clipboard.writeText(tempDiv.innerText);

      alert(currentLanguage === 'english' ?
        'Document copied to clipboard!' :
        'Документ скопирован в буфер обмена!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert(currentLanguage === 'english' ?
        'Failed to copy document' :
        'Не удалось скопировать документ');
    }
  };

  // Download as TXT
  const downloadAsTxt = () => {
    const previewElement = document.getElementById('preview-document');
    if (!previewElement) return;

    const text = previewElement.innerText;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'consulting-agreement.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download as DOCX
  const downloadAsDocx = async () => {
    try {
      if (typeof generateConsultingDocx !== 'function') {
        throw new Error('DOCX generator not loaded');
      }
      await generateConsultingDocx(formData, currentLanguage);
    } catch (error) {
      console.error('Error generating DOCX:', error);
      alert(currentLanguage === 'english' ?
        'Error generating document. Please try again.' :
        'Ошибка при создании документа. Попробуйте еще раз.');
    }
  };

  // Main render
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">
            {currentLanguage === 'english' ?
              'Dual-Language Consulting Agreement Generator' :
              'Генератор Двуязычного Договора Оказания Консультационных Услуг'}
          </h1>
          <p className="header-subtitle">
            {currentLanguage === 'english' ?
              'Generate professional consulting agreements in English and Russian' :
              'Создайте профессиональный договор оказания консультационных услуг на английском и русском языках'}
          </p>
        </div>

        {/* Language toggle */}
        <div className="language-toggle">
          <button
            className={`lang-btn ${currentLanguage === 'english' ? 'active' : ''}`}
            onClick={() => toggleLanguage('english')}
          >
            <img src="usa-flag.svg" alt="English" className="flag-icon" />
            <span>English</span>
          </button>
          <button
            className={`lang-btn ${currentLanguage === 'russian' ? 'active' : ''}`}
            onClick={() => toggleLanguage('russian')}
          >
            <img src="russia-flag.svg" alt="Русский" className="flag-icon" />
            <span>Русский</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="main-content">
        {/* Left panel - Form */}
        <div className="form-panel">
          {/* Tabs */}
          <div className="tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab ${currentTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {currentLanguage === 'english' ? tab.labelEn : tab.labelRu}
              </button>
            ))}
          </div>

          {/* Form content */}
          <div className="form-content">
            {currentTab === 'parties' && (
              <PartiesTab formData={formData} handleChange={handleChange} language={currentLanguage} />
            )}
            {currentTab === 'services' && (
              <ServicesTab formData={formData} handleChange={handleChange} language={currentLanguage} />
            )}
            {currentTab === 'payment' && (
              <PaymentTab formData={formData} handleChange={handleChange} language={currentLanguage} />
            )}
            {currentTab === 'legal' && (
              <LegalTab formData={formData} handleChange={handleChange} language={currentLanguage} />
            )}
            {currentTab === 'summary' && (
              <SummaryTab formData={formData} language={currentLanguage} />
            )}
          </div>

          {/* Navigation buttons */}
          <div className="form-navigation">
            <button
              className="nav-btn prev-btn"
              onClick={handlePrevious}
              disabled={currentTab === 'parties'}
            >
              {currentLanguage === 'english' ? '← Previous' : '← Назад'}
            </button>
            <button
              className="nav-btn next-btn"
              onClick={handleNext}
              disabled={currentTab === 'summary'}
            >
              {currentLanguage === 'english' ? 'Next →' : 'Далее →'}
            </button>
          </div>
        </div>

        {/* Right panel - Preview */}
        <div className="preview-panel">
          <div className="preview-header">
            <h3 className="preview-title">
              {currentLanguage === 'english' ? 'Document Preview' : 'Предпросмотр Документа'}
            </h3>
            <div className="preview-actions">
              <button className="action-btn" onClick={copyToClipboard} title={currentLanguage === 'english' ? 'Copy to clipboard' : 'Копировать'}>
                <i data-feather="copy"></i>
              </button>
              <button className="action-btn" onClick={downloadAsTxt} title={currentLanguage === 'english' ? 'Download as TXT' : 'Скачать TXT'}>
                <i data-feather="file-text"></i>
              </button>
              <button className="action-btn primary" onClick={downloadAsDocx} title={currentLanguage === 'english' ? 'Download as DOCX' : 'Скачать DOCX'}>
                <i data-feather="download"></i>
              </button>
            </div>
          </div>
          <div className="preview-content" ref={previewRef}>
            <DocumentPreview formData={formData} language={currentLanguage} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          {currentLanguage === 'english' ? (
            <>Created by <a href="https://terms.law" target="_blank" rel="noopener noreferrer">Sergei Tokmakov, Esq.</a> | California Bar #279869</>
          ) : (
            <>Создано <a href="https://terms.law" target="_blank" rel="noopener noreferrer">Сергей Токмаков</a> | Адвокат Калифорнии #279869</>
          )}
        </p>
      </footer>
    </div>
  );
};

// Parties Tab Component
const PartiesTab = ({ formData, handleChange, language }) => (
  <div className="tab-content">
    <h3 className="tab-title">
      {language === 'english' ? 'Parties Information' : 'Информация о Сторонах'}
    </h3>

    <div className="form-group">
      <label className="form-label">
        {language === 'english' ? 'Company Name' : 'Название Компании'}
        <span className="required">*</span>
      </label>
      <input
        type="text"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        className="form-input"
        placeholder={language === 'english' ? 'e.g., Tech Solutions Inc.' : 'например, ООО "Тех Солюшнс"'}
        required
      />
    </div>

    <div className="form-group">
      <label className="form-label">
        {language === 'english' ? 'Company Address' : 'Адрес Компании'}
        <span className="required">*</span>
      </label>
      <textarea
        name="companyAddress"
        value={formData.companyAddress}
        onChange={handleChange}
        className="form-textarea"
        rows="3"
        placeholder={language === 'english' ?
          '123 Main Street, Suite 100, San Francisco, CA 94105' :
          '123 Main Street, Suite 100, San Francisco, CA 94105'}
        required
      />
    </div>

    <div className="form-group">
      <label className="form-label">
        {language === 'english' ? 'Consultant Name' : 'Имя Консультанта'}
        <span className="required">*</span>
      </label>
      <input
        type="text"
        name="consultantName"
        value={formData.consultantName}
        onChange={handleChange}
        className="form-input"
        placeholder={language === 'english' ? 'e.g., John Smith' : 'например, Иван Иванов'}
        required
      />
    </div>

    <div className="form-group">
      <label className="form-label">
        {language === 'english' ? 'Consultant Address' : 'Адрес Консультанта'}
        <span className="required">*</span>
      </label>
      <textarea
        name="consultantAddress"
        value={formData.consultantAddress}
        onChange={handleChange}
        className="form-textarea"
        rows="3"
        placeholder={language === 'english' ?
          '456 Oak Avenue, Moscow, Russia' :
          '456 Oak Avenue, Москва, Россия'}
        required
      />
    </div>

    <div className="form-group">
      <label className="form-label">
        {language === 'english' ? 'Effective Date' : 'Дата Вступления в Силу'}
        <span className="required">*</span>
      </label>
      <input
        type="date"
        name="effectiveDate"
        value={formData.effectiveDate}
        onChange={handleChange}
        className="form-input"
        required
      />
    </div>

    <div className="info-box">
      <i data-feather="info"></i>
      <p>
        {language === 'english' ?
          'This information will appear in the agreement header and signature sections.' :
          'Эта информация появится в заголовке договора и в разделах подписей.'}
      </p>
    </div>
  </div>
);

// Services Tab Component
const ServicesTab = ({ formData, handleChange, language }) => (
  <div className="tab-content">
    <h3 className="tab-title">
      {language === 'english' ? 'Services Description' : 'Описание Услуг'}
    </h3>

    <div className="form-group">
      <label className="form-label">
        <input
          type="checkbox"
          name="useStatementOfWork"
          checked={formData.useStatementOfWork}
          onChange={handleChange}
          className="form-checkbox"
        />
        {language === 'english' ?
          'Use separate Statement of Work (Recommended)' :
          'Использовать отдельный Регламент Услуг (Рекомендуется)'}
      </label>
      <p className="help-text">
        {language === 'english' ?
          'A Statement of Work (SOW) allows you to define specific projects separately without modifying the main agreement.' :
          'Регламент Услуг позволяет определять конкретные проекты отдельно без изменения основного договора.'}
      </p>
    </div>

    {!formData.useStatementOfWork && (
      <div className="form-group">
        <label className="form-label">
          {language === 'english' ? 'Services Description' : 'Описание Услуг'}
          <span className="required">*</span>
        </label>
        <textarea
          name="servicesDescription"
          value={formData.servicesDescription}
          onChange={handleChange}
          className="form-textarea"
          rows="6"
          placeholder={language === 'english' ?
            'Describe the services to be provided by the Consultant...' :
            'Опишите услуги, которые будет предоставлять Консультант...'}
          required={!formData.useStatementOfWork}
        />
      </div>
    )}

    <div className="info-box">
      <i data-feather="info"></i>
      <p>
        {language === 'english' ?
          'Most consulting agreements use a Statement of Work (SOW) to define specific services, deliverables, and timelines for each project.' :
          'Большинство консультационных договоров используют Регламент Услуг для определения конкретных услуг, результатов и сроков для каждого проекта.'}
      </p>
    </div>
  </div>
);

// Payment Tab Component
const PaymentTab = ({ formData, handleChange, language }) => (
  <div className="tab-content">
    <h3 className="tab-title">
      {language === 'english' ? 'Payment Terms' : 'Условия Оплаты'}
    </h3>

    <div className="form-group">
      <label className="form-label">
        {language === 'english' ? 'Payment Structure' : 'Структура Оплаты'}
      </label>
      <select
        name="paymentType"
        value={formData.paymentType}
        onChange={handleChange}
        className="form-select"
      >
        <option value="hourly">{language === 'english' ? 'Hourly Rate' : 'Почасовая Ставка'}</option>
        <option value="fixed">{language === 'english' ? 'Fixed Fee' : 'Фиксированная Плата'}</option>
        <option value="milestone">{language === 'english' ? 'Milestone-Based' : 'По Этапам'}</option>
      </select>
    </div>

    {formData.paymentType === 'hourly' && (
      <>
        <div className="form-group">
          <label className="form-label">
            {language === 'english' ? 'Hourly Rate (USD)' : 'Почасовая Ставка (USD)'}
            <span className="required">*</span>
          </label>
          <input
            type="number"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleChange}
            className="form-input"
            placeholder="150"
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            {language === 'english' ? 'Maximum Hours (optional)' : 'Максимальное Количество Часов (опционально)'}
          </label>
          <input
            type="number"
            name="maxHours"
            value={formData.maxHours}
            onChange={handleChange}
            className="form-input"
            placeholder="160"
            min="0"
          />
        </div>
      </>
    )}

    {formData.paymentType === 'fixed' && (
      <div className="form-group">
        <label className="form-label">
          {language === 'english' ? 'Fixed Fee (USD)' : 'Фиксированная Плата (USD)'}
          <span className="required">*</span>
        </label>
        <input
          type="number"
          name="fixedFee"
          value={formData.fixedFee}
          onChange={handleChange}
          className="form-input"
          placeholder="5000"
          min="0"
          step="0.01"
        />
      </div>
    )}

    <div className="form-group">
      <label className="form-label">
        {language === 'english' ? 'Payment Terms (Days)' : 'Срок Оплаты (Дней)'}
      </label>
      <select
        name="paymentTermsDays"
        value={formData.paymentTermsDays}
        onChange={handleChange}
        className="form-select"
      >
        <option value="15">{language === 'english' ? 'Net 15 (15 days)' : 'Net 15 (15 дней)'}</option>
        <option value="30">{language === 'english' ? 'Net 30 (30 days)' : 'Net 30 (30 дней)'}</option>
        <option value="45">{language === 'english' ? 'Net 45 (45 days)' : 'Net 45 (45 дней)'}</option>
        <option value="60">{language === 'english' ? 'Net 60 (60 days)' : 'Net 60 (60 дней)'}</option>
      </select>
    </div>

    <div className="form-group">
      <label className="form-label">
        <input
          type="checkbox"
          name="expensesReimbursed"
          checked={formData.expensesReimbursed}
          onChange={handleChange}
          className="form-checkbox"
        />
        {language === 'english' ?
          'Company will reimburse expenses' :
          'Компания возмещает расходы'}
      </label>
      <p className="help-text">
        {language === 'english' ?
          'If checked, the consultant can request reimbursement for approved expenses.' :
          'Если отмечено, консультант может запросить возмещение утвержденных расходов.'}
      </p>
    </div>

    <div className="info-box">
      <i data-feather="info"></i>
      <p>
        {language === 'english' ?
          'Net 30 is the most common payment term in the US, meaning payment is due 30 days after invoice date.' :
          'Net 30 - самый распространенный срок оплаты в США, что означает оплату в течение 30 дней после даты счета.'}
      </p>
    </div>
  </div>
);

// Legal Tab Component
const LegalTab = ({ formData, handleChange, language }) => (
  <div className="tab-content">
    <h3 className="tab-title">
      {language === 'english' ? 'Legal Terms & Options' : 'Юридические Условия и Опции'}
    </h3>

    <div className="form-group">
      <label className="form-label">
        {language === 'english' ? 'Governing Law (State)' : 'Применимое Право (Штат)'}
      </label>
      <select
        name="governingLaw"
        value={formData.governingLaw}
        onChange={handleChange}
        className="form-select"
      >
        <option value="california">California</option>
        <option value="newyork">New York</option>
        <option value="texas">Texas</option>
        <option value="florida">Florida</option>
        <option value="delaware">Delaware</option>
      </select>
    </div>

    <div className="form-group">
      <label className="form-label">
        {language === 'english' ? 'Jurisdiction City' : 'Город Юрисдикции'}
      </label>
      <input
        type="text"
        name="governingCity"
        value={formData.governingCity}
        onChange={handleChange}
        className="form-input"
        placeholder={language === 'english' ? 'San Francisco' : 'Сан-Франциско'}
      />
    </div>

    <div className="form-group">
      <label className="form-label">
        {language === 'english' ? 'Termination Notice Period (Days)' : 'Период Уведомления о Расторжении (Дней)'}
      </label>
      <input
        type="number"
        name="terminationNoticeDays"
        value={formData.terminationNoticeDays}
        onChange={handleChange}
        className="form-input"
        placeholder="10"
        min="0"
      />
    </div>

    <div className="form-group">
      <label className="form-label">
        <input
          type="checkbox"
          name="includeNonCompete"
          checked={formData.includeNonCompete}
          onChange={handleChange}
          className="form-checkbox"
        />
        {language === 'english' ?
          'Include Non-Compete Clause' :
          'Включить Пункт о Неконкуренции'}
      </label>
      <p className="help-text">
        {language === 'english' ?
          'Note: Non-compete clauses are generally unenforceable in California but valid in most other states.' :
          'Примечание: Пункты о неконкуренции обычно неисполнимы в Калифорнии, но действительны в большинстве других штатов.'}
      </p>
    </div>

    <div className="form-group">
      <label className="form-label">
        <input
          type="checkbox"
          name="includeNonSolicitation"
          checked={formData.includeNonSolicitation}
          onChange={handleChange}
          className="form-checkbox"
        />
        {language === 'english' ?
          'Include Non-Solicitation Clause' :
          'Включить Пункт о Непереманивании Сотрудников'}
      </label>
      {formData.includeNonSolicitation && (
        <div className="nested-form-group">
          <label className="form-label">
            {language === 'english' ? 'Non-Solicitation Period (Years)' : 'Период Непереманивания (Лет)'}
          </label>
          <input
            type="number"
            name="nonSolicitationPeriod"
            value={formData.nonSolicitationPeriod}
            onChange={handleChange}
            className="form-input"
            placeholder="1"
            min="1"
            max="5"
          />
        </div>
      )}
    </div>

    <div className="form-group">
      <label className="form-label">
        <input
          type="checkbox"
          name="includeReturnMaterials"
          checked={formData.includeReturnMaterials}
          onChange={handleChange}
          className="form-checkbox"
        />
        {language === 'english' ?
          'Include Return of Materials Provision' :
          'Включить Положение о Возврате Материалов'}
      </label>
    </div>

    <div className="form-group">
      <label className="form-label">
        <input
          type="checkbox"
          name="includeLimitationLiability"
          checked={formData.includeLimitationLiability}
          onChange={handleChange}
          className="form-checkbox"
        />
        {language === 'english' ?
          'Include Limitation of Liability' :
          'Включить Ограничение Ответственности'}
      </label>
    </div>

    <div className="form-group">
      <label className="form-label">
        <input
          type="checkbox"
          name="includeSeverability"
          checked={formData.includeSeverability}
          onChange={handleChange}
          className="form-checkbox"
        />
        {language === 'english' ?
          'Include Severability Clause' :
          'Включить Пункт о Независимости Положений'}
      </label>
    </div>

    <div className="form-group">
      <label className="form-label">
        {language === 'english' ? 'Controlling Language' : 'Преобладающий Язык'}
      </label>
      <select
        name="controllingLanguage"
        value={formData.controllingLanguage}
        onChange={handleChange}
        className="form-select"
      >
        <option value="english">{language === 'english' ? 'English' : 'Английский'}</option>
        <option value="russian">{language === 'english' ? 'Russian' : 'Русский'}</option>
      </select>
      <p className="help-text">
        {language === 'english' ?
          'In case of discrepancy, which language version will prevail?' :
          'В случае разночтений, какая языковая версия будет иметь преимущество?'}
      </p>
    </div>

    <div className="info-box warning">
      <i data-feather="alert-triangle"></i>
      <p>
        {language === 'english' ?
          'These legal terms have important implications. Consider consulting with a licensed attorney before finalizing your agreement.' :
          'Эти юридические условия имеют важные последствия. Рассмотрите возможность консультации с лицензированным адвокатом перед заключением договора.'}
      </p>
    </div>
  </div>
);

// Summary Tab Component
const SummaryTab = ({ formData, language }) => {
  const getMissingFields = () => {
    const required = [];
    if (!formData.companyName) required.push(language === 'english' ? 'Company Name' : 'Название Компании');
    if (!formData.companyAddress) required.push(language === 'english' ? 'Company Address' : 'Адрес Компании');
    if (!formData.consultantName) required.push(language === 'english' ? 'Consultant Name' : 'Имя Консультанта');
    if (!formData.consultantAddress) required.push(language === 'english' ? 'Consultant Address' : 'Адрес Консультанта');
    if (!formData.effectiveDate) required.push(language === 'english' ? 'Effective Date' : 'Дата Вступления в Силу');

    if (!formData.useStatementOfWork && !formData.servicesDescription) {
      required.push(language === 'english' ? 'Services Description' : 'Описание Услуг');
    }

    if (formData.paymentType === 'hourly' && !formData.hourlyRate) {
      required.push(language === 'english' ? 'Hourly Rate' : 'Почасовая Ставка');
    }

    if (formData.paymentType === 'fixed' && !formData.fixedFee) {
      required.push(language === 'english' ? 'Fixed Fee' : 'Фиксированная Плата');
    }

    return required;
  };

  const missingFields = getMissingFields();
  const isComplete = missingFields.length === 0;

  return (
    <div className="tab-content">
      <h3 className="tab-title">
        {language === 'english' ? 'Agreement Summary' : 'Сводка по Договору'}
      </h3>

      {!isComplete && (
        <div className="alert alert-warning">
          <i data-feather="alert-circle"></i>
          <div>
            <h4>{language === 'english' ? 'Missing Required Information' : 'Отсутствует Обязательная Информация'}</h4>
            <ul>
              {missingFields.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="alert alert-success">
          <i data-feather="check-circle"></i>
          <div>
            <h4>{language === 'english' ? 'Agreement is Complete!' : 'Договор Заполнен!'}</h4>
            <p>
              {language === 'english' ?
                'All required information has been provided. You can now download or copy your agreement.' :
                'Вся необходимая информация предоставлена. Теперь вы можете скачать или скопировать ваш договор.'}
            </p>
          </div>
        </div>
      )}

      <div className="summary-section">
        <h4 className="summary-heading">{language === 'english' ? 'Parties' : 'Стороны'}</h4>
        <div className="summary-item">
          <span className="summary-label">{language === 'english' ? 'Company:' : 'Компания:'}</span>
          <span className="summary-value">{formData.companyName || '—'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">{language === 'english' ? 'Consultant:' : 'Консультант:'}</span>
          <span className="summary-value">{formData.consultantName || '—'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">{language === 'english' ? 'Effective Date:' : 'Дата Вступления:'}</span>
          <span className="summary-value">{formData.effectiveDate || '—'}</span>
        </div>
      </div>

      <div className="summary-section">
        <h4 className="summary-heading">{language === 'english' ? 'Services' : 'Услуги'}</h4>
        <div className="summary-item">
          <span className="summary-label">{language === 'english' ? 'Structure:' : 'Структура:'}</span>
          <span className="summary-value">
            {formData.useStatementOfWork ?
              (language === 'english' ? 'Statement of Work' : 'Регламент Услуг') :
              (language === 'english' ? 'Defined in Agreement' : 'Определено в Договоре')}
          </span>
        </div>
      </div>

      <div className="summary-section">
        <h4 className="summary-heading">{language === 'english' ? 'Payment' : 'Оплата'}</h4>
        <div className="summary-item">
          <span className="summary-label">{language === 'english' ? 'Type:' : 'Тип:'}</span>
          <span className="summary-value">
            {formData.paymentType === 'hourly' && (language === 'english' ? 'Hourly' : 'Почасовая')}
            {formData.paymentType === 'fixed' && (language === 'english' ? 'Fixed Fee' : 'Фиксированная')}
            {formData.paymentType === 'milestone' && (language === 'english' ? 'Milestone-Based' : 'По Этапам')}
          </span>
        </div>
        {formData.paymentType === 'hourly' && formData.hourlyRate && (
          <div className="summary-item">
            <span className="summary-label">{language === 'english' ? 'Rate:' : 'Ставка:'}</span>
            <span className="summary-value">${formData.hourlyRate}/hr</span>
          </div>
        )}
        {formData.paymentType === 'fixed' && formData.fixedFee && (
          <div className="summary-item">
            <span className="summary-label">{language === 'english' ? 'Fee:' : 'Плата:'}</span>
            <span className="summary-value">${formData.fixedFee}</span>
          </div>
        )}
        <div className="summary-item">
          <span className="summary-label">{language === 'english' ? 'Terms:' : 'Условия:'}</span>
          <span className="summary-value">Net {formData.paymentTermsDays}</span>
        </div>
      </div>

      <div className="summary-section">
        <h4 className="summary-heading">{language === 'english' ? 'Legal Terms' : 'Юридические Условия'}</h4>
        <div className="summary-item">
          <span className="summary-label">{language === 'english' ? 'Governing Law:' : 'Применимое Право:'}</span>
          <span className="summary-value">{formData.governingLaw}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">{language === 'english' ? 'Termination Notice:' : 'Уведомление о Расторжении:'}</span>
          <span className="summary-value">{formData.terminationNoticeDays} {language === 'english' ? 'days' : 'дней'}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">{language === 'english' ? 'Non-Compete:' : 'Неконкуренция:'}</span>
          <span className="summary-value">{formData.includeNonCompete ? (language === 'english' ? 'Yes' : 'Да') : (language === 'english' ? 'No' : 'Нет')}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">{language === 'english' ? 'Non-Solicitation:' : 'Непереманивание:'}</span>
          <span className="summary-value">{formData.includeNonSolicitation ? (language === 'english' ? 'Yes' : 'Да') : (language === 'english' ? 'No' : 'Нет')}</span>
        </div>
      </div>

      <div className="cta-section">
        <p className="cta-text">
          {language === 'english' ?
            'Need help with your consulting agreement? Schedule a consultation with Attorney Sergei Tokmakov.' :
            'Нужна помощь с вашим договором? Запишитесь на консультацию с адвокатом Сергеем Токмаковым.'}
        </p>
        <a
          href="https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button"
        >
          {language === 'english' ? 'Schedule Consultation ($125)' : 'Записаться на Консультацию ($125)'}
        </a>
      </div>
    </div>
  );
};

// Document Preview Component
const DocumentPreview = ({ formData, language }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '[DATE]';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatDateRu = (dateString) => {
    if (!dateString) return '[ДАТА]';
    const date = new Date(dateString);
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} г.`;
  };

  const getStateName = (stateCode) => {
    const states = {
      california: 'California',
      newyork: 'New York',
      texas: 'Texas',
      florida: 'Florida',
      delaware: 'Delaware'
    };
    return states[stateCode] || stateCode;
  };

  return (
    <div id="preview-document" className="document-preview">
      {/* English Version */}
      <div className="document-section">
        <div className="document-title">CONSULTING AGREEMENT</div>

        <p className="document-paragraph">
          This Consulting Agreement ("Agreement") is entered into as of <strong>{formatDate(formData.effectiveDate)}</strong> (the "Effective Date"),
          between <strong>{formData.companyName || '[Company Name]'}</strong> ("Company"),
          and <strong>{formData.consultantName || '[Consultant Name]'}</strong> ("Consultant")
          (the Company and Consultant are each referred to herein individually as a "Party" and collectively as the "Parties").
        </p>

        <p className="document-paragraph">
          For good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged, the Parties agree as follows:
        </p>

        {/* Section 1: Services */}
        <div className="section-title">1. SERVICES</div>

        {formData.useStatementOfWork ? (
          <>
            <p className="section-subtitle">1.1 Statements of Work.</p>
            <p className="document-paragraph">
              From time to time, Company and Consultant may execute one or more statements of work that describe the specific services
              to be performed by Consultant (as executed, a "Statement of Work"). Each Statement of Work will expressly refer to this Agreement,
              will form a part of this Agreement, and will be subject to the terms and conditions contained herein.
              A Statement of Work may be amended only by written agreement of the parties.
            </p>

            <p className="section-subtitle">1.2 Performance of Services.</p>
            <p className="document-paragraph">
              Consultant will perform the services described in each Statement of Work (the "Services") in accordance with the terms
              and conditions set forth in each such Statement of Work and this Agreement.
            </p>

            <p className="section-subtitle">1.3 Delivery.</p>
            <p className="document-paragraph">
              Consultant will deliver to Company the deliverables, designs, modules, software, products, documentation and other materials
              specified in the Statement of Work (individually or collectively, "Deliverables") in accordance with the delivery schedule
              and other terms and conditions set forth in the Statement of Work.
            </p>
          </>
        ) : (
          <>
            <p className="section-subtitle">1.1 Services.</p>
            <p className="document-paragraph">
              Consultant shall provide the following services to Company ("Services"):
            </p>
            <p className="document-paragraph indented">
              {formData.servicesDescription || '[Describe services to be provided]'}
            </p>
          </>
        )}

        {/* Section 2: Payment */}
        <div className="section-title">2. PAYMENT</div>

        <p className="section-subtitle">2.1 Fees.</p>
        <p className="document-paragraph">
          As Consultant's sole compensation for the performance of Services, Company will pay Consultant
          {formData.paymentType === 'hourly' && formData.hourlyRate && (
            <> at the rate of <strong>${formData.hourlyRate} per hour</strong></>
          )}
          {formData.paymentType === 'hourly' && formData.maxHours && (
            <>, not to exceed <strong>{formData.maxHours} hours</strong> without prior written approval</>
          )}
          {formData.paymentType === 'fixed' && formData.fixedFee && (
            <> a fixed fee of <strong>${formData.fixedFee}</strong></>
          )}
          {formData.paymentType === 'milestone' && (
            <> according to milestones specified in the Statement of Work</>
          )}
          {formData.useStatementOfWork && (
            <> the fees specified in each Statement of Work in accordance with the terms set forth therein</>
          )}
          .
        </p>

        <p className="section-subtitle">2.2 Expenses.</p>
        <p className="document-paragraph">
          {formData.expensesReimbursed ? (
            <>Company will reimburse Consultant for reasonable, pre-approved expenses incurred by Consultant in connection with performing Services,
            provided that Consultant submits documentation supporting such expenses.</>
          ) : (
            <>Unless otherwise specified in a Statement of Work, Company will not reimburse Consultant for any expenses incurred by Consultant
            in connection with performing Services.</>
          )}
        </p>

        <p className="section-subtitle">2.3 Payment Terms.</p>
        <p className="document-paragraph">
          All fees and other amounts are stated in and are payable in U.S. dollars. Consultant will invoice Company
          {formData.paymentType === 'hourly' && <> on a monthly basis</>} for all fees and expenses payable to Consultant.
          Company will pay the full amount of each such invoice within <strong>{formData.paymentTermsDays} days</strong> following receipt thereof,
          except for any amounts that Company disputes in good faith. The parties will use their respective commercially reasonable efforts
          to promptly resolve any such payment disputes.
        </p>

        {/* Section 3: Relationship of Parties */}
        <div className="section-title">3. RELATIONSHIP OF THE PARTIES</div>

        <p className="section-subtitle">3.1 Independent Contractor.</p>
        <p className="document-paragraph">
          Consultant is an independent contractor and nothing in this Agreement will be construed as establishing an employment
          or agency relationship between Company and Consultant. Consultant has no authority to bind Company by contract or otherwise.
          Consultant will perform Services under the general direction of Company, but Consultant will determine, in Consultant's sole discretion,
          the manner and means by which Services are accomplished, subject to the requirement that Consultant will at all times comply with applicable law.
        </p>

        <p className="section-subtitle">3.2 Taxes and Employee Benefits.</p>
        <p className="document-paragraph">
          Consultant will report to all applicable government agencies as income all compensation received by Consultant pursuant to this Agreement.
          Consultant will be solely responsible for payment of all withholding taxes, social security, workers' compensation, unemployment
          and disability insurance or similar items required by any government agency. Consultant will not be entitled to any benefits paid
          or made available by Company to its employees, including, without limitation, any vacation or illness payments, or to participate
          in any plans, arrangements or distributions made by Company pertaining to any bonus, stock option, profit sharing, insurance
          or similar benefits. Consultant will indemnify and hold Company harmless from and against all damages, liabilities, losses, penalties,
          fines, expenses and costs (including reasonable fees and expenses of attorneys and other professionals) arising out of or relating
          to any obligation imposed by law on Company to pay any withholding taxes, social security, unemployment or disability insurance
          or similar items in connection with compensation received by Consultant pursuant to this Agreement.
        </p>

        <p className="section-subtitle">3.3 Liability Insurance.</p>
        <p className="document-paragraph">
          Consultant acknowledges that Company will not carry any liability insurance on behalf of Consultant. Consultant will maintain
          in force adequate liability insurance to protect Consultant from claims of personal injury (or death) or tangible or intangible
          property damage (including loss of use) that arise out of any act or omission of Consultant.
        </p>

        {/* Section 4: Ownership */}
        <div className="section-title">4. OWNERSHIP</div>

        <p className="section-subtitle">4.1 Disclosure of Work Product.</p>
        <p className="document-paragraph">
          Consultant will, as an integral part of the performance of Services, disclose in writing to Company all inventions, products, designs,
          drawings, notes, documents, information, documentation, improvements, works of authorship, processes, techniques, know-how, algorithms,
          specifications, biological or chemical specimens or samples, hardware, circuits, computer programs, databases, user interfaces,
          encoding techniques, and other materials of any kind that Consultant may make, conceive, develop or reduce to practice, alone or jointly
          with others, in connection with performing Services or that result from or that are related to such Services (collectively, "Consultant Work Product").
          Consultant Work Product includes without limitation any Deliverables that Consultant delivers to Company.
        </p>

        <p className="section-subtitle">4.2 Ownership of Consultant Work Product.</p>
        <p className="document-paragraph">
          Consultant agrees that all Consultant Work Product is and will be the sole and exclusive property of Company. Consultant hereby
          irrevocably transfers and assigns to Company, and agrees to irrevocably transfer and assign to Company, all right, title and interest
          in and to the Consultant Work Product, including all worldwide patent rights (including patent applications and disclosures),
          copyright rights, mask work rights, trade secret rights, know-how, and any and all other intellectual property or proprietary rights
          (collectively, "Intellectual Property Rights") therein. At Company's request and expense, during and after the term of this Agreement,
          Consultant will assist and cooperate with Company in all respects, and will execute documents, and will take such further acts reasonably
          requested by Company to enable Company to acquire, transfer, maintain, perfect and enforce its Intellectual Property Rights and other
          legal protections for the Consultant Work Product. Consultant hereby appoints the officers of Company as Consultant's attorney-in-fact
          to execute documents on behalf of Consultant for this limited purpose.
        </p>

        {/* Section 5: Confidentiality */}
        <div className="section-title">5. CONFIDENTIAL INFORMATION</div>

        <p className="document-paragraph">
          For purposes of this Agreement, "Confidential Information" means and will include: (i) any information, materials or knowledge
          regarding Company and its business, financial condition, products, programming techniques, customers, suppliers, technology
          or research and development that is disclosed to Consultant or to which Consultant has access in connection with performing Services;
          (ii) the Consultant Work Product; and (iii) the terms and conditions of this Agreement. Confidential Information will not include
          any information that: (a) is or becomes part of the public domain through no fault of Consultant; (b) was rightfully in Consultant's
          possession at the time of disclosure, without restriction as to use or disclosure; or (c) Consultant rightfully receives from a third party
          who has the right to disclose it and who provides it without restriction as to use or disclosure. Consultant agrees to hold all
          Confidential Information in strict confidence, not to use it in any way, commercially or otherwise, except in performing Services,
          and not to disclose it to others. Consultant further agrees to take all actions reasonably necessary to protect the confidentiality
          of all Confidential Information.
        </p>

        {/* Section 6: Warranties */}
        <div className="section-title">6. WARRANTIES</div>

        <p className="section-subtitle">6.1 No Pre-existing Obligations.</p>
        <p className="document-paragraph">
          Consultant represents and warrants that Consultant has no pre-existing obligations or commitments (and will not assume or otherwise
          undertake any obligations or commitments) that would be in conflict or inconsistent with or that would hinder Consultant's performance
          of its obligations under this Agreement.
        </p>

        <p className="section-subtitle">6.2 Performance Standard.</p>
        <p className="document-paragraph">
          Consultant represents and warrants that Services will be performed in a thorough and professional manner, consistent with high professional
          and industry standards by individuals with the requisite training, background, experience, technical knowledge and skills to perform Services.
        </p>

        <p className="section-subtitle">6.3 Non-infringement.</p>
        <p className="document-paragraph">
          Consultant represents and warrants that the Consultant Work Product will not infringe, misappropriate or violate the rights of any third party,
          including, without limitation, any Intellectual Property Rights or any rights of privacy or rights of publicity, except to the extent
          any portion of the Consultant Work Product is created, developed or supplied by Company or by a third party on behalf of Company.
        </p>

        {formData.includeNonCompete && (
          <>
            <p className="section-subtitle">6.4 Competitive Activities.</p>
            <p className="document-paragraph">
              During the term of this Agreement, Consultant will not, directly or indirectly, in any individual or representative capacity,
              engage or participate in or provide services to any business that is competitive with the types and kinds of business being conducted by Company.
            </p>
          </>
        )}

        {formData.includeNonSolicitation && (
          <>
            <p className="section-subtitle">{formData.includeNonCompete ? '6.5' : '6.4'} Non-Solicitation of Personnel.</p>
            <p className="document-paragraph">
              During the term of this Agreement and for a period of <strong>{formData.nonSolicitationPeriod} year(s)</strong> thereafter,
              Consultant will not directly or indirectly solicit the services of any Company employee or consultant for Consultant's own benefit
              or for the benefit of any other person or entity.
            </p>
          </>
        )}

        {/* Section 7: Indemnity */}
        <div className="section-title">7. INDEMNITY</div>

        <p className="document-paragraph">
          Consultant will defend, indemnify and hold Company harmless from and against all claims, damages, liabilities, losses, expenses
          and costs (including reasonable fees and expenses of attorneys and other professionals) arising out of or resulting from:
        </p>
        <p className="document-paragraph indented">
          (a) any action by a third party against Company that is based on a claim that any Services performed under this Agreement,
          or the results of such Services (including any Consultant Work Product), or Company's use thereof, infringe, misappropriate
          or violate such third party's Intellectual Property Rights; and
        </p>
        <p className="document-paragraph indented">
          (b) any action by a third party against Company that is based on any act or omission of Consultant and that results in:
          (i) personal injury (or death) or tangible or intangible property damage (including loss of use); or (ii) the violation
          of any statute, ordinance, or regulation.
        </p>

        {/* Section 8: Term and Termination */}
        <div className="section-title">8. TERM AND TERMINATION</div>

        <p className="section-subtitle">8.1 Term.</p>
        <p className="document-paragraph">
          This Agreement will commence on the Effective Date and, unless terminated earlier in accordance with the terms of this Agreement,
          will remain in force and effect for as long as Consultant is performing Services.
        </p>

        <p className="section-subtitle">8.2 Termination for Breach.</p>
        <p className="document-paragraph">
          Either Party may terminate this Agreement (including all Statements of Work) if the other Party breaches any material term of this Agreement
          and fails to cure such breach within thirty (30) days following written notice thereof from the non-breaching Party.
        </p>

        <p className="section-subtitle">8.3 Termination for Convenience.</p>
        <p className="document-paragraph">
          Company may terminate this Agreement (including all Statements of Work) at any time, for any reason or no reason,
          upon at least <strong>{formData.terminationNoticeDays} days</strong> written notice to Consultant. Company may also terminate
          an individual Statement of Work at any time, for any reason or no reason, upon at least <strong>{formData.terminationNoticeDays} days</strong> written notice to Consultant.
        </p>

        <p className="section-subtitle">8.4 Effect of Termination.</p>
        <p className="document-paragraph">
          Upon the expiration or termination of this Agreement for any reason: (i) Consultant will promptly deliver to Company all Consultant Work Product,
          including all work in progress on any Consultant Work Product not previously delivered to Company, if any;
          {formData.includeReturnMaterials && (
            <> (ii) Consultant will promptly deliver to Company all Confidential Information in Consultant's possession or control; and</>
          )}
          {formData.includeReturnMaterials ? ' (iii)' : ' (ii)'} Company will pay Consultant any accrued but unpaid fees due and payable to Consultant.
        </p>

        <p className="section-subtitle">8.5 Survival.</p>
        <p className="document-paragraph">
          The rights and obligations of the parties under Sections 2, 3.2, 3.3, 4, 5, 6.3,
          {formData.includeNonSolicitation && <> 6.{formData.includeNonCompete ? '5' : '4'},</>}
          {' '}7, 8.4, 8.5, 9 and 10 will survive the expiration or termination of this Agreement.
        </p>

        {/* Section 9: Limitation of Liability */}
        {formData.includeLimitationLiability && (
          <>
            <div className="section-title">9. LIMITATION OF LIABILITY</div>
            <p className="document-paragraph uppercase">
              IN NO EVENT WILL COMPANY BE LIABLE FOR ANY SPECIAL, INCIDENTAL, PUNITIVE, EXEMPLARY OR CONSEQUENTIAL DAMAGES OF ANY KIND
              IN CONNECTION WITH THIS AGREEMENT, EVEN IF COMPANY HAS BEEN INFORMED IN ADVANCE OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
          </>
        )}

        {/* Section 10: General */}
        <div className="section-title">{formData.includeLimitationLiability ? '10' : '9'}. GENERAL</div>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.1 Assignment.</p>
        <p className="document-paragraph">
          Consultant may not assign or transfer this Agreement, in whole or in part, without Company's express prior written consent.
          Any attempt to assign this Agreement, without such consent, will be void. Subject to the foregoing, this Agreement will bind
          and benefit the parties and their respective successors and assigns.
        </p>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.2 No Election of Remedies.</p>
        <p className="document-paragraph">
          Except as expressly set forth in this Agreement, the exercise by Company of any of its remedies under this Agreement will not be deemed
          an election of remedies and will be without prejudice to its other remedies under this Agreement or available at law or in equity or otherwise.
        </p>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.3 Equitable Remedies.</p>
        <p className="document-paragraph">
          Because the Services are personal and unique and because Consultant will have access to Confidential Information of Company,
          Company will have the right to enforce this Agreement and any of its provisions by injunction, specific performance or other equitable relief,
          without having to post a bond or other consideration, in addition to all other remedies that Company may have for a breach of this Agreement
          at law or otherwise.
        </p>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.4 Attorneys' Fees.</p>
        <p className="document-paragraph">
          If any action is necessary to enforce the terms of this Agreement, the substantially prevailing Party will be entitled to reasonable
          attorneys' fees, costs and expenses in addition to any other relief to which such prevailing Party may be entitled.
        </p>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.5 Governing Law.</p>
        <p className="document-paragraph">
          This Agreement will be governed by and construed in accordance with the laws of the State of <strong>{getStateName(formData.governingLaw)}</strong>,
          excluding its body of law controlling conflict of laws. Any legal action or proceeding arising under this Agreement will be brought exclusively
          in the federal or state courts located in <strong>{formData.governingCity || '[City]'}, {getStateName(formData.governingLaw)}</strong>.
        </p>

        {formData.includeSeverability && (
          <>
            <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.6 Severability.</p>
            <p className="document-paragraph">
              If any provision of this Agreement is held invalid or unenforceable by a court of competent jurisdiction, the remaining provisions
              of this Agreement will remain in full force and effect, and the provision affected will be construed so as to be enforceable to the maximum
              extent permissible by law.
            </p>
          </>
        )}

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.{formData.includeSeverability ? '7' : '6'} Waiver.</p>
        <p className="document-paragraph">
          The failure by either Party to enforce any provision of this Agreement will not constitute a waiver of future enforcement of that or any other provision.
        </p>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.{formData.includeSeverability ? '8' : '7'} Notices.</p>
        <p className="document-paragraph">
          All notices required or permitted under this Agreement will be in writing, will reference this Agreement, and will be deemed given:
          (i) when delivered personally; (ii) one (1) business day after deposit with a nationally recognized express courier, with written confirmation
          of receipt; or (iii) three (3) business days after having been sent by registered or certified mail, return receipt requested, postage prepaid.
        </p>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.{formData.includeSeverability ? '9' : '8'} Entire Agreement.</p>
        <p className="document-paragraph">
          This Agreement{formData.useStatementOfWork && ', together with all Statements of Work,'} constitutes the complete and exclusive understanding
          and agreement of the parties with respect to its subject matter and supersedes all prior understandings and agreements, whether written or oral,
          with respect to its subject matter. Any waiver, modification or amendment of any provision of this Agreement will be effective only if in writing
          and signed by the parties hereto.
        </p>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.{formData.includeSeverability ? '10' : '9'} Counterparts.</p>
        <p className="document-paragraph">
          This Agreement may be executed in counterparts, each of which will be deemed an original, but all of which together will constitute one and the same instrument.
          In case of any conflict, discrepancy, inconsistency or ambiguity between the English text version of this Agreement and Russian translation,
          the <strong>{formData.controllingLanguage === 'english' ? 'English' : 'Russian'} version shall prevail</strong>.
        </p>

        <p className="document-paragraph signature-intro">
          IN WITNESS WHEREOF, the Parties have executed this agreement as of the Effective Date.
        </p>

        <div className="signature-block">
          <div className="signature-section">
            <p className="signature-label">COMPANY:</p>
            <p>By: _________________________________</p>
            <p>Name: {formData.companyName || '______________________________'}</p>
            <p>Title: ________________________________</p>
            <p>Date: _______________________________</p>
          </div>

          <div className="signature-section">
            <p className="signature-label">CONSULTANT:</p>
            <p>By: _________________________________</p>
            <p>Name: {formData.consultantName || '______________________________'}</p>
            <p>Title: ________________________________</p>
            <p>Date: _______________________________</p>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="language-separator">
        <span>⬤ ⬤ ⬤</span>
      </div>

      {/* Russian Version */}
      <div className="document-section russian-section">
        <div className="document-title">ДОГОВОР ОКАЗАНИЯ КОНСУЛЬТАЦИОННЫХ УСЛУГ</div>

        <p className="document-paragraph">
          Настоящее Соглашение об оказании консультационных услуг ("Соглашение") заключено <strong>{formatDateRu(formData.effectiveDate)}</strong> ("Дата Вступления в Силу")
          между <strong>{formData.companyName || '[Название Компании]'}</strong> ("Компания")
          и <strong>{formData.consultantName || '[Имя Консультанта]'}</strong> ("Консультант")
          (далее вместе именуемые "Стороны", а каждая в отдельности – "Сторона").
        </p>

        <p className="document-paragraph">
          За действительное и ценное встречное предоставление, получение и обоснованность которого Стороны настоящим признают,
          Стороны договорились о нижеследующем:
        </p>

        {/* Раздел 1: Услуги */}
        <div className="section-title">1. УСЛУГИ</div>

        {formData.useStatementOfWork ? (
          <>
            <p className="section-subtitle">1.1 Регламент Услуг.</p>
            <p className="document-paragraph">
              Компания и Консультант могут периодически заключать один или несколько регламентов с перечнем конкретных услуг,
              оказываемых Консультантом ("Регламент Услуг"). Каждый Регламент Услуг должен содержать ссылку на данное Соглашение,
              являться частью данного Соглашения и соответствовать его положениям и условиям. Регламент Услуг может быть изменен
              только по взаимному соглашению Сторон.
            </p>

            <p className="section-subtitle">1.2 Оказание Услуг.</p>
            <p className="document-paragraph">
              Консультант обязуется оказывать услуги, описанные в каждом Регламенте Услуг ("Услуги"), в соответствии со сроками
              и условиями каждого Регламента Услуг и данного Соглашения.
            </p>

            <p className="section-subtitle">1.3 Передача Результатов.</p>
            <p className="document-paragraph">
              Консультант предоставляет Компании результаты своей деятельности, дизайн, модули, программное обеспечение, разработки,
              документацию и другие материалы, перечисленные в Регламенте Услуг (вместе или по отдельности – "Результаты Труда"),
              в соответствии с графиком и другими условиями, указанными Регламенте Услуг.
            </p>
          </>
        ) : (
          <>
            <p className="section-subtitle">1.1 Услуги.</p>
            <p className="document-paragraph">
              Консультант обязуется предоставить Компании следующие услуги ("Услуги"):
            </p>
            <p className="document-paragraph indented">
              {formData.servicesDescription || '[Опишите услуги, которые будут предоставлены]'}
            </p>
          </>
        )}

        {/* Раздел 2: Оплата */}
        <div className="section-title">2. ОПЛАТА</div>

        <p className="section-subtitle">2.1 Вознаграждение.</p>
        <p className="document-paragraph">
          В качестве единственной формы компенсации за предоставленные Услуги Компания обязуется выплатить Консультанту
          {formData.paymentType === 'hourly' && formData.hourlyRate && (
            <> вознаграждение по ставке <strong>${formData.hourlyRate} в час</strong></>
          )}
          {formData.paymentType === 'hourly' && formData.maxHours && (
            <>, не превышающее <strong>{formData.maxHours} часов</strong> без предварительного письменного одобрения</>
          )}
          {formData.paymentType === 'fixed' && formData.fixedFee && (
            <> фиксированное вознаграждение в размере <strong>${formData.fixedFee}</strong></>
          )}
          {formData.paymentType === 'milestone' && (
            <> в соответствии с этапами, указанными в Регламенте Услуг</>
          )}
          {formData.useStatementOfWork && (
            <> вознаграждение в размере и порядке, указанном в каждом Регламенте Услуг</>
          )}
          .
        </p>

        <p className="section-subtitle">2.2 Расходы.</p>
        <p className="document-paragraph">
          {formData.expensesReimbursed ? (
            <>Компания возместит Консультанту разумные, предварительно одобренные расходы, понесенные Консультантом в связи с оказанием Услуг,
            при условии, что Консультант предоставит документы, подтверждающие такие расходы.</>
          ) : (
            <>Компания не возмещает Консультанту расходы, не оговоренные в Регламенте Услуг.</>
          )}
        </p>

        <p className="section-subtitle">2.3 Порядок Расчетов.</p>
        <p className="document-paragraph">
          Вознаграждение и другие суммы подлежат оплате в долларах США. Консультант предоставляет Компании счета на оплату вознаграждения
          и расходов{formData.paymentType === 'hourly' && <> ежемесячно</>}. Компания полностью оплачивает каждый счет в течение <strong>{formData.paymentTermsDays} дней</strong> с момента его получения,
          за исключением добросовестно оспариваемых Компанией сумм. Стороны предпримут коммерчески оправданные усилия для скорого разрешения
          любых подобных споров по оплате.
        </p>

        {/* Раздел 3: Отношения Сторон */}
        <div className="section-title">3. ОТНОШЕНИЯ СТОРОН</div>

        <p className="section-subtitle">3.1 Независимый Подрядчик.</p>
        <p className="document-paragraph">
          Консультант является независимым подрядчиком, и ничто в данном Соглашении не устанавливает трудовых или агентских отношений
          между Компанией и Консультантом. Консультант не имеет права налагать на Компанию обязательства, характерные для трудового договора,
          или какие-либо иные обязательства. Консультант предоставляет Услуги под общим руководством Компании, но Консультант сам решает,
          по собственному усмотрению, каким образом и средствами оказывать Услуги, при условии, что Консультант обязуется всегда действовать
          в соответствии с применимым законодательством.
        </p>

        <p className="section-subtitle">3.2 Налоги и Льготы.</p>
        <p className="document-paragraph">
          Консультант обязуется декларировать получаемое по данному Соглашению вознаграждение в качестве дохода во все соответствующие
          государственные органы. Консультант несет личную ответственность за уплату всех налогов, социальных страховок, компенсационных
          выплат работникам, страховок от безработицы и инвалидности или любых подобных платежей, требуемых соответствующими государственными
          органами. У Консультанта не будет права ни на какие льготы, выплачиваемые или предоставляемые Компанией своим сотрудникам,
          в том числе, помимо прочего, на любые оплачиваемые отпуска или больничные, участие в планах, соглашениях или выплатах Компанией
          любых бонусов, прав на покупку акций, участие в прибылях, страховках или подобных льгот. Консультант обязуется возместить убытки,
          потери, пени, штрафы, расходы и издержки (включая разумные вознаграждения и расходы на юристов и других профессионалов),
          возникшие в результате или относящиеся к любой обязанности, наложенной по закону на Компанию, по удержанию налогов на выплачиваемые
          суммы, социальную страховку, страховок от безработицы и инвалидности или любых подобных платежей в связи с компенсацией,
          полученной Консультантом по данному Соглашению.
        </p>

        <p className="section-subtitle">3.3 Страхование Ответственности.</p>
        <p className="document-paragraph">
          Консультант признает, что Компания не будет заключать никакого договора страхования ответственности Консультанта. Консультант
          должен обладать действующей соответствующей страховкой, покрывающей требования третьих лиц, относящиеся к ущербу здоровью (или жизни),
          либо ущербу материальному или нематериальному имуществу (в том числе утраты возможности эксплуатации), возникшие в результате
          любого действия или бездействия Консультанта.
        </p>

        {/* Раздел 4: Права Собственности */}
        <div className="section-title">4. ПРАВА СОБСТВЕННОСТИ</div>

        <p className="section-subtitle">4.1 Сообщение о Результатах Работы.</p>
        <p className="document-paragraph">
          Неотъемлемой частью оказания Услуг Консультантом является письменное предоставление Компании всех изобретений, результатов работы,
          дизайна, графических материалов, заметок, документов, информации, документации, улучшений, авторских работ, процессов, методов,
          ноу-хау, алгоритмов, спецификаций, биологических или химических образцов, оборудования, электросхем, компьютерных программ,
          баз данных, интерфейсов, кодировок и других материалов любого вида, которые Консультант сделал, придумал, разработал или реализовал
          самостоятельно или в сотрудничестве с другими в связи с исполнением Услуг либо деятельности, относящейся к Услугам
          (в совокупности – "Результаты Работы Консультанта"). Результаты Работы Консультанта включают без каких-либо ограничения все
          Результаты Труда, предоставляемые Компании Консультантом.
        </p>

        <p className="section-subtitle">4.2 Право Собственности на Результаты Работы Консультанта.</p>
        <p className="document-paragraph">
          Консультант соглашается, что все Результаты Работы Консультанта являются и будут являться единоличной и исключительной собственностью
          Компании. Настоящим Консультант безотзывно передает и уступает Компании и соглашается безотзывно передать и уступить Компании все
          права и правоустанавливающие документы на Результаты Работы Консультанта, включая все свои патентные права в любой стране мира
          (включая заявки на патент и сопутствующую информацию), авторские права, промышленные образцы, коммерческую тайну, ноу-хау,
          а также все и любые имущественные права и интеллектуальную собственность (в совокупности – "Права на Интеллектуальную Собственность").
          По разумному требованию Компании и за её счет, во время действия данного Соглашения и после истечения его срока действия,
          Консультант обязан оказывать содействие и сотрудничать с Компанией по всем вопросам, связанным с приобретением, передачей,
          поддержкой, подтверждением, оформлением необходимых документов и обеспечением соблюдения Компанией Права на Интеллектуальную
          Собственность и иной правовой защите Результатов Работы Консультанта. Настоящим Консультант уполномочивает сотрудников Компании
          быть его доверенными лицами при оформлении и подписании документов, необходимых для целей, указанных в данном пункте
          Настоящего Соглашения.
        </p>

        {/* Раздел 5: Конфиденциальная Информация */}
        <div className="section-title">5. КОНФИДЕНЦИАЛЬНАЯ ИНФОРМАЦИЯ</div>

        <p className="document-paragraph">
          Для целей настоящего Соглашения "Конфиденциальная Информация" означает и включает: (i) любую информацию, материалы или сведения
          относительно Компании и ее бизнеса, финансового состояния, продуктов, методов программирования, клиентов, поставщиков, технологий,
          исследований и разработок, предоставленные Консультанту или к которым Консультант имел доступ в связи с исполнением Услуг;
          (ii) Результаты Работы Консультанта; и (iii) сроки и условия настоящего Соглашения. Конфиденциальная Информация не включает
          информацию, которая: (a) является или становится общедоступной не по вине Консультанта; (b) во время разглашения находилась
          в правомерном распоряжении Консультанта без ограничений на её использование и разглашение; (c) информацию, правомерно полученную
          Консультантом от третьего лица без ограничений на использование и разглашение. Консультант соглашается хранить всю Конфиденциальную
          Информацию в строгой тайне, не использовать ее никоим образом ни в коммерческих, ни в других целях, кроме как для исполнения Услуг
          и не разглашать другим. Консультант также соглашается принять все разумно возможные меры для сохранения конфиденциальности
          в отношении информации, отнесенной настоящим Соглашением к конфиденциальной.
        </p>

        {/* Раздел 6: Гарантии */}
        <div className="section-title">6. ГАРАНТИИ</div>

        <p className="section-subtitle">6.1 Отсутствие Прежних Обязательств.</p>
        <p className="document-paragraph">
          Консультант заявляет и гарантирует, что у Консультанта нет прежних обязанностей или обязательств (и он не примет на себя
          каких бы то ни было обязанностей или обязательств) которые бы препятствовали, не согласовывались или замедляли исполнение
          обязанностей Консультанта по данному Соглашению.
        </p>

        <p className="section-subtitle">6.2 Критерий Профессионализма.</p>
        <p className="document-paragraph">
          Консультант заявляет и гарантирует, что Услуги будут исполнены в полной и профессиональной форме, соответствующей высоким
          профессиональным и отраслевым стандартам лиц с должной квалификацией, в соответствии с данными, опытом, техническими знаниями
          и навыками, необходимыми для исполнения Услуг.
        </p>

        <p className="section-subtitle">6.3 Отсутствие Нарушений.</p>
        <p className="document-paragraph">
          Консультант заявляет и гарантирует, что Результаты Работы Консультанта не нарушат и не присвоят неправомерно права любых
          третьих лиц, включая, помимо прочего, любые Права на Интеллектуальную Собственность или на неприкосновенность частной жизни,
          на публикацию личных данных, за исключением тех случаев и в том объеме, в котором Результаты Работы Консультанта созданы,
          подготовлены или предоставлены Компанией или третьим лицом по поручению Компании.
        </p>

        {formData.includeNonCompete && (
          <>
            <p className="section-subtitle">6.4 Конкурентная Деятельность.</p>
            <p className="document-paragraph">
              Во время действия настоящего Соглашения Консультант не будет прямо или косвенно, лично или через третьих лиц осуществлять,
              участвовать или предоставлять услуги любому субъекту, конкурирующему с любой деятельностью Компании.
            </p>
          </>
        )}

        {formData.includeNonSolicitation && (
          <>
            <p className="section-subtitle">{formData.includeNonCompete ? '6.5' : '6.4'} Обязательство Не Переманивать Сотрудников.</p>
            <p className="document-paragraph">
              Во время действия настоящего Соглашения и на <strong>{formData.nonSolicitationPeriod} год(а)</strong> после истечения его срока действия
              Консультант не будет прямо или косвенно привлекать к сотрудничеству любых сотрудников или консультантов Компании в целях
              извлечения личной выгоды Консультантом либо другими лицами или предприятиями.
            </p>
          </>
        )}

        {/* Раздел 7: Гарантия Возмещения Вреда */}
        <div className="section-title">7. ГАРАНТИЯ ВОЗМЕЩЕНИЯ ВРЕДА</div>

        <p className="document-paragraph">
          Консультант обязуется защитить, возместить затраты и обезопасить Компанию от всех видов исков, ущерба, ответственности,
          потерь, затрат и расходов (включая разумные вознаграждения и расходы на юристов и других профессионалов) возникших в результате
          или относящихся к:
        </p>
        <p className="document-paragraph indented">
          (a) любому требованию третьих лиц против Компании, основанному на утверждении, что любые Услуги либо результаты Услуг,
          предоставленных в соответствии с данным Соглашением либо использование Компанией упомянутых Услуг нарушает или неправомерно
          присваивает Права на Интеллектуальную Собственность этих третьих лиц; а также
        </p>
        <p className="document-paragraph indented">
          (b) любому требованию третьих лиц против Компании, основанному на любом действии или бездействии Консультанта, которое повлекло:
          (i) ущерб здоровью (или жизни) либо ущерб материальному или нематериальному имуществу (в том числе утраты возможности эксплуатации);
          либо (ii) нарушение любого закона, постановления или правила.
        </p>

        {/* Раздел 8: Срок Действия и Окончания Соглашения */}
        <div className="section-title">8. СРОК ДЕЙСТВИЯ И ОКОНЧАНИЯ СОГЛАШЕНИЯ</div>

        <p className="section-subtitle">8.1 Срок Действия.</p>
        <p className="document-paragraph">
          Настоящее Соглашение начинает действовать с Даты Вступления В Силу и заканчивает свое действие в момент завершения Консультантом
          исполнения Услуг, либо при досрочном расторжении в соответствии с условиями данного Соглашения.
        </p>

        <p className="section-subtitle">8.2 Расторжение за Нарушение.</p>
        <p className="document-paragraph">
          Каждая Сторона может расторгнуть данное Соглашение (включая все Регламенты Услуг) при нарушении другой Стороной любого
          из существенных условий настоящего Соглашения, если нарушившая Сторона не исправит нарушение в течении тридцати (30) дней
          после письменного уведомления ненарушившей Стороной.
        </p>

        <p className="section-subtitle">8.3 Одностороннее Расторжение.</p>
        <p className="document-paragraph">
          Компания вправе расторгнуть настоящее Соглашение (включая все Регламенты Услуг) в любое время, по любой причине или без причин
          по истечении <strong>{formData.terminationNoticeDays} дней</strong> с момента предоставления Консультанту соответствующего письменного уведомления.
          Компания может также расторгнуть каждый отдельный Регламент Услуг в любое время, по любой причине или без причин по истечении <strong>{formData.terminationNoticeDays} дней</strong> с момента предоставления Консультанту соответствующего письменного уведомления.
        </p>

        <p className="section-subtitle">8.4 Последствия Расторжения.</p>
        <p className="document-paragraph">
          По истечении срока действия или при расторжении настоящего Соглашения по любой причине: (i) Консультант незамедлительно должен
          предоставить Компании все Результаты Работы Консультанта, включая незавершенные работы;
          {formData.includeReturnMaterials && (
            <> (ii) Консультант незамедлительно должен предоставить Компании всю Конфиденциальную Информацию, находящуюся во владении или
            под контролем Консультанта; и</>
          )}
          {formData.includeReturnMaterials ? ' (iii)' : ' (ii)'} Компания обязана выплатить Консультанту всё ему причитающееся,
          но не выплаченное вознаграждение.
        </p>

        <p className="section-subtitle">8.5 Сохранение Юридической Силы.</p>
        <p className="document-paragraph">
          Права и обязанности Сторон по разделам 2, 3.2, 3.3, 4, 5, 6.3,
          {formData.includeNonSolicitation && <> 6.{formData.includeNonCompete ? '5' : '4'},</>}
          {' '}7, 8.4, 8.5, 9 и 10 остаются в силе после прекращения или окончания срока действия настоящего Соглашения.
        </p>

        {/* Раздел 9: Ограничение Ответственности */}
        {formData.includeLimitationLiability && (
          <>
            <div className="section-title">9. ОГРАНИЧЕНИЕ ОТВЕТСТВЕННОСТИ</div>
            <p className="document-paragraph uppercase">
              НИ ПРИ КАКИХ ОБСТОЯТЕЛЬСТВАХ КОМПАНИЯ НЕ БУДЕТ НЕСТИ ОТВЕТСТВЕННОСТИ ЗА КАКИЕ-ЛИБО СПЕЦИАЛЬНЫЕ, ПОБОЧНЫЕ, ШТРАФНЫЕ
              ИЛИ КОСВЕННЫЕ УБЫТКИ, ВОЗНИКАЮЩИЕ В СВЯЗИ С НАСТОЯЩИМ СОГЛАШЕНИЕМ, ДАЖЕ ЕСЛИ КОМПАНИИ БЫЛО ИЗВЕСТНО О ВОЗМОЖНОСТИ
              ВОЗНИКНОВЕНИЯ ТАКИХ УБЫТКОВ.
            </p>
          </>
        )}

        {/* Раздел 10: Общие Положения */}
        <div className="section-title">{formData.includeLimitationLiability ? '10' : '9'}. ОБЩИЕ ПОЛОЖЕНИЯ</div>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.1 Передача Прав и Обязанностей.</p>
        <p className="document-paragraph">
          Консультант не может ни частично, ни полностью передать или уступить права и/или обязанности по данному Соглашению без письменного
          разрешения Компании. Любая попытка передачи прав или отчуждения обязанностей по данному Соглашению без упомянутого разрешения ничтожна.
          С учётом вышеизложенного, настоящее Соглашение будет иметь обязательную силу и действовать для пользы сторон, их наследников и правопреемников.
        </p>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.2 Неограниченная Правовая Защита.</p>
        <p className="document-paragraph">
          За исключением случаев, прямо предусмотренных настоящим Соглашением, использование Компанией каких-либо средств правовой защиты,
          предусмотренных настоящим Договором, не будет считаться выбором ограниченного круга средств защиты и будет осуществляться без
          ущемления имеющихся у Компании иных средств правовой защиты по настоящему Договору или по иным законным основаниям.
        </p>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.3 Средство Судебной Защиты по Праву Справедливости.</p>
        <p className="document-paragraph">
          Так как Услуги индивидуальны и уникальны, и поскольку у Консультанта будет доступ к Конфиденциальной Информации Компании,
          Компания вправе обеспечить исполнение настоящего Соглашения и любой его нормы путем судебного запрещения, судебного приказа
          на совершение определенных действий или других средств судебной защиты по праву справедливости без обязанности внесения залога
          или других платежей, а также путем других средств правовой защиты по настоящему Соглашению и другому применимому праву.
        </p>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.4 Судебные Издержки.</p>
        <p className="document-paragraph">
          При необходимости иска в целях обеспечения исполнения настоящего Соглашения, Сторона, выигравшая дело по существу, имеет право
          на возмещение разумных расходов на адвокатов и других затрат и издержек в дополнение к другим средствам правовой защиты.
        </p>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.5 Регулирующее Право.</p>
        <p className="document-paragraph">
          Настоящее Соглашение будет регулироваться и трактоваться в соответствии с правом штата <strong>{getStateName(formData.governingLaw)}</strong> без учёта его коллизионных норм.
          Любые иски или претензии по настоящему Соглашению должны быть предъявлены исключительно в федеральных судах или судах штата,
          находящихся в <strong>{formData.governingCity || '[Город]'}, {getStateName(formData.governingLaw)}</strong>.
        </p>

        {formData.includeSeverability && (
          <>
            <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.6 Независимость Положений.</p>
            <p className="document-paragraph">
              Если какое-либо положение настоящего Соглашения становится незаконным или необеспеченным принудительной силой в суде
              соответствующей юрисдикции, это не повлияет на юридическую силу или возможность принудительного исполнения какого-либо
              другого положения настоящего Соглашения в наибольшей разрешенной законом степени.
            </p>
          </>
        )}

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.{formData.includeSeverability ? '7' : '6'} Отказ от Права.</p>
        <p className="document-paragraph">
          Нереализация любой Стороной любого права требования в связи с нарушением какого-либо положения настоящего Соглашения не будет
          толковаться как отказ от права требования в связи с каким-либо последующим нарушением этого же или любого другого положения.
        </p>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.{formData.includeSeverability ? '8' : '7'} Уведомления.</p>
        <p className="document-paragraph">
          Все уведомления, требуемые или дозволенные настоящим Соглашением, будут подаваться в письменном виде со ссылкой на данное Соглашение
          и будут признаны действительными, (i) когда доставлены лично; (ii) через один (1) рабочий день после сдачи общенационально
          признанной скорой курьерской службе или (iii) через три (3) рабочих дня после отправки заказным письмом с уведомлением о вручении
          и предоплаченным обратным конвертом.
        </p>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.{formData.includeSeverability ? '9' : '8'} Целостность Соглашения.</p>
        <p className="document-paragraph">
          Настоящее Соглашение{formData.useStatementOfWork && ' совместно со всеми Регламентами Услуг'} содержит полный и исключительный объём
          устных и письменных соглашений и договоренностей между Сторонами по предмету настоящего Соглашения и заменяет собой все предыдущие
          письменные или устные соглашения. Любой отказ, изменение или дополнение любого положения настоящего Соглашения вступит в силу только,
          если заключено в письменном виде и подписано Сторонами.
        </p>

        <p className="section-subtitle">{formData.includeLimitationLiability ? '10' : '9'}.{formData.includeSeverability ? '10' : '9'} Отдельные Экземпляры.</p>
        <p className="document-paragraph">
          Настоящее Соглашение может быть подписано на нескольких экземплярах, имеющих одинаковую юридическую силу и представляющих собой
          один и тот же документ. В случае возникновения противоречия, разночтения, несоответствия или неясности между текстом настоящего
          Соглашения на английском языке и русским переводом, <strong>текст на {formData.controllingLanguage === 'english' ? 'английском' : 'русском'} языке будет иметь преимущественную силу</strong>.
        </p>

        <p className="document-paragraph signature-intro">
          В ПОДТВЕРЖДЕНИЕ ВЫШЕИЗЛОЖЕННОГО Стороны заключили настоящее Соглашение, действующее с Даты Вступления в Силу.
        </p>

        <div className="signature-block">
          <div className="signature-section">
            <p className="signature-label">КОМПАНИЯ:</p>
            <p>Подпись: _____________________________</p>
            <p>Ф.И.О: {formData.companyName || '_______________________________'}</p>
            <p>Должность:___________________________</p>
            <p>Дата: ________________________________</p>
          </div>

          <div className="signature-section">
            <p className="signature-label">КОНСУЛЬТАНТ:</p>
            <p>Подпись: _____________________________</p>
            <p>Ф.И.О: {formData.consultantName || '_______________________________'}</p>
            <p>Должность:___________________________</p>
            <p>Дата: ________________________________</p>
          </div>
        </div>
      </div>

      {formData.useStatementOfWork && (
        <>
          {/* Statement of Work Template */}
          <div className="language-separator">
            <span>⬤ ⬤ ⬤</span>
          </div>

          <div className="document-section">
            <div className="document-title">EXHIBIT A - STATEMENT OF WORK</div>

            <p className="document-paragraph">
              This Statement of Work Number ____ is issued under and subject to all of the terms and conditions of the Consulting Agreement
              dated as of <strong>{formatDate(formData.effectiveDate)}</strong>, between <strong>{formData.companyName || '[Company Name]'}</strong> (the "Company")
              and <strong>{formData.consultantName || '[Consultant Name]'}</strong> ("Consultant").
            </p>

            <div className="section-title">Description of Services / Описание услуг</div>
            <p className="document-paragraph">
              [Describe the specific services, deliverables, and timeline for this project]
            </p>
            <p className="document-paragraph">
              [Опишите конкретные услуги, результаты и сроки для данного проекта]
            </p>

            <div className="section-title">Payment Terms / Порядок оплаты</div>
            <p className="document-paragraph">
              Hourly Consulting Rate / Почасовая ставка консультанта: $_________________________<br/>
              Maximum Number of Hours / Максимальное количество часов: _______________________<br/>
              Maximum Consulting Fee / Максимальное вознаграждение Консультанта: $_____________
            </p>

            <div className="section-title">Timeline / Сроки</div>
            <p className="document-paragraph">
              Start Date / Дата начала работ: ___________________________________________________<br/>
              Required Completion Date / Предельный срок завершения: ___________________________
            </p>

            <div className="section-title">Other Terms / Прочие условия</div>
            <p className="document-paragraph">
              _________________________________________________________________________________
            </p>

            <p className="document-paragraph signature-intro">
              AGREED AS OF / СОГЛАСОВАНО С ____________________, 20___
            </p>

            <div className="signature-block">
              <div className="signature-section">
                <p className="signature-label">COMPANY / КОМПАНИЯ:</p>
                <p>By / Подпись: ________________________</p>
                <p>Name / Ф.И.О: _______________________</p>
                <p>Title / Должность:_____________________</p>
                <p>Date / Дата: _________________________</p>
              </div>

              <div className="signature-section">
                <p className="signature-label">CONSULTANT / КОНСУЛЬТАНТ:</p>
                <p>By / Подпись: ________________________</p>
                <p>Name / Ф.И.О: ________________________</p>
                <p>Title / Должность:_____________________</p>
                <p>Date / Дата: _________________________</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
