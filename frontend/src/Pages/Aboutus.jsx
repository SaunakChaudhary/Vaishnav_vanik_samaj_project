import React, { useEffect } from 'react'
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Users, Award, Heart, BookOpen, Briefcase, Calendar, Star, ChevronRight } from 'lucide-react';

const Aboutus = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const activities = [
        { text: "તેજસ્વી તારલા સન્માન સમારંભ", icon: Award },
        { text: "જીવન સાથી સંમેલન", icon: Heart },
        { text: "યુવાવિકાસ તથા સંસ્કૃતિક પ્રવૃતિઓ", icon: Users },
        { text: "ધાર્મિક વ્યાખ્યાનો", icon: BookOpen },
        { text: "બેરોજગારોને રોજગાર કાર્યક્રમ", icon: Briefcase },
        { text: "મહિલા ઉત્કર્ષ પ્રવૃતિઓ", icon: Star },
        { text: "રમત ગમત સ્પર્ધાઓ", icon: Users },
        { text: "શરદોત્સવ કાર્યક્રમ", icon: Calendar },
        { text: "દિવાળી સ્નેહમિલન સમારંભ", icon: Heart },
        { text: "વિદ્યાર્થીઓને અભ્યાસકીય માર્ગદર્શન", icon: BookOpen },
        { text: "વરિષ્ટ નાગરિકોનું સન્માન", icon: Award },
        { text: "મહાપૃભુજી પ્રગટ્ય મહોત્સવ", icon: Star },
        { text: "તબીબી તપાસ", icon: Heart },
        { text: "વાર્ષિક સભા", icon: Calendar }
    ];

    const helpWays = [
        "સમાજના આજીવન સભ્ય બનીને આણંદમાં વસતા વૈષ્ણવ વણિક જ્ઞાતિબંધુઓને સમાજમાં આજીવન સભ્યપદ અપાવીને",
        "સમાજ દ્વારા આયોજિત દરેક કાર્યક્રમોમાં ઉત્સાહપૂર્વક ભાગ લઈને",
        "સમાજ દ્વારા સમાજ સેવાના સેવાના હેતુસર આપના વ્યવસાયની જાહેરખબર આપીને",
        "સમાજનો પરિપત્ર આપને મળી રહે તે માટે રહેઠાણ બદલાતાં સરનામાની લેખિત જાણ કરીને",
        "સમાજના કાર્યકરોને હુફાળો સાથ સહકાર આપીને",
        "સમાજને આપના રચનાત્મક સૂચનો મોકલાવીને",
        "આપના કૌશલ્ય સમાજમાં ઉપયોગી થાય તે માટે સેવા આપીને",
        "સ્ત્રી કેળવણી પ્રોત્સાહન અને અગ્રીમતા આપીને",
        "જુદા જુદા ક્ષેત્રનાં નિષ્ણાત મહુનુભાવોનાં સેમીનાર ગોઠવીને તથા સભ્યોને માર્ગદર્શન પરૂં પાડીને",
        "રમત ગમત પ્રવૃત્તિ તથા વકતૃત્વ શક્તિ ખીલતી, જ્ઞાતિબંધુઓંને સર્વાંગી વિકાસ સાધીને",
        "શૈક્ષણિક ક્ષેત્રે સર્વાંગી વિકાસ સાધવા સમાજ તરફથી તમામ પ્રયત્નો કરીને",
        "શૈક્ષણિક ક્ષેત્રે ઉચ્ચ ગુણ મેળવનાર તેજસ્વી તારલાઓનું સન્માન કરીને તથા શૈક્ષણિક ફંડમાં ઉદાર હાથે ફાળો આપીને",
        "સમાજમાં રહેલા બેરોજગાર યુવક યુવતીઓને રોજગાર અપાવીને",
        "ભારતીય સંસ્કૃતિની પરંપરા પ્રમાણે ઉત્સવ કરીને",
        "સંપ, સાહસિક અને સંગઠન ત્રિવેણી સંગમનો સમન્વય કરીને",
        "વિદ્યા ધન, સમય ધન, આર્થિક ધન આપી સમાજનું ઋણ ચૂકવીને"
    ];

    const galleryImages = [
        "./galary-img1.jpg",
        "./galary-img2.jpg",
        "./galary-img3.jpg",
        "./galary-img4.jpg",
        "./galary-img5.jpg",
        "./galary-img1.jpg"
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            {/* Activities Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-left mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">સમાજની પ્રવૃત્તિઓ</h2>
                        <p className="text-slate-600">Our community activities and programs</p>
                        <div className="w-24 h-1 bg-slate-300 mt-4"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activities.map((activity, index) => {
                            const IconComponent = activity.icon;
                            return (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 hover:border-amber-300">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <IconComponent className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">{activity.text}</h3>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-left mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">Gallery</h2>
                        <p className="text-slate-600">Moments from our community events</p>
                        <div className="w-24 h-1 bg-slate-300 mt-4"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {galleryImages.map((image, index) => (
                            <div key={index} className="relative group overflow-hidden rounded-lg aspect-square">
                                <img
                                    src={image}
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Help Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-left mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">સમાજ માં તમે કેવી રીતે મદદ કરી શકો?</h2>
                        <p className="text-slate-600">Ways you can contribute to our community</p>
                        <div className="w-24 h-1 bg-slate-300 mt-4"></div>
                    </div>

                    <div className="space-y-4">
                        {helpWays.map((way, index) => (
                            <div key={index} className="flex items-start">
                                <span className="text-amber-600 font-medium mr-3">{index + 1}.</span>
                                <p className="text-slate-700">{way}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Aboutus