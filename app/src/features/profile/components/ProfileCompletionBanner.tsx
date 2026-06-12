import { useProfileCompletion } from "../providers/ProfileCompletionProvider";

import { ProfileProgressBanner } from "./ProfileProgressBanner";

/**
 * Connected completion banner. Reads shared completion state and renders the nudge when there's
 * something left to do.
 */
export function ProfileCompletionBanner() {
  const { progress, isBannerVisible, dismissBanner } = useProfileCompletion();

  if (!isBannerVisible) return null;

  return <ProfileProgressBanner progress={progress} onDismiss={dismissBanner} />;
}
