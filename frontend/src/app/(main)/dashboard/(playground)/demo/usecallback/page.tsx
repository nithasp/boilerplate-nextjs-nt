'use client';

import { memo, useCallback, useState } from 'react';

let previousTest555Without: (() => void) | null = null;
let previousTest555With: (() => void) | null = null;
let test555WithoutRecreationCount = 0;
let test555WithRecreationCount = 0;

const ChildWithCallback = memo(
  ({
    onClick,
    label,
    color,
  }: {
    onClick: () => void;
    label: string;
    color: string;
  }) => {
    console.log(`${color} ${label} - Child component RENDERED!`);

    return (
      <div
        className={`p-4 border-2 rounded-lg ${
          color === '🔴'
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : 'border-green-500 bg-green-50 dark:bg-green-900/20'
        }`}
      >
        <p
          className={`text-sm font-semibold mb-2 ${
            color === '🔴'
              ? 'text-red-900 dark:text-red-300'
              : 'text-green-900 dark:text-green-300'
          }`}
        >
          {label}
        </p>
        <button
          onClick={onClick}
          className={`${
            color === '🔴'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          } text-white px-4 py-2 rounded font-medium transition-colors`}
        >
          Click Me
        </button>
      </div>
    );
  },
);

ChildWithCallback.displayName = 'ChildWithCallback';

export default function UseCallbackDemoPage() {
  const [callbackCounter, setCallbackCounter] = useState(0);
  const [triggerRerender, setTriggerRerender] = useState(0);
  const [input, setInput] = useState('');

  console.log('🔵 === PARENT Component Rendered ===');

  const handleClickWithout = () => {
    console.log('🔴 Function WITHOUT useCallback was called!');
    setCallbackCounter((prev) => prev + 1);
  };

  const handleClickWith = useCallback(() => {
    console.log('🟢 Function WITH useCallback was called!');
    setCallbackCounter((prev) => prev + 1);
  }, []);

  const test555Without = () => {
    console.log('🔴 test555 WITHOUT useCallback was called!');
  };

  const test555With = useCallback(() => {
    console.log('🟢 test555 WITH useCallback was called!');
  }, []);

  console.log('\n📍 === FUNCTION REFERENCE COMPARISON ===');
  console.log('📦 Current test555Without function:', test555Without);
  console.log('📦 Current test555With function:', test555With);
  console.log('');

  console.log('🔴 === Checking test555Without ===');
  if (previousTest555Without === null) {
    console.log('   First render - creating initial function');
    console.log('   ❓ Comparison: previousTest555Without === test555Without? N/A (first render)');
    console.log(`   📊 Recreation Count: ${test555WithoutRecreationCount + 1}`);
    previousTest555Without = test555Without;
    test555WithoutRecreationCount = 1;
  } else {
    const isSameReference = previousTest555Without === test555Without;
    console.log(
      `   ❓ Comparison: previousTest555Without === test555Without? ${isSameReference}`,
    );

    if (isSameReference) {
      console.log('   🟢 SAME reference as previous render (This should NEVER happen!)');
      console.log(`   📊 Recreation Count: ${test555WithoutRecreationCount} (unchanged)`);
    } else {
      test555WithoutRecreationCount++;
      console.log(`   ❌ DIFFERENT reference! NEW FUNCTION CREATED!`);
      console.log(`   📊 Recreation Count: ${test555WithoutRecreationCount} (increased!)`);
      console.log('   ⚠️  Function reference changed! This is wasteful!');
      previousTest555Without = test555Without;
    }
  }

  console.log('');

  console.log('🟢 === Checking test555With ===');
  if (previousTest555With === null) {
    console.log('   First render - creating initial function');
    console.log('   ❓ Comparison: previousTest555With === test555With? N/A (first render)');
    console.log(`   📊 Recreation Count: ${test555WithRecreationCount + 1}`);
    previousTest555With = test555With;
    test555WithRecreationCount = 1;
  } else {
    const isSameReference = previousTest555With === test555With;
    console.log(`   ❓ Comparison: previousTest555With === test555With? ${isSameReference}`);

    if (isSameReference) {
      console.log(`   ✅ SAME REFERENCE! useCallback is working! 🎉`);
      console.log(`   📊 Recreation Count: ${test555WithRecreationCount} (stayed at 1!)`);
      console.log('   ✅ Function reference preserved! This is optimized!');
    } else {
      test555WithRecreationCount++;
      console.log(`   ❌ DIFFERENT reference! NEW function created!`);
      console.log(`   📊 Recreation Count: ${test555WithRecreationCount}`);
      console.log('   ⚠️  This means dependencies changed!');
      previousTest555With = test555With;
    }
  }

  console.log('\n🔢 === RECREATION COUNTER SUMMARY ===');
  console.log(`🔴 test555Without: ${test555WithoutRecreationCount} times recreated`);
  console.log(
    `🟢 test555With: ${test555WithRecreationCount} time(s) created (should stay at 1!)`,
  );
  console.log(
    `📊 Difference: test555Without was recreated ${
      test555WithoutRecreationCount - test555WithRecreationCount
    } MORE times!`,
  );
  console.log('🔢 === END COUNTER ===');
  console.log('📍 === END COMPARISON ===\n');
  console.log('🔵 === End of Parent Component Render ===\n');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          useCallback Demo
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Open your browser&apos;s <strong>Console (F12)</strong> to see the DIFFERENCE clearly!
        </p>

        <div className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl p-8 mb-8 border-4 border-orange-500">
          <h2 className="text-3xl font-bold text-orange-900 dark:text-orange-300 mb-4">
            🎓 Simple Example: test555
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Let&apos;s see the difference with a simple example. Both buttons call a function, but one uses{' '}
              <code className="bg-orange-100 dark:bg-orange-800 px-2 py-1 rounded">useCallback</code>.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 <strong>Watch the console:</strong> Every time you click &quot;Force Re-render&quot;, you&apos;ll see the function recreation logs!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-6">
              <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-3">
                🔴 WITHOUT useCallback
              </h3>
              <button
                onClick={test555Without}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-md"
              >
                Click test555 (No useCallback)
              </button>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-6">
              <h3 className="text-lg font-bold text-green-900 dark:text-green-300 mb-3">
                🟢 WITH useCallback
              </h3>
              <button
                onClick={test555With}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-md"
              >
                Click test555 (With useCallback)
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-8 mb-8 border-4 border-purple-500">
          <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-300 mb-4">
            🎯 Advanced Example: Child Component Re-rendering
          </h2>

          <div className="mb-6">
            <button
              onClick={() => setTriggerRerender((prev) => prev + 1)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
            >
              🔄 Force Re-render (Count: {triggerRerender})
            </button>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-3">
              Click this to trigger parent re-render. Watch console to see which child re-renders!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <ChildWithCallback
              onClick={handleClickWithout}
              label="🔴 WITHOUT useCallback"
              color="🔴"
            />
            <ChildWithCallback
              onClick={handleClickWith}
              label="🟢 WITH useCallback"
              color="🟢"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center mb-6">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              Callback Counter: {callbackCounter}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              (Both buttons update the same counter)
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🧪 Additional Test: Type to Trigger Re-render
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Type something (causes parent re-render)
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type here to trigger parent re-render..."
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Current State:
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Callback Counter:</span>
              <span className="ml-2 font-bold text-gray-900 dark:text-white">
                {callbackCounter}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Re-render Count:</span>
              <span className="ml-2 font-bold text-gray-900 dark:text-white">
                {triggerRerender}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Input:</span>
              <span className="ml-2 font-bold text-gray-900 dark:text-white">
                {input || '(empty)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
