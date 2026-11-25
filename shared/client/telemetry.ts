/**
 * kold/no-telemetry: the upstream daily install heartbeat is removed. The exported API stays so the
 * family packages compile; nothing is generated, stored, or sent.
 */

export type TelemetryChannel = 'market' | 'npm' | 'unknown'

export interface TelemetryItem {
  /** npm package name or asset id, e.g. "@linxin666/dsh-pet" or "skin:harbor". */
  name: string
  /** Installed version when known; omitted otherwise. */
  version?: string
  /** Install channel when determinable (market = Workshop install). */
  channel?: TelemetryChannel
}

/** localStorage key carrying the family-wide telemetry opt-out ('1' = off). */
export const TELEMETRY_OPT_OUT_KEY = 'dsh-web-ui-telemetry-opt-out'

/** Whether the user switched the family-wide opt-out on (reads storage only). */
export function isTelemetryOptedOut(): boolean {
  try {
    return localStorage.getItem(TELEMETRY_OPT_OUT_KEY) === '1'
  } catch {
    // Storage unavailable: there is no stored opt-out to honour.
    return false
  }
}

/** Turn the family-wide opt-out on or off (writing '1' / removing the key); never throws. */
export function setTelemetryOptedOut(optedOut: boolean): void {
  try {
    if (optedOut) localStorage.setItem(TELEMETRY_OPT_OUT_KEY, '1')
    else localStorage.removeItem(TELEMETRY_OPT_OUT_KEY)
  } catch {
    // Storage unavailable: the preference cannot be persisted on this machine.
  }
}

/** Whether the browser itself asks not to be tracked; a failed read means no signal. */
function doNotTrackRequested(): boolean {
  try {
    // '1' per the DNT header spec, 'yes' from older Firefox builds.
    return navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes'
  } catch {
    return false
  }
}

/** Whether a heartbeat must be suppressed right now: opt-out stored, or the browser asks not to be tracked. */
export function isTelemetrySuppressed(): boolean {
  return isTelemetryOptedOut() || doNotTrackRequested()
}

/**
 * No-op kept for callers.
 * @param _items - ignored.
 */
export function reportDailyHeartbeat(_items: readonly TelemetryItem[]): void {
  // kold/no-telemetry: the heartbeat is removed.
}
