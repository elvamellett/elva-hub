import type { AgentStatus } from "@/lib/types";
import { statusMeta } from "@/lib/agents-meta";

// A flat, modern "little person at a desk", tinted by department colour.
// `status` drives the subtle motion: working = gentle bob + typing dots,
// thinking = pulsing thought dot, gate = steady, idle = dimmed.
export function AgentAvatar({
  color,
  status,
  size = 88,
}: {
  color: string;
  status: AgentStatus;
  size?: number;
}) {
  const skin = "#F4D2B8";
  const desk = "#D8E2EC";
  const idle = status === "idle";
  const working = status === "active";
  const thinking = status === "thinking";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-hidden
      className={working ? "agent-bob" : undefined}
      style={{ opacity: idle ? 0.55 : 1 }}
    >
      {/* desk */}
      <rect x="14" y="70" width="72" height="9" rx="3" fill={desk} />
      <rect x="20" y="79" width="6" height="12" rx="2" fill={desk} />
      <rect x="74" y="79" width="6" height="12" rx="2" fill={desk} />

      {/* laptop */}
      <rect x="34" y="60" width="32" height="11" rx="2" fill={color} opacity="0.9" />
      <rect x="37" y="62.5" width="26" height="6" rx="1" fill="#fff" opacity="0.85" />
      <rect x="30" y="70" width="40" height="3.5" rx="1.75" fill={color} />

      {/* chair back */}
      <rect x="38" y="40" width="24" height="26" rx="11" fill={color} opacity="0.18" />

      {/* body */}
      <path d="M32 70c0-12 8-19 18-19s18 7 18 19" fill={color} />
      {/* head */}
      <circle cx="50" cy="38" r="12" fill={skin} />
      {/* hair */}
      <path d="M38 36c0-8 6-13 12-13s12 5 12 13c-4-5-8-6-12-6s-8 1-12 6z" fill={color} />

      {/* typing dots when working */}
      {working && (
        <g fill={color}>
          <circle className="agent-dot agent-dot-1" cx="44" cy="65.5" r="1.4" />
          <circle className="agent-dot agent-dot-2" cx="50" cy="65.5" r="1.4" />
          <circle className="agent-dot agent-dot-3" cx="56" cy="65.5" r="1.4" />
        </g>
      )}

      {/* thought bubble when thinking */}
      {thinking && (
        <g>
          <circle cx="69" cy="26" r="6.5" fill="#fff" stroke={color} strokeWidth="1.5" />
          <circle className="agent-think" cx="69" cy="26" r="2.4" fill={color} />
          <circle cx="62" cy="33" r="2" fill="#fff" stroke={color} strokeWidth="1" />
        </g>
      )}

      {/* status dot */}
      <circle cx="78" cy="44" r="6.5" fill="#fff" />
      <circle
        className={status === "gate" || status === "active" ? "agent-pulse" : undefined}
        cx="78"
        cy="44"
        r="4.5"
        fill={statusMeta[status].color}
        style={{ ["--pulse-color" as string]: statusMeta[status].color }}
      />
    </svg>
  );
}
