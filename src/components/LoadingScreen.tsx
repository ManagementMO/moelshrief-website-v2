import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const robotText = [
  'Initializing neural interface...',
  'Syncing data streams...',
  'Calibrating experience...',
  'Welcome to the future.'
];


const binaryStrings = [
  '1010110110001101',
  '0101101011110010', 
  '1100110010101101',
  '0011010110101110',
  '1111000011001010',
  '0110101010110011',
];

const stepDuration = 800; // ms

const LoadingScreen = () => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [systemsOnline, setSystemsOnline] = useState<string[]>([]);
  const [subsystemProgress, setSubsystemProgress] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
    graphics: 0,
    security: 0
  });

  const systems = [
    'NEURAL_NET',
    'QUANTUM_CORE', 
    'CYBER_MATRIX',
    'DATA_STREAM',
    'UI_INTERFACE',
    'FIREWALL_ACTIVE',
    'CRYPTO_LAYER',
    'API_GATEWAY'
  ];

  useEffect(() => {
    if (step < robotText.length - 1) {
      const t = setTimeout(() => setStep(step + 1), stepDuration);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 12, 100);
        return newProgress;
      });
    }, 120);

    const subsystemInterval = setInterval(() => {
      setSubsystemProgress(prev => ({
        cpu: Math.min(prev.cpu + Math.random() * 8, 100),
        memory: Math.min(prev.memory + Math.random() * 6, 100),
        network: Math.min(prev.network + Math.random() * 10, 100),
        graphics: Math.min(prev.graphics + Math.random() * 7, 100),
        security: Math.min(prev.security + Math.random() * 5, 100)
      }));
    }, 200);

    const systemInterval = setInterval(() => {
      setSystemsOnline(prev => {
        if (prev.length < systems.length) {
          const nextSystem = systems[prev.length];
          return [...prev, nextSystem];
        }
        return prev;
      });
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(systemInterval);
      clearInterval(subsystemInterval);
    };
  }, []);

  useEffect(() => {
    const body = document.body;
    body.style.overflow = 'hidden';
    return () => { body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ 
        scale: 0.95,
        opacity: 0,
        filter: "blur(10px)",
        transition: { 
          duration: 1.2,
          ease: "easeInOut"
        }
      }}
      style={{ fontFamily: 'Fira Code, monospace' }}
    >
      {/* Simple Grid Background */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Subtle Background Effects */}
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-500/2 to-transparent"
        animate={{ 
          background: [
            'linear-gradient(135deg, transparent, rgba(0,255,255,0.02), transparent)',
            'linear-gradient(315deg, transparent, rgba(0,255,255,0.02), transparent)',
            'linear-gradient(135deg, transparent, rgba(0,255,255,0.02), transparent)'
          ]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Key Gear Elements - Reduced */}
      {/* Main Vault Gear */}
      <motion.div
        className="absolute top-16 left-16 w-24 h-24 border-3 border-cyan-400/40"
        style={{
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, transparent, rgba(0,255,255,0.2), transparent)'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-4 border border-cyan-300/60 rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </motion.div>

      <motion.div
        className="absolute bottom-16 right-16 w-20 h-20 border-2 border-purple-400/40"
        style={{
          borderRadius: '50%',
          background: 'conic-gradient(from 180deg, transparent, rgba(255,0,255,0.2), transparent)'
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-3 border border-purple-300/60 rounded-full" />
      </motion.div>

      {/* Small accent gears */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`accent-gear-${i}`}
          className="absolute w-12 h-12 border border-blue-400/30 rounded-full"
          style={{
            left: `${20 + i * 25}%`,
            top: `${15 + Math.sin(i) * 10}%`,
            background: `conic-gradient(from ${i * 60}deg, transparent, rgba(0,100,255,0.15), transparent)`
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ 
            duration: 4 + i, 
            repeat: Infinity, 
            ease: "linear",
            delay: i * 0.5
          }}
        />
      ))}

      {/* Additional Unique Gears */}
      {/* Gear with Spokes - Top Right */}
      <motion.div
        className="absolute top-24 right-32 w-18 h-18 border-2 border-green-400/40 rounded-full"
        style={{
          background: 'conic-gradient(from 45deg, transparent, rgba(0,255,100,0.2), transparent)'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-2 border border-green-300/50 rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-green-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        {/* Spokes */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-6 bg-green-400/70"
            style={{
              left: '50%',
              top: '10%',
              transformOrigin: '50% 300%',
              transform: `translateX(-50%) rotate(${i * 60}deg)`
            }}
          />
        ))}
      </motion.div>

      {/* Hexagonal Gear - Left Middle */}
      <motion.div
        className="absolute top-1/2 left-24 w-16 h-16 border-2 border-orange-400/40"
        style={{
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          background: 'conic-gradient(from 0deg, transparent, rgba(255,150,0,0.2), transparent)'
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      >
        <div 
          className="absolute inset-3 border border-orange-300/60"
          style={{
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          }}
        />
      </motion.div>

      {/* Toothed Gear - Bottom Left */}
      <motion.div
        className="absolute bottom-24 left-32 w-20 h-20 border border-pink-400/40 rounded-full relative"
        style={{
          background: 'conic-gradient(from 90deg, transparent, rgba(255,100,200,0.15), transparent)'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-3 border border-pink-300/60 rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-pink-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        {/* Teeth around the gear */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-3 bg-pink-400/60"
            style={{
              left: '50%',
              top: '-6px',
              transformOrigin: '50% 46px',
              transform: `translateX(-50%) rotate(${i * 30}deg)`
            }}
          />
        ))}
      </motion.div>

      {/* Minimal Data Streams */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`data-${i}`}
          className="absolute font-mono text-xs text-cyan-300/30"
          style={{
            left: `${20 + (i * 30)}%`,
            top: '-5%',
          }}
          animate={{ y: ['-5vh', '105vh'] }}
          transition={{
            duration: 12 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        >
          {[...Array(8)].map((_, j) => (
            <div key={j} className="mb-3" style={{ opacity: Math.max(0.1, 0.4 - j * 0.04) }}>
              {binaryStrings[Math.floor(Math.random() * binaryStrings.length)]}
            </div>
          ))}
        </motion.div>
      ))}

      {/* Corner Tech Elements - Simplified */}
      <div className="absolute top-4 left-4 text-cyan-400/60 font-mono text-xs">
        <div>STATUS: ONLINE</div>
        <div>VAULT: ACTIVE</div>
      </div>
      
      <div className="absolute top-4 right-4 text-purple-400/60 font-mono text-xs text-right">
        <div>SECURE</div>
        <div>{Math.round(progress)}%</div>
      </div>

      {/* Subtle Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            background: ['#00ffff', '#ff00ff'][i % 2],
            opacity: 0.3
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-2xl px-8">
        
        {/* Vault Door Effect */}
        <motion.div
          className="relative w-64 h-64 mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {/* Outer Ring */}
          <motion.div
            className="absolute inset-0 border-4 border-cyan-400/50 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Middle Rings */}
          <motion.div
            className="absolute inset-8 border-2 border-purple-400/40 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          <motion.div
            className="absolute inset-16 border border-blue-400/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          {/* Center Hub */}
          <motion.div
            className="absolute inset-24 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full border border-white/20"
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(0,255,255,0.3)",
                "0 0 40px rgba(255,0,255,0.3)",
                "0 0 20px rgba(0,255,255,0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-white tracking-widest text-center"
          initial={{ opacity: 0, y: 30, letterSpacing: '0.1em' }}
          animate={{ 
            opacity: 1, 
            y: 0,
            textShadow: [
              "0 0 10px rgba(0,255,255,0.5)",
              "0 0 20px rgba(255,0,255,0.5)", 
              "0 0 10px rgba(0,255,255,0.5)"
            ]
          }}
          transition={{ 
            delay: 0.8, 
            duration: 1,
            textShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ fontFamily: 'Fira Code, monospace' }}
        >
          MOHAMMED ELSHRIEF
        </motion.h1>

        {/* Status Text */}
        <motion.div
          key={step}
          className="text-xl md:text-2xl font-mono text-cyan-300 text-center min-h-[3em] flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <span className="relative">
            {robotText[step]}
            <motion.span
              className="inline-block w-2 h-6 bg-cyan-400 ml-1"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </span>
        </motion.div>

        {/* Enhanced Progress Bars Section */}
        <div className="w-full max-w-lg space-y-6">
          {/* Main System Progress */}
          <div className="relative">
            <div className="flex justify-between text-sm text-cyan-300 mb-2">
              <span className="font-semibold">VAULT INITIALIZATION</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-900/60 border border-cyan-400/40 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          {/* Subsystem Progress Bars */}
          <div className="grid grid-cols-1 gap-3">
            {/* CPU Progress */}
            <div className="relative">
              <div className="flex justify-between text-xs text-blue-300/80 mb-1">
                <span>CPU_CORES</span>
                <span>{Math.round(subsystemProgress.cpu)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800/60 border border-blue-400/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-300"
                  style={{ width: `${subsystemProgress.cpu}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Memory Progress */}
            <div className="relative">
              <div className="flex justify-between text-xs text-purple-300/80 mb-1">
                <span>MEMORY_BANKS</span>
                <span>{Math.round(subsystemProgress.memory)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800/60 border border-purple-400/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-300"
                  style={{ width: `${subsystemProgress.memory}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Network Progress */}
            <div className="relative">
              <div className="flex justify-between text-xs text-green-300/80 mb-1">
                <span>NETWORK_STACK</span>
                <span>{Math.round(subsystemProgress.network)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800/60 border border-green-400/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-green-300"
                  style={{ width: `${subsystemProgress.network}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Graphics Progress */}
            <div className="relative">
              <div className="flex justify-between text-xs text-yellow-300/80 mb-1">
                <span>GPU_SHADERS</span>
                <span>{Math.round(subsystemProgress.graphics)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800/60 border border-yellow-400/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
                  style={{ width: `${subsystemProgress.graphics}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Security Progress */}
            <div className="relative">
              <div className="flex justify-between text-xs text-red-300/80 mb-1">
                <span>SECURITY_LAYER</span>
                <span>{Math.round(subsystemProgress.security)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800/60 border border-red-400/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 to-red-300"
                  style={{ width: `${subsystemProgress.security}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </div>

          {/* Enhanced System Status Grid */}
          <div className="grid grid-cols-2 gap-2">
            {systems.map((system, index) => (
              <motion.div
                key={system}
                className="flex justify-between items-center text-xs bg-gray-900/40 border border-gray-600/30 rounded p-2"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ 
                  opacity: systemsOnline.includes(system) ? 1 : 0.4, 
                  x: 0,
                  borderColor: systemsOnline.includes(system) ? 'rgba(0,255,255,0.3)' : 'rgba(100,100,100,0.3)'
                }}
                transition={{ delay: index * 0.3 }}
              >
                <span className="text-cyan-300/70 font-mono text-[10px]">{system}</span>
                <motion.span 
                  className={`px-2 py-1 rounded text-[9px] font-mono border ${
                    systemsOnline.includes(system) 
                      ? 'text-green-400 bg-green-400/10 border-green-400/30' 
                      : 'text-gray-400 bg-gray-400/10 border-gray-400/20'
                  }`}
                  animate={{
                    boxShadow: systemsOnline.includes(system) 
                      ? '0 0 8px rgba(0,255,0,0.3)' 
                      : '0 0 0px rgba(0,255,0,0)'
                  }}
                >
                  {systemsOnline.includes(system) ? 'ONLINE' : 'INIT'}
                </motion.span>
              </motion.div>
            ))}
          </div>

          {/* Data Transfer Indicators */}
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-2 text-xs text-cyan-400/70"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span>DATA_STREAM_ACTIVE</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-2 text-xs text-purple-400/70"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            >
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span>SYNC_PROTOCOL</span>
            </motion.div>
          </div>
        </div>

        {/* Loading Spinner */}
        <motion.div
          className="relative w-8 h-8 mt-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 border-2 border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full" />
        </motion.div>

        {/* Access Code */}
        <motion.div
          className="text-center font-mono text-xs text-cyan-400/50 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          ACCESS_CODE: {Math.random().toString(16).substring(2, 10).toUpperCase()}
        </motion.div>
      </div>

      {/* Scanning Line Effect */}
      <motion.div
        className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
        animate={{ y: [0, window.innerHeight, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
};

export default LoadingScreen;
