import connectDB from "@/lib/db";
import Feature from "@/models/Feature";

// Data fetch function (Server Component capability)
async function getFeatures() {
  await connectDB();
  // Lean() use karte hain taaki plain JS object mile, jo fast hota hai
  const features = await Feature.find({}).lean();
  return features;
}

export default async function Features() {
  // Database se data yahan aayega
  const features = await getFeatures();

  return (
    // Outer Container: Mobile py-12, PC py-32 (Design intact)
    <div className="bg-black py-12 sm:py-32 relative overflow-hidden">
      
      {/* 1. Futuristic Cyber Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      ></div>
      
      {/* 2. Floating Neon Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-1000"></div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-20">
          <div className="inline-flex items-center justify-center p-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-4 backdrop-blur-md">
             <span className="px-4 py-1 text-xs font-bold text-yellow-400 uppercase tracking-widest">Why Choose LearnR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">English Learning</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-gray-400 mx-auto font-light">
            Experience a tech-enabled ecosystem designed to accelerate your fluency.
          </p>
        </div>

        {/* Futuristic Cards Grid - Loop through Database Data */}
        <div className="grid grid-cols-1 gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.length > 0 ? (
            features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_-5px_rgba(234,179,8,0.3)]"
              >
                
                {/* --- NEON GRADIENT ANIMATIONS --- */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                <div className="absolute inset-0 border border-transparent group-hover:border-yellow-500/30 rounded-3xl transition-colors duration-500 z-10"></div>
                {/* --- END ANIMATIONS --- */}


                {/* Content */}
                <div className="relative z-20">
                    {/* Corner Accents */}
                    <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-gradient-to-br from-transparent to-white/5 rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Icon Container */}
                    <div className="relative mb-4 sm:mb-6 inline-block">
                       <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-300"></div>
                       <div className="relative flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-500 text-black shadow-lg shadow-yellow-500/20 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          {/* DB se SVG string aayegi. 
                              Use 'dangerouslySetInnerHTML' to render SVG string properly.
                          */}
                          <div dangerouslySetInnerHTML={{ __html: feature.iconSvg }} />
                       </div>
                    </div>
                    
                    {/* Text Content */}
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-yellow-400 transition-colors duration-300 drop-shadow-sm">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-light group-hover:text-gray-200 transition-colors">
                      {feature.description}
                    </p>
                </div>

                {/* Bottom Line Animation */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700 group-hover:w-full z-20"></div>
              </div>
            ))
          ) : (
            <p className="text-white text-center col-span-3">No features found. Please run the seed script.</p>
          )}
        </div>
      </div>
    </div>
  );
}