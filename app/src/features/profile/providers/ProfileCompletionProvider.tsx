import { createContext, type PropsWithChildren, useContext, useMemo, useState } from "react";

import {
  getProfileProgress,
  type ProfileCompletion,
  type ProfileProgress,
} from "../lib/profileProgress";

// Hardcoded empty until the profile/account service exists. Owned here so completion can later be
// fed from that service in one place and shared across every main-app screen.
const INITIAL_COMPLETION: ProfileCompletion = { hasPhoto: true, hasPrompt: false };

type ProfileCompletionValue = {
  progress: ProfileProgress;
  isBannerVisible: boolean;
  dismissBanner: () => void;
};

const ProfileCompletionContext = createContext<ProfileCompletionValue | null>(null);

/**
 * Owns profile-completion state for the signed-in app.
 */
export function ProfileCompletionProvider({ children }: PropsWithChildren) {
  const [completion] = useState<ProfileCompletion>(INITIAL_COMPLETION);
  const [dismissed, setDismissed] = useState(false);

  const value = useMemo<ProfileCompletionValue>(() => {
    const progress = getProfileProgress(completion);
    return {
      progress,
      isBannerVisible: !progress.isComplete && !dismissed,
      dismissBanner: () => setDismissed(true),
    };
  }, [completion, dismissed]);

  return (
    <ProfileCompletionContext.Provider value={value}>{children}</ProfileCompletionContext.Provider>
  );
}

export function useProfileCompletion(): ProfileCompletionValue {
  const value = useContext(ProfileCompletionContext);
  if (!value) {
    throw new Error("useProfileCompletion must be used within a ProfileCompletionProvider");
  }
  return value;
}
