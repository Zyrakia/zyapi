import { documentedRoute } from '@/utils/documented-route.ts';

const DEFAULT_USER_ID = 1;

/**
 * Redirects to the primary user profile (my own profile).
 */
export const get = documentedRoute((_, res) => res.redirect(`/user/${DEFAULT_USER_ID}`));
