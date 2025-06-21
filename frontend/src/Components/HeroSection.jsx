import React, { useEffect, useState } from 'react';

const HeroSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        {
            src: './frontendimage1.jpg',
            alt: 'વૈષ્ણવ વણિક સમાજ સમૂહ ફોટો ૧'
        },
        {
            src: './frontendimage2.jpg',
            alt: 'વૈષ્ણવ વણિક સમાજ સમૂહ ફોટો ૨'
        },
        {
            src: './frontendimage3.jpg',
            alt: 'વૈષ્ણવ વણિક સમાજ સમૂહ ફોટો ૩'
        },
    ];

    // Auto-scrolling effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 overflow-hidden">
            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-8 py-16 md:py-16 flex flex-col lg:flex-col items-center">
                {/*  Image Content */}
                <div className="w-full mb-12 lg:mb-12 lg:pr-12">
                    <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
                            </div>
                        ))}

                        {/* Overlay Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <div className="bg-black/50 backdrop-blur-sm p-4 rounded-lg">
                                <p className="text-lg font-medium">
                                    "સમાજ મારો ને હું સમાજનો, એવી ભાવના અને સમર્પણ"
                                </p>
                                <p className="mt-2">
                                    પ્રગતિશીલ રહેશે સમગ્ર સમાજ તોજ આપણો સમાજ, બની રહેશે "વૈષ્ણવ વણિક સમાજ"
                                </p>
                            </div>
                        </div>

                        {/* Navigation Dots */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Text Gallery */}
                <div className="w-full relative">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-900 mb-6 leading-tight">
                        <span className="text-2xl md:text-3xl text-indigo-700">આત્મીય જ્ઞાતિ પરિવાર સ્વજનો</span>
                    </h1>

                    <div className="prose prose-lg text-gray-700 mb-8">
                        <p className="font-medium">
                            વૈષ્ણવ વણિક સમાજ, આણંદનો 1976 માં આદ્ય સ્થાપકોની દીર્ઘ દ્રષ્ટિથી ઉદભવ થયો.
                        </p>

                        <div className="bg-indigo-100 p-4 rounded-lg border-l-4 border-indigo-500 my-4">
                            <p>
                                સંસ્થાની ગતિશીલતા તેના સભ્યોને આધીન છે. સંસ્થા એક નાવ છે અને સદસ્યો એ યાત્રી છે.
                                નાવ ચલાવવા સુકાની સક્ષમ અને કાર્યરત રહે તે ખુબ જરૂરી છે.
                            </p>
                        </div>

                        <p>
                            સમાજના ત્રણ અક્ષરોમાં 'સં' = સરળ સંસ્થા, 'મા' = મારી સંસ્થા, 'જ' = જવાબદારી -
                            ત્રિસુત્રી સંસ્થા છે.
                        </p>
                    </div>

                </div>
            </div>

            {/* Multiple Wave Decorations at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor" className="text-indigo-200"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor" className="text-indigo-100"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor" className="text-indigo-50"></path>
                </svg>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 -mt-10">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".15" fill="currentColor" className="text-indigo-300"></path>
                </svg>
            </div>
        </div>
    );
};

export default HeroSection;