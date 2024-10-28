"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

export default function AdminPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('events'); // 'events' or 'profile'
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allDay, setAllDay] = useState(false);
    const [image, setImage] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);

    const [name, setName] = useState('');
    const [titleProfile, setTitleProfile] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [github, setGithub] = useState('');
    const [website, setWebsite] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch('/api/auth/verify');
          if (!response.ok) throw new Error('Not authenticated');
        } catch (error) {
          router.push('/login');
        }
      };
      checkAuth();
      fetchEvents();
    }, [router]);
    

    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    const handleTabClick = (tab) => setActiveTab(tab);

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    };

    const handleProfileUpdate = async (e) => {
      e.preventDefault();
  
      // Build updatedProfile object with only non-empty fields
      const updatedProfile = {};
      if (name) updatedProfile.name = name;
      if (titleProfile) updatedProfile.title = titleProfile;
      if (linkedin) updatedProfile.linkedin = linkedin;
      if (github) updatedProfile.github = github;
      if (website) updatedProfile.website = website;
      if (profileImage) updatedProfile.image = profileImage;
  
      try {
          const response = await fetch('/api/admin/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedProfile),
          });
  
          if (!response.ok) throw new Error('Failed to update profile');
          alert('Profile updated successfully!');
      } catch (error) {
          console.error('Error updating profile:', error);
      }
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const newEvent = { title, description, startDate, endDate, allDay, image };
    
      try {
        const method = editingEvent ? 'PUT' : 'POST';
        const url = editingEvent ? `/api/events/${editingEvent._id}` : '/api/events';
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvent),
        });
    
        if (!response.ok) throw new Error('Failed to save event');
        
        alert(editingEvent ? 'Event updated successfully!' : 'Event added successfully!');
        resetForm();
        fetchEvents();
      } catch (error) {
        console.error('Error saving event:', error);
      }
    };

    const resetForm = () => {
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setAllDay(false);
      setImage(null);
      setEditingEvent(null);
    };

    const handleSelectEvent = (id) => {
      setSelectedEvents(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleDeleteSelected = async () => {
      if (selectedEvents.length === 0) return alert('No events selected for deletion');
    
      try {
        const response = await fetch('/api/events', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedEvents }),
        });
    
        if (!response.ok) throw new Error('Failed to delete events');
        
        alert('Selected events deleted successfully');
        setSelectedEvents([]);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting events:', error);
      }
    };

    const handleEditEvent = (event) => {
      setTitle(event.title);
      setDescription(event.description);
      setStartDate(event.startDate);
      setEndDate(event.endDate);
      setAllDay(event.allDay);
      setImage(event.image);
      setEditingEvent(event);
    };
        const handleLogout = async () => {
      await fetch('/api/auth/logout', { method: 'GET' });
      router.push('/login');
    };

    const handleRegister = async () => {
      router.push('/register');
    };

    const handleChangePassword = async (e) => {
      e.preventDefault();
      if (!newPassword) return alert("Please enter a new password.");
  
      try {
        const response = await fetch('/api/admin/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword }),
        });
  
        const result = await response.json();
        if (response.ok) {
          alert('Password updated successfully');
          setShowChangePasswordModal(false);
        } else {
          alert(result.error || 'Failed to update password');
        }
      } catch (error) {
        console.error('Error changing password:', error);
        alert('Error changing password');
      }
    };

    return (
      <div className="container mx-auto p-6 text-gray-700">
        {/* Subnavbar with Extra Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => handleTabClick('events')}
              className={`flex items-center px-4 py-2 rounded-md font-bold ${activeTab === 'events' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Events
            </button>
            <button
              onClick={() => handleTabClick('profile')}
              className={`flex items-center px-4 py-2 rounded-md font-bold ${activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Profile
            </button>
          </div>
          <div className="flex space-x-4">
            <button onClick={handleRegister} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md">
              Register New User
            </button>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md">
              Logout
            </button>
            <button onClick={() => setShowChangePasswordModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
              Change Password
            </button>
          </div>
        </div>

        {/* Change Password Modal */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Change Password</h2>
              <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-700">Current Password</label>
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <label className="block text-lg font-semibold text-gray-700">New Password</label>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Conditional Rendering Based on Selected Tab */}
        {activeTab === 'events' ? (
          <EventsSection
            events={events}
            title={title}
            description={description}
            startDate={startDate}
            endDate={endDate}
            allDay={allDay}
            image={image}
            setTitle={setTitle}
            setDescription={setDescription}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setAllDay={setAllDay}
            setImage={setImage}
            handleSubmit={handleSubmit}
            handleEditEvent={handleEditEvent}
            handleDeleteSelected={handleDeleteSelected}
            handleSelectEvent={handleSelectEvent}
            selectedEvents={selectedEvents}
            resetForm={resetForm}
            editingEvent={editingEvent}
          />
        ) : (
          <ProfileSection
            name={name}
            titleProfile={titleProfile}
            linkedin={linkedin}
            github={github}
            website={website}
            profileImage={profileImage}
            setName={setName}
            setTitleProfile={setTitleProfile}
            setLinkedin={setLinkedin}
            setGithub={setGithub}
            setWebsite={setWebsite}
            setProfileImage={setProfileImage}
            handleProfileUpdate={handleProfileUpdate}
            handleImageChange={handleImageChange}
          />
        )}
      </div>
    );
}

