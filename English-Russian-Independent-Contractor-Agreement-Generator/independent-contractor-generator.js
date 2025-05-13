            <div className="form-group">
              <label className="form-label" htmlFor="consultantCountry">
                {language === 'en' ? 'Consultant Country' : 'Страна Консультанта'}
              </label>
              <input
                type="text"
                id="consultantCountry"
                name="consultantCountry"
                className="form-control"
                value={formData.consultantCountry}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-row">
              <div className="form-col md-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="consultantRepName">
                    {language === 'en' ? 'Consultant Representative Name' : 'ФИО Представителя Консультанта'}
                  </label>
                  <input
                    type="text"
                    id="consultantRepName"
                    name="consultantRepName"
                    className="form-control"
                    value={formData.consultantRepName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-col md-6">
                <div className="form-group">
                  <label className="form-label" htmlFor="consultantRepTitle">
                    {language === 'en' ? 'Consultant Representative Title' : 'Должность Представителя Консультанта'}
                  </label>
                  <input
                    type="text"
                    id="consultantRepTitle"
                    name="consultantRepTitle"
                    className="form-control"
                    value={formData.consultantRepTitle}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="effectiveDate">
                {language === 'en' ? 'Effective Date' : 'Дата Вступления в Силу'}
              </label>
              <input
                type="date"
                id="effectiveDate"
                name="effectiveDate"
                className="form-control"
                value={formData.effectiveDate}
                onChange={handleChange}
              />
            </div>
          </div>
        );
        
      case 1: // Terms
        return (
          <div className="form-content">
            <h3>{language === 'en' ? 'Services Description' : 'Описание Услуг'}</h3>
            <div className="form-group">
              <label className="form-label" htmlFor="serviceDescription">
                {language === 'en' ? 'Service Description' : 'Описание Услуг'}
                <i data-feather="help-circle" className="help-icon"></i>
              </label>
              <div className="tooltip">
                {language === 'en' 
                  ? 'Brief description of the consulting services to be provided.' 
                  : 'Краткое описание предоставляемых консультационных услуг.'}
              </div>
              <textarea
                id="serviceDescription"
                name="serviceDescription"
                className="form-control textarea-control"
                value={formData.serviceDescription}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="scopeOfWork">
                {language === 'en' ? 'Scope of Work' : 'Объем Работы'}
                <i data-feather="help-circle" className="help-icon"></i>
              </label>
              <div className="tooltip">
                {language === 'en' 
                  ? 'Detailed description of the work to be performed, including specific tasks and responsibilities.' 
                  : 'Подробное описание выполняемых работ, включая конкретные задачи и обязанности.'}
              </div>
              <textarea
                id="scopeOfWork"
                name="scopeOfWork"
                className="form-control textarea-control"
                value={formData.scopeOfWork}
                onChange={handleChange}
                rows="5"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="deliverables">
                {language === 'en' ? 'Deliverables' : 'Результаты Работ'}
                <i data-feather="help-circle" className="help-icon"></i>
              </label>
              <div className="tooltip">
                {language === 'en' 
                  ? 'Specific materials, reports, or other items the consultant must deliver.' 
                  : 'Конкретные материалы, отчеты или другие результаты, которые должен предоставить консультант.'}
              </div>
              <textarea
                id="deliverables"
                name="deliverables"
                className="form-control textarea-control"
                value={formData.deliverables}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>
            
            <h3>{language === 'en' ? 'Work Arrangements' : 'Организация Работы'}</h3>
            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'Work Location' : 'Место Работы'}
              </label>
              <div className="radio-group">
                <div className="radio-item">
                  <input
                    type="radio"
                    id="remote"
                    name="workLocation"
                    value="remote"
                    checked={formData.workLocation === 'remote'}
                    onChange={handleChange}
                  />
                  <label htmlFor="remote">
                    {language === 'en' ? 'Remote' : 'Удаленно'}
                  </label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="company"
                    name="workLocation"
                    value="company"
                    checked={formData.workLocation === 'company'}
                    onChange={handleChange}
                  />
                  <label htmlFor="company">
                    {language === 'en' ? 'Company Location' : 'Офис Компании'}
                  </label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="consultant"
                    name="workLocation"
                    value="consultant"
                    checked={formData.workLocation === 'consultant'}
                    onChange={handleChange}
                  />
                  <label htmlFor="consultant">
                    {language === 'en' ? 'Consultant Location' : 'Офис Консультанта'}
                  </label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="mixed"
                    name="workLocation"
                    value="mixed"
                    checked={formData.workLocation === 'mixed'}
                    onChange={handleChange}
                  />
                  <label htmlFor="mixed">
                    {language === 'en' ? 'Mixed' : 'Смешанный Режим'}
                  </label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'Work Schedule' : 'График Работы'}
              </label>
              <div className="radio-group">
                <div className="radio-item">
                  <input
                    type="radio"
                    id="flexible"
                    name="workSchedule"
                    value="flexible"
                    checked={formData.workSchedule === 'flexible'}
                    onChange={handleChange}
                  />
                  <label htmlFor="flexible">
                    {language === 'en' ? 'Flexible' : 'Гибкий'}
                  </label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="fixed"
                    name="workSchedule"
                    value="fixed"
                    checked={formData.workSchedule === 'fixed'}
                    onChange={handleChange}
                  />
                  <label htmlFor="fixed">
                    {language === 'en' ? 'Fixed Hours' : 'Фиксированные Часы'}
                  </label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="project"
                    name="workSchedule"
                    value="project"
                    checked={formData.workSchedule === 'project'}
                    onChange={handleChange}
                  />
                  <label htmlFor="project">
                    {language === 'en' ? 'Project-Based' : 'Проектная Основа'}
                  </label>
                </div>
              </div>
            </div>
            
            {formData.workSchedule === 'fixed' && (
              <div className="form-group">
                <label className="form-label" htmlFor="fixedScheduleDetails">
                  {language === 'en' ? 'Fixed Schedule Details' : 'Детали Фиксированного Графика'}
                </label>
                <input
                  type="text"
                  id="fixedScheduleDetails"
                  name="fixedScheduleDetails"
                  className="form-control"
                  value={formData.fixedScheduleDetails}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'e.g., Monday-Friday, 9am-5pm' : 'например, Понедельник-Пятница, 9:00-17:00'}
                />
              </div>
            )}
            
            <h3>{language === 'en' ? 'Agreement Term' : 'Срок Соглашения'}</h3>
            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'Term Type' : 'Тип Срока'}
              </label>
              <div className="radio-group">
                <div className="radio-item">
                  <input
                    type="radio"
                    id="fixed-term"
                    name="termLength"
                    value="fixed"
                    checked={formData.termLength === 'fixed'}
                    onChange={handleChange}
                  />
                  <label htmlFor="fixed-term">
                    {language === 'en' ? 'Fixed Term' : 'Фиксированный Срок'}
                  </label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="indefinite"
                    name="termLength"
                    value="indefinite"
                    checked={formData.termLength === 'indefinite'}
                    onChange={handleChange}
                  />
                  <label htmlFor="indefinite">
                    {language === 'en' ? 'Indefinite' : 'Бессрочный'}
                  </label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="project-term"
                    name="termLength"
                    value="project"
                    checked={formData.termLength === 'project'}
                    onChange={handleChange}
                  />
                  <label htmlFor="project-term">
                    {language === 'en' ? 'Project Completion' : 'Завершение Проекта'}
                  </label>
                </div>
              </div>
            </div>
            
            {formData.termLength === 'fixed' && (
              <div className="form-group">
                <label className="form-label" htmlFor="termDuration">
                  {language === 'en' ? 'Term Duration' : 'Продолжительность Срока'}
                </label>
                <input
                  type="text"
                  id="termDuration"
                  name="termDuration"
                  className="form-control"
                  value={formData.termDuration}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'e.g., 6 months' : 'например, 6 месяцев'}
                />
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label" htmlFor="terminationNotice">
                {language === 'en' ? 'Termination Notice (days)' : 'Уведомление о Расторжении (дни)'}
              </label>
              <input
                type="number"
                id="terminationNotice"
                name="terminationNotice"
                className="form-control"
                value={formData.terminationNotice}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>
        );
        
      case 2: // Payment
        return (
          <div className="form-content">
            <h3>{language === 'en' ? 'Payment Structure' : 'Структура Оплаты'}</h3>
            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'Payment Type' : 'Тип Оплаты'}
                <i data-feather="help-circle" className="help-icon"></i>
              </label>
              <div className="tooltip">
                {language === 'en' 
                  ? 'How the consultant will be compensated for services.' 
                  : 'Как консультант будет получать компенсацию за услуги.'}
              </div>
              <div className="radio-group">
                <div className="radio-item">
                  <input
                    type="radio"
                    id="hourly"
                    name="paymentType"
                    value="hourly"
                    checked={formData.paymentType === 'hourly'}
                    onChange={handleChange}
                  />
                  <label htmlFor="hourly">
                    {language === 'en' ? 'Hourly Rate' : 'Почасовая Ставка'}
                  </label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="fixed-fee"
                    name="paymentType"
                    value="fixed"
                    checked={formData.paymentType === 'fixed'}
                    onChange={handleChange}
                  />
                  <label htmlFor="fixed-fee">
                    {language === 'en' ? 'Fixed Fee' : 'Фиксированная Оплата'}
                  </label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="milestone"
                    name="paymentType"
                    value="milestone"
                    checked={formData.paymentType === 'milestone'}
                    onChange={handleChange}
                  />
                  <label htmlFor="milestone">
                    {language === 'en' ? 'Milestone-Based' : 'Оплата по Этапам'}
                  </label>
                </div>
              </div>
            </div>
            
            {formData.paymentType === 'hourly' && (
              <div className="form-group">
                <label className="form-label" htmlFor="hourlyRate">
                  {language === 'en' ? 'Hourly Rate' : 'Почасовая Ставка'}
                </label>
                <input
                  type="text"
                  id="hourlyRate"
                  name="hourlyRate"
                  className="form-control"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                />
              </div>
            )}
            
            {formData.paymentType === 'fixed' && (
              <div className="form-group">
                <label className="form-label" htmlFor="fixedFee">
                  {language === 'en' ? 'Fixed Fee' : 'Фиксированная Сумма'}
                </label>
                <input
                  type="text"
                  id="fixedFee"
                  name="fixedFee"
                  className="form-control"
                  value={formData.fixedFee}
                  onChange={handleChange}
                />
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label" htmlFor="currency">
                {language === 'en' ? 'Currency' : 'Валюта'}
              </label>
              <select
                id="currency"
                name="currency"
                className="form-control select-control"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="RUB">RUB</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="paymentFrequency">
                {language === 'en' ? 'Payment Frequency' : 'Периодичность Оплаты'}
              </label>
              <select
                id="paymentFrequency"
                name="paymentFrequency"
                className="form-control select-control"
                value={formData.paymentFrequency}
                onChange={handleChange}
              >
                <option value="weekly">{language === 'en' ? 'Weekly' : 'Еженедельно'}</option>
                <option value="biweekly">{language === 'en' ? 'Bi-weekly' : 'Раз в две недели'}</option>
                <option value="monthly">{language === 'en' ? 'Monthly' : 'Ежемесячно'}</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="paymentTerms">
                {language === 'en' ? 'Payment Terms (days)' : 'Условия Оплаты (дни)'}
                <i data-feather="help-circle" className="help-icon"></i>
              </label>
              <div className="tooltip">
                {language === 'en' 
                  ? 'Number of days after invoice receipt that payment is due.' 
                  : 'Количество дней после получения счета, в течение которых должна быть произведена оплата.'}
              </div>
              <input
                type="number"
                id="paymentTerms"
                name="paymentTerms"
                className="form-control"
                value={formData.paymentTerms}
                onChange={handleChange}
                min="1"
              />
            </div>
            
            <div className="form-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="expenses"
                  name="expenses"
                  checked={formData.expenses}
                  onChange={handleChange}
                />
                <label htmlFor="expenses">
                  {language === 'en' ? 'Reimbursable Expenses' : 'Возмещаемые Расходы'}
                </label>
              </div>
            </div>
            
            {formData.expenses && (
              <div className="form-group">
                <label className="form-label" htmlFor="expensesDetails">
                  {language === 'en' ? 'Expenses Details' : 'Детали Возмещаемых Расходов'}
                </label>
                <textarea
                  id="expensesDetails"
                  name="expensesDetails"
                  className="form-control textarea-control"
                  value={formData.expensesDetails}
                  onChange={handleChange}
                  rows="3"
                  placeholder={language === 'en' ? 'e.g., travel, materials, etc.' : 'например, проезд, материалы и т.д.'}
                ></textarea>
              </div>
            )}
          </div>
        );
        
      case 3: // Deliverables
        return (
          <div className="form-content">
            <h3>{language === 'en' ? 'Intellectual Property' : 'Интеллектуальная Собственность'}</h3>
            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'IP Ownership' : 'Владение ИС'}
                <i data-feather="help-circle" className="help-icon"></i>
              </label>
              <div className="tooltip">
                {language === 'en' 
                  ? 'Who will own the intellectual property created during the project.' 
                  : 'Кому будет принадлежать интеллектуальная собственность, созданная в ходе проекта.'}
              </div>
              <div className="radio-group">
                <div className="radio-item">
                  <input
                    type="radio"
                    id="company-ip"
                    name="ipOwnership"
                    value="company"
                    checked={formData.ipOwnership === 'company'}
                    onChange={handleChange}
                  />
                  <label htmlFor="company-ip">
                    {language === 'en' ? 'Company Owns All IP' : 'Компания Владеет Всей ИС'}
                  </label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="consultant-ip"
                    name="ipOwnership"
                    value="consultant"
                    checked={formData.ipOwnership === 'consultant'}
                    onChange={handleChange}
                  />
                  <label htmlFor="consultant-ip">
                    {language === 'en' ? 'Consultant Retains IP' : 'Консультант Сохраняет ИС'}
                  </label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="mixed-ip"
                    name="ipOwnership"
                    value="mixed"
                    checked={formData.ipOwnership === 'mixed'}
                    onChange={handleChange}
                  />
                  <label htmlFor="mixed-ip">
                    {language === 'en' ? 'Mixed Ownership' : 'Смешанное Владение'}
                  </label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="ipRights">
                {language === 'en' ? 'IP Rights Included' : 'Включенные Права ИС'}
              </label>
              <select
                id="ipRights"
                name="ipRights"
                className="form-control select-control"
                multiple
                value={formData.ipRights}
                onChange={handleChange}
                size="5"
              >
                <option value="copyright">{language === 'en' ? 'Copyright' : 'Авторские Права'}</option>
                <option value="patent">{language === 'en' ? 'Patent Rights' : 'Патентные Права'}</option>
                <option value="trademark">{language === 'en' ? 'Trademark Rights' : 'Права на Товарные Знаки'}</option>
                <option value="trade-secret">{language === 'en' ? 'Trade Secrets' : 'Коммерческая Тайна'}</option>
                <option value="know-how">{language === 'en' ? 'Know-how' : 'Ноу-хау'}</option>
              </select>
              <div className="info-box">
                <p>
                  {language === 'en' 
                    ? 'Hold Ctrl/Cmd key to select multiple options' 
                    : 'Удерживайте клавишу Ctrl/Cmd для выбора нескольких опций'}
                </p>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'Moral Rights' : 'Неимущественные Авторские Права'}
                <i data-feather="help-circle" className="help-icon"></i>
              </label>
              <div className="tooltip">
                {language === 'en' 
                  ? 'Moral rights include the right to be identified as the author and to object to derogatory treatment of the work.' 
                  : 'Неимущественные авторские права включают право быть признанным автором и возражать против негативного обращения с произведением.'}
              </div>
              <div className="radio-group">
                <div className="radio-item">
                  <input
                    type="radio"
                    id="waived"
                    name="moralRights"
                    value="waived"
                    checked={formData.moralRights === 'waived'}
                    onChange={handleChange}
                  />
                  <label htmlFor="waived">
                    {language === 'en' ? 'Waived/Assigned to Company' : 'Отказ/Передача Компании'}
                  </label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="retained"
                    name="moralRights"
                    value="retained"
                    checked={formData.moralRights === 'retained'}
                    onChange={handleChange}
                  />
                  <label htmlFor="retained">
                    {language === 'en' ? 'Retained by Consultant' : 'Сохраняются за Консультантом'}
                  </label>
                </div>
              </div>
            </div>
            
            <h3>{language === 'en' ? 'Confidentiality' : 'Конфиденциальность'}</h3>
            <div className="form-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="confidentiality"
                  name="confidentiality"
                  checked={formData.confidentiality}
                  onChange={handleChange}
                />
                <label htmlFor="confidentiality">
                  {language === 'en' ? 'Include Confidentiality Provisions' : 'Включить Положения о Конфиденциальности'}
                </label>
              </div>
            </div>
            
            {formData.confidentiality && (
              <div className="form-group">
                <label className="form-label" htmlFor="confidentialityTerm">
                  {language === 'en' ? 'Confidentiality Term (years)' : 'Срок Конфиденциальности (лет)'}
                </label>
                <input
                  type="number"
                  id="confidentialityTerm"
                  name="confidentialityTerm"
                  className="form-control"
                  value={formData.confidentialityTerm}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            )}
          </div>
        );
        
      case 4: // Additional
        return (
          <div className="form-content">
            <h3>{language === 'en' ? 'Restrictive Covenants' : 'Ограничительные Условия'}</h3>
            <div className="form-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="nonCompete"
                  name="nonCompete"
                  checked={formData.nonCompete}
                  onChange={handleChange}
                />
                <label htmlFor="nonCompete">
                  {language === 'en' ? 'Include Non-Compete Clause' : 'Включить Положение о Неконкуренции'}
                </label>
              </div>
            </div>
            
            {formData.nonCompete && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="nonCompeteTerm">
                    {language === 'en' ? 'Non-Compete Term' : 'Срок Ограничения Конкуренции'}
                  </label>
                  <input
                    type="text"
                    id="nonCompeteTerm"
                    name="nonCompeteTerm"
                    className="form-control"
                    value={formData.nonCompeteTerm}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'e.g., 1 year' : 'например, 1 год'}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="nonCompeteScope">
                    {language === 'en' ? 'Non-Compete Scope' : 'Область Ограничения Конкуренции'}
                  </label>
                  <textarea
                    id="nonCompeteScope"
                    name="nonCompeteScope"
                    className="form-control textarea-control"
                    value={formData.nonCompeteScope}
                    onChange={handleChange}
                    rows="3"
                    placeholder={language === 'en' ? 'e.g., geographic area, industry sector' : 'например, географическая область, отрасль'}
                  ></textarea>
                </div>
                
                <div className="warning-box">
                  <p>
                    {language === 'en' 
                      ? 'Non-compete clauses may not be enforceable in some jurisdictions or may be subject to limitations.' 
                      : 'Положения о неконкуренции могут быть неисполнимы в некоторых юрисдикциях или могут иметь ограничения.'}
                  </p>
                </div>
              </>
            )}
            
            <div className="form-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="nonSolicitation"
                  name="nonSolicitation"
                  checked={formData.nonSolicitation}
                  onChange={handleChange}
                />
                <label htmlFor="nonSolicitation">
                  {language === 'en' ? 'Include Non-Solicitation Clause' : 'Включить Положение о Непереманивании'}
                </label>
              </div>
            </div>
            
            {formData.nonSolicitation && (
              <div className="form-group">
                <label className="form-label" htmlFor="nonSolicitationTerm">
                  {language === 'en' ? 'Non-Solicitation Term' : 'Срок Запрета на Переманивание'}
                </label>
                <input
                  type="text"
                  id="nonSolicitationTerm"
                  name="nonSolicitationTerm"
                  className="form-control"
                  value={formData.nonSolicitationTerm}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'e.g., 1 year' : 'например, 1 год'}
                />
              </div>
            )}
            
            <h3>{language === 'en' ? 'Legal Protections' : 'Правовая Защита'}</h3>
            <div className="form-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="indemnification"
                  name="indemnification"
                  checked={formData.indemnification}
                  onChange={handleChange}
                />
                <label htmlFor="indemnification">
                  {language === 'en' ? 'Include Indemnification Clause' : 'Включить Положение о Возмещении Ущерба'}
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="insurance"
                  name="insurance"
                  checked={formData.insurance}
                  onChange={handleChange}
                />
                <label htmlFor="insurance">
                  {language === 'en' ? 'Require Insurance Coverage' : 'Требовать Страховое Покрытие'}
                </label>
              </div>
            </div>
            
            {formData.insurance && (
              <div className="form-group">
                <label className="form-label" htmlFor="insuranceRequirements">
                  {language === 'en' ? 'Insurance Requirements' : 'Требования к Страхованию'}
                </label>
                <textarea
                  id="insuranceRequirements"
                  name="insuranceRequirements"
                  className="form-control textarea-control"
                  value={formData.insuranceRequirements}
                  onChange={handleChange}
                  rows="3"
                  placeholder={language === 'en' ? 'e.g., coverage types, amounts' : 'например, типы покрытия, суммы'}
                ></textarea>
              </div>
            )}
            
            <h3>{language === 'en' ? 'Dispute Resolution' : 'Разрешение Споров'}</h3>
            <div className="form-group">
              <label className="form-label" htmlFor="governingLaw">
                {language === 'en' ? 'Governing Law' : 'Применимое Право'}
              </label>
              <input
                type="text"
                id="governingLaw"
                name="governingLaw"
                className="form-control"
                value={formData.governingLaw}
                onChange={handleChange}
                placeholder={language === 'en' ? 'e.g., California' : 'например, Калифорния'}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'Dispute Resolution Method' : 'Метод Разрешения Споров'}
              </label>
              <div className="radio-group">
                <div className="radio-item">
                  <input
                    type="radio"
                    id="arbitration"
                    name="disputeResolution"
                    value="arbitration"
                    checked={formData.disputeResolution === 'arbitration'}
                    onChange={handleChange}
                  />
                  <label htmlFor="arbitration">
                    {language === 'en' ? 'Arbitration' : 'Арбитраж'}
                  </label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="litigation"
                    name="disputeResolution"
                    value="litigation"
                    checked={formData.disputeResolution === 'litigation'}
                    onChange={handleChange}
                  />
                  <label htmlFor="litigation">
                    {language === 'en' ? 'Litigation' : 'Судебное Разбирательство'}
                  </label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="mediation"
                    name="disputeResolution"
                    value="mediation"
                    checked={formData.disputeResolution === 'mediation'}
                    onChange={handleChange}
                  />
                  <label htmlFor="mediation">
                    {language === 'en' ? 'Mediation First, Then Arbitration' : 'Сначала Медиация, Затем Арбитраж'}
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 5: // Summary
        return (
          <div className="form-content">
            <h3>{language === 'en' ? 'Agreement Summary' : 'Сводка Соглашения'}</h3>
            
            <div className="summary-section">
              <h4>{language === 'en' ? 'Parties' : 'Стороны'}</h4>
              <div className="summary-item">
                <span className="summary-label">{language === 'en' ? 'Company:' : 'Компания:'}</span>
                <span className="summary-value">{formData.companyName || '—'}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{language === 'en' ? 'Consultant:' : 'Консультант:'}</span>
                <span className="summary-value">{formData.consultantName || '—'}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{language === 'en' ? 'Effective Date:' : 'Дата Вступления в Силу:'}</span>
                <span className="summary-value">
                  {formData.effectiveDate 
                    ? new Date(formData.effectiveDate).toLocaleDateString(language === 'en' ? 'en-US' : 'ru-RU') 
                    : '—'}
                </span>
              </div>
            </div>
            
            <div className="summary-section">
              <h4>{language === 'en' ? 'Key Terms' : 'Ключевые Условия'}</h4>
              <div className="summary-item">
                <span className="summary-label">{language === 'en' ? 'Payment Structure:' : 'Структура Оплаты:'}</span>
                <span className="summary-value">
                  {formData.paymentType === 'hourly' 
                    ? (language === 'en' ? `Hourly Rate: ${formData.currency} ${formData.hourlyRate || '—'}` : `Почасовая Ставка: ${formData.currency} ${formData.hourlyRate || '—'}`)
                    : formData.paymentType === 'fixed'
                    ? (language === 'en' ? `Fixed Fee: ${formData.currency} ${formData.fixedFee || '—'}` : `Фиксированная Оплата: ${formData.currency} ${formData.fixedFee || '—'}`)
                    : (language === 'en' ? 'Milestone-Based Payment' : 'Оплата по Этапам')}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{language === 'en' ? 'Term Type:' : 'Тип Срока:'}</span>
                <span className="summary-value">
                  {formData.termLength === 'fixed' 
                    ? (language === 'en' ? `Fixed Term: ${formData.termDuration || '—'}` : `Фиксированный Срок: ${formData.termDuration || '—'}`)
                    : formData.termLength === 'indefinite'
                    ? (language === 'en' ? 'Indefinite Term' : 'Бессрочный')
                    : (language === 'en' ? 'Until Project Completion' : 'До Завершения Проекта')}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{language === 'en' ? 'IP Ownership:' : 'Владение ИС:'}</span>
                <span className="summary-value">
                  {formData.ipOwnership === 'company' 
                    ? (language === 'en' ? 'Company Owns All IP' : 'Компания Владеет Всей ИС')
                    : formData.ipOwnership === 'consultant'
                    ? (language === 'en' ? 'Consultant Retains IP' : 'Консультант Сохраняет ИС')
                    : (language === 'en' ? 'Mixed Ownership' : 'Смешанное Владение')}
                </span>
              </div>
            </div>
            
            <div className="summary-section">
              <h4>{language === 'en' ? 'Restrictive Covenants' : 'Ограничительные Условия'}</h4>
              <div className="summary-item">
                <span className="summary-label">{language === 'en' ? 'Non-Compete:' : 'Неконкуренция:'}</span>
                <span className="summary-value">
                  {formData.nonCompete 
                    ? (language === 'en' ? `Yes, for ${formData.nonCompeteTerm || '—'}` : `Да, на срок ${formData.nonCompeteTerm || '—'}`)
                    : (language === 'en' ? 'No' : 'Нет')}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{language === 'en' ? 'Non-Solicitation:' : 'Непереманивание:'}</span>
                <span className="summary-value">
                  {formData.nonSolicitation 
                    ? (language === 'en' ? `Yes, for ${formData.nonSolicitationTerm || '—'}` : `Да, на срок ${formData.nonSolicitationTerm || '—'}`)
                    : (language === 'en' ? 'No' : 'Нет')}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{language === 'en' ? 'Confidentiality:' : 'Конфиденциальность:'}</span>
                <span className="summary-value">
                  {formData.confidentiality 
                    ? (language === 'en' ? `Yes, for ${formData.confidentialityTerm} years` : `Да, на ${formData.confidentialityTerm} лет`)
                    : (language === 'en' ? 'No' : 'Нет')}
                </span>
              </div>
            </div>
            
            <div className="summary-section">
              <h4>{language === 'en' ? 'Legal Framework' : 'Правовая Основа'}</h4>
              <div className="summary-item">
                <span className="summary-label">{language === 'en' ? 'Governing Law:' : 'Применимое Право:'}</span>
                <span className="summary-value">{formData.governingLaw || '—'}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{language === 'en' ? 'Dispute Resolution:' : 'Разрешение Споров:'}</span>
                <span className="summary-value">
                  {formData.disputeResolution === 'arbitration' 
                    ? (language === 'en' ? 'Arbitration' : 'Арбитраж')
                    : formData.disputeResolution === 'litigation'
                    ? (language === 'en' ? 'Litigation' : 'Судебное Разбирательство')
                    : (language === 'en' ? 'Mediation, then Arbitration' : 'Сначала Медиация, Затем Арбитраж')}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{language === 'en' ? 'Indemnification:' : 'Возмещение Ущерба:'}</span>
                <span className="summary-value">
                  {formData.indemnification 
                    ? (language === 'en' ? 'Yes' : 'Да')
                    : (language === 'en' ? 'No' : 'Нет')}
                </span>
              </div>
            </div>
            
            <div className="summary-section">
              <h4>{language === 'en' ? 'Risk Assessment' : 'Оценка Рисков'}</h4>
              <div className="summary-item">
                <span className="summary-label">{language === 'en' ? 'Overall Risk Level:' : 'Общий Уровень Риска:'}</span>
                <span className={`risk-indicator ${getRiskLevel()}`}>
                  {getRiskLevelText()}
                </span>
              </div>
            </div>
            
            {getRiskItems().length > 0 && (
              <div className="warning-box">
                <p><strong>{language === 'en' ? 'Risk Factors:' : 'Факторы Риска:'}</strong></p>
                <ul>
                  {getRiskItems().map((item, index) => (
                    <li key={index}>{item}</li>
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
  
  // Function to determine risk level
  const getRiskLevel = () => {
    let riskScore = 0;
    
    // Add risk points based on agreement terms
    if (formData.ipOwnership !== 'company') riskScore += 2;
    if (formData.nonCompete && !formData.nonCompeteTerm) riskScore += 1;
    if (formData.confidentiality && parseInt(formData.confidentialityTerm) > 5) riskScore += 1;
    if (formData.paymentType === 'fixed' && !formData.fixedFee) riskScore += 1;
    if (!formData.indemnification) riskScore += 2;
    
    // Determine risk level based on score
    if (riskScore <= 2) return 'risk-low';
    if (riskScore <= 4) return 'risk-medium';
    return 'risk-high';
  };
  
  // Get risk level text
  const getRiskLevelText = () => {
    const level = getRiskLevel();
    
    if (level === 'risk-low') {
      return language === 'en' ? 'Low Risk' : 'Низкий Риск';
    }
    if (level === 'risk-medium') {
      return language === 'en' ? 'Medium Risk' : 'Средний Риск';
    }
    return language === 'en' ? 'High Risk' : 'Высокий Риск';
  };
  
  // Get risk items list
  const getRiskItems = () => {
    const items = [];
    
    if (formData.ipOwnership !== 'company') {
      items.push(
        language === 'en' 
          ? 'IP ownership not fully assigned to the company may create risks for future product development.'
          : 'Права на интеллектуальную собственность, не полностью переданные компании, могут создавать риски для будущей разработки продуктов.'
      );
    }
    
    if (formData.nonCompete && !formData.nonCompeteTerm) {
      items.push(
        language === 'en' 
          ? 'Non-compete clause missing specific time limitations may be unenforceable.'
          : 'Положение о неконкуренции без конкретных временных ограничений может быть неисполнимым.'
      );
    }
    
    if (formData.confidentiality && parseInt(formData.confidentialityTerm) > 5) {
      items.push(
        language === 'en' 
          ? 'Extended confidentiality periods (over 5 years) may face enforcement challenges in some jurisdictions.'
          : 'Продленные периоды конфиденциальности (свыше 5 лет) могут столкнуться с проблемами правоприменения в некоторых юрисдикциях.'
      );
    }
    
    if (!formData.indemnification) {
      items.push(
        language === 'en' 
          ? 'Lack of indemnification provisions may expose the company to third-party claims.'
          : 'Отсутствие положений о возмещении ущерба может подвергнуть компанию претензиям третьих лиц.'
      );
    }
    
    return items;
  };
  
  // Render component
  return (
    <div className="container">
      <div className="app-header">
        <h1 className="app-title">
          {language === 'en' 
            ? 'English-Russian Independent Contractor Agreement Generator' 
            : 'Генератор Англо-Русского Договора с Независимым Подрядчиком'}
        </h1>
        <p className="app-description">
          {language === 'en'
            ? 'Create a professional bilingual independent contractor agreement'
            : 'Создайте профессиональный двуязычный договор с независимым подрядчиком'}
        </p>
        <div className="language-toggle">
          <button 
            className={language === 'en' ? 'active' : ''} 
            onClick={() => toggleLanguage('en')}
            title="English"
          >
            <img src={englishFlag} alt="English" />
          </button>
          <button 
            className={language === 'ru' ? 'active' : ''} 
            onClick={() => toggleLanguage('ru')}
            title="Русский"
          >
            <img src={russianFlag} alt="Русский" />
          </button>
        </div>
      </div>
      
      <div className="tabs-container">
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
        
        <div className="tab-content">
          <div className="form-panel">
            {renderTabContent()}
          </div>
          
          <div className={`preview-panel ${showPreview ? 'visible' : ''}`} ref={previewRef}>
            {showPreview && (
              <button className="preview-close" onClick={togglePreview}>×</button>
            )}
            <div className="preview-content">
              <h2>{language === 'en' ? 'Live Preview' : 'Предпросмотр'}</h2>
              <div 
                className="document-preview"
                dangerouslySetInnerHTML={{ __html: getHighlightedDocument() }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="navigation-buttons">
          <button
            onClick={prevTab}
            className={`nav-button prev-button ${currentTab === 0 ? 'disabled' : ''}`}
            disabled={currentTab === 0}
          >
            <i data-feather="chevron-left"></i>
            {language === 'en' ? 'Previous' : 'Назад'}
          </button>
          
          <button
            onClick={copyToClipboard}
            className="nav-button"
            style={{
              backgroundColor: "#4f46e5", 
              color: "white",
              border: "none"
            }}
          >
            <i data-feather="copy"></i>
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
            <i data-feather="file-text"></i>
            {language === 'en' ? 'MS Word' : 'MS Word'}
          </button>
          
          <a
            href="https://terms.law/call/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-button"
            style={{
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center"
            }}
          >
            <i data-feather="phone-call"></i>
            {language === 'en' ? 'Consult' : 'Консультация'}
          </a>
          
          <button
            onClick={nextTab}
            className="nav-button next-button"
            disabled={currentTab === tabs.length - 1}
          >
            {language === 'en' ? 'Next' : 'Далее'}
            <i data-feather="chevron-right"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile preview toggle button */}
      <div className="mobile-preview-toggle" style={{ display: window.innerWidth < 1024 ? 'block' : 'none' }}>
        <button onClick={togglePreview}>
          <i data-feather="eye"></i>
        </button>
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));