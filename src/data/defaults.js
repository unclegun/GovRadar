import { capabilityStatementExample } from './capabilityStatementExample'

export const defaultBusinessProfile = {
  companyName: 'StrataStack Solutions LLC',
  shortDescription:
    'Small business providing cloud modernization, analytics, and program support services to civilian agencies.',
  coreKeywords: ['cloud migration', 'data analytics', 'program management'],
  preferredAgencies: ['Department of Homeland Security', 'GSA'],
  naicsCodes: ['541512', '541611', '518210'],
  contractSize: { min: 50000, max: 1500000 },
  certifications: ['Small Business', 'WOSB'],
  techStackKeywords: ['AWS', 'Azure', 'Power BI', 'Salesforce'],
  excludedKeywords: ['construction', 'janitorial'],
  website: 'https://www.stratastack.example',
  contactInfo: 'Avery Cole | bids@stratastack.example | (202) 555-0188',
}

export const defaultCapabilityStatement = capabilityStatementExample

export const defaultPipelineColumns = [
  { id: 'discovered', title: 'Discovered', items: [] },
  { id: 'reviewing', title: 'Reviewing', items: [] },
  { id: 'partnering', title: 'Partnering', items: [] },
  { id: 'proposal-ready', title: 'Proposal Ready', items: [] },
  { id: 'submitted', title: 'Submitted', items: [] },
  { id: 'archived', title: 'Archived', items: [] },
]
