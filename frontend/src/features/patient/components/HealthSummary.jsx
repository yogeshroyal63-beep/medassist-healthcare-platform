import { HeartPulse } from "lucide-react";

export default function HealthSummary() {

  return (

    <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl p-6 mb-6">

      <div className="flex items-center gap-2 text-xs opacity-90 mb-1">
        <HeartPulse size={14} />
        Health Confidence Index
      </div>

      <div className="text-3xl font-bold mb-1">
        89
      </div>

      <p className="text-xs opacity-90 mb-3">
        Your overall health score based on recent activity
      </p>

      <div className="h-2 bg-white/30 rounded">
        <div className="h-2 bg-white rounded w-[89%]"></div>
      </div>

    </div>

  );
}