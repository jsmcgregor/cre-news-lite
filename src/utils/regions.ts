import { Region, State, RegionGroup } from '../../types/article';

export const regionGroups: RegionGroup[] = [
    {
        name: 'West',
        states: ['California', 'Oregon', 'Washington', 'Alaska', 'Hawaii']
    },
    {
        name: 'Southwest',
        states: ['Arizona', 'New Mexico', 'Nevada', 'Utah']
    },
    {
        name: 'Midwest',
        states: ['North Dakota', 'South Dakota', 'Nebraska', 'Kansas', 'Minnesota', 'Iowa', 'Missouri', 'Illinois', 'Indiana', 'Michigan', 'Ohio']
    },
    {
        name: 'South',
        states: ['Texas', 'Oklahoma', 'Arkansas', 'Louisiana', 'Kentucky', 'Tennessee', 'Mississippi', 'Alabama', 'Georgia', 'Florida', 'South Carolina', 'North Carolina', 'West Virginia', 'Virginia']
    },
    {
        name: 'Northeast',
        states: ['Pennsylvania', 'New York', 'New Jersey', 'Connecticut', 'Rhode Island', 'Massachusetts', 'Vermont', 'New Hampshire', 'Maine', 'Delaware', 'Maryland', 'Washington, D.C.']
    }
];

const stateAbbreviations: { [key: string]: State } = {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West Virginia',
    'WI': 'Wisconsin',
    'WY': 'Wyoming'
};

const stateNames = Object.values(stateAbbreviations);
const stateAbbreviationsList = Object.keys(stateAbbreviations);

function getRegionForState(state: State): Region {
    for (const region of regionGroups) {
        if (region.states.includes(state)) {
            return region.name;
        }
    }
    return state;
}

export function detectRegion(title: string): Region {
    // Convert to uppercase for easier matching
    const upperTitle = title.toUpperCase();
    
    // Check for state names
    for (const state of stateNames) {
        if (upperTitle.includes(state.toUpperCase())) {
            return state;
        }
    }
    
    // Check for state abbreviations
    for (const abbr of stateAbbreviationsList) {
        // Use word boundaries to avoid false matches (e.g., 'IN' in 'INDUSTRY')
        const pattern = new RegExp(`\\b${abbr}\\b`);
        if (pattern.test(upperTitle)) {
            const state = stateAbbreviations[abbr];
            return getRegionForState(state);
        }
    }
    
    // Common city-state combinations
    const cityStatePatterns = [
        { pattern: /\b(NEW YORK CITY|NYC)\b/, state: 'New York' },
        { pattern: /\b(LOS ANGELES|LA)\b/, state: 'California' },
        { pattern: /\b(SAN FRANCISCO|SF)\b/, state: 'California' },
        { pattern: /\bDC\b/, state: 'National' },
        { pattern: /\b(CHICAGO)\b/, state: 'Illinois' },
        { pattern: /\b(MIAMI)\b/, state: 'Florida' },
        { pattern: /\b(BOSTON)\b/, state: 'Massachusetts' },
        { pattern: /\b(SEATTLE)\b/, state: 'Washington' },
        { pattern: /\b(AUSTIN|DALLAS|HOUSTON)\b/, state: 'Texas' }
    ];
    
    for (const { pattern, state } of cityStatePatterns) {
        if (pattern.test(upperTitle)) {
            return state as State;
        }
    }
    
    // Default to National if no specific state is found
    return 'National';
}
