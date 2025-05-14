// California-specific tooltips and helper components

// InfoTooltip component
const InfoTooltip = ({ title, content }) => {
  return (
    <div className="info-tooltip">
      <span className="tooltip-title">{title}</span>
      <i data-feather="info" className="info-icon"></i>
      <div className="tooltip-content">
        {content}
      </div>
    </div>
  );
};

// CaliforniaLawAlert component for important notices
const CaliforniaLawAlert = ({ title, children }) => {
  return (
    <div className="ca-law-alert">
      <div className="ca-law-alert-header">
        <i data-feather="alert-triangle"></i>
        <span>{title || "California Law Note"}</span>
      </div>
      <div className="ca-law-alert-content">
        {children}
      </div>
    </div>
  );
};

// California-specific helper text examples
const californiaTips = {
  overtime: "California has strict overtime rules requiring payment at 1.5x for hours over 8 in a day or 40 in a week, and 2x for hours over 12 in a day or for hours over 8 on the 7th consecutive workday.",
  mealBreaks: "California requires a 30-minute meal break for shifts over 5 hours, and a second meal break for shifts over 10 hours. Premium pay of one hour at regular rate is required if meal breaks are missed.",
  restBreaks: "California requires a 10-minute paid rest break for every 4 hours worked or major fraction thereof. Premium pay of one hour at regular rate is required if rest breaks are missed.",
  sickLeave: "California requires employers to provide at least 3 days or 24 hours of paid sick leave per year, with specific accrual, usage, and carryover rules.",
  finalPay: "California requires immediate payment of final wages upon termination, or within 72 hours of resignation without notice. All accrued PTO must be paid out.",
  nonCompete: "California generally prohibits non-compete agreements, making them void and unenforceable under Business and Professions Code Section 16600.",
  ipAssignment: "California Labor Code Section 2870 protects employee inventions created on their own time without employer resources, even if related to the employer's business.",
  expenseReimbursement: "California requires employers to reimburse employees for all necessary expenses incurred in performing their duties, including remote work expenses.",
  arbitration: "California arbitration agreements must meet specific requirements, including employer payment of all arbitration fees and no limitation on available remedies.",
};

// Usage examples:
// <InfoTooltip 
//   title="Overtime Rules" 
//   content={californiaTips.overtime}
// />
// 
// <CaliforniaLawAlert title="Non-Compete Warning">
//   <p>California law prohibits non-compete agreements with very limited exceptions.</p>
// </CaliforniaLawAlert>
