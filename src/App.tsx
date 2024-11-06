import { useCallback, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Juke from "./Juke.tsx";

const supabase = createClient(
  "https://yimbuaubbxhbtsqkmesm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbWJ1YXViYnhoYnRzcWttZXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MTY0OTgsImV4cCI6MjA0NDQ5MjQ5OH0.AGfcs3-hEXom9BYrkiWUwjwfIvZMIW94POXoDeMnVBg",
);

type Record = { id: number; a: number; b: number };

function App() {
  const [aAttack, setAAttack] = useState(false);

  const triggerAAttack = () => {
    playSound();
    incrementA();
    setAAttack(true);
    setTimeout(() => {
      setAAttack(false);
    }, 1000);
  };

  const [bAttack, setBAttack] = useState(false);

  const triggerBAttack = () => {
    playSound();
    incrementB();
    setBAttack(true);
    setTimeout(() => {
      setBAttack(false);
    }, 1000);
  };

  const [counts, setCounts] = useState<Record>({ id: 1, a: 1, b: 1 });

  useEffect(() => {
    const chan = supabase
      .channel("counts")
      .on(
        "postgres_changes",
        {
          event: "*",
          table: "cnt",
          schema: "public",
        },
        (x) => {
          setCounts(x.new as Record);
        },
      )
      .subscribe();

    return () => {
      chan.unsubscribe();
    };
  }, []);

  useEffect(() => {
    getCounts();
  }, []);

  // Call the RPC to increment column 'a'
  const incrementA = async () => {
    const { data, error } = await supabase.rpc("increment_cnt_column", {
      column_name: "a",
    });

    if (error) {
      console.error("Error:", error);
      return;
    }

    return data;
  };

  // Call the RPC to increment column 'b'
  const incrementB = async () => {
    const { data, error } = await supabase.rpc("increment_cnt_column", {
      column_name: "b",
    });

    if (error) {
      console.error("Error:", error);
      return;
    }

    return data;
  };

  async function getCounts() {
    const { data = [] } = await supabase.from("cnt").select().single();
    setCounts(data as Record);
  }

  const total = counts.a + counts.b;
  const leftPercentage = total > 0 ? (counts.a / total) * 100 : 50;
  const rightPercentage = total > 0 ? (counts.b / total) * 100 : 50;

  const playSound = useCallback(() => {
    const audio = new Audio("/suifighter/attack.wav");

    // Reset audio to start
    audio.currentTime = 0;
    // Play the sound
    return audio.play();
  }, []);

  return (
    <main className="relative flex flex-col justify-evenly min-h-screen items-center w-full bg-[url('/bg.jpeg')] bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-lg mx-auto bg-[url('/bar-decor.png')] bg-cover bg-no-repeat">
        <div className="mx-8 my-[9px]">
          <div className="relative h-2 overflow-hidden">
            {/* Left side */}
            <div
              className="absolute left-0 h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${leftPercentage}%` }}
            />

            {/* Right side */}
            <div
              className="absolute right-0 h-full bg-red-500 transition-all duration-300"
              style={{ width: `${rightPercentage}%` }}
            />

            {/* Center marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-black transform -translate-x-1/2"
              style={{ left: `${leftPercentage}%` }}
            />
          </div>
        </div>
      </div>
      <div className="relative flex justify-center items-center w-[70rem] h-[32rem]">
        {aAttack ? (
          <>
            <img
              src={bAttack ? "./dog-attack.png" : "./dog-idle.png"}
              alt="Right Fighter"
              className="absolute object-contain"
            />
            <img
              src={aAttack ? "./cat-attack.png" : "./cat-idle.png"}
              alt="Left Fighter"
              className="absolute object-contain"
            />
          </>
        ) : (
          <>
            <img
              src={aAttack ? "./cat-attack.png" : "./cat-idle.png"}
              alt="Left Fighter"
              className="absolute object-contain"
            />
            <img
              src={bAttack ? "./dog-attack.png" : "./dog-idle.png"}
              alt="Right Fighter"
              className="absolute object-contain"
            />
          </>
        )}
      </div>
      <button
        className="absolute h-full w-[50%] top-0 left-0 hover:bg-red-100 opacity-5"
        onClick={() => triggerAAttack()}
      />
      <button
        className="absolute h-full w-[50%] top-0 right-0 hover:bg-blue-100 opacity-5"
        onClick={() => triggerBAttack()}
      />
      <Juke />
    </main>
  );
}

export default App;
