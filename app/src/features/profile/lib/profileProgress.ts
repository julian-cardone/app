export type ProfileCompletion = {
  hasPhoto: boolean;
  hasPrompt: boolean;
};

export type ProfileStep = {
  key: keyof ProfileCompletion;
  /** Warm, encouraging nudge shown while this is the next thing left to do. */
  nudge: string;
  done: boolean;
};

// in-order of how we want to encourage members to complete them
const STEP_NUDGES: { key: keyof ProfileCompletion; nudge: string }[] = [
  { key: "hasPhoto", nudge: "Add a photo to start joining plans." },
  { key: "hasPrompt", nudge: "Answer a prompt so hosts get to know you." },
];

export type ProfileProgress = {
  steps: ProfileStep[];
  completed: number;
  total: number;
  /** 0–1 fraction for the progress bar fill. */
  ratio: number;
  isComplete: boolean;
  /** The next unfinished step, or null once the profile is complete. */
  nextStep: ProfileStep | null;
};

export function getProfileProgress(completion: ProfileCompletion): ProfileProgress {
  const steps: ProfileStep[] = STEP_NUDGES.map(({ key, nudge }) => ({
    key,
    nudge,
    done: completion[key],
  }));
  const completed = steps.filter((step) => step.done).length;
  const total = steps.length;

  return {
    steps,
    completed,
    total,
    ratio: total === 0 ? 1 : completed / total,
    isComplete: completed === total,
    nextStep: steps.find((step) => !step.done) ?? null,
  };
}
