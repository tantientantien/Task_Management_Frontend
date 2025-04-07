// src/components/dashboard/Analytics.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Analytics() {
  const [stats] = useState({
    totalTasks: 42,
    completedTasks: 28,
    overdueTasks: 5,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Analytics Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Total Tasks
          </h3>
          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            {stats.totalTasks}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Completed Tasks
          </h3>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">
            {stats.completedTasks}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Overdue Tasks
          </h3>
          <p className="text-4xl font-bold text-red-600 dark:text-red-400">
            {stats.overdueTasks}
          </p>
        </div>
      </div>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Overview
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          use shadcn :))
        </p>
      </div>
    </motion.div>
  );
}