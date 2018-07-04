export function mins(time) {
  const timeParts = time.split(":");
  if (timeParts.length < 2) return 0;

  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);

  return hours * 60 + minutes;
}

// noinspection JSUnusedGlobalSymbols
export function percent(v, max) {
  return (v / max) * 100;
}
