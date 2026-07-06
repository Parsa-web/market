export function emitDashboardDataChange() {
  window.dispatchEvent(new CustomEvent('dashboard-data-change'))
}

export function emitFactoryDataChange() {
  emitDashboardDataChange()
}
