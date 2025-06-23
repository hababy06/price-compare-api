import React, { useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

const BarcodeScanner = ({ onDetected, onClose }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream;
    let codeReader;
    let stopScan = false;

    // 1. 先取得後鏡頭串流並顯示在 video
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: 'environment' } }
    })
      .then(s => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        // 2. 再用 decodeFromStream 做條碼辨識
        codeReader = new BrowserMultiFormatReader();
        codeReader.decodeFromStream(
          stream,
          videoRef.current,
          (result, err) => {
            if (result && !stopScan) {
              alert('已掃到條碼：' + result.getText());
              if (onDetected) onDetected(result.getText());
              stopScan = true;
              codeReader.reset();
              if (onClose) onClose();
            }
          }
        );
      })
      .catch(err => {
        console.error('getUserMedia 失敗', err);
        alert('無法開啟相機，請檢查權限或裝置支援度');
        if (onClose) onClose();
      });

    return () => {
      stopScan = true;
      if (codeReader) codeReader.reset();
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [onDetected, onClose]);

  return (
    <div style={{ position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.8)', zIndex:9000, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <div style={{ color: 'yellow', fontWeight: 'bold', marginBottom: 8 }}>BarcodeScanner 後鏡頭</div>
      <video ref={videoRef} style={{ width: '90vw', maxWidth: 400, borderRadius: 8 }} autoPlay playsInline />
      <button onClick={onClose} style={{ marginTop: 16, padding: '8px 24px', borderRadius: 6 }}>關閉</button>
    </div>
  );
};

export default BarcodeScanner;
