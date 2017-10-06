export function mins(time) {
  let timeParts = time.split(":");
  if(timeParts.length < 2)
    return 0;

  let hours = parseInt(timeParts[0]);
  let minutes = parseInt(timeParts[1]);

  return (hours * 60) + minutes;
}

export function percent(v, max) {
  return (v / max) * 100;
}