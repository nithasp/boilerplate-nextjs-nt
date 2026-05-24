"use client";

import { useMemo, useState } from "react";

export default function UseMemoDemoPage() {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Electronics");

  console.log("🔵 === Component Rendered ===");

  const countMemoValue = useMemo(() => {
    console.log("  🟢 countMemoValue recalculated (WITH useMemo)!");
    return count + 1;
  }, [count]);

  console.log("  🔴 countValueNotUseMemo recalculated (WITHOUT useMemo)!");
  const countValueNotUseMemo = count + 1;

  console.log("🔵 === End of Component Render ===\n");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          useMemo Demo - See The Difference
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Open your browser&apos;s <strong>Console (F12)</strong> to see when calculations run!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-4">
              📚 What to Watch in Console:
            </h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
              <li>🔵 <strong>Blue</strong> = Component rendered</li>
              <li>🔴 <strong>Red</strong> = WITHOUT useMemo (runs every render)</li>
              <li>🟢 <strong>Green</strong> = WITH useMemo (runs only when count changes)</li>
            </ul>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-300 mb-4">
              🎯 Try This:
            </h3>
            <ol className="space-y-2 text-yellow-800 dark:text-yellow-200 text-sm list-decimal list-inside">
              <li>Type in the input field below</li>
              <li>Watch console - 🔴 RED runs every keystroke!</li>
              <li>🟢 GREEN only runs when you click &quot;Increment Count&quot;</li>
              <li>This shows useMemo saves performance! 🚀</li>
            </ol>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Interactive Controls
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Count: {count} (Used in calculation)
            </label>
            <button
              onClick={() => setCount(count + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
            >
              Increment Count (Both calculations will run)
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              ✅ This changes the dependency, so BOTH calculations run
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Type Something (Not related to calculation)
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type here..."
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              ⚠️ Component re-renders on each keystroke, but only 🔴 RED runs (🟢 GREEN is cached!)
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Select Category (Not related to calculation)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Food</option>
              <option>Books</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              ⚠️ Component re-renders, but only 🔴 RED runs (🟢 GREEN stays cached!)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-6">
            <h3 className="text-xl font-bold text-red-900 dark:text-red-300 mb-4">
              🔴 WITHOUT useMemo
            </h3>
            <p className="text-sm text-red-700 dark:text-red-200 mb-4">
              Recalculates on <strong>EVERY</strong> render (typing, selecting, everything!)
            </p>
            <div className="bg-white dark:bg-gray-800 rounded p-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                Result: {countValueNotUseMemo}
              </p>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-4">
              🟢 WITH useMemo
            </h3>
            <p className="text-sm text-green-700 dark:text-green-200 mb-4">
              Recalculates <strong>ONLY</strong> when count changes!
            </p>
            <div className="bg-white dark:bg-gray-800 rounded p-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                Result: {countMemoValue}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-3">
            ⚡ Performance Impact
          </h3>
          <p className="text-purple-800 dark:text-purple-200 mb-4">
            Notice the difference in your console:
          </p>
          <ul className="space-y-2 text-purple-700 dark:text-purple-300 text-sm">
            <li>✅ When you <strong>type in the input</strong>, only 🔴 RED calculation runs</li>
            <li>✅ When you <strong>change the category</strong>, only 🔴 RED calculation runs</li>
            <li>✅ The 🟢 GREEN calculation is <strong>cached</strong> and reused!</li>
            <li>🚀 This saves CPU time and makes your app faster!</li>
          </ul>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Current State:
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Count:</span>
              <span className="ml-2 font-bold text-gray-900 dark:text-white">{count}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Input:</span>
              <span className="ml-2 font-bold text-gray-900 dark:text-white">
                {input || "(empty)"}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Category:</span>
              <span className="ml-2 font-bold text-gray-900 dark:text-white">{category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
