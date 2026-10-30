export type Milestone = { percent: number; title: string; emoji: string };

export const MILESTONES: Milestone[] = [
  { percent: 0.001, title: "Someone actually did it", emoji: "😳" },
  { percent: 0.01, title: "Paid for a doorknob", emoji: "🚪" },
  { percent: 0.1, title: "A whole window", emoji: "🪟" },
  { percent: 1, title: "The garage is basically mine", emoji: "🚗" },
  { percent: 10, title: "One room, debt-free", emoji: "🛏️" },
  { percent: 100, title: "I'm free", emoji: "🎉" },
];

export function unlocked(percent: number) {
  return MILESTONES.filter((m) => percent >= m.percent);
}

export function nextMilestone(percent: number) {
  return MILESTONES.find((m) => percent < m.percent) ?? null;
}
