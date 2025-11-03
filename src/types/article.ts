export type State = 
  | 'Alabama' | 'Alaska' | 'Arizona' | 'Arkansas' | 'California'
  | 'Connecticut' | 'Delaware' | 'Florida' | 'Georgia' | 'Hawaii'
  | 'Illinois' | 'Indiana' | 'Iowa' | 'Kansas' | 'Kentucky'
  | 'Louisiana' | 'Maine' | 'Maryland' | 'Massachusetts' | 'Michigan'
  | 'Minnesota' | 'Mississippi' | 'Missouri' | 'Nebraska' | 'Nevada'
  | 'New Hampshire' | 'New Jersey' | 'New Mexico' | 'New York'
  | 'North Carolina' | 'North Dakota' | 'Ohio' | 'Oklahoma' | 'Oregon'
  | 'Pennsylvania' | 'Rhode Island' | 'South Carolina' | 'South Dakota'
  | 'Tennessee' | 'Texas' | 'Utah' | 'Vermont' | 'Virginia' | 'Washington'
  | 'West Virginia' | 'Washington, D.C.';

export type Region = 
  | 'All'
  | 'National'
  | 'West'
  | 'Southwest'
  | 'Midwest'
  | 'South'
  | 'Northeast'
  | State;

export interface RegionGroup {
    name: Region;
    states: State[];
}

export interface Article {
  title: string;
  url: string;
  source: string;
  publishedDate: string;
  region: Region;
  summary?: string;
  imageUrl?: string;
}
