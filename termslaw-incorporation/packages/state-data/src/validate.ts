import { STATE_CODES, STATE_DATA } from './index';

const REQUIRED_CODES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

const missing = REQUIRED_CODES.filter(code => !STATE_DATA[code]);
if (missing.length) {
  console.error('Missing state records:', missing.join(', '));
  process.exit(1);
}

if (STATE_CODES.length !== REQUIRED_CODES.length) {
  console.error(`Expected ${REQUIRED_CODES.length} states but found ${STATE_CODES.length}.`);
  process.exit(1);
}

console.log('State data validated for all 50 states.');
