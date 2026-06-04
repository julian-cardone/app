import { useProfileCompletion } from "../providers/ProfileCompletionProvider";

import { ProfileProgressBanner } from "./ProfileProgressBanner";

/**
 * Connected completion banner. Reads shared completion state and renders the nudge when there's
 * something left to do. Drop it in as a main-app screen's first child inside `<Screen>`; the screen
 * owns the safe area, and dismiss state is shared via the provider so it persists across screens.
 */
export function ProfileCompletionBanner() {
  const { progress, isBannerVisible, dismissBanner } = useProfileCompletion();

  if (!isBannerVisible) return null;

  return <ProfileProgressBanner progress={progress} onDismiss={dismissBanner} />;
}
