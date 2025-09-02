"use client";

import { useQuickActions } from "@/hooks";

export function QuickActions() {
  const { quickActions, isLoading, error, executeAction } = useQuickActions();

  const handleActionClick = async (actionId: string) => {
    await executeAction(actionId);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-200 rounded mr-3"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="text-red-600 text-sm">
          <p>Error loading quick actions: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.id)}
            className={`${action.color} text-white p-3 rounded-lg transition-colors duration-200 text-left hover:shadow-md`}
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
