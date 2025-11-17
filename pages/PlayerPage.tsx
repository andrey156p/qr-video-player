import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { VideoData, StatsData } from '../types';
import { PlayIcon, PauseIcon, ErrorIcon, ReplayIcon } from '../components/icons';
import { useTranslations } from '../i18n/useTranslations';

const PlayerPage: React.FC = () => {
  const { t } = useTranslations();
  const [videoData] = useLocalStorage<VideoData>('videoData', { url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isEnabled: true });
  const [, setStats] = useLocalStorage<StatsData>('statsData', { totalViews: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);

  const incrementViewCount = useCallback(() => {
    setStats(prevStats => ({ totalViews: (prevStats?.totalViews || 0) + 1 }));
  }, [setStats]);

  useEffect(() => {
    if (videoData.isEnabled && videoData.url) {
        incrementViewCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoData.isEnabled, videoData.url]);

  const playVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.play().then(() => {
        setIsPlaying(true);
        setShowControls(false);
        setVideoEnded(false);
        // Request fullscreen on user interaction
        if (document.fullscreenElement === null) {
          video.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
          });
        }
      }).catch(err => {
        console.error("Video play failed:", err);
        setShowControls(true);
      });
  }

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (videoEnded) {
        video.currentTime = 0;
        playVideo();
        return;
    }

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      setShowControls(true);
    } else {
      playVideo();
    }
  };

  const handleVideoTap = () => {
    if (isPlaying) {
      setShowControls(prev => !prev);
    }
  };

  if (!videoData.isEnabled || !videoData.url) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-center p-4">
        <ErrorIcon className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white">{t('videoNotAvailable')}</h1>
        <p className="text-gray-400 mt-2">
          {t('contentDisabled')}
        </p>
        <Link to="/admin" className="text-sm text-gray-500 hover:text-blue-400 mt-8 underline">
          {t('adminPanelLink')}
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-black" onClick={handleVideoTap}>
      <video
        ref={videoRef}
        src={videoData.url}
        className="w-full h-full object-contain"
        onPlay={() => {
            setIsPlaying(true);
            setShowControls(false);
            setVideoEnded(false);
        }}
        onPause={() => {
            setIsPlaying(false);
            setShowControls(true);
        }}
        onEnded={() => {
            setIsPlaying(false);
            setShowControls(true);
            setVideoEnded(true);
        }}
        playsInline // Important for iOS
      />
      
      {showControls && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent tap event from propagating to the parent div
              togglePlay();
            }}
            className="p-4 bg-white bg-opacity-20 rounded-full text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            aria-label={videoEnded ? t('watchAgain') : (isPlaying ? t('pauseLabel') : t('playLabel'))}
          >
            {videoEnded ? (
                <ReplayIcon className="w-16 h-16" />
            ) : isPlaying ? (
              <PauseIcon className="w-16 h-16" />
            ) : (
              <PlayIcon className="w-16 h-16" />
            )}
          </button>
          {videoEnded && (
            <p className="text-white text-lg mt-4 font-semibold select-none">
              {t('watchAgain')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerPage;
