export function timeLevel(minutes: number | null): string | null {
  if (minutes == null) return null;
  if (minutes <= 15) return "Low";
  if (minutes <= 30) return "Medium";
  return "High";
}

export function costLevel(inr: number | null): string | null {
  if (inr == null) return null;
  if (inr <= 70) return "Low";
  if (inr <= 130) return "Medium";
  return "High";
}

export function calorieLevel(cal: number | null): string | null {
  if (cal == null) return null;
  if (cal <= 150) return "Low";
  if (cal <= 350) return "Medium";
  return "High";
}
