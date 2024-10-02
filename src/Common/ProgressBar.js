import { useEffect } from 'react';
import NProgress from 'nprogress';

const useProgressBar = () => {
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            #nprogress {
                pointer-events: none;
            }
            #nprogress .bar {
                background: rgb(35, 211, 0);
                position: fixed;
                z-index: 1031;
                top: 70px;
                left: 0;
                width: 100%;
                height: 3px;
            }
            #nprogress .peg {
                display: block;
                position: absolute;
                right: 0px;
                width: 100px;
                height: 100%;
                box-shadow: 0 0 10px #29d, 0 0 5px #29d;
                opacity: 1.0;
                transform: rotate(3deg) translate(0px, -4px);
            }
        `;
        document.head.appendChild(style);

        NProgress.configure({
            showSpinner: false,
            minimum: 0.1,
            speed: 500,
            trickleSpeed: 100,
            easing: 'ease',
        });

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const startProgress = () => {
        NProgress.start();
    };

    const stopProgress = () => {
        NProgress.done();
    };

    return { startProgress, stopProgress };
};

export default useProgressBar;