// Events Section Component
const EventsSection = ({ events, title, description, startDate, endDate, allDay, image, setTitle, setDescription, setStartDate, setEndDate, setAllDay, setImage, handleSubmit, handleEditEvent, handleDeleteSelected, handleSelectEvent, selectedEvents, resetForm, editingEvent }) => (
  <div className="flex flex-col lg:flex-row lg:space-x-8">
    {/* Event Form */}
    <div className="lg:w-1/2 bg-white shadow-md rounded-lg p-8 space-y-6 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 text-center">Manage Events</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-lg font-semibold text-gray-700">Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          required 
        />

        <label className="block text-lg font-semibold text-gray-700">Description</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          required 
        />

        <label className="block text-lg font-semibold text-gray-700">Start Date</label>
        <input 
          type="datetime-local" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          required 
        />

        <label className="block text-lg font-semibold text-gray-700">End Date</label>
        <input 
          type="datetime-local" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" 
          required 
        />

        <label className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
          <input 
            type="checkbox" 
            checked={allDay} 
            onChange={(e) => setAllDay(e.target.checked)} 
            className="w-5 h-5 rounded text-blue-600 focus:ring-blue-400 border-gray-300" 
          />
          <span>All Day Event</span>
        </label>

        <label className="block text-lg font-semibold text-gray-700">Event Image</label>
        <input 
          type="file" 
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(file);
          }} 
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" 
        />

        <div className="flex space-x-4">
          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition duration-200">
            {editingEvent ? 'Update Event' : 'Add Event'}
          </button>
          {editingEvent && (
            <button type="button" onClick={resetForm} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-md transition duration-200">
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Event List</h3>
      <table className="w-full bg-white rounded-lg shadow-lg">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="p-3 text-left">Select</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id} className="border-b border-gray-200">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(event._id)}
                  onChange={() => handleSelectEvent(event._id)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-400 border-gray-300 rounded"
                />
              </td>
              <td className="p-3 text-gray-800 font-medium">{event.title}</td>
              <td className="p-3 text-gray-600">{new Date(event.startDate).toLocaleDateString()}</td>
              <td className="p-3">
                <button
                  onClick={() => handleEditEvent(event)}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleDeleteSelected}
        className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-md transition duration-200"
      >
        Delete Selected
      </button>
    </div>

    {/* Live Preview */}
    <div className="lg:w-1/2 bg-white p-6 rounded-lg max-w-lg w-full border border-gray-200 shadow-md">
      <h2 className="text-3xl font-bold text-gray-900 text-center">Live Event Preview</h2>
      <div className="mt-4">
        {image && <img src={image} alt={title} className="w-full h-64 object-cover rounded-md mb-4" />}
        <h2 className="text-3xl font-bold mb-4 text-blue-700">{title || 'Event Title'}</h2>
        <p className="text-gray-800 mb-4">{description || 'Event description will appear here.'}</p>
        <p className="text-gray-800 mb-4">
          <strong>Date:</strong> {startDate ? moment(startDate).format('MMMM Do, YYYY') : 'Select a date'}
          <br />
          <strong>Time:</strong> {allDay ? 'All Day' : `${moment(startDate).format('h:mm A')} - ${moment(endDate).format('h:mm A')}`}
        </p>
      </div>
    </div>
  </div>
);


const ProfileSection = ({
  name, titleProfile, linkedin, github, website, profileImage,
  setName, setTitleProfile, setLinkedin, setGithub, setWebsite,
  setProfileImage, handleProfileUpdate, handleImageChange
}) => (
  <div className="flex flex-col lg:flex-row lg:space-x-8">
    {/* Profile Form */}
    <div className="lg:w-1/2 bg-white shadow-md rounded-lg p-8 space-y-6 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 text-center">Update Profile</h2>
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <label className="block text-lg font-semibold text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-lg font-semibold text-gray-700">Title</label>
        <input
          type="text"
          value={titleProfile}
          onChange={(e) => setTitleProfile(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-lg font-semibold text-gray-700">LinkedIn</label>
        <input
          type="text"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-lg font-semibold text-gray-700">GitHub</label>
        <input
          type="text"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-lg font-semibold text-gray-700">Website</label>
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-lg font-semibold text-gray-700">Profile Image</label>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setProfileImage(reader.result);
            reader.readAsDataURL(file);
          }}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition duration-200">
          Save Profile
        </button>
      </form>
    </div>

    {/* Live Profile Preview */}
    <div className="lg:w-1/2 flex justify-center items-center text-gray-900 text-xl">
      <div className="our-team border-solid border-2 border-black shadow-lg text-center p-8 rounded-lg" style={{ width: '500px', height: '300px' }}>
        <div className="picture mb-4">
          <img
            src={profileImage || '/images/default-profile.jpg'}
            alt={name || 'Default Name'}
            className="img-fluid w-40 h-40 object-cover rounded-full mx-auto"
          />
        </div>
        <div className="team-content">
          <h3 className="name">{name || 'Officer Name'}</h3>
          <h4 className="title text-gray-600 text-lg">{titleProfile || 'Officer Title'}</h4>
        </div>
        <ul className="social flex justify-center mt-4 space-x-4">
          {linkedin && (
            <li>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
            </li>
          )}
          <li>
            <a href={`mailto:example@example.com`} className="text-blue-600 hover:text-blue-800">
              <FontAwesomeIcon icon={faEnvelope} size="lg" />
            </a>
          </li>
          {github && (
            <li>
              <a href={github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>
            </li>
          )}
          {website && (
            <li>
              <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <FontAwesomeIcon icon={faGlobe} size="lg" />
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  </div>
);
