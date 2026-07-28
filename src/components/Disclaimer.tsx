const disclaimer =
  "本测试仅供娱乐与自我观察，不构成心理、医学、法律、投资或人生决策建议。";

export function Disclaimer() {
  return (
    <p className="text-center text-xs leading-5 text-[var(--muted)]">
      {disclaimer}
    </p>
  );
}
