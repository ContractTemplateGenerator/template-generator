import React from 'react';
import MemberCard from './components/MemberCard.jsx';

const highlightDuration = 1800;

const defaultPlaceholders = {
  llcName: '[LLC Name]',
  effectiveDate: '[Effective Date]',
  state: '[Governing State]',
  principalOffice: '[Principal Office Address]',
  registeredAgentName: '[Registered Agent Name]',
  registeredAgentAddress: '[Registered Agent Address]',
  propertyAddress: '[Property Address]',
  propertyDescription: '[Property description]',
  businessPurpose:
    'to acquire, own, lease, operate, and manage real estate assets and engage in lawful activities related thereto.',
  capitalContributions: 'As set forth on Schedule A attached hereto.',
  distributionPolicy:
    'quarterly in proportion to membership interests after reserving adequate funds for expenses.',
  decisionProcess:
    'by Members holding at least a majority of the outstanding membership interests.',
  dissolutionPlan:
    'wind up its affairs, liquidate assets, satisfy liabilities, and distribute remaining proceeds to the Members in proportion to their interests.',
  signingLocation: '[City, State]',
  signatureBlock:
    'IN WITNESS WHEREOF, the Members execute this Operating Agreement as of the Effective Date.'
};

function escapeHtml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(value) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

function FieldText({ fieldKey, value, fallback, multiline = false }) {
  const raw = (value || '').trim();
  const isEmpty = raw.length === 0;
  const source = isEmpty ? fallback : value;
  const safe = escapeHtml(source || '');
  const html = multiline ? safe.replace(/\n/g, '<br />') : safe;
  const classes = `field-value${isEmpty ? ' placeholder' : ''}`;

  return (
    <span
      className={classes}
      data-field={fieldKey}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function MemberSummary({ member }) {
  return (
    <li className="member-preview" data-member-preview={member.id}>
      <p>
        <strong>
          <FieldText
            fieldKey={`member:${member.id}:name`}
            value={member.name}
            fallback="[Member Name]"
          />
        </strong>{' '}
        contributes{' '}
        <FieldText
          fieldKey={`member:${member.id}:contribution`}
          value={member.contribution}
          fallback="[capital contribution]"
        />{' '}
        for a{' '}
        <FieldText
          fieldKey={`member:${member.id}:percentage`}
          value={member.percentage}
          fallback="[ownership %]"
        />{' '}
        membership interest and will{' '}
        <FieldText
          fieldKey={`member:${member.id}:role`}
          value={member.role}
          fallback="[role / responsibilities]"
        />
        .
      </p>
    </li>
  );
}

const App = () => {
  const formRef = React.useRef(null);
  const previewRef = React.useRef(null);
  const highlightTimersRef = React.useRef(new Map());
  const nextMemberId = React.useRef(1);

  const createMember = React.useCallback((initial = {}) => ({
    id: `m-${nextMemberId.current++}`,
    name: '',
    contribution: '',
    percentage: '',
    role: '',
    ...initial
  }), []);

  const createEmptyState = React.useCallback(() => ({
    llcName: '',
    effectiveDate: '',
    state: '',
    principalOffice: '',
    registeredAgentName: '',
    registeredAgentAddress: '',
    propertyAddress: '',
    propertyDescription: '',
    businessPurpose: '',
    managementStructure: 'member',
    managerName: '',
    capitalContributions: '',
    distributionPolicy: '',
    decisionProcess: '',
    dissolutionPlan: '',
    signingLocation: '',
    signatureBlock: '',
    members: [createMember()]
  }), [createMember]);

  const [formState, setFormState] = React.useState(createEmptyState);
  const [activeMarker, setActiveMarker] = React.useState(null);
  const [lastAddedMember, setLastAddedMember] = React.useState(null);

  const triggerHighlight = React.useCallback((key) => {
    if (!key) {
      return;
    }
    setActiveMarker({ key, nonce: Math.random() });
  }, []);

  const handleFieldChange = React.useCallback(
    (key, value) => {
      setFormState((prev) => {
        const next = { ...prev, [key]: value };
        if (key === 'managementStructure' && value !== 'manager' && prev.managerName) {
          next.managerName = '';
        }
        return next;
      });
      triggerHighlight(key);
      if (key === 'managementStructure' && value === 'manager') {
        window.requestAnimationFrame(() => {
          const managerInput = formRef.current?.querySelector('#managerName');
          if (managerInput) {
            managerInput.focus();
            triggerHighlight('managerName');
          }
        });
      }
    },
    [triggerHighlight]
  );

  const handleMemberChange = React.useCallback(
    (memberId, field, value) => {
      setFormState((prev) => ({
        ...prev,
        members: prev.members.map((member) =>
          member.id === memberId ? { ...member, [field]: value } : member
        )
      }));
      triggerHighlight(`member:${memberId}:${field}`);
    },
    [triggerHighlight]
  );

  const handleAddMember = React.useCallback(() => {
    const newMember = createMember();
    setFormState((prev) => ({
      ...prev,
      members: [...prev.members, newMember]
    }));
    setLastAddedMember(newMember.id);
    triggerHighlight(`member:${newMember.id}:name`);
  }, [createMember, triggerHighlight]);

  const handleRemoveMember = React.useCallback(
    (memberId) => {
      setFormState((prev) => {
        if (prev.members.length <= 1) {
          return prev;
        }
        const updatedMembers = prev.members.filter((member) => member.id !== memberId);
        window.setTimeout(() => {
          if (updatedMembers.length === 0) {
            triggerHighlight('members-placeholder');
          } else {
            triggerHighlight(`member:${updatedMembers[0].id}:name`);
          }
        }, 0);
        return { ...prev, members: updatedMembers };
      });
    },
    [triggerHighlight]
  );

  const handleReset = React.useCallback(() => {
    nextMemberId.current = 1;
    highlightTimersRef.current.forEach((timerId, node) => {
      window.clearTimeout(timerId);
      if (node instanceof HTMLElement) {
        node.classList.remove('highlight');
      }
    });
    highlightTimersRef.current.clear();
    setFormState(createEmptyState());
    setActiveMarker(null);
    setLastAddedMember(null);
  }, [createEmptyState]);

  React.useEffect(() => {
    if (!activeMarker || !previewRef.current) {
      return;
    }
    const { key } = activeMarker;
    const nodes = previewRef.current.querySelectorAll(`[data-field="${key}"]`);
    if (!nodes.length) {
      return;
    }
    nodes.forEach((node, index) => {
      node.classList.add('highlight');
      if (index === 0) {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (highlightTimersRef.current.has(node)) {
        window.clearTimeout(highlightTimersRef.current.get(node));
      }
      const timerId = window.setTimeout(() => {
        node.classList.remove('highlight');
        highlightTimersRef.current.delete(node);
      }, highlightDuration);
      highlightTimersRef.current.set(node, timerId);
    });
  }, [activeMarker]);

  React.useEffect(() => {
    return () => {
      highlightTimersRef.current.forEach((timerId, node) => {
        window.clearTimeout(timerId);
        if (node instanceof HTMLElement) {
          node.classList.remove('highlight');
        }
      });
      highlightTimersRef.current.clear();
    };
  }, []);

  const effectiveDateText = React.useMemo(
    () => formatDate(formState.effectiveDate),
    [formState.effectiveDate]
  );

  const membersList =
    formState.members.length > 0 ? (
      <ul>
        {formState.members.map((member) => (
          <MemberSummary key={member.id} member={member} />
        ))}
      </ul>
    ) : (
      <p className="placeholder" data-field="members-placeholder">
        Add members to populate this section.
      </p>
    );

  const managementSection =
    formState.managementStructure === 'manager' ? (
      <p>
        The Members designate <strong>
          <FieldText
            fieldKey="managerName"
            value={formState.managerName}
            fallback="[Manager Name]"
          />
        </strong>{' '}
        as the Manager. The Manager will oversee daily operations, approve ordinary-course
        expenditures, and keep the Members informed of material developments related to the
        Company and its rental properties.
      </p>
    ) : (
      <p>
        The Company is <strong>member-managed</strong>. Each Member is authorized to act on behalf
        of the Company in the ordinary course of business, consistent with this Agreement.
      </p>
    );

  return (
    <>
      <header className="app-header">
        <h1>Real Estate LLC Operating Agreement Generator</h1>
        <p>
          Create a tailored operating agreement outline with live preview and change tracking.
        </p>
      </header>
      <main className="app-main">
        <section className="builder" aria-label="Operating agreement builder">
          <form ref={formRef} id="oa-form" autoComplete="off">
            <div className="form-section">
              <h2>LLC Details</h2>
              <label className="field">
                <span className="field-label">LLC Name</span>
                <input
                  type="text"
                  id="llcName"
                  name="llcName"
                  value={formState.llcName}
                  onChange={(event) => handleFieldChange('llcName', event.target.value)}
                  onFocus={() => triggerHighlight('llcName')}
                  placeholder="Example Property Holdings, LLC"
                />
              </label>
              <label className="field">
                <span className="field-label">Effective Date</span>
                <input
                  type="date"
                  id="effectiveDate"
                  name="effectiveDate"
                  value={formState.effectiveDate}
                  onChange={(event) => handleFieldChange('effectiveDate', event.target.value)}
                  onFocus={() => triggerHighlight('effectiveDate')}
                />
              </label>
              <label className="field">
                <span className="field-label">Governing State</span>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formState.state}
                  onChange={(event) => handleFieldChange('state', event.target.value)}
                  onFocus={() => triggerHighlight('state')}
                  placeholder="Delaware"
                />
              </label>
              <label className="field">
                <span className="field-label">Principal Office Address</span>
                <input
                  type="text"
                  id="principalOffice"
                  name="principalOffice"
                  value={formState.principalOffice}
                  onChange={(event) => handleFieldChange('principalOffice', event.target.value)}
                  onFocus={() => triggerHighlight('principalOffice')}
                  placeholder="123 Main Street, City, State"
                />
              </label>
              <label className="field">
                <span className="field-label">Registered Agent Name</span>
                <input
                  type="text"
                  id="registeredAgentName"
                  name="registeredAgentName"
                  value={formState.registeredAgentName}
                  onChange={(event) => handleFieldChange('registeredAgentName', event.target.value)}
                  onFocus={() => triggerHighlight('registeredAgentName')}
                  placeholder="Registered Agent Name"
                />
              </label>
              <label className="field">
                <span className="field-label">Registered Agent Address</span>
                <input
                  type="text"
                  id="registeredAgentAddress"
                  name="registeredAgentAddress"
                  value={formState.registeredAgentAddress}
                  onChange={(event) => handleFieldChange('registeredAgentAddress', event.target.value)}
                  onFocus={() => triggerHighlight('registeredAgentAddress')}
                  placeholder="456 Agent Ave, City, State"
                />
              </label>
            </div>

            <div className="form-section">
              <h2>Property Information</h2>
              <label className="field">
                <span className="field-label">Primary Property Address</span>
                <input
                  type="text"
                  id="propertyAddress"
                  name="propertyAddress"
                  value={formState.propertyAddress}
                  onChange={(event) => handleFieldChange('propertyAddress', event.target.value)}
                  onFocus={() => triggerHighlight('propertyAddress')}
                  placeholder="789 Rental Road, City, State"
                />
              </label>
              <label className="field">
                <span className="field-label">Property Description</span>
                <textarea
                  id="propertyDescription"
                  name="propertyDescription"
                  rows={3}
                  value={formState.propertyDescription}
                  onChange={(event) => handleFieldChange('propertyDescription', event.target.value)}
                  onFocus={() => triggerHighlight('propertyDescription')}
                  placeholder="Two-unit residential property currently leased to long-term tenants."
                />
              </label>
              <label className="field">
                <span className="field-label">Business Purpose</span>
                <textarea
                  id="businessPurpose"
                  name="businessPurpose"
                  rows={3}
                  value={formState.businessPurpose}
                  onChange={(event) => handleFieldChange('businessPurpose', event.target.value)}
                  onFocus={() => triggerHighlight('businessPurpose')}
                  placeholder="Acquire, own, lease, and manage residential rental properties and related assets."
                />
              </label>
            </div>

            <div className="form-section">
              <h2>Management</h2>
              <fieldset className="field">
                <legend>Management Structure</legend>
                <label className="option">
                  <input
                    type="radio"
                    name="managementStructure"
                    value="member"
                    checked={formState.managementStructure === 'member'}
                    onChange={(event) => handleFieldChange('managementStructure', event.target.value)}
                    onFocus={() => triggerHighlight('managementStructure')}
                  />
                  Member-managed
                </label>
                <label className="option">
                  <input
                    type="radio"
                    name="managementStructure"
                    value="manager"
                    checked={formState.managementStructure === 'manager'}
                    onChange={(event) => handleFieldChange('managementStructure', event.target.value)}
                    onFocus={() => triggerHighlight('managementStructure')}
                  />
                  Manager-managed
                </label>
              </fieldset>
              {formState.managementStructure === 'manager' && (
                <label className="field" id="managerNameField">
                  <span className="field-label">Designated Manager Name</span>
                  <input
                    type="text"
                    id="managerName"
                    name="managerName"
                    value={formState.managerName}
                    onChange={(event) => handleFieldChange('managerName', event.target.value)}
                    onFocus={() => triggerHighlight('managerName')}
                    placeholder="Manager Name"
                  />
                </label>
              )}
            </div>

            <div className="form-section">
              <h2>Members</h2>
              <div id="members-container">
                {formState.members.map((member, index) => (
                  <MemberCard
                    key={member.id}
                    index={index}
                    member={member}
                    onChange={handleMemberChange}
                    onRemove={handleRemoveMember}
                    disableRemove={formState.members.length <= 1}
                    onMemberFocus={triggerHighlight}
                    autoFocus={member.id === lastAddedMember}
                  />
                ))}
              </div>
              <button type="button" id="add-member" className="button-secondary" onClick={handleAddMember}>
                Add Member
              </button>
            </div>

            <div className="form-section">
              <h2>Capital &amp; Distributions</h2>
              <label className="field">
                <span className="field-label">Initial Capital Contributions</span>
                <textarea
                  id="capitalContributions"
                  name="capitalContributions"
                  rows={3}
                  value={formState.capitalContributions}
                  onChange={(event) => handleFieldChange('capitalContributions', event.target.value)}
                  onFocus={() => triggerHighlight('capitalContributions')}
                  placeholder="Members contribute cash and property listed in Schedule A."
                />
              </label>
              <label className="field">
                <span className="field-label">Distribution Policy</span>
                <textarea
                  id="distributionPolicy"
                  name="distributionPolicy"
                  rows={3}
                  value={formState.distributionPolicy}
                  onChange={(event) => handleFieldChange('distributionPolicy', event.target.value)}
                  onFocus={() => triggerHighlight('distributionPolicy')}
                  placeholder="Distributions will be made quarterly in proportion to membership interests after reserving funds for expenses."
                />
              </label>
            </div>

            <div className="form-section">
              <h2>Operational Provisions</h2>
              <label className="field">
                <span className="field-label">Decision-Making Process</span>
                <textarea
                  id="decisionProcess"
                  name="decisionProcess"
                  rows={3}
                  value={formState.decisionProcess}
                  onChange={(event) => handleFieldChange('decisionProcess', event.target.value)}
                  onFocus={() => triggerHighlight('decisionProcess')}
                  placeholder="Major decisions require approval of members holding at least 66% of the membership interests."
                />
              </label>
              <label className="field">
                <span className="field-label">Dissolution Plan</span>
                <textarea
                  id="dissolutionPlan"
                  name="dissolutionPlan"
                  rows={3}
                  value={formState.dissolutionPlan}
                  onChange={(event) => handleFieldChange('dissolutionPlan', event.target.value)}
                  onFocus={() => triggerHighlight('dissolutionPlan')}
                  placeholder="Upon dissolution, assets will be sold and proceeds distributed after satisfying liabilities in accordance with membership interests."
                />
              </label>
            </div>

            <div className="form-section">
              <h2>Execution</h2>
              <label className="field">
                <span className="field-label">Agreement Signing Location</span>
                <input
                  type="text"
                  id="signingLocation"
                  name="signingLocation"
                  value={formState.signingLocation}
                  onChange={(event) => handleFieldChange('signingLocation', event.target.value)}
                  onFocus={() => triggerHighlight('signingLocation')}
                  placeholder="City, State"
                />
              </label>
              <label className="field">
                <span className="field-label">Signature Block Notes</span>
                <textarea
                  id="signatureBlock"
                  name="signatureBlock"
                  rows={3}
                  value={formState.signatureBlock}
                  onChange={(event) => handleFieldChange('signatureBlock', event.target.value)}
                  onFocus={() => triggerHighlight('signatureBlock')}
                  placeholder="IN WITNESS WHEREOF, the Members execute this Operating Agreement as of the Effective Date."
                />
              </label>
            </div>
          </form>
        </section>

        <section className="preview" aria-label="Live operating agreement preview">
          <div className="preview-toolbar">
            <h2>Agreement Preview</h2>
            <button type="button" id="reset-form" className="button-ghost" onClick={handleReset}>
              Reset Form
            </button>
          </div>
          <div id="preview-content" className="preview-content" ref={previewRef}>
            <article className="document">
              <h2>
                Operating Agreement of{' '}
                <FieldText
                  fieldKey="llcName"
                  value={formState.llcName}
                  fallback={defaultPlaceholders.llcName}
                />
              </h2>
              <p>
                THIS OPERATING AGREEMENT (this "Agreement") is entered into as of{' '}
                <FieldText
                  fieldKey="effectiveDate"
                  value={effectiveDateText}
                  fallback={defaultPlaceholders.effectiveDate}
                />{' '}
                by and among the Members identified below of{' '}
                <FieldText
                  fieldKey="llcName"
                  value={formState.llcName}
                  fallback={defaultPlaceholders.llcName}
                />
                , a limited liability company organized under the laws of the State of{' '}
                <FieldText
                  fieldKey="state"
                  value={formState.state}
                  fallback={defaultPlaceholders.state}
                />{' '}
                (the "Company").
              </p>

              <h3>Article I. Formation</h3>
              <p>
                The Members formed the Company by filing Articles of Organization with the Secretary of
                State of{' '}
                <FieldText
                  fieldKey="state"
                  value={formState.state}
                  fallback={defaultPlaceholders.state}
                />
                . The Company maintains its principal office at{' '}
                <FieldText
                  fieldKey="principalOffice"
                  value={formState.principalOffice}
                  fallback={defaultPlaceholders.principalOffice}
                />
                .
              </p>
              <p>
                The Registered Agent for service of process is{' '}
                <FieldText
                  fieldKey="registeredAgentName"
                  value={formState.registeredAgentName}
                  fallback={defaultPlaceholders.registeredAgentName}
                />{' '}
                located at{' '}
                <FieldText
                  fieldKey="registeredAgentAddress"
                  value={formState.registeredAgentAddress}
                  fallback={defaultPlaceholders.registeredAgentAddress}
                />
                .
              </p>

              <h3>Article II. Purpose</h3>
              <p>
                The purpose of the Company is{' '}
                <FieldText
                  fieldKey="businessPurpose"
                  value={formState.businessPurpose}
                  fallback={defaultPlaceholders.businessPurpose}
                  multiline
                />
              </p>
              <p>
                The initial property of the Company is located at{' '}
                <FieldText
                  fieldKey="propertyAddress"
                  value={formState.propertyAddress}
                  fallback={defaultPlaceholders.propertyAddress}
                />
                . The property is described as{' '}
                <FieldText
                  fieldKey="propertyDescription"
                  value={formState.propertyDescription}
                  fallback={defaultPlaceholders.propertyDescription}
                  multiline
                />
                .
              </p>

              <h3>Article III. Members</h3>
              {membersList}

              <h3>Article IV. Management</h3>
              {managementSection}

              <h3>Article V. Capital Contributions</h3>
              <p>
                Initial capital contributions shall be as follows:{' '}
                <FieldText
                  fieldKey="capitalContributions"
                  value={formState.capitalContributions}
                  fallback={defaultPlaceholders.capitalContributions}
                  multiline
                />
              </p>

              <h3>Article VI. Distributions</h3>
              <p>
                The Company will make distributions{' '}
                <FieldText
                  fieldKey="distributionPolicy"
                  value={formState.distributionPolicy}
                  fallback={defaultPlaceholders.distributionPolicy}
                  multiline
                />
              </p>

              <h3>Article VII. Governance</h3>
              <p>
                Company decisions will be made{' '}
                <FieldText
                  fieldKey="decisionProcess"
                  value={formState.decisionProcess}
                  fallback={defaultPlaceholders.decisionProcess}
                  multiline
                />
              </p>

              <h3>Article VIII. Dissolution</h3>
              <p>
                Upon dissolution, the Company will{' '}
                <FieldText
                  fieldKey="dissolutionPlan"
                  value={formState.dissolutionPlan}
                  fallback={defaultPlaceholders.dissolutionPlan}
                  multiline
                />
              </p>

              <h3>Article IX. Execution</h3>
              <p>
                This Agreement is executed in{' '}
                <FieldText
                  fieldKey="signingLocation"
                  value={formState.signingLocation}
                  fallback={defaultPlaceholders.signingLocation}
                />{' '}
                as of{' '}
                <FieldText
                  fieldKey="effectiveDate"
                  value={effectiveDateText}
                  fallback={defaultPlaceholders.effectiveDate}
                />
                .
              </p>
              <p>
                <FieldText
                  fieldKey="signatureBlock"
                  value={formState.signatureBlock}
                  fallback={defaultPlaceholders.signatureBlock}
                  multiline
                />
              </p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
};

export default App;
