// lib/utils/networkHash.ts
/**
 * Utility to compute a deterministic network hash for rate‑limit caps.
 * The hash is based on the client IP address and a rotating salt stored in
 * settings (settings.networkHashSalt).  The salt is rotated daily by the
 * scheduled job (see BP‑13) – we simply fetch the current value each call.
 */
import crypto from "crypto";
import type { NextApiRequest } from "next";
import { getSetting } from "../settings";

/**
 * Extracts the client IP from the request.  Supports the typical
 * `x-forwarded-for` header used by Vercel/Edge functions and falls back to
 * the direct socket address.
 */
function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"] as string | undefined;
  if (forwarded) {
    // x-forwarded-for may contain a list of IPs – the left‑most is the client.
    return forwarded.split(",")[0].trim();
  }
  // Vercel provides `req.socket.remoteAddress`.
  const remote = (req.socket?.remoteAddress as string) ?? "unknown";
  return remote;
}

/**
 * Returns a SHA‑256 hash of `${ip}|${salt}`.  The result is a 64‑character
 * hexadecimal string.  The salt changes once per day (or whenever the admin
 * rotates it) which prevents long‑term fingerprinting.
 */
export function getNetworkHash(req: NextApiRequest): string {
  const ip = getClientIp(req);
  const salt = getSetting("networkHashSalt") ?? "default-salt";
  const hash = crypto.createHash("sha256");
  hash.update(`${ip}|${salt}`);
  return hash.digest("hex");
}

export default getNetworkHash;
