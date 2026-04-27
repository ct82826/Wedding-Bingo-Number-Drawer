/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Play, CheckCircle2, History } from 'lucide-react';
import confetti from 'canvas-confetti';

const TOTAL_NUMBERS = 75;

export default function App() {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rollingNumber, setRollingNumber] = useState<number>(0);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  
  const numbers = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1);

  const drawNumber = useCallback(() => {
    if (drawnNumbers.length >= TOTAL_NUMBERS || isDrawing) return;

    setIsDrawing(true);
    
    // Preparation for tension animation
    let count = 0;
    const duration = 2000; // 2 seconds of rolling
    const intervalTime = 50;
    const totalTicks = duration / intervalTime;

    const interval = setInterval(() => {
      // Find a random number that hasn't been drawn yet
      const remaining = numbers.filter(n => !drawnNumbers.includes(n));
      if (remaining.length === 0) {
        clearInterval(interval);
        return;
      }
      
      const randomIndex = Math.floor(Math.random() * remaining.length);
      setRollingNumber(remaining[randomIndex]);
      
      count++;
      if (count >= totalTicks) {
        clearInterval(interval);
        
        // Finalize
        const finalNumber = remaining[randomIndex];
        setCurrentNumber(finalNumber);
        setDrawnNumbers(prev => [...prev, finalNumber]);
        setIsDrawing(false);
        
        // Celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#B2AC88', '#FDFBF7']
        });
      }
    }, intervalTime);
  }, [drawnNumbers, isDrawing]);

  const toggleNumber = (num: number) => {
    if (isDrawing) return;
    
    if (drawnNumbers.includes(num)) {
      setDrawnNumbers(prev => prev.filter(n => n !== num));
      if (currentNumber === num) setCurrentNumber(null);
    } else {
      setDrawnNumbers(prev => [...prev, num]);
      setCurrentNumber(num);
      
      // Celebration for manual selection
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#5C544B', '#FDFCF9']
      });
    }
  };

  const resetGame = () => {
    setDrawnNumbers([]);
    setCurrentNumber(null);
    setShowConfirmReset(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-pp-bg text-pp-text font-serif">
      {/* Header Section */}
      <header className="w-full pt-10 pb-6 text-center border-b border-pp-border mx-auto px-4 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:block"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-[1px] bg-pp-gold/30"></div>
            <span className="text-[10px] tracking-[0.5em] text-pp-muted [writing-mode:vertical-lr] font-sans font-bold uppercase">2026 • 05 • 03</span>
            <div className="h-12 w-[1px] bg-pp-gold/30"></div>
          </div>
        </motion.div>

        <p className="uppercase tracking-[0.4em] text-[10px] text-pp-muted mb-2 font-sans font-bold">The Wedding Celebration of</p>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-light tracking-widest text-pp-primary"
        >
          CHEN TING & CHANG LING
        </motion.h1>
        <div className="flex justify-center items-center gap-4 mt-2">
          <div className="h-[1px] w-16 bg-pp-gold"></div>
          <div className="flex flex-col items-center">
            <span className="text-pp-gold text-xl md:text-2xl font-light tracking-[0.3em] uppercase">Bingo Draw</span>
            <span className="text-[9px] tracking-[0.8em] text-pp-muted/60 mt-1 font-sans font-bold uppercase ml-2">May 03, 2026</span>
          </div>
          <div className="h-[1px] w-16 bg-pp-gold"></div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-12 max-w-[1400px]">
        {/* Left Side: Draw Action Panel */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-16">
          <div className="relative flex flex-col items-center">
            {/* Super Large Elegant Suspense Circle */}
            <div className="w-80 h-80 md:w-112 md:h-112 rounded-full border border-pp-gold flex items-center justify-center bg-white shadow-2xl shadow-pp-gold/10 relative overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
               <div className="w-[calc(100%-24px)] h-[calc(100%-24px)] rounded-full border-[8px] border-pp-panel flex flex-col items-center justify-center">
                <p className="text-xs text-pp-muted uppercase tracking-[0.3em] mb-2 font-sans font-bold">Current Number</p>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isDrawing ? 'rolling' : (currentNumber ?? 'empty')}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    className="text-[10rem] md:text-[14rem] font-light text-pp-primary leading-none select-none"
                  >
                    {isDrawing ? rollingNumber : (currentNumber ?? '--')}
                  </motion.span>
                </AnimatePresence>
               </div>
            </div>
            {/* Decorative Ring */}
            <div className="absolute -inset-6 border border-pp-border rounded-full -z-10 opacity-40"></div>
          </div>

          <div className="flex flex-col items-center space-y-8">
            <button
              onClick={drawNumber}
              disabled={isDrawing || drawnNumbers.length >= TOTAL_NUMBERS}
              className="px-20 py-6 bg-pp-primary text-pp-bg text-2xl tracking-[0.25em] hover:bg-pp-primary/95 transition-all rounded-sm shadow-2xl disabled:opacity-30 active:scale-95 group font-sans font-bold cursor-pointer"
            >
              {isDrawing ? 'DRAWING...' : 'DRAW NUMBER'}
            </button>
            <button
              onClick={() => setShowConfirmReset(true)}
              className="text-xs uppercase tracking-[0.2em] text-pp-muted border-b border-pp-muted/30 hover:border-pp-muted hover:text-pp-primary transition-all font-sans font-bold py-1 cursor-pointer"
            >
              RESET SETTINGS
            </button>
          </div>
        </div>

        {/* Right Side: Bingo Grid Panel - Enlarged */}
        <div className="w-full lg:w-[550px] bg-pp-panel rounded-lg p-8 border border-pp-border shadow-md flex flex-col h-fit lg:h-[750px]">
          <div className="flex justify-between items-end mb-8 border-b border-pp-border pb-4">
            <h3 className="text-lg uppercase tracking-[0.2em] text-pp-primary font-bold">Number History</h3>
            <span className="text-xs text-pp-muted font-sans font-bold bg-white px-3 py-1 rounded-full border border-pp-border">
              {drawnNumbers.length} / {TOTAL_NUMBERS} DRAWN
            </span>
          </div>

          <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-4 overflow-y-auto flex-1 pr-4 scrollbar-thin scrollbar-thumb-pp-gold/30">
            {numbers.map(num => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.15, zIndex: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleNumber(num)}
                className={`
                  aspect-square rounded-full flex items-center justify-center text-sm md:text-base font-sans transition-all duration-300 shadow-sm
                  ${drawnNumbers.includes(num) 
                    ? 'bg-pp-gold text-white border-2 border-pp-gold scale-105 shadow-pp-gold/20' 
                    : 'bg-white text-pp-muted border border-pp-border hover:border-pp-gold/60 hover:text-pp-primary'}
                `}
              >
                {num.toString().padStart(2, '0')}
              </motion.button>
            ))}
          </div>

          {/* Recently Selected Status - Enlarged */}
          <div className="mt-8 p-6 bg-white border border-pp-border rounded shadow-inner text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-pp-muted mb-2 font-sans font-bold">Last Selected</p>
            <p className="text-5xl font-light text-pp-primary">
              {drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1] : '-'}
            </p>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="w-full py-6 px-12 border-t border-pp-border flex flex-col md:flex-row justify-between items-center bg-white/50 gap-4 mt-auto">
        <div className="text-[10px] tracking-widest text-pp-muted font-sans font-bold">
          MAY 03, 2026 • TAIPEI
        </div>
        <div className="text-[10px] tracking-widest text-pp-muted font-sans font-bold text-right uppercase">
          Wishing you luck & happiness
        </div>
      </footer>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showConfirmReset && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmReset(false)}
              className="absolute inset-0 bg-pp-primary/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-pp-bg border border-pp-gold p-8 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-full border border-pp-gold flex items-center justify-center mx-auto mb-4">
                <RotateCcw size={20} className="text-pp-gold" />
              </div>
              <h4 className="text-xl font-light tracking-[0.1em] text-pp-primary mb-2">RESET BINGO</h4>
              <p className="text-sm text-pp-muted font-sans font-bold mb-8 uppercase tracking-widest leading-relaxed">
                Are you sure you want to clear all drawn numbers and restart?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={resetGame}
                  className="w-full py-3 bg-pp-primary text-pp-bg font-sans font-bold text-xs tracking-widest hover:bg-pp-primary/90 transition-all cursor-pointer"
                >
                  YES, RESET ALL
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="w-full py-3 border border-pp-border text-pp-muted font-sans font-bold text-xs tracking-widest hover:bg-pp-panel transition-all cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
