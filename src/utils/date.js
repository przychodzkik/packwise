export const TODAY = new Date().toISOString().split("T")[0];

export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso + "T12:00:00").toLocaleDateString("pl-PL", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export function shortDay(iso) {
  return new Date(iso + "T12:00:00").toLocaleDateString("pl-PL", {
    weekday: "short", day: "numeric",
  });
}

export function nightsCount(from, to) {
  if (!from || !to) return 0;
  return Math.max(0, Math.round((new Date(to) - new Date(from)) / 86_400_000));
}

export function pluralNights(n) {
  if (n === 1) return "noc";
  if (n >= 2 && n <= 4) return "noce";
  return "nocy";
}
