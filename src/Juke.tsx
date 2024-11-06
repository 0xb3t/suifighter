import {useEffect, useRef, useState} from "react";

export default function Juke() {
    const [currentTrack, setCurrentTrack] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    // const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef(new Audio());

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


    useEffect(() => {
        const audio = audioRef.current;

        // Set up audio event listeners
        audio.addEventListener("ended", handleNext);

        // Load first track
        audio.src = playlist[currentTrack].url;

        // Cleanup
        return () => {
            audio.removeEventListener("ended", handleNext);
        };
    }, [currentTrack, handleNext, playlist]);

    useEffect(() => {
        // Update audio source when current track changes
        audioRef.current.src = playlist[currentTrack].url;
        if (isPlaying) {
            audioRef.current.play();
        }
    }, [currentTrack, isPlaying, playlist]);

    useEffect(() => {
        // Handle play/pause
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);


    // const handlePrevious = () => {
    //     setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    // };
    //
    // const toggleMute = () => {
    //     setIsMuted(!isMuted);
    //     audioRef.current.muted = !isMuted;
    // };

    return (
        <button
            className="absolute bottom-4 right-4 bg-[url('/juke.png')] bg-contain bg-center bg-no-repeat h-[12rem] w-[32rem]"
            onClick={() => handlePlayPause()}></button>
    );
}
