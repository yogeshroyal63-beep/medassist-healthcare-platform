import { Activity, Calendar, Pill, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardCards() {

  const navigate = useNavigate();

  const cards = [
    {
      title: "Smart Check",
      subtitle: "Check symptoms",
      icon: <Activity size={18} />,
      color: "bg-blue-100 text-blue-600",
      path: "/triage"
    },
    {
      title: "Book Appointment",
      subtitle: "Schedule visit",
      icon: <Calendar size={18} />,
      color: "bg-green-100 text-green-600",
      path: "/appointments"
    },
    {
      title: "Medications",
      subtitle: "View medicines",
      icon: <Pill size={18} />,
      color: "bg-teal-100 text-teal-600",
      path: "/medications"
    },
    {
      title: "Health Records",
      subtitle: "View history",
      icon: <FileText size={18} />,
      color: "bg-purple-100 text-purple-600",
      path: "/records"
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">

      {cards.map((card, i) => (

        <div
          key={i}
          onClick={() => navigate(card.path)}
          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md flex gap-3 cursor-pointer"
        >

          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${card.color}`}>
            {card.icon}
          </div>

          <div>
            <p className="text-sm font-medium">{card.title}</p>
            <p className="text-xs text-gray-500">{card.subtitle}</p>
          </div>

        </div>

      ))}

    </div>
  );
}