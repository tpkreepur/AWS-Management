export function AccountInfoCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Account ID</label>
            <p className="text-lg font-mono text-gray-900">123456789012</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Region</label>
            <p className="text-lg text-gray-900">us-east-1</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Account Type</label>
            <p className="text-lg text-gray-900">Production</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Organization Unit</label>
            <p className="text-lg text-gray-900">Core Infrastructure</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Billing Contact</label>
            <p className="text-lg text-gray-900">billing@company.com</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-lg text-green-700 font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}