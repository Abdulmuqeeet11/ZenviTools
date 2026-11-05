export function navigateTo(path: string) {
  if (window.location.pathname === path) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'auto' });
}

export function handleLinkClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  path: string
) {
  if (
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey ||
    e.button !== 0
  ) {
    return;
  }
  e.preventDefault();
  navigateTo(path);
}
