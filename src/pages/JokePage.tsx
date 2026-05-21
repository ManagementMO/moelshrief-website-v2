
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FuturisticButton } from "@/components/ui/futuristic-button";
import { Brain, RefreshCw } from "lucide-react";

const dataJokes = [
  "Why did the data scientist get kicked out of the bar? Because he kept trying to spike everyone's drinks with outliers!",
  "I'm reading a book on anti-gravity. It's impossible to put down!",
  "Why don't scientists trust atoms? Because they make up everything!",
  "What's a data scientist's favorite type of music? Algorithm!",
  "Why did the database administrator leave his wife? She had one-to-many relationships.",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "What do you call fake spaghetti? An impasta!",
  "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
  "Why is 6 afraid of 7? Because 7, 8, 9!"
];

const JokePage = () => {
  const [joke, setJoke] = useState("");
  const [showPunchline, setShowPunchline] = useState(false);
  
  const getRandomJoke = () => {
    const randomIndex = Math.floor(Math.random() * dataJokes.length);
    const selectedJoke = dataJokes[randomIndex];
    setJoke(selectedJoke);
    setShowPunchline(false);
    
    // Show punchline after a delay
    setTimeout(() => {
      setShowPunchline(true);
    }, 2000);
  };
  
  useEffect(() => {
    getRandomJoke();
  }, []);
  
  const jokeLines = joke.split('?');
  const hasQuestion = jokeLines.length > 1;
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative p-4">
      {/* Background gradient */}
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-futuristic-dark via-background to-futuristic-dark/80 z-0"></div>
      
      {/* Floating data elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute text-futuristic-purple/10"
            initial={{ 
              opacity: 0,
              top: `${Math.random() * 100}vh`,
              left: '-100px',
              fontSize: `${20 + Math.random() * 40}px`,
            }}
            animate={{
              opacity: [0, 0.3, 0],
              left: '120vw',
            }}
            transition={{
              duration: 15 + Math.random() * 30,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: "linear"
            }}
          >
            {Math.random() > 0.5 ? '01' : Math.random() > 0.5 ? '10' : '{}'} 
          </motion.div>
        ))}
      </div>
      
      {/* Content */}
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <motion.div 
              className="inline-block p-4 rounded-full bg-futuristic-purple/20 mb-4"
              animate={{ 
                boxShadow: [
                  "0 0 0 rgba(155, 135, 245, 0.4)",
                  "0 0 20px rgba(155, 135, 245, 0.6)",
                  "0 0 0 rgba(155, 135, 245, 0.4)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Brain size={48} className="text-futuristic-purple" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">You Found The Secret Joke Page!</h1>
            <p className="text-xl text-muted-foreground">A little humor for the data-minded...</p>
          </div>
        </motion.div>
        
        <motion.div
          className="glass-effect p-8 rounded-2xl relative overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Decorative elements */}
          <motion.div 
            className="absolute -top-20 -right-20 w-40 h-40 bg-futuristic-purple/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="relative min-h-[150px] flex flex-col items-center justify-center">
            {hasQuestion ? (
              <>
                <motion.p 
                  className="text-2xl font-medium mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={joke + "question"}
                >
                  {jokeLines[0]}?
                </motion.p>
                
                <AnimatePresence mode="wait">
                  {showPunchline && (
                    <motion.p 
                      className="text-2xl font-medium text-futuristic-purple"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      key={joke + "answer"}
                    >
                      {jokeLines[1]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <motion.p 
                className="text-2xl font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={joke}
              >
                {joke}
              </motion.p>
            )}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <FuturisticButton 
            variant="primary" 
            size="lg" 
            glowEffect
            onClick={getRandomJoke}
            className="flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Another Joke
          </FuturisticButton>
          
          <FuturisticButton 
            variant="outline" 
            onClick={() => window.location.href = "/"}
          >
            Back to Portfolio
          </FuturisticButton>
        </motion.div>
      </div>
    </div>
  );
};

export default JokePage;
