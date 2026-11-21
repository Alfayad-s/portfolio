const USER = "Alfayads";
const YEARS = [2022, 2023, 2024, 2025, 2026];

function countFromTooltip(text) {
  const match = text.trim().match(/^(\d+) contribution/);
  return match ? Number(match[1]) : 0;
}

function parseDays(html) {
  const days = new Map();
  const pattern =
    /data-date="(\d{4}-\d{2}-\d{2})"[\s\S]{0,500}?<tool-tip[^>]*>([\s\S]*?)<\/tool-tip>/g;

  for (const match of html.matchAll(pattern)) {
    days.set(match[1], countFromTooltip(match[2]));
  }

  return days;
}

export async function GET() {
  const responses = await Promise.all(
    YEARS.map((year) =>
      fetch(
        `https://github.com/users/${USER}/contributions?from=${year}-01-01&to=${year}-12-31`,
        {
          headers: { "User-Agent": "portfolio" },
          next: { revalidate: 60 * 60 * 6 },
        },
      ).then((response) => (response.ok ? response.text() : "")),
    ),
  );

  const days = new Map();
  for (const html of responses) {
    for (const [date, count] of parseDays(html)) {
      days.set(date, Math.max(days.get(date) ?? 0, count));
    }
  }

  const months = new Map();
  for (const [date, count] of days) {
    const key = date.slice(0, 7);
    months.set(key, (months.get(key) ?? 0) + count);
  }

  const recent = [...months.keys()]
    .sort()
    .slice(-24)
    .map((key) => months.get(key));
  const total = [...days.values()].reduce((sum, count) => sum + count, 0);
  const latestWeek = [...days.entries()]
    .filter(([date]) => {
      const then = new Date(`${date}T00:00:00Z`);
      const now = new Date();
      return now - then < 7 * 24 * 60 * 60 * 1000;
    })
    .reduce((sum, [, count]) => sum + count, 0);

  return Response.json({
    total,
    weeks: recent,
    activeThisWeek: latestWeek > 0,
  });
}
