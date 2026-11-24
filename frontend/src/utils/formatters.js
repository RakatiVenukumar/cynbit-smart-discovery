export function formatDate(isoString) {
  if (!isoString) return '—'
  try {
    return new Date(isoString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return isoString
  }
}

export function formatStatus(status) {
  const map = {
    new: 'New',
    contacted: 'Contacted',
    in_progress: 'In Progress',
    converted: 'Converted',
    closed: 'Closed',
  }
  return map[status] || status
}

export function formatPriority(priority) {
  if (!priority) return 'Low'
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}
