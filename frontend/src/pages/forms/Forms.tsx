export default function Forms() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Forms</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Manage your compliance forms and documents.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Form Categories */}
          <div className="card">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Policy Forms</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <button className="w-full rounded-lg p-3 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <div className="font-medium text-neutral-900 dark:text-white">Privacy Policy</div>
                  <div className="text-neutral-600 dark:text-neutral-400">Last updated 2 days ago</div>
                </button>
              </li>
              <li>
                <button className="w-full rounded-lg p-3 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <div className="font-medium text-neutral-900 dark:text-white">Terms of Service</div>
                  <div className="text-neutral-600 dark:text-neutral-400">Last updated 1 week ago</div>
                </button>
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Compliance Reports</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <button className="w-full rounded-lg p-3 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <div className="font-medium text-neutral-900 dark:text-white">Annual Compliance Report</div>
                  <div className="text-neutral-600 dark:text-neutral-400">Due in 30 days</div>
                </button>
              </li>
              <li>
                <button className="w-full rounded-lg p-3 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <div className="font-medium text-neutral-900 dark:text-white">Security Assessment</div>
                  <div className="text-neutral-600 dark:text-neutral-400">Due in 15 days</div>
                </button>
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Templates</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <button className="w-full rounded-lg p-3 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <div className="font-medium text-neutral-900 dark:text-white">Data Processing Agreement</div>
                  <div className="text-neutral-600 dark:text-neutral-400">Template</div>
                </button>
              </li>
              <li>
                <button className="w-full rounded-lg p-3 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <div className="font-medium text-neutral-900 dark:text-white">Incident Response Plan</div>
                  <div className="text-neutral-600 dark:text-neutral-400">Template</div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 