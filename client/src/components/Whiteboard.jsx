import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';

const Whiteboard = ({ socket, roomId }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const isUpdatingRef = useRef(false);
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  // Listen for dark mode class changes on <html>
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!socket || !roomId || !excalidrawAPI) return;

    const handleUpdate = (elements) => {
      isUpdatingRef.current = true;
      excalidrawAPI.updateScene({ elements });
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    };

    socket.on('whiteboard_update', handleUpdate);

    return () => {
      socket.off('whiteboard_update', handleUpdate);
    };
  }, [socket, roomId, excalidrawAPI]);

  const onChange = useCallback((elements) => {
    if (isUpdatingRef.current) return;

    // In a production app, we should debounce and diff elements to avoid sending the entire scene.
    socket.emit('whiteboard_update', { roomId, elements });
  }, [socket, roomId]);

  return (
    <div className="excalidraw-wrapper" style={{ height: '100%', width: '100%', position: 'relative' }}>
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={onChange}
        theme={theme}
        UIOptions={{
          canvasActions: {
            loadScene: false,
            saveToActiveFile: false,
            export: { saveFileToDisk: true },
          },
        }}
      />
    </div>
  );
};

export default Whiteboard;