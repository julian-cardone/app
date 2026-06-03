import { useAppBootstrap } from "@/hooks/useAppBootstrap";
import { AppProviders } from "@/providers/AppProviders";

export default function App() {
  const appReady = useAppBootstrap();
  if (!appReady) return null;

  return <AppProviders />;
}
