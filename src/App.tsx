import {useEffect, useState} from 'react'
import {createClient} from "@supabase/supabase-js";


const supabase = createClient("https://yimbuaubbxhbtsqkmesm.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbWJ1YXViYnhoYnRzcWttZXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg5MTY0OTgsImV4cCI6MjA0NDQ5MjQ5OH0.AGfcs3-hEXom9BYrkiWUwjwfIvZMIW94POXoDeMnVBg");

type Record = { id: number, a: number, b: number };

function App() {
    const [counts, setCounts] = useState<Record>({id: 1, a: 1, b: 1});

    useEffect(() => {
        const chan = supabase.channel("counts").on("postgres_changes", {
            event: "*",
            table: "cnt",
            schema: "public"
        }, (x) => {
            setCounts(x.new as Record)
            console.log(x)
        }).subscribe(status => {
            console.log(status)
        });

        return () => {
            chan.unsubscribe()
        }
    }, []);

    useEffect(() => {
        getCounts();
    }, []);

    // Call the RPC to increment column 'a'
    const incrementA = async () => {
        const {data, error} = await supabase
            .rpc('increment_cnt_column', {
                column_name: 'a'
            })

        if (error) {
            console.error('Error:', error)
            return
        }

        return data
    }

    // Call the RPC to increment column 'b'
    const incrementB = async () => {
        const {data, error} = await supabase
            .rpc('increment_cnt_column', {
                column_name: 'b'
            })

        if (error) {
            console.error('Error:', error)
            return
        }

        return data
    }

    async function getCounts() {
        const {data = []} = await supabase.from("cnt").select().single();
        setCounts(data as Record);
    }

    const total = counts.a + counts.b;
    const leftPercentage = total > 0 ? (counts.a / total) * 100 : 50;
    const rightPercentage = total > 0 ? (counts.b / total) * 100 : 50;

    return (
        <main className="relative min-h-screen w-full bg-[url('/bg.jpeg')] bg-cover bg-center bg-no-repeat">
            <div className="w-full max-w-lg mx-auto">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{counts.a}</span>
                    <span className="text-sm font-medium">{counts.b}</span>
                </div>

                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                    {/* Left side */}
                    <div
                        className="absolute left-0 h-full bg-blue-500 transition-all duration-300"
                        style={{width: `${leftPercentage}%`}}
                    />

                    {/* Right side */}
                    <div
                        className="absolute right-0 h-full bg-red-500 transition-all duration-300"
                        style={{width: `${rightPercentage}%`}}
                    />

                    {/* Center marker */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-black transform -translate-x-1/2"
                         style={{left: `${leftPercentage}%`}}
                    />
                </div>

                <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{leftPercentage.toFixed(1)}%</span>
                    <span className="text-xs text-gray-500">{rightPercentage.toFixed(1)}%</span>
                </div>
            </div>
            <div className="absolute top-[45%] left-[30%]" onClick={() => incrementA()}>
                <img
                    src="https://placehold.co/600x1000"
                    alt="Left Fighter"
                    className="h-64 w-48 object-contain"
                />
            </div>
            <div className="absolute top-[45%] right-[30%]" onClick={() => incrementB()}>
                <img
                    src="https://placehold.co/600x1000"
                    alt="Right Fighter"
                    className="h-64 w-48 object-contain"
                />
            </div>
        </main>
    );
}

export default App
