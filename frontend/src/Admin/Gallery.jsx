import React, { useEffect, useState } from 'react';
import { Camera, Plus, ArrowLeft, Image, Calendar, Upload, Trash2, Download, X, Eye } from 'lucide-react';
import Slidebar from '../Components/Slidebar';
import { toast } from "react-hot-toast";
import { Riple } from "react-loading-indicators";

const EventGalleryApp = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [currentView, setCurrentView] = useState('main');
    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [viewPhotosEvent, setViewPhotosEvent] = useState(null);
    const [pendingImages, setPendingImages] = useState({});
    const [selectedImages, setSelectedImages] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:5000/api/events/display");
                const data = await response.json();
                if (response.ok) {
                    setEvents(data.events);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error("Failed to fetch events");
                console.error("Error fetching events:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleAddImages = (gallery, eventId, files) => {
        const fileArray = Array.from(files);
        const imageUrls = fileArray.map(file => URL.createObjectURL(file));

        const pendingKey = `${gallery}_${eventId}`;
        setPendingImages(prev => ({
            ...prev,
            [pendingKey]: [...(prev[pendingKey] || []), ...fileArray]
        }));

        setEvents(prevEvents =>
            prevEvents.map(event =>
                event._id === eventId
                    ? {
                        ...event,
                        [gallery === 'gallery1' ? 'images1' : 'images2']: [
                            ...(gallery === 'gallery1' ? event.images1 || [] : event.images2 || []),
                            ...imageUrls
                        ]
                    }
                    : event
            )
        );
    };

    const handleSave = async (gallery) => {
        setIsLoading(true);
        try {
            for (const event of events) {
                const pendingKey = `${gallery}_${event._id}`;
                const eventPendingImages = pendingImages[pendingKey];

                if (eventPendingImages && eventPendingImages.length > 0) {
                    const formData = new FormData();
                    formData.append('eventId', event._id);
                    formData.append('gallery', gallery);

                    eventPendingImages.forEach((file, index) => {
                        formData.append('images', file);
                    });

                    const response = await fetch(`http://localhost:5000/api/events/upload-images`, {
                        method: 'POST',
                        body: formData,
                    });

                    const result = await response.json();

                    if (response.ok) {
                        toast.success(`Images uploaded successfully for ${event.eventName}`);
                        setPendingImages(prev => {
                            const newPending = { ...prev };
                            delete newPending[pendingKey];
                            return newPending;
                        });
                    } else {
                        toast.error(result.message || 'Failed to upload images');
                    }
                }
            }
        } catch (error) {
            toast.error('Failed to save images');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteImages = async (gallery, eventId, imageUrls) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/events/delete-images`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventId,
                    gallery,
                    imageUrls
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setEvents(prevEvents =>
                    prevEvents.map(event =>
                        event._id === eventId
                            ? {
                                ...event,
                                [gallery === 'gallery1' ? 'images1' : 'images2']:
                                    (gallery === 'gallery1' ? event.images1 || [] : event.images2 || [])
                                        .filter(img => !imageUrls.includes(img))
                            }
                            : event
                    )
                );

                setSelectedImages([]);
                setIsSelectionMode(false);
                toast.success(`${imageUrls.length} image(s) deleted successfully`);
                setViewPhotosEvent(null);
            } else {
                toast.error(result.message || 'Failed to delete images');
            }
        } catch (error) {
            toast.error('Failed to delete images');
            console.error('Delete error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadImages = async (imageUrls, eventName) => {
        try {
            for (let i = 0; i < imageUrls.length; i++) {
                const imageUrl = imageUrls[i];
                const response = await fetch(imageUrl);
                const blob = await response.blob();

                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${eventName}_image_${i + 1}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                if (i < imageUrls.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            toast.success(`${imageUrls.length} image(s) downloaded successfully`);
            setSelectedImages([]);
            setIsSelectionMode(false);
        } catch (error) {
            toast.error('Failed to download images');
            console.error('Download error:', error);
        }
    };

    const toggleImageSelection = (imageUrl) => {
        setSelectedImages(prev =>
            prev.includes(imageUrl)
                ? prev.filter(url => url !== imageUrl)
                : [...prev, imageUrl]
        );
    };

    const GalleryPage = ({ gallery }) => {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {gallery === 'gallery1' ? 'Event Gallery 1' : 'Event Gallery 2'}
                            </h1>
                            <p className="text-gray-600 mt-1">Manage and organize your event photos</p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => setCurrentView('main')}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Back</span>
                            </button>
                            <button
                                onClick={() => handleSave(gallery)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <span className="hidden sm:inline">Save</span> Changes
                            </button>
                        </div>
                    </div>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {events.map(event => (
                            <div
                                key={event._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{event.eventName}</h3>
                                    
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        {(gallery === 'gallery1' ? event.images1 : event.images2)?.length > 0 ? (
                                            (gallery === 'gallery1' ? event.images1 : event.images2)
                                                .slice(0, 3)
                                                .map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img.charAt(0) === "/" ? "http://localhost:5000" + img : img}
                                                        alt={`Event ${event.eventName} photo ${idx + 1}`}
                                                        className="w-full h-20 object-cover rounded"
                                                    />
                                                ))
                                        ) : (
                                            <div className="col-span-3 h-20 bg-gray-100 rounded flex items-center justify-center">
                                                <Camera className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => setSelectedEvent({ ...event, gallery })}
                                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                        >
                                            <Upload className="w-4 h-4" />
                                            <span>Add Photos</span>
                                        </button>

                                        <button
                                            onClick={() => setViewPhotosEvent({ ...event, gallery })}
                                            className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>View All</span>
                                        </button>
                                    </div>

                                    {pendingImages[`${gallery}_${event._id}`] && (
                                        <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                            {pendingImages[`${gallery}_${event._id}`].length} unsaved photos
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Images Modal */}
                    {selectedEvent && selectedEvent.gallery === gallery && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Add Photos to {selectedEvent.eventName}
                                        </h3>
                                        <button
                                            onClick={() => setSelectedEvent(null)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                                        <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                                        <p className="text-gray-600 mb-2">Drag & drop photos here</p>
                                        <p className="text-sm text-gray-500 mb-4">or</p>
                                        <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                                            Browse Files
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        handleAddImages(gallery, selectedEvent._id, e.target.files);
                                                        setSelectedEvent(null);
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View Photos Modal */}
                    {viewPhotosEvent && viewPhotosEvent.gallery === gallery && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                                <div className="p-4 sm:p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                            {viewPhotosEvent.eventName} Photos
                                        </h3>
                                        <button
                                            onClick={() => {
                                                setViewPhotosEvent(null);
                                                setIsSelectionMode(false);
                                                setSelectedImages([]);
                                            }}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="bg-gray-50 p-3 rounded-lg mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setIsSelectionMode(!isSelectionMode);
                                                    setSelectedImages([]);
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${isSelectionMode
                                                    ? 'bg-gray-700 text-white'
                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {isSelectionMode ? 'Cancel' : 'Select Photos'}
                                            </button>
                                            {isSelectionMode && selectedImages.length > 0 && (
                                                <span className="text-sm text-gray-600">
                                                    {selectedImages.length} selected
                                                </span>
                                            )}
                                        </div>

                                        {isSelectionMode && selectedImages.length > 0 && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDownloadImages(selectedImages, viewPhotosEvent.eventName)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Delete ${selectedImages.length} selected photos?`)) {
                                                            handleDeleteImages(gallery, viewPhotosEvent._id, selectedImages);
                                                        }
                                                    }}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Photos Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {(gallery === 'gallery1' ? viewPhotosEvent.images1 : viewPhotosEvent.images2)?.length > 0 ? (
                                            (gallery === 'gallery1' ? viewPhotosEvent.images1 : viewPhotosEvent.images2).map((img, index) => (
                                                <div
                                                    key={index}
                                                    className={`relative group rounded-lg overflow-hidden ${isSelectionMode ? 'cursor-pointer' : ''} ${selectedImages.includes(img) ? 'ring-2 ring-blue-500' : ''}`}
                                                    onClick={() => isSelectionMode && toggleImageSelection(img)}
                                                >
                                                    <img
                                                        src={img.charAt(0) === "/" ? "http://localhost:5000" + img : img}
                                                        alt={`Photo ${index + 1}`}
                                                        className="w-full h-40 object-cover"
                                                    />
                                                    {isSelectionMode && (
                                                        <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedImages.includes(img)
                                                            ? 'bg-blue-500 border-blue-500'
                                                            : 'bg-white border-gray-300'
                                                            }`}
                                                        >
                                                            {selectedImages.includes(img) && (
                                                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-8 text-gray-500">
                                                No photos available
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const MainPage = () => (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8">
            <div className="max-w-3xl mx-auto text-center">
                <div className="mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white shadow-md rounded-full mb-4 sm:mb-6">
                        <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">Event Gallery</h1>
                    <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                        Organize and showcase your event memories with our professional gallery system
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                    <button
                        onClick={() => setCurrentView('gallery1')}
                        className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-medium text-lg transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                        <Calendar className="w-5 h-5" />
                        <span>Gallery 1</span>
                    </button>

                    <button
                        onClick={() => setCurrentView('gallery2')}
                        className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-medium text-lg transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                        <Image className="w-5 h-5" />
                        <span>Gallery 2</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {isLoading && (
                <div className="fixed inset-0 z-50 bg-gray-900/50 flex justify-center items-center">
                    <Riple color={["#5978ce", "#8198d9", "#a8b8e5", "#cfd8f1"]} />
                </div>
            )}
            <Slidebar highlight={"gallery"} />
            <div className="flex-1 md:ml-64">
                {currentView === 'main' && <MainPage />}
                {currentView === 'gallery1' && <div className='mt-14 md:mt-0'><GalleryPage gallery="gallery1" /></div>}
                {currentView === 'gallery2' && <GalleryPage gallery="gallery2" />}
            </div>
        </div>
    );
};

export default EventGalleryApp;