let nextRouterPush: ((path: string) => void) | null = null;

export function registerNextNavigator(pushFn: (path: string) => void) {
  nextRouterPush = pushFn;
}

export function navigateTo(path: string) {
  if (typeof window === 'undefined') return;
  if (window.location.pathname === path) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (nextRouterPush) {
    nextRouterPush(path);
    window.scrollTo({ top: 0, behavior: 'auto' });
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
