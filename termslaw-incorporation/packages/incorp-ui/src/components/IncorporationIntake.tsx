import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { DEFAULT_STATE, STATE_DATA } from '@termslaw/state-data';

const RA_PRICE = 149;

const PACKAGE_OPTIONS = [
  {
    id: 'basic',
    name: 'Basic Incorporation Service',
    price: 399,
    description: ['State filing', 'Attorney review', 'Basic guidance'],
    flags: { bylaws: false, ein: false, resolutions: false, corpKit: false, consult: false }
  },
  {
    id: 'pro',
    name: 'Professional Package',
    price: 599,
    description: ['Operating Agreement/Bylaws', 'EIN assistance'],
    flags: { bylaws: true, ein: true, resolutions: false, corpKit: false, consult: false }
  },
  {
    id: 'complete',
    name: 'Complete Business Setup',
    price: 899,
    description: ['Everything in Professional', 'Initial resolutions', 'Corporate kit', '30-min consultation'],
    flags: { bylaws: true, ein: true, resolutions: true, corpKit: true, consult: true }
  }
] as const;

const SPEED_OPTIONS = [
  { id: 'standard', name: 'Standard', price: 0 },
  { id: 'expedited', name: 'Expedited', price: 100 },
  { id: 'rush', name: 'Rush', price: 250 }
] as const;

type EntityType = 'LLC' | 'C-Corp' | 'S-Corp';

type PackageId = (typeof PACKAGE_OPTIONS)[number]['id'];
type SpeedId = (typeof SPEED_OPTIONS)[number]['id'];

const STATE_LABELS: Record<string, string> = {
  DE: 'Delaware (recommended)',
  WY: 'Wyoming',
  CA: 'California',
  NY: 'New York',
  TX: 'Texas',
  FL: 'Florida',
  NV: 'Nevada'
};

const ALL_STATE_OPTIONS = Object.keys(STATE_DATA)
  .sort()
  .map(code => ({ code, label: STATE_LABELS[code] ?? code }));

const ENTITY_OPTIONS: EntityType[] = ['LLC', 'C-Corp', 'S-Corp'];

interface OwnerRow {
  name: string;
  percent: string;
  issued: string;
}

interface DirectorRow {
  name: string;
  address: string;
}

interface OfficerRow {
  title: string;
  name: string;
}

export interface IncorporationIntakeProps {
  variant?: 'default' | 'embed';
}

function addBusinessDays(start: Date, days: number) {
  let remaining = days;
  const current = new Date(start);
  if (remaining <= 0) {
    return current;
  }
  while (remaining > 0) {
    current.setDate(current.getDate() + 1);
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      remaining -= 1;
    }
  }
  return current;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function clampPercent(value: string) {
  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) return 0;
  return numeric;
}

function getUnitLabel(entity: EntityType) {
  return entity === 'LLC' ? 'Units' : 'Shares';
}

function getOwnerLabel(entity: EntityType) {
  return entity === 'LLC' ? 'Member' : 'Shareholder';
}

const defaultOfficers: OfficerRow[] = [
  { title: 'President / CEO', name: '' },
  { title: 'Secretary', name: '' },
  { title: 'Treasurer / CFO', name: '' }
];

export function useEmbedResize(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || typeof ResizeObserver === 'undefined') {
      return;
    }
    const target = document.body;
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      const height = Math.ceil(entry.contentRect.height) + 24;
      window.parent?.postMessage({ type: 'termslaw-embed:resize', height }, '*');
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled]);
}

