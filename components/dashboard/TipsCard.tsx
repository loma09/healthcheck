"use client";

const tips = [
  { emoji: "💧", text: "Minum 2 gelas air sebelum makan membantu kontrol porsi makan siang.", color: "var(--color-sky)" },
  { emoji: "🌙", text: "Konsistensi jam tidur lebih penting dari durasi — usahakan tidur pukul 22.30.", color: "var(--color-indigo)" },
  { emoji: "🥦", text: "Tambah satu porsi sayur hijau hari ini untuk capai target mikronutrien.", color: "var(--color-sage)" },
];

export default function TipsCard() {
  return (
    <div className="tips-card">
      <p className="tips-title">💡 Tips Hari Ini</p>
      {tips.map((tip, i) => (
        <div key={i} className="tip-item">
          <span className="tip-bullet" style={{ background: tip.color }} />
          <p className="tip-text">
            <span style={{ marginRight: 5 }}>{tip.emoji}</span>
            {tip.text}
          </p>
        </div>
      ))}
    </div>
  );
}
