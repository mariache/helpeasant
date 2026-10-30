export type PublicDonor = {
  id: string;
  name: string;
  message: string | null;
  emoji: string;
  tierLabel: string;
  createdAt: string;
};

export type Stats = {
  percent: number;
  donorCount: number;
  donors: PublicDonor[];
};
