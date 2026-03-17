export const defaultCapabilityStatement = {
  companyName: 'Apex Digital Solutions LLC',
  tagline: 'Delivering Modern Technology Solutions for Federal Missions',
  dunsUei: 'APEX123456789',
  cageCode: '8XYZ4',
  website: 'https://www.apexdigitalsolutions.com',
  address: '1234 Innovation Drive, Suite 400, McLean, VA 22102',
  phone: '(703) 555-0192',
  email: 'contracts@apexdigitalsolutions.com',
  pointOfContact: 'Jane Doe, CEO',

  coreCompetencies: [
    'Cloud Migration & Modernization (AWS, Azure, GCP)',
    'Cybersecurity & Zero Trust Architecture',
    'Agile Software Development & DevSecOps',
    'Data Analytics & Business Intelligence',
    'IT Service Management (ITSM)',
  ],

  differentiators: [
    'FedRAMP-ready cloud solutions deployed in 90-day sprints',
    'Certified AWS GovCloud and Azure Government partner',
    '100% of staff hold active federal security clearances',
    'Proven track record with 12 federal agencies in 5 years',
  ],

  naicsCodes: [
    { code: '541511', description: 'Custom Computer Programming Services' },
    { code: '541519', description: 'Other Computer Related Services' },
    { code: '541512', description: 'Computer Systems Design Services' },
  ],

  certifications: [
    'Small Business (SB)',
    '8(a) – SBA Certified (2023–2027)',
    'HUBZone Certified',
    'ISO 9001:2015 Certified',
    'CMMC Level 2 Assessment Underway',
  ],

  pastPerformance: [
    {
      id: 'pp-001',
      client: 'Department of Veterans Affairs',
      title: 'VBMS Cloud Migration Support',
      value: '$3.2M',
      period: '2023–2025',
      description: 'Migrated 14 legacy applications to AWS GovCloud, achieving 40% cost reduction and 99.9% uptime SLA.',
      poc: 'John Smith, (202) 555-0100',
    },
    {
      id: 'pp-002',
      client: 'Department of Homeland Security',
      title: 'SOC Managed Services',
      value: '$1.8M',
      period: '2024–2025',
      description: 'Provided 24/7 security monitoring, SIEM management, and incident response for DHS component agencies.',
      poc: 'Sarah Johnson, (202) 555-0200',
    },
    {
      id: 'pp-003',
      client: 'General Services Administration',
      title: 'DevSecOps Platform Implementation',
      value: '$750K',
      period: '2024',
      description: 'Implemented CI/CD pipelines and automated security scanning for GSA digital services, reducing deployment time by 60%.',
      poc: 'Michael Chen, (202) 555-0300',
    },
  ],

  teamHighlights: 'Our 45-person team includes 12 certified AWS architects, 8 CISSP-certified cybersecurity professionals, and 6 PMP-certified project managers. Average federal IT experience: 11 years.',

  logoUrl: '',
}
