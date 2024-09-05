import React, { useState } from 'react';
import './App.css'; 
import logo from "./assets/logo.png"
import insta from "./assets/insta.jfif"
import fb from "./assets/fb.jfif"
import twitter from "./assets/twitter.jfif"
import { FaHeart, FaRetweet, FaExclamationTriangle } from 'react-icons/fa';

const AsurTrackerPage = () => {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [platform, setPlatform] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !platform) {
      setError('Both username and platform must be selected.');
      return;
    }
    setError('');

    try {
      const response = await fetch(`http://127.0.0.1:8000/get_data/${username}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
      console.log('Data received:', result);
    } catch (error) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center font-sans justify-between px-8 py-4 bg-red-400 text-white rounded-full">
        <a href="https://www.sih.gov.in/" className="flex-shrink-0">
          <img src="https://www.sih.gov.in/img1/SIH2024-logo.png" alt="SIH Logo" className="h-10" />
        </a>
        <h1 className="text-xl font-bold">Team Aadigya</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="mb-6 text-center">
          <img src={logo} alt="Asur Tracker Logo" className="mx-auto h-20 md:h-24" />
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm shadow-lg">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter username"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="platform" className="block text-gray-700 text-sm font-bold mb-2">Select Platform:</label>
            <select
              id="platform"
              name="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="" disabled>Select platform</option>
              <option value="instagram" className="flex items-center">
                <img src={insta} alt="Instagram" className="w-5 h-5 mr-2" /> Instagram
              </option>
              <option value="twitter" className="flex items-center">
                <img src={twitter} alt="Twitter" className="w-5 h-5 mr-2" /> Twitter
              </option>
              <option value="facebook" className="flex items-center">
                <img src={fb} alt="Facebook" className="w-5 h-5 mr-2" /> Facebook
              </option>
            </select>
          </div>
          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Get Data
          </button>
        </form>

        {
          data && data.map( tweet => <Tweet tweet={tweet} /> )
        }
      </main>
    </div>
  );
};


const Tweet = ({ tweet }) => {
  // Helper function to format screen names (handles both single and multiple names)
  const formatScreenNames = (screenNames) => {
    if (Array.isArray(screenNames)) {
      return screenNames.join(", "); // Join names with commas if it's an array
    }
    return screenNames; // If it's a single string, just return it
  };

  return (
    <div className="border border-gray-300 bg-white rounded-lg p-4 shadow-lg max-w-xl mx-auto my-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
            {Array.isArray(tweet.screen_name) ? tweet.screen_name[0][0] : tweet.screen_name[0]}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">
              {formatScreenNames(tweet.screen_name)}
            </h3>
            <span className="text-gray-500 text-sm">{new Date(tweet.created_at).toLocaleString()}</span>
          </div>

          {tweet.possibly_sensitive && (
            <div className="text-red-500 flex items-center">
              <FaExclamationTriangle className="mr-1" /> Sensitive Content
            </div>
          )}

          <p className="mt-2 text-gray-800">{tweet.full_text}</p>

          <div className="mt-2 text-gray-500 text-sm">
            <strong>Mentions:</strong> {tweet.user_mentions.length > 0 ? tweet.user_mentions.join(", ") : "None"}
          </div>

          <div className="mt-4 flex space-x-4 text-gray-500">
            <div className="flex items-center cursor-pointer hover:text-green-500">
              <FaRetweet className="mr-1" /> {tweet.quote_count} Retweets
            </div>
            <div className="flex items-center cursor-pointer hover:text-red-500">
              <FaHeart className="mr-1" /> {tweet.favorite_count} Likes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AsurTrackerPage;
