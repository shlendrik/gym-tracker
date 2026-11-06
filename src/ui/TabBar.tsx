import { NavLink } from "react-router-dom";

const svgProps = {
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const icons = {
  workout: (
    <svg {...svgProps}>
      <path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" />
    </svg>
  ),
  plans: (
    <svg {...svgProps}>
      <rect x="5" y="4" width="14" height="17" rx="2.5" />
      <path d="M9 9h6M9 13h6M9 17h3" />
    </svg>
  ),
  history: (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  ),
};

const tabs = [
  { to: "/", label: "Тренировка", icon: icons.workout, end: true },
  { to: "/templates", label: "Планы", icon: icons.plans, end: false },
  { to: "/history", label: "История", icon: icons.history, end: false },
];

export default function TabBar() {
  return (
    <nav className="tabbar" aria-label="Навигация">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) => "tab" + (isActive ? " active" : "")}
        >
          {t.icon}
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
