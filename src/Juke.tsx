import {useEffect, useRef, useState} from "react";

export default function Juke() {
    const [currentTrack, setCurrentTrack] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Keep audio instance in ref to persist between renders
    const audioRef = useRef<HTMLAudioElement | null>(null);
    

    const playlist = [
        {
            title: "Street Fighter II Ryu Theme Original",
            url: "/suifighter/Street-Fighter-II-Ryu-Theme-Original.mp3",
        },
    ];

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        setCurrentTrack((prev) => (prev + 1) % playlist.length);
    };

    // Initialize audio only once
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(playlist[currentTrack].url);
            audioRef.current.addEventListener("ended", handleNext);
        }

        // Cleanup
        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener("ended", handleNext);
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Handle track changes
    useEffect(() => {
        if (audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            const wasPlaying = !audioRef.current.paused;
            
            audioRef.current.src = playlist[currentTrack].url;
            audioRef.current.currentTime = currentTime;
            
            if (wasPlaying) {
                audioRef.current.play();
            }
        }
    }, [currentTrack, playlist]);

    // Handle play/pause
    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
             audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    return (
        <button
            className="absolute bottom-4 right-4 bg-[url('/juke.png')] bg-contain bg-center bg-no-repeat h-[12rem] w-[32rem]"
            onClick={handlePlayPause}
        />
    );
}