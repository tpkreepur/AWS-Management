export function QuickActions() {
  const actions = [
    {
      title: "Launch Instance",
      description: "Start a new EC2 instance",
      icon: "🚀",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "View Snapshots",
      description: "Manage EBS snapshots",
      icon: "📸",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Volume Management",
      description: "Manage EBS volumes",
      icon: "💾",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Backup Status",
      description: "Check backup status",
      icon: "🔄",
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "Cost Analysis",
      description: "View cost breakdown",
      icon: "💰",
      color: "bg-yellow-500 hover:bg-yellow-600"
    },
    {
      title: "Security Groups",
      description: "Manage firewall rules",
      icon: "🔒",
      color: "bg-red-500 hover:bg-red-600"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`${action.color} text-white p-3 rounded-lg transition-colors duration-200 text-left`}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">{action.icon}</span>
              <div>
                <div className="font-medium">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}