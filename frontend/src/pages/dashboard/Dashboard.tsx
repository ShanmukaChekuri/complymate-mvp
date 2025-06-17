export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Welcome to your compliance dashboard. Here's an overview of your compliance status.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Compliance Status Card */}
        <div className="card">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Compliance Status</h3>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Overall Score</span>
              <span className="text-lg font-semibold text-success-600">85%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800">
              <div className="h-2 rounded-full bg-success-500" style={{ width: '85%' }} />
            </div>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="card">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Pending Tasks</h3>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Tasks Due</span>
              <span className="text-lg font-semibold text-warning-600">3</span>
            </div>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Annual Review</span>
                <span className="text-warning-600">Due in 2 days</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">Policy Update</span>
                <span className="text-warning-600">Due in 5 days</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="card">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Recent Activity</h3>
          <div className="mt-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <span className="mt-1 h-2 w-2 rounded-full bg-success-500" />
                <div>
                  <p className="text-neutral-900 dark:text-white">Compliance check completed</p>
                  <p className="text-neutral-600 dark:text-neutral-400">2 hours ago</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                <div>
                  <p className="text-neutral-900 dark:text-white">New policy added</p>
                  <p className="text-neutral-600 dark:text-neutral-400">1 day ago</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 