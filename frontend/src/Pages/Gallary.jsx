import React, { useEffect, useState } from 'react'
import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"

const Gallery = () => {
  const [galleryData, setGalleryData] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("http://localhost:5000/api/events/display");
      const data = await response.json();
      if (response.ok) {
        setGalleryData(data.events);
      } else {
        toast.error(data.message);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-10">Photo Gallery</h2>

        {galleryData.map((section, index) => (
          <div key={index} className="mb-12">
            {section.images1.length != 0 && <h3 className="text-2xl font-semibold text-blue-800 mb-6">{section.eventName}</h3>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {section.images1.map((photo, idx) => (
                <img
                  key={idx}
                  src={"http://localhost:5000" + photo}
                  alt={`${section.eventName} ${idx + 1}`}
                  className="rounded-lg shadow-lg object-cover h-60 w-full hover:scale-105 transition duration-300"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}

export default Gallery
