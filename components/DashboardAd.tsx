import React, { useEffect, useRef } from 'react';

const DashboardAd: React.FC = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            const doc = iframeRef.current.contentWindow.document;
            // Clear previous content if any (though useEffect [] runs once)
            doc.open();
            doc.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background-color: transparent; }
                    </style>
                </head>
                <body>
                    <script type="text/javascript">
                        atOptions = {
                            'key' : '52b17ec539597a3f2de617124abaaa17',
                            'format' : 'iframe',
                            'height' : 50,
                            'width' : 320,
                            'params' : {}
                        };
                    </script>
                    <script type="text/javascript" src="https://www.highperformanceformat.com/52b17ec539597a3f2de617124abaaa17/invoke.js"></script>
                </body>
                </html>
            `);
            doc.close();
        }
    }, []);

    return (
        <div className="flex justify-center items-center my-4 px-2">
            <div className="bg-slate-100 rounded-lg shadow-sm border border-slate-200 overflow-hidden" style={{ width: '320px', height: '52px' }}>
                <iframe 
                    ref={iframeRef} 
                    width="320" 
                    height="50" 
                    title="Dashboard Ad"
                    scrolling="no"
                    style={{ border: 'none', display: 'block', margin: '0 auto' }}
                />
            </div>
        </div>
    );
};

export default DashboardAd;