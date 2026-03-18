/**
 * Skill profiles — tiers of skill sets
 *
 * - `include` = only install these skills
 * - Both empty = install everything (full)
 */

export const profiles: Record<string, { include?: string[] }> = {
  minimal: {
    include: ['hello', 'quote'],
  },
  standard: {
    include: ['hello', 'quote', 'countdown'],
  },
  full: {},
};

/**
 * Resolve a profile to a filtered list of skill names.
 * Returns null if no filtering (full profile).
 */
export function resolveProfile(
  profileName: string,
  allSkillNames: string[]
): string[] | null {
  const profile = profiles[profileName];
  if (!profile) return null;

  if (profile.include && profile.include.length > 0) {
    return profile.include;
  }

  return null;
}