export default function IncorporationIntake({ variant = 'default' }: IncorporationIntakeProps) {
  useEmbedResize(variant === 'embed');

  const [state, setState] = useState(DEFAULT_STATE);
  const [entityType, setEntityType] = useState<EntityType>('LLC');
  const [companyName, setCompanyName] = useState('');
  const [alternateNames, setAlternateNames] = useState<string[]>(['', '']);
  const [showThirdAlternate, setShowThirdAlternate] = useState(false);
  const [managementStyle, setManagementStyle] = useState<'member-managed' | 'manager-managed'>('member-managed');
  const [directors, setDirectors] = useState<DirectorRow[]>([{ name: '', address: '' }]);
  const [officers, setOfficers] = useState<OfficerRow[]>(defaultOfficers);
  const [owners, setOwners] = useState<OwnerRow[]>([{ name: '', percent: '100', issued: '100' }]);
  const [packageId, setPackageId] = useState<PackageId>('basic');
  const [speedId, setSpeedId] = useState<SpeedId>('standard');
  const [registeredAgent, setRegisteredAgent] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const stateInfo = STATE_DATA[state];
  const stateLabel = STATE_LABELS[state] ?? state;
  const unitLabel = getUnitLabel(entityType);
  const ownerLabel = getOwnerLabel(entityType);

  const packageOption = PACKAGE_OPTIONS.find(option => option.id === packageId)!;
  const speedOption = SPEED_OPTIONS.find(option => option.id === speedId)!;

  const expediteAvailable = stateInfo.expediteAvailable;
  const rushAvailable = stateInfo.rushAvailable;

  useEffect(() => {
    if (speedId === 'expedited' && !expediteAvailable) {
      setSpeedId('standard');
    }
    if (speedId === 'rush' && !rushAvailable) {
      setSpeedId(expediteAvailable ? 'expedited' : 'standard');
    }
  }, [expediteAvailable, rushAvailable, speedId]);

  const ownersTotal = useMemo(
    () => owners.reduce((acc, owner) => acc + clampPercent(owner.percent), 0),
    [owners]
  );

  const stateFee = entityType === 'LLC' ? stateInfo.filingFeeLLC : stateInfo.filingFeeCorp;

  const total = useMemo(() => {
    const items: number[] = [packageOption.price, speedOption.price];
    if (registeredAgent) items.push(RA_PRICE);
    items.push(stateFee);
    return items.reduce((sum, value) => sum + value, 0);
  }, [packageOption.price, speedOption.price, registeredAgent, stateFee]);

  const eta = useMemo(() => {
    const baseDays = stateInfo.standardDays;
    let modifier = 0;
    if (speedId === 'expedited' && expediteAvailable) {
      modifier = stateInfo.expediteDeltaDays;
    }
    if (speedId === 'rush' && rushAvailable) {
      modifier = stateInfo.rushDeltaDays;
    }
    const totalDays = Math.max(2, baseDays + modifier);
    const etaDate = addBusinessDays(new Date(), totalDays);
    return dayjs(etaDate).format('MMMM D, YYYY');
  }, [stateInfo, speedId, expediteAvailable, rushAvailable]);

  const previewContent = useMemo(() => {
    const ownersList = owners
      .map((owner, index) => `${index + 1}. ${owner.name || '[Name]'} — ${owner.percent || '—'}% (${owner.issued || '—'} ${unitLabel.toLowerCase()})`)
      .join('\n');
    const altNames = alternateNames.filter(Boolean);
    const corpDetails = entityType === 'LLC'
      ? `\nManagement: ${managementStyle === 'member-managed' ? 'Member-managed' : 'Manager-managed with designated managers.'}`
      : `\nDirectors:\n${directors
          .map((director, index) => `  ${index + 1}. ${director.name || '[Director]'} — ${director.address || '[Address]'}`)
          .join('\n')}\nOfficers: ${officers
          .map(officer => `${officer.title || 'Officer'}: ${officer.name || '[Name]'}`)
          .join('; ')}`;

    return `Preview — ${entityType === 'LLC' ? 'Operating Agreement' : 'Bylaws'} (Excerpt)\nCompany: ${companyName || '[Company Name]'}\nAlternate names: ${
      altNames.length ? altNames.join(', ') : 'None provided'
    }\nJurisdiction: ${stateLabel}\n${ownerLabel}s:\n${ownersList || '(No owners entered yet)'}${corpDetails}\n\nFull deliverables will render as secure, watermarked images.`;
  }, [
    alternateNames,
    companyName,
    directors,
    entityType,
    managementStyle,
    officers,
    ownerLabel,
    owners,
    stateLabel,
    unitLabel
  ]);

  const packageInclusions = useMemo(() => {
    const inclusions: string[] = [];
    if (packageOption.flags.bylaws) {
      inclusions.push(entityType === 'LLC' ? 'Operating Agreement' : 'Bylaws');
    }
    if (packageOption.flags.ein) inclusions.push('EIN assistance');
    if (packageOption.flags.resolutions) inclusions.push('Initial resolutions');
    if (packageOption.flags.corpKit) inclusions.push('Corporate kit');
    if (packageOption.flags.consult) inclusions.push('30-min attorney consultation');
    if (!inclusions.length) inclusions.push('Formation filing & attorney guidance');
    return inclusions;
  }, [entityType, packageOption]);

  const addOwner = () => {
    setOwners(prev => [...prev, { name: '', percent: '', issued: '' }]);
  };

  const updateOwner = (index: number, key: keyof OwnerRow, value: string) => {
    setOwners(prev => prev.map((owner, idx) => (idx === index ? { ...owner, [key]: value } : owner)));
  };

  const removeOwner = (index: number) => {
    setOwners(prev => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== index)));
  };

  const setDirectorCount = (count: number) => {
    const normalized = Math.max(1, Math.min(15, count));
    setDirectors(prev => {
      const next = [...prev];
      if (normalized > next.length) {
        while (next.length < normalized) {
          next.push({ name: '', address: '' });
        }
      } else if (normalized < next.length) {
        next.length = normalized;
      }
      return next;
    });
  };

  const summaryItems = [
    { label: 'Package', value: packageOption.name },
    { label: 'Package price', value: formatCurrency(packageOption.price) },
    {
      label: 'Processing speed',
      value: `${speedOption.name}${speedOption.price ? ` (+${formatCurrency(speedOption.price)})` : ' (included)'}`
    },
    { label: 'Registered Agent (1st year)', value: registeredAgent ? formatCurrency(RA_PRICE) : '$0' },
    { label: `State & third-party fees (${stateLabel})`, value: formatCurrency(stateFee) }
  ];

  const ownershipStatus = Math.round(ownersTotal) === 100;

  const layoutClasses = clsx('w-full', {
    'max-w-7xl mx-auto': variant === 'default',
    'max-w-5xl mx-auto': variant === 'embed'
  });

  return (
    <div className={layoutClasses}>
      <div className={clsx('rounded-2xl shadow-sm border border-slate-200 bg-white', { 'mt-10': variant === 'default', 'mt-4': variant === 'embed' })}>
        <div className="p-6 md:p-8">
          <header className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-indigo-500">Attorney-led incorporation</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Guided intake, precise estimates, and attorney-prepared documents.</h1>
            <p className="text-sm text-slate-600">
              Defaulting to Delaware LLC with registered agent coverage. Adjust below for corporations, S-corps, or alternative jurisdictions.
            </p>
          </header>
        </div>
        <div className="border-t border-slate-200" />
        <div className="grid lg:grid-cols-3 gap-0">
          <div className="lg:col-span-2 p-6 md:p-8 space-y-8">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Packages</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {PACKAGE_OPTIONS.map(option => {
                  const inputId = `package-${option.id}`;
                  const isSelected = packageId === option.id;
                  return (
                    <div key={option.id}>
                      <input
                        type="radio"
                        name="package"
                        id={inputId}
                        value={option.id}
                        checked={isSelected}
                        onChange={() => setPackageId(option.id)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={inputId}
                        aria-label={option.name}
                        className={clsx(
                          'block border rounded-xl p-4 cursor-pointer shadow-sm transition focus-visible:ring-2 focus-visible:ring-indigo-500',
                          isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
                        )}
                      >
                        <div className="space-y-2">
                          <div>
                            <h3 className="font-semibold text-slate-900">{option.name}</h3>
                            <p className="text-sm text-slate-500">{formatCurrency(option.price)}</p>
                          </div>
                          <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                            {option.description.map(item => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Formation details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">State of incorporation</span>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={state}
                    onChange={event => setState(event.target.value)}
                  >
                    {ALL_STATE_OPTIONS.map(option => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500">All 50 states supported. Delaware defaults for speed and investor familiarity.</p>
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-slate-700">Entity type</span>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={entityType}
                    onChange={event => setEntityType(event.target.value as EntityType)}
                  >
                    {ENTITY_OPTIONS.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Company name preferences</h2>
              <div className="space-y-3">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  placeholder="Primary name"
                  value={companyName}
                  onChange={event => setCompanyName(event.target.value)}
                />
                <div className="grid md:grid-cols-2 gap-3">
                  {alternateNames.map((value, index) => (
                    <input
                      key={`alt-${index}`}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      placeholder={`Alternative name #${index + 1}`}
                      value={value}
                      onChange={event => {
                        const next = [...alternateNames];
                        next[index] = event.target.value;
                        setAlternateNames(next);
                      }}
                    />
                  ))}
                  {showThirdAlternate && (
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      placeholder="Alternative name #3"
                      value={alternateNames[2] ?? ''}
                      onChange={event => {
                        const next = [...alternateNames];
                        next[2] = event.target.value;
                        setAlternateNames(next);
                      }}
                    />
                  )}
                </div>
                {!showThirdAlternate && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowThirdAlternate(true);
                      setAlternateNames(prev => [...prev, '']);
                    }}
                    className="text-sm font-semibold text-indigo-600"
                  >
                    + Add a third alternative
                  </button>
                )}
                <p className="text-xs text-slate-500">We will clear conflicts in order and confirm final naming prior to filing.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">{ownerLabel} roster</h2>
              <div className="space-y-4">
                {owners.map((owner, index) => (
                  <div key={`owner-${index}`} className="rounded-xl border border-slate-200 p-4 space-y-3">
                    <div className="grid md:grid-cols-3 gap-3">
                      <input
                        className="rounded-lg border border-slate-300 px-3 py-2"
                        placeholder={`${ownerLabel} name`}
                        value={owner.name}
                        onChange={event => updateOwner(index, 'name', event.target.value)}
                      />
                      <input
                        className="rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="% ownership"
                        value={owner.percent}
                        onChange={event => updateOwner(index, 'percent', event.target.value)}
                      />
                      <input
                        className="rounded-lg border border-slate-300 px-3 py-2"
                        placeholder={`${unitLabel} issued`}
                        value={owner.issued}
                        onChange={event => updateOwner(index, 'issued', event.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="text-xs text-slate-500 hover:text-rose-500"
                        onClick={() => removeOwner(index)}
                        disabled={owners.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addOwner} className="text-sm font-semibold text-indigo-600">
                  + Add {ownerLabel.toLowerCase()}
                </button>
                <p className={clsx('text-xs', ownershipStatus ? 'text-emerald-600' : 'text-amber-600')}>
                  Ownership total: <span className="font-semibold">{Math.round(ownersTotal)}%</span>{' '}
                  {ownershipStatus ? 'Looks good for 100% allocation.' : 'Adjust to reach 100% before finalizing documents.'}
                </p>
              </div>
            </section>

            {entityType === 'LLC' ? (
              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900">LLC management</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="management"
                      value="member-managed"
                      checked={managementStyle === 'member-managed'}
                      onChange={() => setManagementStyle('member-managed')}
                    />
                    Member-managed (default)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="management"
                      value="manager-managed"
                      checked={managementStyle === 'manager-managed'}
                      onChange={() => setManagementStyle('manager-managed')}
                    />
                    Manager-managed
                  </label>
                </div>
              </section>
            ) : (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">Directors &amp; officers</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-slate-700">Initial directors</span>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      value={directors.length}
                      onChange={event => setDirectorCount(Number(event.target.value) || 1)}
                    />
                  </label>
                </div>
                <div className="space-y-3">
                  {directors.map((director, index) => (
                    <div key={`director-${index}`} className="grid md:grid-cols-2 gap-3">
                      <input
                        className="rounded-lg border border-slate-300 px-3 py-2"
                        placeholder={`Director #${index + 1} name`}
                        value={director.name}
                        onChange={event => {
                          const next = [...directors];
                          next[index] = { ...next[index], name: event.target.value };
                          setDirectors(next);
                        }}
                      />
                      <input
                        className="rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="Address"
                        value={director.address}
                        onChange={event => {
                          const next = [...directors];
                          next[index] = { ...next[index], address: event.target.value };
                          setDirectors(next);
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-700">Officer titles & assignments</h3>
                  {officers.map((officer, index) => (
                    <div key={`officer-${index}`} className="grid md:grid-cols-2 gap-3">
                      <input
                        className="rounded-lg border border-slate-300 px-3 py-2"
                        value={officer.title}
                        onChange={event => {
                          const next = [...officers];
                          next[index] = { ...next[index], title: event.target.value };
                          setOfficers(next);
                        }}
                      />
                      <input
                        className="rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="Assignee name"
                        value={officer.name}
                        onChange={event => {
                          const next = [...officers];
                          next[index] = { ...next[index], name: event.target.value };
                          setOfficers(next);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-sm font-semibold text-indigo-600"
                    onClick={() => setOfficers(prev => [...prev, { title: 'Officer', name: '' }])}
                  >
                    + Add officer
                  </button>
                </div>
              </section>
            )}

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Processing speed</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {SPEED_OPTIONS.map(option => {
                  const unavailable =
                    (option.id === 'expedited' && !expediteAvailable) ||
                    (option.id === 'rush' && !rushAvailable);
                  const note = (() => {
                    if (option.id === 'standard') {
                      return `${stateInfo.standardDays}-business-day timeline in ${stateLabel}.`;
                    }
                    if (option.id === 'expedited') {
                      if (!expediteAvailable) {
                        return `Not available in ${stateLabel}.`;
                      }
                      const saved = Math.abs(stateInfo.expediteDeltaDays);
                      return saved
                        ? `Typically ${saved} business day${saved === 1 ? '' : 's'} faster in ${stateLabel}.`
                        : `State expedited handling in ${stateLabel}.`;
                    }
                    if (!rushAvailable) {
                      return `Not available in ${stateLabel}.`;
                    }
                    const saved = Math.abs(stateInfo.rushDeltaDays);
                    return saved
                      ? `Typically ${saved} business day${saved === 1 ? '' : 's'} faster in ${stateLabel}.`
                      : `Rush handling in ${stateLabel}.`;
                  })();
                  const inputId = `speed-${option.id}`;
                  const isSelected = speedId === option.id;
                  return (
                    <div key={option.id}>
                      <input
                        type="radio"
                        name="speed"
                        id={inputId}
                        value={option.id}
                        checked={isSelected}
                        disabled={unavailable}
                        onChange={() => setSpeedId(option.id)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={inputId}
                        aria-label={option.name}
                        className={clsx(
                          'block border rounded-xl p-4 cursor-pointer shadow-sm transition focus-visible:ring-2 focus-visible:ring-indigo-500',
                          isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white',
                          unavailable && 'opacity-60 cursor-not-allowed'
                        )}
                      >
                        <div className="space-y-1">
                          <h3 className="font-semibold text-slate-900">{option.name}</h3>
                          <p className="text-xs text-slate-500">
                            {option.price ? `+${formatCurrency(option.price)}` : 'Included'}
                          </p>
                          <p className="text-xs text-slate-500">{note}</p>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
              <div className="rounded-xl bg-indigo-50 text-indigo-900 px-4 py-3 text-sm font-medium">
                Your incorporation will be complete by <span className="font-semibold">{eta}</span>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">Add-ons</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRegisteredAgent(value => !value)}
                  className={clsx(
                    'px-4 py-2 rounded-full border text-sm font-semibold transition',
                    registeredAgent
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-300 text-slate-600 hover:border-indigo-400'
                  )}
                  aria-pressed={registeredAgent}
                >
                  Registered Agent (first year) • {formatCurrency(RA_PRICE)}
                </button>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">Preview excerpt</h2>
              <p className="text-sm text-slate-600">
                This lightweight preview references your intake. Paid previews render secured, watermarked image files.
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <pre className="whitespace-pre-wrap text-sm text-slate-800">{previewContent}</pre>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="mt-3 text-sm font-semibold text-indigo-600"
                >
                  Open modal preview
                </button>
              </div>
            </section>
          </div>
          <aside className="border-t border-slate-200 lg:border-l lg:border-t-0 p-6 md:p-8 space-y-6">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">Investment summary</h2>
              <ul className="space-y-2 text-sm text-slate-700">
                {summaryItems.map(item => (
                  <li key={item.label} className="flex justify-between gap-4">
                    <span>{item.label}</span>
                    <span className="font-semibold text-slate-900">{item.value}</span>
                  </li>
                ))}
              </ul>
              <div className="text-xs text-slate-500">
                Package includes:
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  {packageInclusions.map(inclusion => (
                    <li key={inclusion}>{inclusion}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Estimated total</span>
                <span className="text-2xl font-bold text-slate-900">{formatCurrency(total)}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                State timelines update weekly. We confirm third-party fees before filing. Registered agent auto-renews with opt-out reminders.
              </p>
              <div className="mt-4 space-y-2">
                <button className="w-full rounded-xl bg-indigo-600 text-white font-semibold py-3 hover:bg-indigo-700">
                  Submit intake to attorney
                </button>
                <button className="w-full rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 hover:border-indigo-400">
                  Schedule a consultation
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {isPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
        >
          <div className="max-w-3xl w-full rounded-2xl bg-white shadow-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">Preview — {entityType === 'LLC' ? 'Operating Agreement' : 'Bylaws'} (Excerpt)</h2>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="text-sm text-slate-500 hover:text-slate-900"
              >
                Close
              </button>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 max-h-[60vh] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-slate-800">{previewContent}</pre>
            </div>
            <p className="text-xs text-slate-500">
              Paid previews render as watermarked PNG pages to prevent copying. Final deliverables remain text-selectable.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
