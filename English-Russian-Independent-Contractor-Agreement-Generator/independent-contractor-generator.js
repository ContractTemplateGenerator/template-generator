// Icon component for Feather icons
const Icon = ({ name, className, size = 16, style = {} }) => {
    React.useEffect(() => {
        feather.replace();
    }, []);
    
    return (
        <i 
            data-feather={name} 
            className={className} 
            style={{ 
                width: size, 
                height: size, 
                ...style 
            }}
        />
    );
};

// Main Independent Contractor Agreement Generator Component
const IndependentContractorGenerator = () => {
    // Language state
    const [language, setLanguage] = React.useState('en');
    const [showMobilePreview, setShowMobilePreview] = React.useState(false);
    
    // Form state
    const [formData, setFormData] = React.useState({
        // Parties Information
        companyName: '',
        companyAddress: '',
        companyCountry: '',
        clientName: '',
        clientAddress: '',
        clientCountry: '',
        // Term Information  
        effectiveDate: '',
        serviceDescription: '',
        termType: 'fixed', // fixed or ongoing
        endDate: '',
        terminationNotice: '30',
        // Payment Information
        paymentType: 'hourly', // hourly, fixed-price, retainer
        hourlyRate: '',
        fixedAmount: '',
        retainerAmount: '',
        paymentSchedule: 'monthly',
        currency: 'USD',
        invoicingRequirements: 'standard',
        // Intellectual Property
        ipOwnership: 'client', // client, contractor, shared
        workProduct: 'all',
        licenseback: false,
        // Confidentiality
        confidentialityPeriod: '3',
        // Non-Competition
        includeNonCompete: false,
        nonCompetePeriod: '1',
        nonCompeteGeography: '',
        // Additional Provisions
        expensesReimbursable: false,
        expenseTypes: '',
        liabilityInsurance: false,
        terminationCause: true,
        governingLaw: 'California',
        disputeResolution: 'courts',
        // Custom provisions
        customProvisions: ''
    });

    // Tab state
    const [currentTab, setCurrentTab] = React.useState(0);
    const [lastChanged, setLastChanged] = React.useState(null);
    const [tooltip, setTooltip] = React.useState({ show: false, text: '', position: {} });

    // Tab configuration
    const tabs = [
        { id: 'parties', label: language === 'en' ? 'Parties' : 'Стороны' },
        { id: 'terms', label: language === 'en' ? 'Terms' : 'Условия' },
        { id: 'payment', label: language === 'en' ? 'Payment' : 'Оплата' },
        { id: 'ip', label: language === 'en' ? 'IP Rights' : 'Права ИС' },
        { id: 'additional', label: language === 'en' ? 'Additional' : 'Дополнительно' },
        { id: 'summary', label: language === 'en' ? 'Summary' : 'Сводка' }
    ];

    // Tooltips content
    const tooltips = {
        en: {
            termType: 'Fixed term has a specific end date. Ongoing continues until terminated by either party.',
            paymentType: 'Hourly: pay per hour worked. Fixed-price: total amount for the project. Retainer: regular payment to secure availability.',
            ipOwnership: 'Who owns the intellectual property created during the contract.',
            nonCompete: 'Prevents contractor from competing with client during and after the contract.',
            expensesReimbursable: 'Whether the client will reimburse contractor for business expenses.',
            liabilityInsurance: 'Requires contractor to maintain insurance coverage.',
            terminationCause: 'Whether the agreement can be terminated only for specific reasons.'
        },
        ru: {
            termType: 'Срочный договор имеет конкретную дату окончания. Бессрочный продолжается до расторжения любой стороной.',
            paymentType: 'Почасовая: оплата за отработанный час. Фиксированная цена: общая сумма за проект. Авансовый платеж: регулярный платеж для обеспечения доступности.',
            ipOwnership: 'Кто владеет интеллектуальной собственностью, созданной во время контракта.',
            nonCompete: 'Запрещает подрядчику конкурировать с клиентом во время и после контракта.',
            expensesReimbursable: 'Будет ли клиент возмещать подрядчику деловые расходы.',
            liabilityInsurance: 'Требует от подрядчика поддерживать страховое покрытие.',
            terminationCause: 'Можно ли расторгнуть соглашение только по конкретным причинам.'
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
        
        setLastChanged(name);
    };

    // Show tooltip
    const showTooltip = (e, text) => {
        const rect = e.target.getBoundingClientRect();
        setTooltip({
            show: true,
            text: text,
            position: {
                top: rect.bottom + 5,
                right: window.innerWidth - rect.right
            }
        });
    };

    // Hide tooltip
    const hideTooltip = () => {
        setTooltip({ show: false, text: '', position: {} });
    };

    // Generate document text
    const generateDocumentText = () => {
        const isEnglish = language === 'en';
        
        let text = isEnglish ? 
            'CONSULTING AGREEMENT\n\n' : 
            'ДОГОВОР ОКАЗАНИЯ КОНСУЛЬТАЦИОННЫХ УСЛУГ\n\n';
        
        // Generate the agreement text based on form data
        const effectiveDate = formData.effectiveDate || '[DATE]';
        const companyName = formData.companyName || '[COMPANY NAME]';
        const companyAddress = formData.companyAddress || '[COMPANY ADDRESS]';
        const clientName = formData.clientName || '[CONSULTANT NAME]';
        const clientAddress = formData.clientAddress || '[CONSULTANT ADDRESS]';
        
        if (isEnglish) {
            text += `This Consulting Agreement ("Agreement") is entered into as of ${effectiveDate} (the "Effective Date"), between ${companyName}, with an address at ${companyAddress} ("Company"), and ${clientName}, with an address at ${clientAddress} ("Consultant") (the Company and Consultant are each referred to herein individually as a "Party" and collectively as the "Parties").\n\n`;
            
            text += 'For good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged, the Parties agree as follows:\n\n';
            
            text += '1. SERVICES\n\n';
            text += `1.1 Description of Services. Consultant will perform the following services: ${formData.serviceDescription || '[DESCRIBE SERVICES]'}\n\n`;
            
            text += '2. TERM\n\n';
            if (formData.termType === 'fixed') {
                text += `2.1 Term. This Agreement will commence on the Effective Date and will continue until ${formData.endDate || '[END DATE]'}, unless earlier terminated in accordance with this Agreement.\n\n`;
            } else {
                text += `2.1 Term. This Agreement will commence on the Effective Date and will continue until terminated by either Party upon ${formData.terminationNotice} days' written notice.\n\n`;
            }
            
            text += '3. PAYMENT\n\n';
            if (formData.paymentType === 'hourly') {
                text += `3.1 Fees. As Consultant's sole compensation for the performance of Services, Company will pay Consultant at the rate of ${formData.currency} ${formData.hourlyRate || '[AMOUNT]'} per hour.\n\n`;
            } else if (formData.paymentType === 'fixed-price') {
                text += `3.1 Fees. As Consultant's sole compensation for the performance of Services, Company will pay Consultant a fixed fee of ${formData.currency} ${formData.fixedAmount || '[AMOUNT]'}.\n\n`;
            } else {
                text += `3.1 Fees. As Consultant's sole compensation for the performance of Services, Company will pay Consultant a retainer of ${formData.currency} ${formData.retainerAmount || '[AMOUNT]'} per ${formData.paymentSchedule}.\n\n`;
            }
            
            text += '4. RELATIONSHIP OF THE PARTIES\n\n';
            text += '4.1 Independent Contractor. Consultant is an independent contractor and nothing in this Agreement will be construed as establishing an employment or agency relationship between Company and Consultant.\n\n';
            
            text += '5. OWNERSHIP\n\n';
            if (formData.ipOwnership === 'client') {
                text += '5.1 Ownership of Work Product. Consultant agrees that all work product is and will be the sole and exclusive property of Company.\n\n';
            } else if (formData.ipOwnership === 'contractor') {
                text += '5.1 Ownership of Work Product. Consultant retains all right, title and interest in and to the work product, and grants Company a license to use the work product.\n\n';
            } else {
                text += '5.1 Ownership of Work Product. The Parties will jointly own all work product created under this Agreement.\n\n';
            }
            
            text += '6. CONFIDENTIAL INFORMATION\n\n';
            text += `6.1 Confidentiality. Consultant agrees to hold all Confidential Information in strict confidence for a period of ${formData.confidentialityPeriod} years following termination of this Agreement.\n\n`;
            
            if (formData.includeNonCompete) {
                text += '7. NON-COMPETITION\n\n';
                text += `7.1 Non-Compete. During the term of this Agreement and for ${formData.nonCompetePeriod} year(s) thereafter, Consultant will not compete with Company in ${formData.nonCompeteGeography || '[GEOGRAPHIC AREA]'}.\n\n`;
            }
            
            text += '8. GENERAL\n\n';
            text += `8.1 Governing Law. This Agreement will be governed by the laws of ${formData.governingLaw}.\n\n`;
            
            if (formData.customProvisions) {
                text += '9. ADDITIONAL PROVISIONS\n\n';
                text += formData.customProvisions + '\n\n';
            }
            
        } else {
            // Russian version
            text += `Настоящее Соглашение об оказании консультационных услуг ("Соглашение") заключено ${effectiveDate} ("Дата Вступления в Силу") между ${companyName}, расположенной по адресу ${companyAddress} ("Компания") и ${clientName}, расположенным по адресу ${clientAddress} ("Консультант") (далее вместе именуемые "Стороны", а каждая в отдельности -- "Сторона").\n\n`;
            
            text += 'За действительное и ценное встречное предоставление, получение и обоснованность которого Стороны настоящим признают, Стороны договорились о нижеследующем:\n\n';
            
            text += '1. УСЛУГИ\n\n';
            text += `1.1 Описание Услуг. Консультант будет выполнять следующие услуги: ${formData.serviceDescription || '[ОПИСАНИЕ УСЛУГ]'}\n\n`;
            
            text += '2. СРОК\n\n';
            if (formData.termType === 'fixed') {
                text += `2.1 Срок. Настоящее Соглашение вступает в силу с Даты Вступления в Силу и будет действовать до ${formData.endDate || '[ДАТА ОКОНЧАНИЯ]'}, если не будет расторгнуто ранее в соответствии с настоящим Соглашением.\n\n`;
            } else {
                text += `2.1 Срок. Настоящее Соглашение вступает в силу с Даты Вступления в Силу и будет действовать до расторжения любой Стороной с письменным уведомлением за ${formData.terminationNotice} дней.\n\n`;
            }
            
            text += '3. ОПЛАТА\n\n';
            if (formData.paymentType === 'hourly') {
                text += `3.1 Вознаграждение. В качестве единственной компенсации за выполнение Услуг Компания будет платить Консультанту по ставке ${formData.currency} ${formData.hourlyRate || '[СУММА]'} в час.\n\n`;
            } else if (formData.paymentType === 'fixed-price') {
                text += `3.1 Вознаграждение. В качестве единственной компенсации за выполнение Услуг Компания выплатит Консультанту фиксированную сумму ${formData.currency} ${formData.fixedAmount || '[СУММА]'}.\n\n`;
            } else {
                text += `3.1 Вознаграждение. В качестве единственной компенсации за выполнение Услуг Компания будет платить Консультанту авансовый платеж в размере ${formData.currency} ${formData.retainerAmount || '[СУММА]'} ${formData.paymentSchedule}.\n\n`;
            }
            
            text += '4. ОТНОШЕНИЯ СТОРОН\n\n';
            text += '4.1 Независимый Подрядчик. Консультант является независимым подрядчиком, и ничто в данном Соглашении не устанавливает трудовых или агентских отношений между Компанией и Консультантом.\n\n';
            
            text += '5. ПРАВА СОБСТВЕННОСТИ\n\n';
            if (formData.ipOwnership === 'client') {
                text += '5.1 Право Собственности на Результаты Работы. Консультант соглашается, что все результаты работы являются и будут являться единоличной и исключительной собственностью Компании.\n\n';
            } else if (formData.ipOwnership === 'contractor') {
                text += '5.1 Право Собственности на Результаты Работы. Консультант сохраняет все права, титул и интерес к результатам работы и предоставляет Компании лицензию на использование результатов работы.\n\n';
            } else {
                text += '5.1 Право Собственности на Результаты Работы. Стороны будут совместно владеть всеми результатами работы, созданными в рамках настоящего Соглашения.\n\n';
            }
            
            text += '6. КОНФИДЕНЦИАЛЬНАЯ ИНФОРМАЦИЯ\n\n';
            text += `6.1 Конфиденциальность. Консультант соглашается хранить всю Конфиденциальную Информацию в строгой тайне в течение ${formData.confidentialityPeriod} лет после прекращения настоящего Соглашения.\n\n`;
            
            if (formData.includeNonCompete) {
                text += '7. ЗАПРЕТ КОНКУРЕНЦИИ\n\n';
                text += `7.1 Запрет Конкуренции. В течение срока действия настоящего Соглашения и в течение ${formData.nonCompetePeriod} года(лет) после его окончания Консультант не будет конкурировать с Компанией в ${formData.nonCompeteGeography || '[ГЕОГРАФИЧЕСКАЯ ОБЛАСТЬ]'}.\n\n`;
            }
            
            text += '8. ОБЩИЕ ПОЛОЖЕНИЯ\n\n';
            text += `8.1 Применимое Право. Настоящее Соглашение регулируется законодательством ${formData.governingLaw}.\n\n`;
            
            if (formData.customProvisions) {
                text += '9. ДОПОЛНИТЕЛЬНЫЕ ПОЛОЖЕНИЯ\n\n';
                text += formData.customProvisions + '\n\n';
            }
        }
        
        return text;
    };

    // Get section to highlight
    const getSectionToHighlight = () => {
        switch (currentTab) {
            case 0: // Parties
                if (lastChanged === 'companyName' || lastChanged === 'clientName') {
                    return 'parties';
                }
                break;
            case 1: // Terms
                if (lastChanged === 'serviceDescription' || lastChanged === 'termType' || lastChanged === 'endDate') {
                    return 'services';
                }
                break;
            case 2: // Payment
                if (lastChanged === 'paymentType' || lastChanged === 'hourlyRate' || lastChanged === 'fixedAmount') {
                    return 'payment';
                }
                break;
            case 3: // IP
                if (lastChanged === 'ipOwnership') {
                    return 'ownership';
                }
                break;
            case 4: // Additional
                if (lastChanged === 'includeNonCompete' || lastChanged === 'nonCompetePeriod') {
                    return 'noncompete';
                }
                break;
        }
        return null;
    };

    // Create highlighted text
    const createHighlightedText = () => {
        const documentText = generateDocumentText();
        const sectionToHighlight = getSectionToHighlight();
        
        if (!sectionToHighlight) return documentText;

        const sections = {
            parties: language === 'en' ? 
                /This Consulting Agreement.*?agree as follows:/s :
                /Настоящее Соглашение.*?договорились о нижеследующем:/s,
            services: language === 'en' ? 
                /1\. SERVICES.*?(?=2\. TERM)/s :
                /1\. УСЛУГИ.*?(?=2\. СРОК)/s,
            payment: language === 'en' ? 
                /3\. PAYMENT.*?(?=4\. RELATIONSHIP)/s :
                /3\. ОПЛАТА.*?(?=4\. ОТНОШЕНИЯ)/s,
            ownership: language === 'en' ? 
                /5\. OWNERSHIP.*?(?=6\. CONFIDENTIAL)/s :
                /5\. ПРАВА СОБСТВЕННОСТИ.*?(?=6\. КОНФИДЕНЦИАЛЬНАЯ)/s,
            noncompete: language === 'en' ? 
                /7\. NON-COMPETITION.*?(?=8\. GENERAL)/s :
                /7\. ЗАПРЕТ КОНКУРЕНЦИИ.*?(?=8\. ОБЩИЕ)/s
        };

        if (sections[sectionToHighlight]) {
            return documentText.replace(sections[sectionToHighlight], match => 
                `<span class="highlighted-text">${match}</span>`
            );
        }

        return documentText;
    };

    // Copy to clipboard
    const copyToClipboard = () => {
        const textToCopy = generateDocumentText();
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Agreement copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard. Please try again.');
        });
    };

    // Download as Word
    const downloadAsWord = () => {
        const documentText = generateDocumentText();
        const fileName = language === 'en' ? 
            'Independent-Contractor-Agreement' : 
            'Dogovor-Konsultirovaniya';
        
        window.generateWordDoc(documentText, {
            documentTitle: language === 'en' ? 
                'Independent Contractor Agreement' : 
                'Договор оказания консультационных услуг',
            fileName: fileName
        });
    };

    // Navigation functions
    const nextTab = () => {
        if (currentTab < tabs.length - 1) {
            setCurrentTab(currentTab + 1);
        }
    };

    const prevTab = () => {
        if (currentTab > 0) {
            setCurrentTab(currentTab - 1);
        }
    };

    const goToTab = (index) => {
        setCurrentTab(index);
    };

    // Render tab content
    const renderTabContent = () => {
        switch (currentTab) {
            case 0: // Parties
                return (
                    <div className="tab-content">
                        <h3>{language === 'en' ? 'Client Information' : 'Информация о клиенте'}</h3>
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'Company Name' : 'Название компании'}
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                className="form-control"
                                placeholder={language === 'en' ? 'Enter company name' : 'Введите название компании'}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'Company Address' : 'Адрес компании'}
                            </label>
                            <input
                                type="text"
                                name="companyAddress"
                                value={formData.companyAddress}
                                onChange={handleChange}
                                className="form-control"
                                placeholder={language === 'en' ? 'Enter company address' : 'Введите адрес компании'}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'Company Country' : 'Страна компании'}
                            </label>
                            <input
                                type="text"
                                name="companyCountry"
                                value={formData.companyCountry}
                                onChange={handleChange}
                                className="form-control"
                                placeholder={language === 'en' ? 'Enter country' : 'Введите страну'}
                            />
                        </div>
                        
                        <h3 style={{marginTop: '2rem'}}>{language === 'en' ? 'Contractor Information' : 'Информация о подрядчике'}</h3>
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'Contractor Name' : 'Имя подрядчика'}
                            </label>
                            <input
                                type="text"
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleChange}
                                className="form-control"
                                placeholder={language === 'en' ? 'Enter contractor name' : 'Введите имя подрядчика'}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'Contractor Address' : 'Адрес подрядчика'}
                            </label>
                            <input
                                type="text"
                                name="clientAddress"
                                value={formData.clientAddress}
                                onChange={handleChange}
                                className="form-control"
                                placeholder={language === 'en' ? 'Enter contractor address' : 'Введите адрес подрядчика'}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'Contractor Country' : 'Страна подрядчика'}
                            </label>
                            <input
                                type="text"
                                name="clientCountry"
                                value={formData.clientCountry}
                                onChange={handleChange}
                                className="form-control"
                                placeholder={language === 'en' ? 'Enter country' : 'Введите страну'}
                            />
                        </div>
                    </div>
                );
                
            case 1: // Terms
                return (
                    <div className="tab-content">
                        <h3>{language === 'en' ? 'Contract Terms' : 'Условия договора'}</h3>
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'Effective Date' : 'Дата вступления в силу'}
                            </label>
                            <input
                                type="date"
                                name="effectiveDate"
                                value={formData.effectiveDate}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'Services Description' : 'Описание услуг'}
                            </label>
                            <textarea
                                name="serviceDescription"
                                value={formData.serviceDescription}
                                onChange={handleChange}
                                className="form-control"
                                rows="4"
                                placeholder={language === 'en' ? 'Describe the services to be provided' : 'Опишите услуги, которые будут предоставлены'}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'Term Type' : 'Тип срока'}
                                <span
                                    className="help-icon"
                                    onMouseEnter={(e) => showTooltip(e, tooltips[language].termType)}
                                    onMouseLeave={hideTooltip}
                                >
                                    <Icon name="help-circle" size={16} />
                                </span>
                            </label>
                            <div className="radio-group">
                                <div className="radio-item">
                                    <input
                                        type="radio"
                                        name="termType"
                                        value="fixed"
                                        checked={formData.termType === 'fixed'}
                                        onChange={handleChange}
                                        id="fixed-term"
                                    />
                                    <label htmlFor="fixed-term">
                                        {language === 'en' ? 'Fixed Term' : 'Срочный'}
                                    </label>
                                </div>
                                <div className="radio-item">
                                    <input
                                        type="radio"
                                        name="termType"
                                        value="ongoing"
                                        checked={formData.termType === 'ongoing'}
                                        onChange={handleChange}
                                        id="ongoing-term"
                                    />
                                    <label htmlFor="ongoing-term">
                                        {language === 'en' ? 'Ongoing' : 'Бессрочный'}
                                    </label>
                                </div>
                            </div>
                        </div>
                        {formData.termType === 'fixed' && (
                            <div className="form-group">
                                <label className="form-label">
                                    {language === 'en' ? 'End Date' : 'Дата окончания'}
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                        )}
                        {formData.termType === 'ongoing' && (
                            <div className="form-group">
                                <label className="form-label">
                                    {language === 'en' ? 'Termination Notice (days)' : 'Уведомление о расторжении (дни)'}
                                </label>
                                <input
                                    type="number"
                                    name="terminationNotice"
                                    value={formData.terminationNotice}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="1"
                                />
                            </div>
                        )}
                    </div>
                );
                
            case 2: // Payment
                return (
                    <div className="tab-content">
                        <h3>{language === 'en' ? 'Payment Terms' : 'Условия оплаты'}</h3>
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'Payment Type' : 'Тип оплаты'}
                                <span
                                    className="help-icon"
                                    onMouseEnter={(e) => showTooltip(e, tooltips[language].paymentType)}
                                    onMouseLeave={hideTooltip}
                                >
                                    <Icon name="help-circle" size={16} />
                                </span>
                            </label>
                            <select
                                name="paymentType"
                                value={formData.paymentType}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="hourly">{language === 'en' ? 'Hourly Rate' : 'Почасовая оплата'}</option>
                                <option value="fixed-price">{language === 'en' ? 'Fixed Price' : 'Фиксированная цена'}</option>
                                <option value="retainer">{language === 'en' ? 'Retainer' : 'Авансовый платеж'}</option>
                            </select>
                        </div>
                        
                        {formData.paymentType === 'hourly' && (
                            <div className="form-group">
                                <label className="form-label">
                                    {language === 'en' ? 'Hourly Rate' : 'Почасовая ставка'}
                                </label>
                                <input
                                    type="number"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder={language === 'en' ? 'Enter hourly rate' : 'Введите почасовую ставку'}
                                />
                            </div>
                        )}
                        
                        {formData.paymentType === 'fixed-price' && (
                            <div className="form-group">
                                <label className="form-label">
                                    {language === 'en' ? 'Fixed Amount' : 'Фиксированная сумма'}
                                </label>
                                <input
                                    type="number"
                                    name="fixedAmount"
                                    value={formData.fixedAmount}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder={language === 'en' ? 'Enter fixed amount' : 'Введите фиксированную сумму'}
                                />
                            </div>
                        )}
                        
                        {formData.paymentType === 'retainer' && (
                            <div className="form-group">
                                <label className="form-label">
                                    {language === 'en' ? 'Retainer Amount' : 'Сумма аванса'}
                                </label>
                                <input
                                    type="number"
                                    name="retainerAmount"
                                    value={formData.retainerAmount}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder={language === 'en' ? 'Enter retainer amount' : 'Введите сумму аванса'}
                                />
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'Currency' : 'Валюта'}
                            </label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="RUB">RUB</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'Payment Schedule' : 'График платежей'}
                            </label>
                            <select
                                name="paymentSchedule"
                                value={formData.paymentSchedule}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="monthly">{language === 'en' ? 'Monthly' : 'Ежемесячно'}</option>
                                <option value="biweekly">{language === 'en' ? 'Bi-weekly' : 'Каждые две недели'}</option>
                                <option value="weekly">{language === 'en' ? 'Weekly' : 'Еженедельно'}</option>
                                <option value="upon-completion">{language === 'en' ? 'Upon Completion' : 'По завершении'}</option>
                            </select>
                        </div>
                    </div>
                );
                
            case 3: // IP Rights
                return (
                    <div className="tab-content">
                        <h3>{language === 'en' ? 'Intellectual Property Rights' : 'Права интеллектуальной собственности'}</h3>
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'IP Ownership' : 'Владение ИС'}
                                <span
                                    className="help-icon"
                                    onMouseEnter={(e) => showTooltip(e, tooltips[language].ipOwnership)}
                                    onMouseLeave={hideTooltip}
                                >
                                    <Icon name="help-circle" size={16} />
                                </span>
                            </label>
                            <select
                                name="ipOwnership"
                                value={formData.ipOwnership}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="client">{language === 'en' ? 'Client Owns All Rights' : 'Все права у клиента'}</option>
                                <option value="contractor">{language === 'en' ? 'Contractor Retains Rights' : 'Права остаются у подрядчика'}</option>
                                <option value="shared">{language === 'en' ? 'Shared Ownership' : 'Совместное владение'}</option>
                            </select>
                        </div>
                        
                        {formData.ipOwnership === 'contractor' && (
                            <div className="form-group">
                                <div className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        name="licenseback"
                                        checked={formData.licenseback}
                                        onChange={handleChange}
                                        id="licenseback"
                                    />
                                    <label htmlFor="licenseback">
                                        {language === 'en' ? 'Grant license to client' : 'Предоставить лицензию клиенту'}
                                    </label>
                                </div>
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'Confidentiality Period (years)' : 'Период конфиденциальности (лет)'}
                            </label>
                            <input
                                type="number"
                                name="confidentialityPeriod"
                                value={formData.confidentialityPeriod}
                                onChange={handleChange}
                                className="form-control"
                                min="1"
                            />
                        </div>
                    </div>
                );
                
            case 4: // Additional
                return (
                    <div className="tab-content">
                        <h3>{language === 'en' ? 'Additional Provisions' : 'Дополнительные положения'}</h3>
                        
                        <div className="form-group">
                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    name="includeNonCompete"
                                    checked={formData.includeNonCompete}
                                    onChange={handleChange}
                                    id="includeNonCompete"
                                />
                                <label htmlFor="includeNonCompete">
                                    {language === 'en' ? 'Include Non-Competition Clause' : 'Включить запрет конкуренции'}
                                    <span
                                        className="help-icon"
                                        onMouseEnter={(e) => showTooltip(e, tooltips[language].nonCompete)}
                                        onMouseLeave={hideTooltip}
                                    >
                                        <Icon name="help-circle" size={16} />
                                    </span>
                                </label>
                            </div>
                        </div>
                        
                        {formData.includeNonCompete && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">
                                        {language === 'en' ? 'Non-Compete Period (years)' : 'Период запрета конкуренции (лет)'}
                                    </label>
                                    <input
                                        type="number"
                                        name="nonCompetePeriod"
                                        value={formData.nonCompetePeriod}
                                        onChange={handleChange}
                                        className="form-control"
                                        min="1"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        {language === 'en' ? 'Non-Compete Geographic Area' : 'Географическая область запрета'}
                                    </label>
                                    <input
                                        type="text"
                                        name="nonCompeteGeography"
                                        value={formData.nonCompeteGeography}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder={language === 'en' ? 'e.g., United States' : 'например, США'}
                                    />
                                </div>
                            </>
                        )}
                        
                        <div className="form-group">
                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    name="expensesReimbursable"
                                    checked={formData.expensesReimbursable}
                                    onChange={handleChange}
                                    id="expensesReimbursable"
                                />
                                <label htmlFor="expensesReimbursable">
                                    {language === 'en' ? 'Expenses Reimbursable' : 'Возмещение расходов'}
                                    <span
                                        className="help-icon"
                                        onMouseEnter={(e) => showTooltip(e, tooltips[language].expensesReimbursable)}
                                        onMouseLeave={hideTooltip}
                                    >
                                        <Icon name="help-circle" size={16} />
                                    </span>
                                </label>
                            </div>
                        </div>
                        
                        {formData.expensesReimbursable && (
                            <div className="form-group">
                                <label className="form-label">
                                    {language === 'en' ? 'Reimbursable Expense Types' : 'Типы возмещаемых расходов'}
                                </label>
                                <input
                                    type="text"
                                    name="expenseTypes"
                                    value={formData.expenseTypes}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder={language === 'en' ? 'e.g., travel, materials' : 'например, проезд, материалы'}
                                />
                            </div>
                        )}
                        
                        <div className="form-group">
                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    name="liabilityInsurance"
                                    checked={formData.liabilityInsurance}
                                    onChange={handleChange}
                                    id="liabilityInsurance"
                                />
                                <label htmlFor="liabilityInsurance">
                                    {language === 'en' ? 'Require Liability Insurance' : 'Требовать страхование ответственности'}
                                    <span
                                        className="help-icon"
                                        onMouseEnter={(e) => showTooltip(e, tooltips[language].liabilityInsurance)}
                                        onMouseLeave={hideTooltip}
                                    >
                                        <Icon name="help-circle" size={16} />
                                    </span>
                                </label>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'Governing Law' : 'Применимое право'}
                            </label>
                            <input
                                type="text"
                                name="governingLaw"
                                value={formData.governingLaw}
                                onChange={handleChange}
                                className="form-control"
                                placeholder={language === 'en' ? 'e.g., California' : 'например, Калифорния'}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">
                                {language === 'en' ? 'Custom Provisions' : 'Дополнительные условия'}
                            </label>
                            <textarea
                                name="customProvisions"
                                value={formData.customProvisions}
                                onChange={handleChange}
                                className="form-control"
                                rows="4"
                                placeholder={language === 'en' ? 'Enter any custom provisions' : 'Введите любые дополнительные условия'}
                            />
                        </div>
                    </div>
                );
                
            case 5: // Summary
                return (
                    <div className="tab-content">
                        <h3>{language === 'en' ? 'Agreement Summary' : 'Сводка соглашения'}</h3>
                        <div className="summary-section">
                            <div className="summary-item">
                                <span className="summary-label">{language === 'en' ? 'Contract Type:' : 'Тип договора:'}</span>
                                <span className="summary-value">
                                    {formData.termType === 'fixed' ? 
                                        (language === 'en' ? 'Fixed Term' : 'Срочный') : 
                                        (language === 'en' ? 'Ongoing' : 'Бессрочный')}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">{language === 'en' ? 'Payment Structure:' : 'Структура оплаты:'}</span>
                                <span className="summary-value">
                                    {formData.paymentType === 'hourly' && (language === 'en' ? 'Hourly Rate' : 'Почасовая оплата')}
                                    {formData.paymentType === 'fixed-price' && (language === 'en' ? 'Fixed Price' : 'Фиксированная цена')}
                                    {formData.paymentType === 'retainer' && (language === 'en' ? 'Retainer' : 'Авансовый платеж')}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">{language === 'en' ? 'IP Ownership:' : 'Владение ИС:'}</span>
                                <span className="summary-value">
                                    {formData.ipOwnership === 'client' && (language === 'en' ? 'Client' : 'Клиент')}
                                    {formData.ipOwnership === 'contractor' && (language === 'en' ? 'Contractor' : 'Подрядчик')}
                                    {formData.ipOwnership === 'shared' && (language === 'en' ? 'Shared' : 'Совместное')}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">{language === 'en' ? 'Non-Compete:' : 'Запрет конкуренции:'}</span>
                                <span className="summary-value">
                                    {formData.includeNonCompete ? 
                                        (language === 'en' ? 'Included' : 'Включен') : 
                                        (language === 'en' ? 'Not Included' : 'Не включен')}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">{language === 'en' ? 'Overall Risk:' : 'Общий риск:'}</span>
                                <span className={`risk-indicator ${getOverallRisk()}`}>
                                    {getOverallRiskLabel()}
                                </span>
                            </div>
                        </div>
                        
                        {getWarnings().length > 0 && (
                            <div className="warning-message">
                                <h4>{language === 'en' ? 'Important Considerations:' : 'Важные соображения:'}</h4>
                                <ul>
                                    {getWarnings().map((warning, index) => (
                                        <li key={index}>{warning}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
                
            default:
                return null;
        }
    };
    
    // Get overall risk assessment
    const getOverallRisk = () => {
        let riskScore = 0;
        
        if (formData.includeNonCompete) riskScore += 2;
        if (formData.ipOwnership === 'client') riskScore += 1;
        if (formData.paymentType === 'fixed-price') riskScore += 1;
        if (!formData.expensesReimbursable) riskScore += 1;
        if (formData.liabilityInsurance) riskScore += 1;
        
        if (riskScore <= 2) return 'risk-low';
        if (riskScore <= 4) return 'risk-medium';
        return 'risk-high';
    };
    
    const getOverallRiskLabel = () => {
        const risk = getOverallRisk();
        if (risk === 'risk-low') return language === 'en' ? 'Low Risk' : 'Низкий риск';
        if (risk === 'risk-medium') return language === 'en' ? 'Medium Risk' : 'Средний риск';
        return language === 'en' ? 'High Risk' : 'Высокий риск';
    };
    
    // Get warnings
    const getWarnings = () => {
        const warnings = [];
        
        if (formData.includeNonCompete && formData.nonCompetePeriod > 2) {
            warnings.push(language === 'en' ? 
                'Long non-compete periods may be unenforceable in some jurisdictions.' :
                'Длительные периоды запрета конкуренции могут быть неисполнимы в некоторых юрисдикциях.');
        }
        
        if (formData.ipOwnership === 'client' && formData.paymentType === 'hourly') {
            warnings.push(language === 'en' ? 
                'Consider higher hourly rates when client owns all intellectual property.' :
                'Рассмотрите более высокие почасовые ставки, когда клиент владеет всей интеллектуальной собственностью.');
        }
        
        if (!formData.terminationCause) {
            warnings.push(language === 'en' ? 
                'Without termination for cause provisions, either party can end the contract at any time.' :
                'Без положений о расторжении по причине любая сторона может расторгнуть договор в любое время.');
        }
        
        return warnings;
    };

    // Render method
    return (
        <div className="generator-container">
            <h1 className="generator-title">
                {language === 'en' ? 
                    'Independent Contractor Agreement Generator' : 
                    'Генератор Договора с Независимым Подрядчиком'}
            </h1>
            <p className="generator-subtitle">
                {language === 'en' ?
                    'Create a professional bilingual independent contractor agreement' :
                    'Создайте профессиональный двуязычный договор с независимым подрядчиком'}
            </p>
            
            <div className="language-toggle">
                <button 
                    className={language === 'en' ? 'active' : ''} 
                    onClick={() => setLanguage('en')}
                >
                    🇺🇸 English
                </button>
                <button 
                    className={language === 'ru' ? 'active' : ''} 
                    onClick={() => setLanguage('ru')}
                >
                    🇷🇺 Русский
                </button>
            </div>
            
            <div className="content-wrapper">
                <div className="form-section">
                    <div className="tab-navigation">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab.id}
                                className={`tab-button ${currentTab === index ? 'active' : ''}`}
                                onClick={() => goToTab(index)}
                            >
                                {index + 1}. {tab.label}
                            </button>
                        ))}
                    </div>
                    
                    {renderTabContent()}
                    
                    <div className="navigation-buttons">
                        <button
                            onClick={prevTab}
                            className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
                            disabled={currentTab === 0}
                        >
                            <Icon name="chevron-left" size={16} />
                            {language === 'en' ? 'Previous' : 'Назад'}
                        </button>
                        
                        <div className="action-buttons">
                            <button
                                onClick={copyToClipboard}
                                className="nav-button"
                                style={{
                                    backgroundColor: "#4f46e5", 
                                    color: "white",
                                    border: "none"
                                }}
                            >
                                <Icon name="copy" size={16} />
                                {language === 'en' ? 'Copy' : 'Копировать'}
                            </button>
                            
                            <button
                                onClick={downloadAsWord}
                                className="nav-button"
                                style={{
                                    backgroundColor: "#2563eb", 
                                    color: "white",
                                    border: "none"
                                }}
                            >
                                <Icon name="file-text" size={16} />
                                {language === 'en' ? 'MS Word' : 'MS Word'}
                            </button>
                            
                            <a
                                href="https://terms.law/call/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="nav-button"
                                style={{
                                    backgroundColor: "#059669",
                                    color: "white",
                                    border: "none",
                                    textDecoration: "none",
                                    display: "inline-flex",
                                    alignItems: "center"
                                }}
                            >
                                <Icon name="calendar" size={16} />
                                {language === 'en' ? 'Consult' : 'Консультация'}
                            </a>
                        </div>
                        
                        <button
                            onClick={nextTab}
                            className={`nav-button next-button ${currentTab === tabs.length - 1 ? 'disabled' : ''}`}
                            disabled={currentTab === tabs.length - 1}
                        >
                            {language === 'en' ? 'Next' : 'Далее'}
                            <Icon name="chevron-right" size={16} />
                        </button>
                    </div>
                </div>
                
                <button
                    className="preview-toggle"
                    onClick={() => setShowMobilePreview(!showMobilePreview)}
                    style={{ display: 'none' }}
                >
                    {showMobilePreview ? 
                        (language === 'en' ? 'Hide Preview' : 'Скрыть предпросмотр') :
                        (language === 'en' ? 'Show Preview' : 'Показать предпросмотр')}
                </button>
                
                <div className={`preview-section ${showMobilePreview ? 'show-mobile' : ''}`}>
                    <div className="preview-content">
                        <h2>{language === 'en' ? 'Live Preview' : 'Предпросмотр'}</h2>
                        <div 
                            className="document-preview"
                            dangerouslySetInnerHTML={{ __html: createHighlightedText() }}
                        />
                    </div>
                </div>
            </div>
            
            {tooltip.show && (
                <div 
                    className="tooltip" 
                    style={{ 
                        top: tooltip.position.top,
                        right: tooltip.position.right
                    }}
                >
                    {tooltip.text}
                </div>
            )}
            
            {/* Instructional screen */}
            <div className="instructional-screen">
                <h2 className="instructional-title">
                    {language === 'en' ? 
                        'Guide to Independent Contractor Agreements' : 
                        'Руководство по Договорам с Независимыми Подрядчиками'}
                </h2>
                
                <div className="instructional-section">
                    <h3>{language === 'en' ? 'Employee vs. Contractor Classification' : 'Классификация: Сотрудник vs. Подрядчик'}</h3>
                    <p>
                        {language === 'en' ? 
                            'Proper classification is crucial to avoid legal and tax penalties. The IRS uses several factors to determine worker classification:' :
                            'Правильная классификация имеет решающее значение для избежания юридических и налоговых штрафов. IRS использует несколько факторов для определения классификации работника:'}
                    </p>
                    <div className="visual-element">
                        <div className="comparison-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{language === 'en' ? 'Factor' : 'Фактор'}</th>
                                        <th>{language === 'en' ? 'Employee' : 'Сотрудник'}</th>
                                        <th>{language === 'en' ? 'Contractor' : 'Подрядчик'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{language === 'en' ? 'Control' : 'Контроль'}</td>
                                        <td>{language === 'en' ? 'Employer controls how, when, where' : 'Работодатель контролирует как, когда, где'}</td>
                                        <td>{language === 'en' ? 'Worker controls methods and schedule' : 'Работник контролирует методы и график'}</td>
                                    </tr>
                                    <tr>
                                        <td>{language === 'en' ? 'Financial' : 'Финансы'}</td>
                                        <td>{language === 'en' ? 'Employer provides tools/equipment' : 'Работодатель предоставляет инструменты/оборудование'}</td>
                                        <td>{language === 'en' ? 'Worker provides own tools/equipment' : 'Работник предоставляет свои инструменты/оборудование'}</td>
                                    </tr>
                                    <tr>
                                        <td>{language === 'en' ? 'Relationship' : 'Отношения'}</td>
                                        <td>{language === 'en' ? 'Ongoing, indefinite relationship' : 'Постоянные, бессрочные отношения'}</td>
                                        <td>{language === 'en' ? 'Project-based, temporary relationship' : 'Проектные, временные отношения'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div className="instructional-section">
                    <h3>{language === 'en' ? 'Payment Structure Comparison' : 'Сравнение Структур Оплаты'}</h3>
                    <div className="visual-element">
                        <div className="risk-spectrum">
                            <div style={{textAlign: 'center'}}>
                                <h4>{language === 'en' ? 'Hourly' : 'Почасовая'}</h4>
                                <p>{language === 'en' ? 'Low risk, flexible' : 'Низкий риск, гибкая'}</p>
                            </div>
                            <div style={{textAlign: 'center'}}>
                                <h4>{language === 'en' ? 'Retainer' : 'Авансовая'}</h4>
                                <p>{language === 'en' ? 'Medium risk, predictable' : 'Средний риск, предсказуемая'}</p>
                            </div>
                            <div style={{textAlign: 'center'}}>
                                <h4>{language === 'en' ? 'Fixed Price' : 'Фиксированная'}</h4>
                                <p>{language === 'en' ? 'High risk, defined scope' : 'Высокий риск, определенный объем'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="instructional-section">
                    <h3>{language === 'en' ? 'Intellectual Property Considerations' : 'Соображения по Интеллектуальной Собственности'}</h3>
                    <p>
                        {language === 'en' ? 
                            'IP ownership can significantly impact the value of the agreement. Consider these factors:' :
                            'Владение ИС может существенно повлиять на ценность соглашения. Учитывайте эти факторы:'}
                    </p>
                    <ul>
                        <li>{language === 'en' ? 
                            'Work for hire doctrine applies differently to contractors vs. employees' :
                            'Доктрина работы по найму применяется по-разному к подрядчикам и сотрудникам'}</li>
                        <li>{language === 'en' ? 
                            'Some types of work cannot be "work for hire" from contractors' :
                            'Некоторые виды работ не могут быть "работой по найму" от подрядчиков'}</li>
                        <li>{language === 'en' ? 
                            'Consider licensing arrangements for pre-existing IP' :
                            'Рассмотрите лицензионные соглашения для существующей ИС'}</li>
                    </ul>
                </div>
                
                <div className="instructional-section">
                    <h3>{language === 'en' ? 'Non-Competition Clauses' : 'Пункты о Запрете Конкуренции'}</h3>
                    <div className="warning-message">
                        <p>
                            {language === 'en' ? 
                                'Non-compete agreements have varying enforceability by jurisdiction. California generally prohibits non-competes, while other states may enforce reasonable restrictions.' :
                                'Соглашения о запрете конкуренции имеют различную исполнимость в зависимости от юрисдикции. Калифорния обычно запрещает неконкурен��ные соглашения, в то время как другие штаты могут применять разумные ограничения.'}
                        </p>
                    </div>
                </div>
                
                <div className="instructional-section">
                    <h3>{language === 'en' ? 'Russian vs. US Contract Law' : 'Российское vs. Американское Договорное Право'}</h3>
                    <p>
                        {language === 'en' ? 
                            'Key differences between Russian and US contractor agreements:' :
                            'Ключевые различия между российскими и американскими договорами с подрядчиками:'}
                    </p>
                    <ul>
                        <li>{language === 'en' ? 
                            'Russian Civil Code provides more statutory protections' :
                            'Гражданский кодекс РФ предоставляет больше законодательных защит'}</li>
                        <li>{language === 'en' ? 
                            'US law relies more on contract terms and case law' :
                            'Американское право больше полагается на условия договора и прецедентное право'}</li>
                        <li>{language === 'en' ? 
                            'Tax implications differ significantly between jurisdictions' :
                            'Налоговые последствия существенно различаются между юрисдикциями'}</li>
                    </ul>
                </div>
                
                <div className="instructional-section">
                    <h3>{language === 'en' ? 'Best Practices' : 'Лучшие Практики'}</h3>
                    <div className="decision-tree">
                        <div className="decision-node">
                            <h4>{language === 'en' ? 'Define Scope Clearly' : 'Четко Определите Объем'}</h4>
                            <p>{language === 'en' ? 
                                'List specific deliverables and milestones' :
                                'Перечислите конкретные результаты и этапы'}</p>
                        </div>
                        <div className="decision-node">
                            <h4>{language === 'en' ? 'Set Payment Terms' : 'Установите Условия Оплаты'}</h4>
                            <p>{language === 'en' ? 
                                'Include invoicing schedule and late payment penalties' :
                                'Включите график выставления счетов и штрафы за просрочку'}</p>
                        </div>
                        <div className="decision-node">
                            <h4>{language === 'en' ? 'Address IP Rights' : 'Определите Права ИС'}</h4>
                            <p>{language === 'en' ? 
                                'Specify ownership and licensing arrangements' :
                                'Укажите владение и лицензионные соглашения'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Render the app
ReactDOM.render(<IndependentContractorGenerator />, document.getElementById('root'));
