import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import Spline from '@splinetool/react-spline';
import AuthModal from '../components/AuthModal';

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const splineRef = useRef();
  const containerRef = useRef();

  // Rive heartbeat animation
  const { rive: heartbeatRive, RiveComponent: HeartbeatComponent } = useRive({
    src: 'https://public.rive.app/community/runtime-files/2063-4080-animated-heart.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
    onLoad: () => {
      console.log('💓 Heartbeat animation loaded');
    }
  });

  const heartbeatTrigger = useStateMachineInput(heartbeatRive, 'State Machine 1', 'Trigger 1');

  // Global mouse tracking
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * -2;
        
        setMousePosition({ x, y });
        
        // Continuously update Spline lighting based on cursor position
        const intensity = hoveredSection ? 1.8 : 0.8;
        triggerSplineLight(intensity, { x, y, z: 0.3 });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, [hoveredSection]);

  // Spline interaction handlers
  const handleSplineLoad = (spline) => {
    splineRef.current = spline;
  };

  const triggerSplineLight = (intensity = 1.0, position = { x: 0, y: 0, z: 0 }) => {
    if (splineRef.current) {
      try {
        // Trigger lighting effects in Spline scene
        splineRef.current.setVariable('lightIntensity', intensity);
        splineRef.current.setVariable('lightPositionX', position.x);
        splineRef.current.setVariable('lightPositionY', position.y);
        splineRef.current.setVariable('lightPositionZ', position.z);
        splineRef.current.emitEvent('mouseMove', 'Light Follow');
      } catch (error) {
        console.log('Spline interaction not available');
      }
    }
  };

  const handleSectionHover = (sectionId, event) => {
    setHoveredSection(sectionId);
    
    // Trigger heartbeat on hover
    if (heartbeatTrigger) {
      heartbeatTrigger.fire();
    }
  };

  const handleSectionLeave = () => {
    setHoveredSection(null);
  };

  const handleGetStarted = () => {
    if (heartbeatTrigger) {
      heartbeatTrigger.fire();
    }
    triggerSplineLight(2.5, { x: mousePosition.x, y: mousePosition.y, z: 1 });
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    navigate('/app');
  };

  return (
    <>
      <div 
        ref={containerRef}
        className="relative flex size-full min-h-screen flex-col bg-[#111518] dark group/design-root overflow-x-hidden" 
        style={{
          fontFamily: '"Space Grotesk", "Noto Sans", sans-serif',
          cursor: 'none' // Hide default cursor for custom light effect
        }}
      >
        {/* Custom Cursor Light Effect */}
        <div 
          className="fixed pointer-events-none z-50"
          style={{
            left: `${(mousePosition.x + 1) * 50}%`,
            top: `${(-mousePosition.y + 1) * 50}%`,
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '200px',
            background: `radial-gradient(circle, rgba(0, 255, 136, ${hoveredSection ? 0.15 : 0.08}) 0%, transparent 70%)`,
            borderRadius: '50%',
            transition: 'all 0.1s ease-out',
            filter: 'blur(20px)',
            mixBlendMode: 'screen'
          }}
        />

        {/* Smaller inner cursor glow */}
        <div 
          className="fixed pointer-events-none z-50"
          style={{
            left: `${(mousePosition.x + 1) * 50}%`,
            top: `${(-mousePosition.y + 1) * 50}%`,
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            background: `radial-gradient(circle, rgba(0, 255, 136, ${hoveredSection ? 0.3 : 0.15}) 0%, transparent 70%)`,
            borderRadius: '50%',
            transition: 'all 0.05s ease-out',
            filter: 'blur(5px)'
          }}
        />

        {/* Spline 3D Background Scene */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <Spline 
            scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
            onLoad={handleSplineLoad}
            style={{ 
              width: '100%', 
              height: '100%',
              opacity: 0.6,
              filter: 'blur(0.5px)'
            }}
          />
        </div>

        <div className="layout-container flex h-full grow flex-col relative" style={{ zIndex: 1 }}>
          <header 
            className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#293238] px-10 py-3 backdrop-blur-sm bg-black/20"
            onMouseEnter={(e) => handleSectionHover('header', e)}
            onMouseLeave={handleSectionLeave}
          >
            {/* Header content with enhanced glow on hover */}
            <div className="flex items-center gap-4 text-white">
              <div className="size-8 relative">
                <HeartbeatComponent 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    filter: hoveredSection === 'header' 
                      ? 'drop-shadow(0 0 15px rgba(255, 107, 107, 0.9))' 
                      : 'drop-shadow(0 0 8px rgba(255, 107, 107, 0.6))',
                    transition: 'filter 0.3s ease'
                  }} 
                />
              </div>
              <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">StreakMaster</h2>
            </div>
            
            <div className="flex flex-1 justify-end gap-8">
              <div className="flex items-center gap-9">
                <a 
                  className="text-white text-sm font-medium leading-normal hover:text-[#00ff88] transition-colors" 
                  href="#"
                  onMouseEnter={(e) => handleSectionHover('nav-features', e)}
                >Features</a>
                <a 
                  className="text-white text-sm font-medium leading-normal hover:text-[#00ff88] transition-colors" 
                  href="#"
                  onMouseEnter={(e) => handleSectionHover('nav-pricing', e)}
                >Pricing</a>
                <a 
                  className="text-white text-sm font-medium leading-normal hover:text-[#00ff88] transition-colors" 
                  href="#"
                  onMouseEnter={(e) => handleSectionHover('nav-support', e)}
                >Support</a>
              </div>
              <button
                onClick={handleGetStarted}
                onMouseEnter={(e) => handleSectionHover('header-cta', e)}
                onMouseLeave={handleSectionLeave}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1993e5] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#1780cc] transition-all duration-300"
                style={{
                  boxShadow: hoveredSection === 'header-cta' 
                    ? '0 0 25px rgba(25, 147, 229, 0.6), 0 0 50px rgba(25, 147, 229, 0.3)' 
                    : 'none'
                }}
              >
                <span className="truncate">Get Started</span>
              </button>
            </div>
          </header>
          
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="@container">
                <div className="@[480px]:p-4">
                  <div
                    className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-4 relative"
                    style={{backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAHPODukI1rSqT7z_s__qASP8QvtFdUqXsbCVewunmjKHoQfYpWm_xgaZbmkFZxUwGmsMw4uLl71CYUtZsYiikDhmDpNFCSHRwuUuJX1hP4dVcikSKM4a6Yaa8iqyqrNtzFht3guQWth8KQs4FUCt2hJf9vgXMpcGmL0xn2RR1Ua0XPKlhh5Jm6fXwN8vAPACEPKd673OGTis2a2FqbnB2qoO_9ieiuOQt1DSdf5XjlbLKpdim9olN_0lzf_5Ck43WndaRcjPEIYBw")'}}
                    onMouseEnter={(e) => handleSectionHover('hero', e)}
                    onMouseLeave={handleSectionLeave}
                  >
                    {/* Dynamic lighting overlay that follows cursor */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at ${(mousePosition.x + 1) * 50}% ${(-mousePosition.y + 1) * 50}%, rgba(0, 255, 136, ${hoveredSection === 'hero' ? 0.2 : 0.1}) 0%, transparent 60%)`,
                        transition: 'background 0.1s ease-out',
                        zIndex: 1
                      }}
                    />

                    {/* Large heartbeat animation */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none"
                      style={{ zIndex: 2 }}
                    >
                      <HeartbeatComponent 
                        style={{ 
                          width: '300px', 
                          height: '300px',
                          filter: hoveredSection === 'hero'
                            ? 'drop-shadow(0 0 50px rgba(255, 107, 107, 1.0))'
                            : 'drop-shadow(0 0 30px rgba(255, 107, 107, 0.8))',
                          transition: 'filter 0.3s ease'
                        }} 
                      />
                    </div>

                    <div className="flex flex-col gap-2 text-center relative" style={{ zIndex: 3 }}>
                      <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                        Master Your Habits, Conquer Your Goals
                      </h1>
                      <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                        StreakMaster is your personal command center for habit tracking. With a futuristic interface, advanced analytics, and gamification features, you'll stay motivated and achieve your goals like never before.
                      </h2>
                    </div>
                    
                    {/* Interactive CTA button with enhanced effects */}
                    <div className="relative">
                      <button
                        onClick={handleGetStarted}
                        onMouseEnter={(e) => {
                          handleSectionHover('hero-cta', e);
                        }}
                        onMouseLeave={handleSectionLeave}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#1993e5] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-[#1780cc] transition-all duration-300 relative"
                        style={{ 
                          zIndex: 4,
                          boxShadow: hoveredSection === 'hero-cta' 
                            ? '0 0 30px rgba(25, 147, 229, 0.8), 0 0 60px rgba(25, 147, 229, 0.4)' 
                            : 'none',
                          transform: hoveredSection === 'hero-cta' ? 'scale(1.05)' : 'scale(1)'
                        }}
                      >
                        <div className="absolute left-3 w-4 h-4">
                          <HeartbeatComponent 
                            style={{ 
                              width: '100%', 
                              height: '100%',
                              filter: 'brightness(0) invert(1)'
                            }} 
                          />
                        </div>
                        <span className="truncate ml-6">Get Started</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features section with cursor-following light */}
              <div className="flex flex-col gap-10 px-4 py-10 @container">
                <div className="flex flex-col gap-4">
                  <h1 className="text-white tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                    Experience the Future of Habit Tracking
                  </h1>
                  <p className="text-white text-base font-normal leading-normal max-w-[720px]">
                    StreakMaster combines a sleek, futuristic interface with powerful features to help you build and maintain positive habits.
                  </p>
                </div>
                
                <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
                  {[
                    {
                      id: 'feature-1',
                      title: 'Futuristic Command Center',
                      description: 'Track your habits in a visually stunning interface that feels like controlling your own personal command center.',
                      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZjDkBjxewdRGTuuQ7S0o6T0RBpZpnoX14ZPwkovmsqt68y6z_Hf1zLPTMlrlp11eFU7O5yFpGPjiZrbO8yUwgUdF9cF5e5j--Hum6y9fZEczkzDtuXZrDnCqWnnQ0ZOJscs_5FzKD0ziRmrMusprh1nZKJvLma2ljYq7bqHR5pzQTBADFRPbTgXzj2pRiUV_iuYc_WhHiNHn5aRgXXk6sQo_J__HrgmVQTzYwwFQA0Ngjq1RYSnlb-Q7V5_29rLtj0fXrG0qDs0M'
                    },
                    {
                      id: 'feature-2', 
                      title: 'Advanced Analytics',
                      description: 'Gain deep insights into your habit progress with detailed analytics and visualizations.',
                      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3tofWluDm835P205ClgXNvZglLxj1A9-DMsL31sIaMDEkY1YwnOCiNfMsxqwo0U4UqBSKdUJSUG4vWVJxrMBAKMNGNFjzTTNWkIg0KED0_0aeQrhEwI_Kf3Wc-sh6vKheQlQWtlxyTKfHehu8CI2mYu56KZDbKN8Qr8oY6LKjAKmDfMw0s4hnVLPct5N4hkuPrHFPjB8QVWJdGis4U-W8tRmrJrFCcPuwxa4fPgfvvizeepQjx66U5mQfQP0R7wkgacih8pBknL4'
                    },
                    {
                      id: 'feature-3',
                      title: 'Gamified Habit Tracking', 
                      description: 'Turn habit building into a fun and rewarding game with challenges, streaks, and achievements.',
                      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWqdcK-i7qBdvQy5v11ebq94Rx0N0zBj3EGDagU8ggbq7J9EF8r2_dqI3o5oFSZdCX1O_xiulJS7S4NVPzyBL1CBI3yfhIy7Cvq5Caqb5Rrk5luqy5pjtEq-EgjysHm5B8S1OTEakVoX-CfPzvquunQdrauFOgw-tZ9DbT5pqAE5BGuFNZyahZ2w7-kjx85eDvyucQQgZbl7rqy5jO_a2Ct0h22LGvjm89kv-i3LiCnrGRl8GiAbu90dgJo447XyqL2OXiiCC8VK0'
                    }
                  ].map((feature, index) => (
                    <div 
                      key={feature.id}
                      className="flex flex-col gap-3 pb-3"
                      onMouseEnter={(e) => handleSectionHover(feature.id, e)}
                      onMouseLeave={handleSectionLeave}
                    >
                      <div
                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg relative overflow-hidden transition-all duration-300"
                        style={{
                          backgroundImage: `url("${feature.image}")`,
                          transform: hoveredSection === feature.id ? 'scale(1.02)' : 'scale(1)',
                          boxShadow: hoveredSection === feature.id 
                            ? '0 0 30px rgba(0, 255, 136, 0.4), 0 0 60px rgba(0, 255, 136, 0.2)' 
                            : 'none'
                        }}
                      >
                        {/* Dynamic light overlay that follows cursor */}
                        <div 
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at ${(mousePosition.x + 1) * 50}% ${(-mousePosition.y + 1) * 50}%, rgba(0, 255, 136, ${hoveredSection === feature.id ? 0.25 : 0.1}) 0%, transparent 70%)`,
                            transition: 'background 0.1s ease-out'
                          }}
                        />
                        
                        {/* Floating heartbeat for first feature */}
                        {index === 0 && (
                          <div className="absolute top-2 right-2 w-6 h-6 opacity-80">
                            <HeartbeatComponent 
                              style={{ 
                                width: '100%', 
                                height: '100%',
                                filter: hoveredSection === feature.id
                                  ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 1.0))'
                                  : 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
                                transition: 'filter 0.3s ease'
                              }} 
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white text-base font-medium leading-normal">{feature.title}</p>
                        <p className="text-[#9daeb8] text-sm font-normal leading-normal">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final CTA section */}
              <div className="@container">
                <div 
                  className="flex flex-col justify-end gap-6 px-4 py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20"
                  onMouseEnter={(e) => handleSectionHover('final-cta', e)}
                  onMouseLeave={handleSectionLeave}
                >
                  <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-white tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
                      Ready to Take Control of Your Habits?
                    </h1>
                    <p className="text-white text-base font-normal leading-normal max-w-[720px]">Join thousands of users who are transforming their lives with StreakMaster.</p>
                  </div>
                  <div className="flex flex-1 justify-center">
                    <div className="flex justify-center">
                      <button
                        onClick={handleGetStarted}
                        onMouseEnter={(e) => handleSectionHover('final-button', e)}
                        onMouseLeave={handleSectionLeave}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#1993e5] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] grow hover:bg-[#1780cc] transition-all duration-300 relative"
                        style={{
                          boxShadow: hoveredSection === 'final-button' 
                            ? '0 0 40px rgba(25, 147, 229, 0.8), 0 0 80px rgba(25, 147, 229, 0.4)' 
                            : 'none',
                          transform: hoveredSection === 'final-button' ? 'scale(1.05)' : 'scale(1)'
                        }}
                      >
                        <div className="absolute left-4 w-5 h-5">
                          <HeartbeatComponent 
                            style={{ 
                              width: '100%', 
                              height: '100%',
                              filter: 'brightness(0) invert(1)'
                            }} 
                          />
                        </div>
                        <span className="truncate ml-8">Get Started</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="flex justify-center backdrop-blur-sm bg-black/10">
            <div className="flex max-w-[960px] flex-1 flex-col">
              <footer 
                className="flex flex-col gap-6 px-5 py-10 text-center @container"
                onMouseEnter={(e) => handleSectionHover('footer', e)}
                onMouseLeave={handleSectionLeave}
              >
                <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
                  <a className="text-[#9daeb8] text-base font-normal leading-normal min-w-40 hover:text-[#00ff88] transition-colors" href="#">Privacy Policy</a>
                  <a className="text-[#9daeb8] text-base font-normal leading-normal min-w-40 hover:text-[#00ff88] transition-colors" href="#">Terms of Service</a>
                  <a className="text-[#9daeb8] text-base font-normal leading-normal min-w-40 hover:text-[#00ff88] transition-colors" href="#">Contact Us</a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4">
                    <HeartbeatComponent 
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        filter: hoveredSection === 'footer'
                          ? 'drop-shadow(0 0 8px rgba(157, 174, 184, 0.9))'
                          : 'drop-shadow(0 0 4px rgba(157, 174, 184, 0.6))',
                        transition: 'filter 0.3s ease'
                      }} 
                    />
                  </div>
                  <p className="text-[#9daeb8] text-base font-normal leading-normal">© 2024 StreakMaster. Built with ❤️ for healthy habits.</p>
                </div>
              </footer>
            </div>
          </footer>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}