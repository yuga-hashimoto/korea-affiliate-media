import { permanentRedirect } from "next/navigation";

/** 比較手法ページは編集方針へ統合（308）。 */
export default function MethodologyRedirect() {
  permanentRedirect("/editorial-policy");
}
