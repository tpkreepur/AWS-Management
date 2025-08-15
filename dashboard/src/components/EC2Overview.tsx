export function EC2Overview() {
  // These numbers match the data from the README
  const ec2Stats = {
    total: 81,
    running: 42,
    stopped: 39,
    windows: 53,
    linux: 28
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">EC2 Instance Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Total Instances */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{ec2Stats.total}</div>
          <div className="text-sm text-blue-700 font-medium">Total Instances</div>
        </div>
        
        {/* Running Instances */}
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{ec2Stats.running}</div>
          <div className="text-sm text-green-700 font-medium">Running</div>
        </div>
        
        {/* Stopped Instances */}
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{ec2Stats.stopped}</div>
          <div className="text-sm text-red-700 font-medium">Stopped</div>
        </div>
        
        {/* Windows Instances */}
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{ec2Stats.windows}</div>
          <div className="text-sm text-purple-700 font-medium">Windows</div>
        </div>
        
        {/* Linux Instances */}
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{ec2Stats.linux}</div>
          <div className="text-sm text-orange-700 font-medium">Linux</div>
        </div>
      </div>
      
      {/* Progress Bars */}
      <div className="mt-6 space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Instance State</span>
            <span>{Math.round((ec2Stats.running / ec2Stats.total) * 100)}% Running</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${(ec2Stats.running / ec2Stats.total) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Operating System</span>
            <span>{Math.round((ec2Stats.windows / ec2Stats.total) * 100)}% Windows</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full" 
              style={{ width: `${(ec2Stats.windows / ec2Stats.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}