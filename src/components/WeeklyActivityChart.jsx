import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/db";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format, subDays, startOfDay, parseISO } from "date-fns";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="cyber-card rounded-lg px-3 py-2 border border-cyber-cyan/30 text-xs">
      <p className="font-orbitron text-cyber-cyan uppercase tracking-widest mb-1">{label}</p>
      <p className="font-mono-cyber text-white/70">📚 {d.prompts} prompt{d.prompts !== 1 ? "s" : ""}</p>
      <p className="font-mono-cyber text-white/70">🔗 {d.resources} resource{d.resources !== 1 ? "s" : ""}</p>
    </div>
  );
};

export default function WeeklyActivityChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalActivity, setTotalActivity] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const [configs, resources] = await Promise.all([
        db.entities.SavedConfig.list("-created_date", 200),
        db.entities.ResourceLink.list("-created_date", 200),
      ]);

      // Build last 7 days buckets
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 6 - i);
        return {
          date: startOfDay(d),
          label: format(d, "EEE"),
          fullLabel: format(d, "MMM d"),
          prompts: 0,
          resources: 0,
          total: 0,
        };
      });

      const bucket = (dateStr) => {
        if (!dateStr) return -1;
        const d = startOfDay(typeof dateStr === "string" ? parseISO(dateStr) : new Date(dateStr));
        return days.findIndex((day) => day.date.getTime() === d.getTime());
      };

      configs.forEach((c) => {
        const i = bucket(c.created_date);
        if (i >= 0) { days[i].prompts += 1; days[i].total += 1; }
      });
      resources.forEach((r) => {
        const i = bucket(r.created_date);
        if (i >= 0) { days[i].resources += 1; days[i].total += 1; }
      });

      // Calculate streak (consecutive days with activity, counting from today backwards)
      let s = 0;
      for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].total > 0) s++;
        else break;
      }

      setData(days);
      setTotalActivity(days.reduce((sum, d) => sum + d.total, 0));
      setStreak(s);
      setLoading(false);
    };
    fetchData();
  }, []);

  const maxVal = Math.max(...data.map((d) => d.total), 1);
  const activeDays = data.filter((d) => d.total > 0).length;

  if (loading) {
    return (
      <div className="cyber-card rounded-xl p-5 flex items-center justify-center h-40">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="cyber-card rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-orbitron text-xs font-bold uppercase tracking-widest text-white/60">
            📈 Weekly Activity
          </h3>
          <p className="font-mono-cyber text-xs text-white/25 mt-0.5">Last 7 days</p>
        </div>
        <div className="flex gap-3">
          <div className="text-right">
            <p className="font-orbitron text-lg font-black text-cyber-cyan">{totalActivity}</p>
            <p className="font-mono-cyber text-xs text-white/30">total actions</p>
          </div>
          <div className="text-right">
            <p className={`font-orbitron text-lg font-black ${streak > 0 ? "text-cyber-pink" : "text-white/20"}`}>
              {streak}🔥
            </p>
            <p className="font-mono-cyber text-xs text-white/30">day streak</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={18} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
            <XAxis
              dataKey="label"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "Share Tech Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9, fontFamily: "Share Tech Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(6,182,212,0.05)" }} />
            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => {
                const isToday = i === data.length - 1;
                const intensity = maxVal > 0 ? entry.total / maxVal : 0;
                return (
                  <Cell
                    key={i}
                    fill={
                      isToday
                        ? "#06B6D4"
                        : entry.total === 0
                        ? "rgba(255,255,255,0.05)"
                        : `rgba(124,58,237,${0.3 + intensity * 0.7})`
                    }
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer legend */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <div className="flex gap-3">
          <span className="flex items-center gap-1.5 font-mono-cyber text-xs text-white/30">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyber-purple/60 inline-block" /> Prompts
          </span>
          <span className="flex items-center gap-1.5 font-mono-cyber text-xs text-white/30">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyber-cyan inline-block" /> Today
          </span>
        </div>
        <span className="font-mono-cyber text-xs text-white/25">
          {activeDays}/7 active days
        </span>
      </div>
    </motion.div>
  );
}
