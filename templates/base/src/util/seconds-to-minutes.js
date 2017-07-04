export default function(totalSeconds) {
  const totalSecondsFloat = parseFloat(totalSeconds);
  let minutes = Math.floor(totalSecondsFloat / 60);
  let seconds = Math.round(totalSecondsFloat - (minutes * 60));

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}
