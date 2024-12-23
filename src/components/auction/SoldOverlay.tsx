import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface SoldOverlayProps {
  player: {
    name: string;
    role: string;
  };
  soldTo: {
    name: string;
    color: string;
  };
  amount: number;
}

const SoldOverlay: React.FC<SoldOverlayProps> = ({ player, soldTo, amount }) => {
  const container = React.useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from('.sold-text', {
      scale: 3,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out'
    })
    .from('.player-info', {
      y: 50,
      opacity: 0,
      duration: 0.5
    })
    .from('.amount', {
      scale: 0,
      opacity: 0,
      duration: 0.3
    })
    .from('.team-info', {
      x: -50,
      opacity: 0,
      duration: 0.3
    });
  }, { scope: container });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div ref={container} className="relative w-full max-w-3xl">
        <motion.div 
          className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 rounded-2xl p-8 border border-purple-500/30 backdrop-blur-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center mb-8">
            <h2 className="sold-text text-7xl font-bold text-yellow-400 mb-4">SOLD!</h2>
          </div>

          <div className="player-info text-center mb-8">
            <h3 className="text-4xl font-bold text-white mb-2">{player.name}</h3>
            <p className="text-2xl text-purple-200">{player.role}</p>
          </div>

          <div className="amount text-center mb-8">
            <div className="inline-flex items-center bg-green-500/20 px-8 py-4 rounded-2xl">
              <div>
                <div className="text-6xl font-bold text-white mb-2">
                  ₹{(amount / 10000000).toFixed(1)}Cr
                </div>
              </div>
            </div>
          </div>

          <div className="team-info flex items-center justify-center">
            <div className={`bg-gradient-to-r ${soldTo.color} px-8 py-4 rounded-2xl flex items-center space-x-4`}>
              <Trophy className="h-8 w-8 text-white" />
              <span className="text-3xl font-bold text-white">{soldTo.name}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SoldOverlay;