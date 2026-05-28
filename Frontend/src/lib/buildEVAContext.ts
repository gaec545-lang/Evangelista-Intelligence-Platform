import { Location, matchPath } from 'react-router-dom';

/**
 * Builds the EVA context payload based on the current URL.
 * Detects if the user is viewing a specific Client or Project,
 * and sets the mode and entity ID accordingly.
 */
export function buildEVAContext(location: Location) {
  let mode: 'Global' | 'Cliente' | 'Proyecto' = 'Global';
  let entityId: string | null = null;
  let tab_data: any = {};

  const clientMatch = matchPath({ path: '/dashboard/clientes/:id' }, location.pathname);
  if (clientMatch) {
    mode = 'Cliente';
    entityId = clientMatch.params.id || null;
    tab_data = { clientId: entityId };
  } else {
    const projectMatch = matchPath({ path: '/dashboard/proyectos/:projectId' }, location.pathname);
    if (projectMatch) {
      mode = 'Proyecto';
      entityId = projectMatch.params.projectId || null;
      tab_data = { projectId: entityId };
    }
  }

  return {
    current_tab: location.pathname,
    mode,
    entityId,
    tab_data,
    timestamp: new Date().toISOString()
  };
}
