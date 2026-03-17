const variantMap = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  gray: 'bg-gray-100 text-gray-700',
  orange: 'bg-orange-100 text-orange-800',
  purple: 'bg-purple-100 text-purple-800',
  teal: 'bg-teal-100 text-teal-800',
}

const statusColorMap = {
  New: 'blue',
  Reviewing: 'yellow',
  Pursuing: 'indigo',
  'No Bid': 'gray',
  Won: 'green',
  Lost: 'red',
  active: 'green',
  closed: 'gray',
  'Small Business': 'green',
  '8(a)': 'purple',
  SDVOSB: 'blue',
  HUBZone: 'teal',
  WOSB: 'orange',
  Unrestricted: 'gray',
  'Large Business': 'gray',
}

export default function Badge({ label, variant }) {
  const resolvedVariant = variant || statusColorMap[label] || 'gray'
  const classes = variantMap[resolvedVariant] || variantMap.gray

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  )
}
