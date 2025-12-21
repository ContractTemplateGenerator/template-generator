(() => {
  const hub = document.getElementById('incorp-hub');
  if (!hub) return;

  const stateSelect = hub.querySelector('#incorp-state');
  const entitySelect = hub.querySelector('#incorp-entity');
  const compareSection = hub.querySelector('#incorp-compare');
  const compareTrigger = hub.querySelector('#incorp-compare-trigger');
  const compareA = hub.querySelector('#compare-a');
  const compareB = hub.querySelector('#compare-b');
  const compareGo = hub.querySelector('#compare-go');
  const compareResults = hub.querySelector('#compare-results');

  const defaultState = {
    abbr: 'WY',
    state: 'Wyoming',
    hubSlug: 'wyoming',
    supports: { llc: true, pllc: true, series_llc: false, pbc: true, corp: true },
    filingOffice: 'Wyoming Secretary of State',
    filingPortalUrl: 'https://wyoming.gov/business',
    nameRulesUrl: 'https://wyoming.gov/business/name-availability',
    reportCadence: 'annual',
    initialReport: 'Initial annual report at anniversary month',
    publication: false,
    expediteOptions: [],
    privacyNotes: 'I keep owners off the public record and list my office as organizer.',
    taxTouchpoints: 'State tax setup may apply.',
    foreignQualTriggers: ['In-state employees', 'Physical office/warehouse', 'Regular on-the-ground services'],
    pitfalls: [
      'Counties collect the annual report fee; I prep it in advance.',
      'Registered agent must stay available during business hours.'
    ],
    entityPages: {
      llc: '/wyoming/llc/',
      pllc: '/wyoming/pllc/',
      corp: '/wyoming/corporation/',
      pbc: '/wyoming/benefit-corporation/',
      series_llc: '/wyoming/series-llc/',
      foreign_llc: '/wyoming/foreign-llc/'
    }
  };

  const stateData = { WY: defaultState };
  let dataReady = false;

  const entityLabels = {
    llc: 'LLC',
    pllc: 'PLLC',
    corp: 'Corporation',
    pbc: 'Benefit Corporation',
    series_llc: 'Series LLC',
    foreign_llc: 'Foreign Qualification'
  };

  function trackEvent(name, detail) {
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...detail });
    } else {
      console.debug('incorp event', name, detail);
    }
  }

  function humanizeSupports(supports) {
    const enabled = Object.entries(supports)
      .filter(([, val]) => val)
      .map(([key]) => entityLabels[key] || key.toUpperCase());
    return enabled.join(', ');
  }

  function updateSchema(currentState, entityKey) {
    const schemaEl = document.getElementById('incorp-schema');
    if (!schemaEl) return;
    const graph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'HowTo',
          name: `Form an ${entityLabels[entityKey] || 'entity'} in ${currentState.state} in 7 steps`,
          description: `I file ${currentState.state} ${entityLabels[entityKey] || 'entity'} formations and walk founders through first-year compliance.`,
          step: [
            'I screen the name and reserve if required.',
            `I appoint a registered agent that meets ${currentState.state} rules.`,
            'I file the Articles online and confirm acceptance.',
            'I obtain the EIN and draft the governing documents.',
            'I file the initial report if required.',
            'I set up state tax accounts if applicable.',
            'I calendar the annual or biennial report cadence.'
          ],
          areaServed: ['US', 'Global']
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'Do I need to qualify as a foreign entity?', acceptedAnswer: { '@type': 'Answer', text: 'If you have employees, an office, or ongoing services in a state, you likely must foreign-qualify; I handle those filings.' } },
            { '@type': 'Question', name: 'Can I keep my name private?', acceptedAnswer: { '@type': 'Answer', text: 'It depends on state disclosure and how I use the organizer/manager fields.' } },
            { '@type': 'Question', name: 'What about S-Corp?', acceptedAnswer: { '@type': 'Answer', text: 'S-Corp is a tax election on a corporation or LLC; I time the election with your CPA.' } },
            { '@type': 'Question', name: 'Do I need a lawyer for an LLC?', acceptedAnswer: { '@type': 'Answer', text: 'I draft and tailor the Operating Agreement so the deal between founders is clear before money moves.' } },
            { '@type': 'Question', name: 'How fast can you file?', acceptedAnswer: { '@type': 'Answer', text: 'I use expedite options when a state offers them; timelines depend on the portal queue.' } },
            { '@type': 'Question', name: 'Can you act as registered agent?', acceptedAnswer: { '@type': 'Answer', text: 'I coordinate with reputable agents so you stay compliant without junk mail.' } }
          ]
        },
        {
          '@type': 'Product',
          name: 'Starter entity formation package',
          description: `I file the ${entityLabels[entityKey] || 'entity'}, coordinate the registered agent, and deliver formation documents.`,
          offers: { '@type': 'Offer', price: '480-720', priceCurrency: 'USD' },
          areaServed: ['US', 'Global']
        },
        {
          '@type': 'Product',
          name: 'Standard formation + compliance package',
          description: 'I draft custom OA/Bylaws, file the initial report, and prep banking paperwork.',
          offers: { '@type': 'Offer', price: '960-1440', priceCurrency: 'USD' },
          areaServed: ['US', 'Global']
        },
        {
          '@type': 'LegalService',
          name: 'Incorporation hub',
          serviceType: 'Entity formation and compliance',
          areaServed: ['US', 'Global'],
          provider: { '@type': 'Person', name: 'Your attorney' }
        }
      ]
    };
    schemaEl.textContent = JSON.stringify(graph);
  }

  function setText(selector, value) {
    const el = hub.querySelector(selector);
    if (el) el.textContent = value;
  }

  function setLink(selector, href, label) {
    const el = hub.querySelector(selector);
    if (!el) return;
    el.setAttribute('href', href);
    if (label) el.textContent = label;
  }

  function renderPitfalls(list) {
    const ul = hub.querySelector('#pitfall-list');
    if (!ul) return;
    ul.innerHTML = '';
    list.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });
  }

  function renderAvailability(stateObj) {
    const availability = hub.querySelector('#availability-text');
    if (!availability) return;
    const supportedEntities = humanizeSupports(stateObj.supports);
    const unsupported = Object.entries(stateObj.supports)
      .filter(([, val]) => !val)
      .map(([key]) => entityLabels[key] || key)
      .join(', ');
    const noteline = unsupported ? ` ${unsupported} are not available here.` : '';
    availability.textContent = `I file ${stateObj.state} ${supportedEntities}. ${stateObj.privacyNotes}${noteline}`;

    const nav = hub.querySelector('#entity-links');
    if (!nav) return;
    nav.innerHTML = '';
    Object.entries(stateObj.entityPages).forEach(([entity, url]) => {
      const supported = stateObj.supports[entity] !== false;
      if (!url) return;
      const link = document.createElement('a');
      link.href = url;
      link.textContent = `${stateObj.state} ${entityLabels[entity] || entity} guide`;
      if (!supported) {
        link.classList.add('disabled');
        link.setAttribute('aria-disabled', 'true');
      }
      nav.appendChild(link);
    });
  }

  function renderSupportsList(stateObj) {
    const span = hub.querySelector('[data-bind="supportsList"]');
    if (span) span.textContent = humanizeSupports(stateObj.supports);
  }

  function renderGlance(stateObj) {
    setText('[data-bind="filingOffice"]', stateObj.filingOffice);
    const portalHref = stateObj.filingPortalUrl || '#';
    setLink('[data-bind="filingPortalUrl"]', portalHref, 'File online');
    setText('[data-bind="initialReport"]', stateObj.initialReport || 'None');
    setText('[data-bind="reportCadence"]', stateObj.reportCadence || 'annual');
    setText('[data-bind="taxTouchpoints"]', stateObj.taxTouchpoints || '');
    setText('[data-bind="state"]', stateObj.state);
    setText('[data-bind="publication"]', stateObj.publication ? 'Yes' : 'No');
    renderSupportsList(stateObj);
    const nameRules = stateObj.nameRulesUrl || '#';
    setLink('[data-bind="nameRulesUrl"]', nameRules, 'state rules');
  }

  function renderCTAs(stateObj, entityKey) {
    const ctaStart = hub.querySelector('#cta-start');
    const ctaBook = hub.querySelector('#cta-book');
    const entityLabel = entityLabels[entityKey] || 'entity';
    setText('[data-bind="entityLabel"]', entityLabel);
    setText('[data-bind="state"]', stateObj.state);

    const targetUrl = stateObj.entityPages?.[entityKey];
    const baseHref = targetUrl ? `${targetUrl}?utm_source=hub&utm_medium=cta&utm_campaign=incorp` : '#';
    if (ctaStart) {
      ctaStart.href = baseHref;
      ctaStart.classList.remove('disabled');
      ctaStart.setAttribute('aria-disabled', 'false');
      if (stateObj.supports[entityKey] === false || !targetUrl) {
        ctaStart.classList.add('disabled');
        ctaStart.setAttribute('aria-disabled', 'true');
      }
      ctaStart.onclick = () => trackEvent('incorp_cta_start', { state: stateObj.abbr, entity: entityKey });
    }
    if (ctaBook) {
      ctaBook.onclick = () => trackEvent('incorp_cta_book', { state: stateObj.abbr, entity: entityKey });
    }
  }

  function renderState(abbr, entityKey) {
    const stateObj = stateData[abbr.toUpperCase()] || defaultState;
    renderGlance(stateObj);
    renderPitfalls(stateObj.pitfalls || []);
    renderAvailability(stateObj);
    renderCTAs(stateObj, entityKey);
    updateSchema(stateObj, entityKey);
    trackEvent('incorp_filter_change', { state: stateObj.abbr, entity: entityKey });
  }

  function populateSelects() {
    const createOption = (state) => {
      const opt = document.createElement('option');
      opt.value = state.abbr.toLowerCase();
      opt.textContent = state.state;
      return opt;
    };

    if (dataReady) {
      stateSelect.innerHTML = '';
      Object.values(stateData).forEach((state) => {
        const opt = createOption(state);
        if (state.abbr === 'WY') opt.selected = true;
        stateSelect.appendChild(opt);
      });
    }

    [compareA, compareB].forEach(select => {
      if (!select) return;
      select.innerHTML = '';
      Object.values(stateData).forEach((state) => {
        const opt = createOption(state);
        select.appendChild(opt);
      });
    });
  }

  function handleHistory(abbr, entity) {
    const params = new URLSearchParams(window.location.search);
    params.set('state', abbr.toLowerCase());
    params.set('entity', entity);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ state: abbr, entity }, '', newUrl);
  }

  function onFilterChange() {
    const selectedState = stateSelect.value || 'wy';
    const selectedEntity = entitySelect.value || 'llc';
    renderState(selectedState, selectedEntity);
    handleHistory(selectedState, selectedEntity);
  }

  function renderCompare() {
    const stateA = stateData[compareA.value.toUpperCase()];
    const stateB = stateData[compareB.value.toUpperCase()];
    if (!stateA || !stateB) return;
    compareResults.innerHTML = '';
    [stateA, stateB].forEach((state) => {
      const card = document.createElement('div');
      card.className = 'compare-card';
      card.innerHTML = `
        <strong>${state.state}</strong>
        <div><small>Office:</small> ${state.filingOffice}</div>
        <div><small>Portal:</small> <a href="${state.filingPortalUrl}" target="_blank" rel="noopener">Online filing</a></div>
        <div><small>Cadence:</small> ${state.reportCadence}</div>
        <div><small>Initial:</small> ${state.initialReport}</div>
        <div><small>Publication:</small> ${state.publication ? 'Yes' : 'No'}</div>
        <div><small>Series/PLLC/PBC:</small> ${state.supports.series_llc ? 'Series LLC' : 'No series'}, ${state.supports.pllc ? 'PLLC ok' : 'No PLLC'}, ${state.supports.pbc ? 'PBC ok' : 'No PBC'}</div>
        <div><small>Pitfalls:</small><ul>${state.pitfalls.slice(0,3).map(p => `<li>${p}</li>`).join('')}</ul></div>
      `;
      compareResults.appendChild(card);
    });
    compareSection.hidden = false;
    compareSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    trackEvent('incorp_compare', { stateA: stateA.abbr, stateB: stateB.abbr });
  }

  function restoreFromHistory() {
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get('state');
    const entityParam = params.get('entity');
    if (stateParam) stateSelect.value = stateParam.toLowerCase();
    if (entityParam) entitySelect.value = entityParam;
  }

  function initEvents() {
    stateSelect.addEventListener('change', onFilterChange);
    entitySelect.addEventListener('change', onFilterChange);
    compareTrigger.addEventListener('click', () => {
      compareSection.hidden = !compareSection.hidden;
      if (!compareSection.hidden) {
        compareSection.setAttribute('aria-live', 'polite');
        trackEvent('incorp_compare_open', {});
      }
    });
    compareGo.addEventListener('click', renderCompare);
    window.addEventListener('popstate', (evt) => {
      const state = evt.state || {};
      if (state.state) {
        stateSelect.value = state.state.toLowerCase();
      }
      if (state.entity) {
        entitySelect.value = state.entity;
      }
      renderState(stateSelect.value || 'wy', entitySelect.value || 'llc');
    });
  }

  async function loadData() {
    try {
      const res = await fetch('/assets/incorp-states.json', { cache: 'force-cache' });
      if (!res.ok) throw new Error('fetch failed');
      const json = await res.json();
      json.forEach((item) => {
        stateData[item.abbr.toUpperCase()] = item;
      });
      dataReady = true;
    } catch (err) {
      console.warn('Using fallback incorporation data', err);
    }
  }

  (async function boot() {
    initEvents();
    await loadData();
    populateSelects();
    restoreFromHistory();
    renderState(stateSelect.value || 'wy', entitySelect.value || 'llc');
  })();
})();
