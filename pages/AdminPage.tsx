import React, { useState, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { VideoData, StatsData } from '../types';
import { LinkIcon, AnalyticsIcon, ServerIcon, InfoIcon, CopyIcon, CheckIcon } from '../components/icons';
import { useTranslations } from '../i18n/useTranslations';


const AdminPage: React.FC = () => {
  const { t, lang } = useTranslations();
  const [videoData, setVideoData] = useLocalStorage<VideoData>('videoData', { url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isEnabled: true });
  const [statsData, setStatsData] = useLocalStorage<StatsData>('statsData', { totalViews: 0 });
  
  const [tempUrl, setTempUrl] = useState(videoData.url);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleSave = () => {
    setVideoData({ ...videoData, url: tempUrl });
    alert(t('urlSaved'));
  };

  const toggleEnabled = () => {
    setVideoData({ ...videoData, isEnabled: !videoData.isEnabled });
  };
  
  const resetStats = () => {
    if (window.confirm(t('confirmStatReset'))) {
        setStatsData({ totalViews: 0 });
    }
  };

  const qrCodeLink = useMemo(() => {
    const { protocol, host, pathname } = window.location;
    // For HashRouter, the link should point to the root.
    return `${protocol}//${host}${pathname}`;
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrCodeLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {t('adminTitle')}
          </h1>
          <p className="text-center text-gray-400 mt-2">{t('adminSubtitle')}</p>
        </header>

        <main className="space-y-8">
          {/* Video Management */}
          <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <LinkIcon className={`w-6 h-6 ${lang === 'he' ? 'ml-3' : 'mr-3'}`} />
                {t('videoManagement')}
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-300 mb-1">
                  {t('videoUrlLabel')}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    id="videoUrl"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder={t('videoUrlPlaceholder')}
                    className="flex-grow bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                    {t('saveButton')}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-200">{t('videoStreaming')}</span>
                <button
                  onClick={toggleEnabled}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${videoData.isEnabled ? 'bg-green-500 focus:ring-green-400' : 'bg-gray-600 focus:ring-gray-500'}`}
                >
                  <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${videoData.isEnabled ? (lang === 'he' ? 'translate-x-1' : 'translate-x-6') : (lang === 'he' ? 'translate-x-6' : 'translate-x-1')}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <AnalyticsIcon className={`w-6 h-6 ${lang === 'he' ? 'ml-3' : 'mr-3'}`} />
              {t('statistics')}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-700 p-4 rounded-md">
                <div>
                    <p className="text-sm text-gray-400">{t('totalViews')}</p>
                    <p className="text-4xl font-bold text-blue-400">{statsData.totalViews}</p>
                </div>
                <button onClick={resetStats} className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                    {t('resetButton')}
                </button>
            </div>
          </section>

          {/* QR Code Link */}
          <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              {t('qrCodeLink')}
            </h2>
            <p className="text-gray-400 mb-2">{t('qrCodeHint')}</p>
            <div className="flex items-center bg-gray-700 p-2 rounded-md">
              <input type="text" readOnly value={qrCodeLink} className="flex-grow bg-transparent text-gray-300 focus:outline-none"/>
              <button onClick={copyToClipboard} className={`${lang === 'he' ? 'mr-2' : 'ml-2'} p-2 rounded-md bg-gray-600 hover:bg-gray-500 transition duration-300`}>
                {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5 text-gray-300" />}
              </button>
            </div>
          </section>

          {/* Infrastructure Advice */}
          <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <ServerIcon className={`w-6 h-6 ${lang === 'he' ? 'ml-3' : 'mr-3'}`} />
              {t('infrastructureAnalysis')}
            </h2>
            <div className="space-y-4 text-gray-300">
                <p>
                    {t('infraIntro')}
                </p>
                <div className="p-4 border border-gray-700 rounded-md">
                    <h3 className="font-bold text-lg text-blue-400">{t('hostingTitle')}</h3>
                    <p className="mt-1"><strong className="text-green-400">{t('hostingPros').split(':')[0]}:</strong> {t('hostingPros').split(':')[1]}</p>
                    <p className="mt-1"><strong className="text-red-400">{t('hostingCons').split(':')[0]}:</strong> {t('hostingCons').split(':')[1]}</p>
                    <p className="mt-2 text-sm text-gray-400"><strong>{t('hostingExamples').split(':')[0]}:</strong> {t('hostingExamples').split(':')[1]}</p>
                </div>
                 <div className="p-4 border border-gray-700 rounded-md">
                    <h3 className="font-bold text-lg text-purple-400">{t('ownServerTitle')}</h3>
                    <p className="mt-1"><strong className="text-green-400">{t('ownServerPros').split(':')[0]}:</strong> {t('ownServerPros').split(':')[1]}</p>
                    <p className="mt-1"><strong className="text-red-400">{t('ownServerCons').split(':')[0]}:</strong> {t('ownServerCons').split(':')[1]}</p>
                </div>
                <div className="flex items-start bg-blue-900 bg-opacity-30 p-4 rounded-md border border-blue-700">
                    <InfoIcon className={`w-5 h-5 ${lang === 'he' ? 'ml-3' : 'mr-3'} mt-1 flex-shrink-0 text-blue-400`} />
                    <p><strong>{t('conclusion').split(':')[0]}:</strong> {t('conclusion').split(':')[1]}</p>
                </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
