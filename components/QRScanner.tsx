import React, { useState, useRef } from 'react';
import { useLanguage } from '../services/LanguageContext';
import { Camera, RefreshCw } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (data: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const { t } = useLanguage();
  const [scanning, setScanning] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate scanning process
  const startScan = () => {
    setScanning(true);
    
    // Request permission (simulated prompt via browser API if available, else just mock state)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
       navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          setPermissionGranted(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          // Mock successful scan after 3 seconds
          setTimeout(() => {
             // Stop stream
             stream.getTracks().forEach(track => track.stop());
             setScanning(false);
             onScanSuccess('bk_2'); // Return a mock Book ID
          }, 3000);
        })
        .catch((err) => {
          console.error("Camera error:", err);
          // Fallback simulation if camera fails
          setTimeout(() => {
            setScanning(false);
            onScanSuccess('bk_2');
          }, 2000);
        });
    } else {
        // Fallback for non-secure contexts
        setTimeout(() => {
            setScanning(false);
            onScanSuccess('bk_2');
        }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 rounded-xl overflow-hidden aspect-square max-w-sm mx-auto relative">
      {!scanning ? (
        <button 
          onClick={startScan}
          className="flex flex-col items-center text-white space-y-4 hover:scale-105 transition"
        >
          <div className="p-6 bg-indigo-600 rounded-full shadow-lg">
            <Camera className="w-8 h-8" />
          </div>
          <span className="font-medium">{t('scanQr')}</span>
        </button>
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {permissionGranted ? (
             <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted></video>
          ) : (
             <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
          )}
          
          {/* Overlay scanning animation */}
          <div className="absolute inset-0 border-2 border-indigo-500 opacity-50 m-8 rounded-lg"></div>
          <div className="absolute left-8 right-8 top-1/2 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
          
          <div className="z-10 bg-black/50 px-4 py-2 rounded-full text-white text-sm flex items-center backdrop-blur-sm mt-auto mb-8">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            {t('simulatingScan')}
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-100px); opacity: 0.5; }
          50% { transform: translateY(100px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};