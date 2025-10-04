(function () {
  const form = document.getElementById('oa-form');
  const managerNameField = document.getElementById('managerNameField');
  const addMemberBtn = document.getElementById('add-member');
  const membersContainer = document.getElementById('members-container');
  const memberTemplate = document.getElementById('member-template');
  const previewContent = document.getElementById('preview-content');
  const resetBtn = document.getElementById('reset-form');

  const highlightDuration = 1800;
  const highlightTimers = new WeakMap();
  let memberCounter = 0;
  let state = createEmptyState();

  function createEmptyState() {
    return {
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
      members: []
    };
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function spanField(key, value, fallback, options = {}) {
    const { multiline = false } = options;
    const raw = (value || '').trim();
    const isEmpty = raw.length === 0;
    const source = isEmpty ? fallback : value;
    let display = escapeHtml(source || '');
    if (multiline) {
      display = display.replace(/\n/g, '<br />');
    }
    const placeholderClass = isEmpty ? ' placeholder' : '';
    return `<span class="field-value${placeholderClass}" data-field="${key}">${display}</span>`;
  }

  function formatDate(value) {
    if (!value) {
      return '';
    }
    try {
      const date = new Date(value);
      const formatted = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
      return formatted;
    } catch (err) {
      return value;
    }
  }

  function buildMemberSummary(member) {
    const name = spanField(`member:${member.id}:name`, member.name, '[Member Name]');
    const contribution = spanField(
      `member:${member.id}:contribution`,
      member.contribution,
      '[capital contribution]'
    );
    const percentage = spanField(
      `member:${member.id}:percentage`,
      member.percentage,
      '[ownership %]'
    );
    const role = spanField(
      `member:${member.id}:role`,
      member.role,
      '[role / responsibilities]'
    );

    return `
      <li class="member-preview" data-member-preview="${member.id}">
        <p><strong>${name}</strong> contributes ${contribution} for a
        ${percentage} membership interest and will ${role}.</p>
      </li>
    `;
  }

  function createPreviewMarkup(currentState) {
    const effectiveDateText = formatDate(currentState.effectiveDate);
    const managementSection =
      currentState.managementStructure === 'manager'
        ? `
            <p>
              The Members designate <strong>${spanField(
                'managerName',
                currentState.managerName,
                '[Manager Name]'
              )}</strong> as the Manager. The Manager will oversee daily
              operations, approve ordinary-course expenditures, and keep the
              Members informed of material developments related to the
              Company and its rental properties.
            </p>
          `
        : `
            <p>
              The Company is <strong>member-managed</strong>. Each Member is
              authorized to act on behalf of the Company in the ordinary
              course of business, consistent with this Agreement.
            </p>
          `;

    const membersList =
      currentState.members.length > 0
        ? `<ul>${currentState.members.map(buildMemberSummary).join('')}</ul>`
        : `<p class="placeholder" data-field="members-placeholder">Add members to populate this section.</p>`;

    const signatureBlock = spanField(
      'signatureBlock',
      currentState.signatureBlock,
      'IN WITNESS WHEREOF, the Members execute this Operating Agreement as of the Effective Date.',
      { multiline: true }
    );

    return `
      <article class="document">
        <h2>Operating Agreement of ${spanField(
          'llcName',
          currentState.llcName,
          '[LLC Name]'
        )}</h2>
        <p>
          THIS OPERATING AGREEMENT (this "Agreement") is entered into as of
          ${spanField('effectiveDate', effectiveDateText, '[Effective Date]')} by and among the
          Members identified below of ${spanField(
            'llcName',
            currentState.llcName,
            '[LLC Name]'
          )}, a limited liability company organized under the laws of the
          State of ${spanField('state', currentState.state, '[Governing State]')} (the "Company").
        </p>

        <h3>Article I. Formation</h3>
        <p>
          The Members formed the Company by filing Articles of Organization with the
          Secretary of State of ${spanField(
            'state',
            currentState.state,
            '[Governing State]'
          )}. The Company maintains its principal office at ${spanField(
            'principalOffice',
            currentState.principalOffice,
            '[Principal Office Address]'
          )}.
        </p>
        <p>
          The Registered Agent for service of process is ${spanField(
            'registeredAgentName',
            currentState.registeredAgentName,
            '[Registered Agent Name]'
          )} located at ${spanField(
            'registeredAgentAddress',
            currentState.registeredAgentAddress,
            '[Registered Agent Address]'
          )}.
        </p>

        <h3>Article II. Purpose</h3>
        <p>
          The purpose of the Company is ${spanField(
            'businessPurpose',
            currentState.businessPurpose,
            'to acquire, own, lease, operate, and manage real estate assets and engage in lawful activities related thereto.',
            { multiline: true }
          )}
        </p>
        <p>
          The initial property of the Company is located at ${spanField(
            'propertyAddress',
            currentState.propertyAddress,
            '[Property Address]'
          )}. The property is described as ${spanField(
            'propertyDescription',
            currentState.propertyDescription,
            '[Property description]',
            { multiline: true }
          )}
        </p>

        <h3>Article III. Members</h3>
        ${membersList}

        <h3>Article IV. Management</h3>
        ${managementSection}

        <h3>Article V. Capital Contributions</h3>
        <p>
          Initial capital contributions shall be as follows: ${spanField(
            'capitalContributions',
            currentState.capitalContributions,
            'As set forth on Schedule A attached hereto.',
            { multiline: true }
          )}
        </p>

        <h3>Article VI. Distributions</h3>
        <p>
          The Company will make distributions ${spanField(
            'distributionPolicy',
            currentState.distributionPolicy,
            'quarterly in proportion to membership interests after reserving adequate funds for expenses.',
            { multiline: true }
          )}
        </p>

        <h3>Article VII. Governance</h3>
        <p>
          Company decisions will be made ${spanField(
            'decisionProcess',
            currentState.decisionProcess,
            'by Members holding at least a majority of the outstanding membership interests.',
            { multiline: true }
          )}
        </p>

        <h3>Article VIII. Dissolution</h3>
        <p>
          Upon dissolution, the Company will ${spanField(
            'dissolutionPlan',
            currentState.dissolutionPlan,
            'wind up its affairs, liquidate assets, satisfy liabilities, and distribute remaining proceeds to the Members in proportion to their interests.',
            { multiline: true }
          )}
        </p>

        <h3>Article IX. Execution</h3>
        <p>
          This Agreement is executed in ${spanField(
            'signingLocation',
            currentState.signingLocation,
            '[City, State]'
          )} as of ${spanField(
            'effectiveDate',
            effectiveDateText,
            '[Effective Date]'
          )}.
        </p>
        <p>${signatureBlock}</p>
      </article>
    `;
  }

  function renderPreview() {
    previewContent.innerHTML = createPreviewMarkup(state);
  }

  function highlightField(fieldKey) {
    if (!fieldKey) {
      return;
    }
    const targets = previewContent.querySelectorAll(`[data-field="${fieldKey}"]`);
    if (!targets.length) {
      return;
    }
    targets.forEach((node, index) => {
      node.classList.add('highlight');
      if (index === 0) {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (highlightTimers.has(node)) {
        clearTimeout(highlightTimers.get(node));
      }
      const timer = window.setTimeout(() => {
        node.classList.remove('highlight');
      }, highlightDuration);
      highlightTimers.set(node, timer);
    });
  }

  function handleGeneralField(input) {
    const key = input.dataset.fieldKey;
    const updateState = () => {
      let value;
      if (input.type === 'radio') {
        if (!input.checked) {
          return;
        }
        value = input.value;
      } else {
        value = input.value;
      }

      state[key] = value;
      if (key === 'managementStructure') {
        managerNameField.hidden = value !== 'manager';
        if (value !== 'manager') {
          state.managerName = '';
          const managerInput = document.getElementById('managerName');
          if (managerInput) {
            managerInput.value = '';
          }
        } else {
          const managerInput = document.getElementById('managerName');
          if (managerInput && typeof managerInput.focus === 'function') {
            managerInput.focus();
          }
          window.requestAnimationFrame(() => highlightField('managerName'));
        }
      }
      renderPreview();
      window.requestAnimationFrame(() => highlightField(key));
    };

    if (input.type === 'radio') {
      input.addEventListener('change', updateState);
    } else {
      input.addEventListener('input', updateState);
    }

    input.addEventListener('focus', () => {
      window.requestAnimationFrame(() => highlightField(key));
    });
  }

  function addMember(initial = {}, options = {}) {
    const member = {
      id: `m-${++memberCounter}`,
      name: '',
      contribution: '',
      percentage: '',
      role: '',
      ...initial
    };
    state.members.push(member);
    renderMemberCards(options.suppressHighlight === true);
    renderPreview();
    if (!options.suppressHighlight) {
      window.requestAnimationFrame(() => highlightField(`member:${member.id}:name`));
    }
  }

  function removeMember(memberId) {
    if (state.members.length <= 1) {
      return;
    }
    state.members = state.members.filter((member) => member.id !== memberId);
    renderMemberCards(true);
    renderPreview();
  }

  function renderMemberCards(suppressHighlight) {
    membersContainer.innerHTML = '';
    state.members.forEach((member, index) => {
      const fragment = memberTemplate.content.cloneNode(true);
      const card = fragment.querySelector('[data-member-card]');
      card.dataset.memberId = member.id;
      const headerIndex = card.querySelector('[data-member-index]');
      headerIndex.textContent = index + 1;

      const inputs = card.querySelectorAll('[data-member-input]');
      inputs.forEach((input) => {
        const field = input.dataset.memberInput;
        input.value = member[field] || '';
        input.name = `member-${member.id}-${field}`;
        input.dataset.fieldKey = `member:${member.id}:${field}`;

        const updateMember = () => {
          member[field] = input.value;
          renderPreview();
          window.requestAnimationFrame(() => highlightField(input.dataset.fieldKey));
        };

        input.addEventListener('input', updateMember);
        input.addEventListener('focus', () => {
          window.requestAnimationFrame(() => highlightField(input.dataset.fieldKey));
        });
      });

      const removeBtn = card.querySelector('[data-remove-member]');
      removeBtn.disabled = state.members.length <= 1;
      removeBtn.addEventListener('click', () => removeMember(member.id));

      membersContainer.appendChild(fragment);
    });

    if (suppressHighlight) {
      const firstField = form.querySelector('input, textarea');
      if (firstField && typeof firstField.focus === 'function') {
        firstField.focus();
      }
    }
  }

  function populateFormFromState() {
    const inputs = form.querySelectorAll('[data-field-key]');
    inputs.forEach((input) => {
      const key = input.dataset.fieldKey;
      if (input.type === 'radio') {
        input.checked = state[key] === input.value;
      } else if (input.type === 'date') {
        input.value = state[key] || '';
      } else {
        input.value = state[key] || '';
      }
    });

    managerNameField.hidden = state.managementStructure !== 'manager';
  }

  function resetForm() {
    state = createEmptyState();
    renderPreview();
    populateFormFromState();
    membersContainer.innerHTML = '';
    memberCounter = 0;
    addMember({}, { suppressHighlight: true });
  }

  function initialize() {
    const generalInputs = form.querySelectorAll('[data-field-key]');
    generalInputs.forEach(handleGeneralField);

    addMember({
      name: '',
      contribution: '',
      percentage: '',
      role: ''
    });

    addMemberBtn.addEventListener('click', () => addMember());
    resetBtn.addEventListener('click', resetForm);

    renderPreview();
  }

  initialize();
})();
