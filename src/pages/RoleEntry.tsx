/**
 * RoleEntry — /role/:slug
 *
 * Lightweight entry route the homepage hero role chips link to. It records the
 * chosen role in sessionStorage (so Luna and downstream pages can read it) and
 * forwards to the canonical role landing page. Unknown slugs fall back to /tools.
 */

import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { track } from '../utils/analytics';
import { setRole, roleBySlug } from '../utils/role';

// Map the role slug → canonical role-page path.
const ROLE_TO_PATH: Record<string, string> = {
  teacher: '/teachers',
  senco: '/senco',
  'school-leader': '/school-leaders',
  parent: '/parents',
  student: '/students',
  admin: '/admin',
};

export default function RoleEntry() {
  const { slug = '' } = useParams<{ slug: string }>();
  const role = roleBySlug(slug);
  const to = ROLE_TO_PATH[slug];

  useEffect(() => {
    if (role) {
      setRole(role.slug); // cookie + role:changed broadcast
      track({ name: 'role_selected', role: role.luna, pageType: 'role-page' });
    }
  }, [role]);

  return <Navigate to={to ?? '/tools'} replace />;
}
