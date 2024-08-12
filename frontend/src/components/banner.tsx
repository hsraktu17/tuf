import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";

const TimerBanner = () => {
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [inputTime, setInputTime] = useState<number>(10);
  const [bannerText, setBannerText] = useState<string>("Default Banner Text");
  const [bannerLink, setBannerLink] = useState<string>("https://");
  const [showClickMeButton, setShowClickMeButton] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0) {
      setIsVisible(false);
      setShowClickMeButton(true);
    }
  }, [timeLeft, isVisible]);

  const closeBanner = () => {
    setIsVisible(false);
    setShowClickMeButton(false);
  };

  const showBanner = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/", {
        BannerText: bannerText,
        Link: bannerLink,
        Timer: inputTime,
      });
      console.log(response.data);
      setTimeLeft(inputTime);
      setIsVisible(true);
      setShowClickMeButton(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("AxiosError:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error in setup:", error.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputTime(Number(e.target.value));
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBannerText(e.target.value);
  };

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBannerLink(e.target.value);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-900 text-white min-h-screen">
      <div>
        <TextareaWithText onTextChange={handleTextChange} />
        <input
          type="url"
          value={bannerLink}
          onChange={handleLinkChange}
          className="border border-red-500 p-2 rounded mt-2 w-full bg-gray-800 text-white placeholder-gray-400"
          placeholder="Enter banner link"
        />
        <input
          type="number"
          value={inputTime}
          onChange={handleTimeChange}
          className="border border-red-500 p-2 rounded mt-2 w-full bg-gray-800 text-white placeholder-gray-400"
          placeholder="Enter time in seconds"
        />
        <div className="mt-4">
          <button
            onClick={showBanner}
            className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Show Banner
          </button>
          <button
            onClick={closeBanner}
            className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
          >
            Remove Banner
          </button>
        </div>
      </div>
      <div>
        {isVisible && (
          <div className="bg-gradient-to-r from-red-700 to-red-500 mt-10 text-white p-6 flex justify-between items-center rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            <div className="flex flex-col">
              <a
                href={bannerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold underline hover:text-gray-300 transition-colors duration-200"
              >
                {bannerText}
              </a>
              <p className="text-sm mt-1">
                Disappears in{" "}
                <span className="font-bold text-yellow-400 ml-1 px-2 py-1 bg-black bg-opacity-50 rounded-lg shadow-inner">
                  {formatTime(timeLeft)}
                </span>{" "}
                minutes
              </p>
            </div>
            <button
              onClick={closeBanner}
              className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
            >
              Close
            </button>
          </div>
        )}
        {showClickMeButton && (
          <div className="p-4 mt-7">
            <button
              className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
              onClick={() => window.open(bannerLink, "_blank")}
            >
              Click Me
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimerBanner;

interface TextareaWithTextProps {
  onTextChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextareaWithText: React.FC<TextareaWithTextProps> = ({
  onTextChange,
}) => {
  return (
    <div className="grid gap-1.5">
      <label htmlFor="message" className="font-bold text-lg text-white">
        Banner Text
      </label>
      <textarea
        placeholder="Type your banner text here."
        id="message"
        onChange={onTextChange}
        className="border border-red-500 p-2 rounded mt-2 w-full bg-gray-800 text-white placeholder-gray-400"
      />
      <p className="text-sm text-gray-400">
        The text you enter will appear in the banner.
      </p>
    </div>
  );
};
