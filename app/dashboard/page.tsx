"use client";
import { useState, useRef, useEffect } from "react";
import {
  Heart,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Plus,
  Calendar,
  Clock,
  Phone,
  Mail,
  Video,
  Globe,
  User,
  Info,
  Stethoscope,
  Zap,
  MessageCircle,
  Star,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { createClient } from "@/lib/supabase";

/* ───── DATA ───── */

// Dot matrix: 7 rows x 14 cols, values 0-3 (0=light, 1=mid, 2=active, 3=dark)
const dotMatrix = [
  [0, 1, 0, 2, 1, 0, 2, 3, 0, 1, 2, 0, 1, 0],
  [2, 0, 1, 0, 2, 1, 0, 1, 2, 0, 1, 2, 0, 1],
  [0, 2, 3, 1, 0, 2, 1, 3, 0, 2, 0, 1, 2, 0],
  [1, 0, 2, 0, 1, 0, 2, 0, 1, 3, 2, 0, 1, 2],
  [0, 1, 0, 2, 3, 1, 0, 2, 0, 1, 0, 2, 0, 1],
  [2, 0, 1, 0, 1, 2, 3, 0, 1, 0, 2, 1, 0, 2],
  [0, 2, 0, 1, 0, 1, 2, 1, 0, 2, 1, 0, 1, 0],
];
const dotClass = ["", "mid", "active", "dark"];

const weeklyChart = [
  { day: "Sen", val: 6.5 },
  { day: "Sel", val: 7 },
  { day: "Rab", val: 7.5 },
  { day: "Kam", val: 8 },
  { day: "Jum", val: 7 },
  { day: "Sab", val: 8.5 },
  { day: "Min", val: 7.75 },
];

const donutData = [
  { name: "Pemeriksaan", value: 48, color: "#4CAF7D" },
  { name: "Olahraga", value: 27, color: "#2D6A8F" },
  { name: "Nutrisi", value: 18, color: "#C4C9D4" },
];

const recruitBars = [65, 80, 55, 90, 70, 85, 60, 75, 88, 72, 68, 82];

const doctors = [
  {
    name: "dr. Rina Sari",
    specialty: "Dokter Umum",
    exp: "8 tahun pengalaman",
    photo: "/doctor-1.png",
    rating: 4.9,
    available: true,
  },
  {
    name: "dr. Budi Hartono",
    specialty: "Spesialis Jantung",
    exp: "12 tahun pengalaman",
    photo: "/doctor-2.png",
    rating: 4.8,
    available: true,
  },
  {
    name: "dr. Maya Putri",
    specialty: "Ahli Gizi",
    exp: "6 tahun pengalaman",
    photo: "/doctor-3.png",
    rating: 4.7,
    available: false,
  },
];

const aiInsights = [
  "Pola tidurmu minggu ini membaik +12%. Pertahankan jam tidur konsisten.",
  "Asupan air masih 60% dari target — coba minum segelas setiap 2 jam.",
  "Tekanan darah stabil di kisaran normal. Tetap jaga pola makan rendah garam.",
];

const recentLogs = [
  {
    name: "Tekanan darah",
    amount: "120/80 mmHg",
    time: "Hari ini",
    status: "done",
    bg: "linear-gradient(135deg,#4CAF7D,#34D399)",
  },
  {
    name: "Gula darah",
    amount: "95 mg/dL",
    time: "Hari ini",
    status: "done",
    bg: "linear-gradient(135deg,#3B82F6,#60A5FA)",
  },
  {
    name: "Konsumsi air",
    amount: "1.200 ml",
    time: "Hari ini",
    status: "waiting",
    bg: "linear-gradient(135deg,#F59E0B,#FBBF24)",
  },
  {
    name: "Langkah kaki",
    amount: "4.200 langkah",
    time: "Hari ini",
    status: "waiting",
    bg: "linear-gradient(135deg,#A78BFA,#C4B5FD)",
  },
  {
    name: "Kolesterol",
    amount: "182 mg/dL",
    time: "Kemarin",
    status: "failed",
    bg: "linear-gradient(135deg,#FB7185,#FDA4AF)",
  },
];

const now = new Date();
const hour = now.getHours();
const greeting =
  hour < 12 ? "Selamat pagi" : hour < 17 ? "Selamat siang" : "Selamat malam";
const dateRange = `${now.getDate() - 4} – ${now.getDate()} ${now.toLocaleDateString("id-ID", { month: "long" })}`;

/* ───── COMPONENT ───── */

export default function DashboardPage() {
  const [userName, setUserName] = useState("...");
  const [docIdx, setDocIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToDoctor = (dir: "prev" | "next") => {
    const newIdx = dir === "next"
      ? Math.min(docIdx + 1, doctors.length - 1)
      : Math.max(docIdx - 1, 0);
    setDocIdx(newIdx);
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({ left: newIdx * slideWidth, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const name = data.user?.user_metadata?.name || data.user?.email || "User";
      setUserName(name);
    });
  }, []);

  const handleNotImplemented = (feature: string) => {
    alert(
      `Fitur "${feature}" akan segera hadir. Hubungkan ke backend untuk mengaktifkan.`,
    );
  };

  return (
    <div className="page-body">
      {/* ── Header ── */}
      <div className="header-row fade-up fade-up-1">
        <div className="page-header">
          <h1 className="page-title">
            {greeting}, {userName}
          </h1>
        </div>
        <div className="header-actions">
          <button
            className="btn-outline"
            onClick={() => handleNotImplemented("Catat data")}
          >
            <Plus size={13} /> Catat data
          </button>
          <button
            className="btn-outline"
            onClick={() => handleNotImplemented("Filter tanggal")}
          >
            <Calendar size={13} /> {dateRange}
          </button>
          <button
            className="btn-primary"
            onClick={() => handleNotImplemented("Tambah laporan")}
          >
            <Plus size={13} /> Tambah laporan
          </button>
        </div>
      </div>

      {/* ── Main 3-column Grid ── */}
      <div className="dash-grid fade-up fade-up-2">
        {/* ▸ LEFT COLUMN */}
        <div className="dash-left">
          {/* Swipeable Doctor Carousel */}
          <div className="doctor-carousel-wrapper">
            <div className="doctor-carousel-nav">
              <span className="doctor-carousel-label">Dokter Tersedia</span>
            </div>

            <div className="doctor-carousel-container">
              <div className="doctor-carousel" ref={scrollRef}>
                {doctors.map((doc, i) => (
                  <div key={i} className="profile-card doctor-slide">
                    <div className="profile-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={doc.photo} alt={doc.name} />

                      {i === docIdx && (
                        <>
                          <button
                            className="doctor-arrow-float left"
                            onClick={() => scrollToDoctor("prev")}
                            disabled={docIdx === 0}
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            className="doctor-arrow-float right"
                            onClick={() => scrollToDoctor("next")}
                            disabled={docIdx === doctors.length - 1}
                          >
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}
                    </div>
                    <div className="profile-badge">
                      <Star size={10} fill="#F59E0B" color="#F59E0B" />{" "}
                      {doc.rating} · {doc.specialty}
                    </div>
                    <div className="profile-info">
                      <div className="profile-name">{doc.name}</div>
                      <div className="profile-role">{doc.exp}</div>
                      <div className="doctor-avail">
                        <span
                          className={
                            doc.available ? "dot-online" : "dot-offline"
                          }
                        />
                        {doc.available ? "Online — Siap konsultasi" : "Offline"}
                      </div>
                      <div className="profile-actions">
                        <button
                          className="profile-action-btn"
                          title="Telepon"
                          onClick={() =>
                            handleNotImplemented(`Telepon ${doc.name}`)
                          }
                        >
                          <Phone size={16} color="#4CAF7D" />
                        </button>
                        <button
                          className="profile-action-btn"
                          title="Chat"
                          onClick={() =>
                            handleNotImplemented(`Chat dengan ${doc.name}`)
                          }
                        >
                          <MessageCircle size={16} color="#2D6A8F" />
                        </button>
                        <button
                          className="profile-action-btn"
                          title="Video"
                          onClick={() =>
                            handleNotImplemented(
                              `Video call dengan ${doc.name}`,
                            )
                          }
                        >
                          <Video size={16} color="#6B7280" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="doctor-dots">
              {doctors.map((_, i) => (
                <div
                  key={i}
                  className={`doctor-dot ${i === docIdx ? "active" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* Rata-rata Tidur */}
          <div className="stat-mini">
            <div className="stat-mini-label">Rata-rata waktu tidur</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span className="stat-mini-value">7.75 jam</span>
              <span className="stat-mini-trend">
                <TrendingUp size={11} /> +0.5% <Info size={10} />
              </span>
            </div>
            <div className="stat-mini-chart">
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart
                  data={weeklyChart}
                  margin={{ top: 4, right: 0, left: -30, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#4CAF7D"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#4CAF7D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" hide />
                  <YAxis domain={[4, 10]} hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "none",
                      fontSize: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#4CAF7D"
                    strokeWidth={2}
                    fill="url(#sg)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                color: "#C4C9D4",
                margin: "4px 0",
              }}
            >
              <span>4 jam</span>
              <span>6 jam</span>
              <span>8 jam</span>
              <span>10 jam</span>
            </div>
            <div className="stat-mini-note">
              ⓘ Termasuk tidur siang dan istirahat singkat
            </div>
          </div>
        </div>

        {/* ▸ CENTER COLUMN */}
        <div className="dash-center">
          {/* Top row: Big stat + Team card */}
          <div className="center-top">
            {/* Big Stat Card — Skor Kesehatan */}
            <div className="big-stat-card">
              <div className="big-stat-header">
                <div className="big-stat-icon">
                  <Stethoscope size={18} color="#2D6A8F" />
                </div>
                <div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span className="big-stat-num">82.5</span>
                    <span className="big-stat-badge">
                      <TrendingUp size={10} /> +4.3%
                    </span>
                  </div>
                  <div className="big-stat-sub">skor kesehatan / minggu</div>
                </div>
              </div>

              {/* Dot Matrix — Aktivitas Harian */}
              <div className="dot-matrix">
                {dotMatrix.flat().map((v, i) => (
                  <div key={i} className={`dot-matrix-dot ${dotClass[v]}`} />
                ))}
              </div>

              <div className="big-stat-footer">
                <span>Rendah</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2, 3].map((v) => (
                    <div
                      key={v}
                      className={`dot-matrix-dot ${dotClass[v]}`}
                      style={{ width: 8, height: 8 }}
                    />
                  ))}
                </div>
                <span>Tinggi</span>
              </div>
            </div>

            {/* Teal Card — Target Olahraga & Nutrisi */}
            <div className="team-card">
              <div className="team-card-top">
                <div>
                  <div className="team-trend">
                    +2.6% <Info size={10} />
                  </div>
                  <div className="team-pct">151%</div>
                  <div className="team-label">Target olahraga</div>
                </div>
                <div className="team-top-badge">
                  <User size={16} color="white" />
                </div>
              </div>
              <div className="team-sub">
                <div className="team-sub-icon">
                  <Globe size={14} color="white" />
                </div>
                <div>
                  <div className="team-sub-trend">
                    +2.6% <Info size={9} />
                  </div>
                  <div className="team-sub-pct">38%</div>
                  <div className="team-sub-label">Nutrisi tercapai</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row: Donut + Recruitment */}
          <div className="center-bottom">
            {/* Donut Card — Distribusi Kesehatan */}
            <div className="donut-card">
              <div className="donut-section-label">Komponen kesehatan</div>
              <div className="donut-header">
                <div className="donut-title">Pantau kesehatanmu</div>
                <button
                  style={{
                    fontSize: 12,
                    color: "#9CA3AF",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="donut-wrap">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={70}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {donutData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center">
                  <div className="donut-center-num">93</div>
                  <div className="donut-center-label">Total cek</div>
                </div>
              </div>

              <div className="donut-legend">
                {donutData.map((d) => (
                  <div key={d.name} className="donut-legend-item">
                    <div className="donut-legend-left">
                      <div
                        className="donut-legend-dot"
                        style={{ background: d.color }}
                      />
                      {d.name}
                    </div>
                    <div className="donut-legend-val">{d.value} catatan</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pencapaian Card */}
            <div className="recruit-card">
              <div className="recruit-section-label">Statistik harian</div>
              <div className="recruit-title">Pencapaian minggu ini</div>

              <div className="recruit-avatars">
                <div
                  className="recruit-avatar"
                  style={{
                    background: "linear-gradient(135deg,#E8F5EE,#B2DFCC)",
                    fontSize: 28,
                  }}
                >
                  🏃
                </div>
                <div
                  className="recruit-avatar"
                  style={{
                    background: "linear-gradient(135deg,#FEF2F4,#FECDD3)",
                    fontSize: 28,
                  }}
                >
                  ❤️
                </div>
                <div
                  className="recruit-avatar"
                  style={{
                    background: "linear-gradient(135deg,#FFF8E8,#FDE68A)",
                    fontSize: 28,
                  }}
                >
                  🥗
                </div>
                <div className="recruit-avatar cta">
                  <Video size={18} />
                  <span>Konsul</span>
                </div>
              </div>

              <div className="recruit-counts">
                <span>120 Target</span>
                <span>80 Tercapai</span>
              </div>

              <div className="recruit-bars">
                {recruitBars.map((h, i) => (
                  <div
                    key={i}
                    className="recruit-bar"
                    style={{
                      height: `${h}%`,
                      background: i < 8 ? "#4CAF7D" : "#E8F5EE",
                    }}
                  />
                ))}
              </div>
              <div className="recruit-stats">
                <div className="recruit-stat-label">
                  <div
                    className="recruit-stat-dot"
                    style={{ background: "#4CAF7D" }}
                  />{" "}
                  Tercapai
                </div>
                <div className="recruit-stat-label">
                  <div
                    className="recruit-stat-dot"
                    style={{
                      background: "#E8F5EE",
                      border: "1px solid #C4C9D4",
                    }}
                  />{" "}
                  Belum
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ▸ RIGHT COLUMN */}
        <div className="dash-right">
          {/* Log Hari Ini */}
          <div className="payout-card">
            <div className="payout-section-label">Catatan harian</div>
            <div className="payout-title">Log Kesehatan</div>
            <div className="payout-list">
              {recentLogs.map((log, i) => (
                <div key={i} className="payout-item">
                  <div className="payout-avatar" style={{ background: log.bg }}>
                    {log.name[0]}
                  </div>
                  <div>
                    <div className="payout-name">{log.name}</div>
                    <div className="payout-amount">
                      {log.amount} ·{" "}
                      <Clock size={9} style={{ display: "inline" }} />{" "}
                      {log.time}
                    </div>
                  </div>
                  <div className={`payout-status ${log.status}`}>
                    {log.status === "done"
                      ? "Normal"
                      : log.status === "waiting"
                        ? "Kurang"
                        : "Perlu cek"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div className="ai-card">
            <div className="ai-card-header">
              <div className="ai-card-icon">
                <Zap size={16} color="white" />
              </div>
              <div>
                <div className="ai-card-label">AI INSIGHT</div>
                <div className="ai-card-title">Analisis Minggu Ini</div>
              </div>
            </div>
            <div className="ai-card-list">
              {aiInsights.map((tip, i) => (
                <div key={i} className="ai-card-item">
                  <div className="ai-card-bullet">{i + 1}</div>
                  <div className="ai-card-text">{tip}</div>
                </div>
              ))}
            </div>
            <div className="ai-card-footer">
              <div className="ai-card-score">
                <span className="ai-card-score-label">Skor kesehatan</span>
                <span className="ai-card-score-value">95 pts</span>
              </div>
              <button
                className="ai-card-btn"
                onClick={() => handleNotImplemented("Detail analisis AI")}
              >
                Lihat detail <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
