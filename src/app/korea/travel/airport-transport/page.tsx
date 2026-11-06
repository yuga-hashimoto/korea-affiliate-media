import { permanentRedirect } from "next/navigation";

/** 旧・空港交通比較ページは記事へ統合（308）。 */
export default function LegacyAirportTransportPage() {
  permanentRedirect("/articles/incheon-airport-to-seoul");
}
