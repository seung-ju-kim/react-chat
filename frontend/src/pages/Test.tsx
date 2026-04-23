import { useEffect, useState, useRef } from "react";

const Test = () => {

    let count = 0;

    const [countState, setCountState] = useState(0);

    const countRef = useRef('🐰');

    useEffect(() => {
        console.log("mount count: ", count);
        console.log("mount useState: ", countState);
        console.log("mount useRef: ", countRef.current);

        return () => {
            console.log("unmount count: ", count);
            console.log("unmount useState: ", countState);
            console.log("unmount useRef: ", countRef.current);
        }
    }, []);

    const updateCount = () => {
        count += 1
        console.log("update count: ", count);
    }

    const updateCountState = () => {
        setCountState((prev) => prev + 1);
        console.log("update useState: ", countState);
    };

    const updateCountRef = () => {
        countRef.current += '안녕?';
        console.log("update useRef: ", countRef.current);
    };


    return (
        <div>
            <h1>Test Page</h1>
            <p>count: {count}</p>
            <p>useState: {countState}</p>
            <p>useRef: {countRef.current}</p>
            <button onClick={updateCount}>Update count</button>
            <button onClick={updateCountState}>Update useState</button>
            <button onClick={updateCountRef}>Update useRef</button>
        </div>
    );
};

export default Test;