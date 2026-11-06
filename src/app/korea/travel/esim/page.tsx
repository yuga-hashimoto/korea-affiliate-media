import { permanentRedirect } from "next/navigation";

/** 旧・通信比較ページは記事へ統合（308）。 */
export default function LegacyEsimPage() {
  permanentRedirect("/articles/korea-esim-wifi-guide");
}
