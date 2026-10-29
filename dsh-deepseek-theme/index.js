/**
 * Host half of `dsh-deepseek-theme`.
 *
 * Everything this plugin does happens in the browser: it stacks a DeepSeek
 * palette layer over the active theme through the client `theme` service and
 * fills two brand-mark seats with a whale. The host half registers no service,
 * tool, or command — it exists so the Loader can resolve the package as an
 * ordinary entry, which is what makes the `dsh.client` declaration below
 * discoverable and lets the browser bundle mount.
 */

/** Loader entry name for this package. */
export const name = 'dsh-deepseek-theme';

/**
 * Mount the host half.
 *
 * Deliberately empty: the browser half is reached through `dsh.client`, not
 * through a host-provided service.
 */
export function apply() {}
