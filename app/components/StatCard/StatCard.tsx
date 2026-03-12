import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface StatsProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: StatsProps) {
  return (
    <motion.div className="grid grid-cols-2">
      <span>{label}</span>
      <Icon className={`${color}`} />
      <span>{value}</span>
    </motion.div>
  );
}
