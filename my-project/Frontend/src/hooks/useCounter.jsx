import { useState, useEffect } from 'react';

// This custom hook handles the logic of counting from 0 to a target number.
const useCounter = (end, duration = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // If the count has already reached the target, stop the effect.
        if (count >= end) return;

        // Calculate the increment step to make the animation last for the specified duration.
        // We use a duration of 16ms to simulate a ~60fps animation.
        const increment = Math.ceil(end / (duration / 16));

        // Set up the interval to update the count.
        const timer = setInterval(() => {
            setCount(prevCount => {
                const nextCount = prevCount + increment;
                // Ensure the count doesn't go past the final number.
                return nextCount > end ? end : nextCount;
            });
        }, 16);

        // Clean up the interval when the component unmounts or the dependencies change.
        return () => clearInterval(timer);
    }, [end, duration, count]);

    return count;
};

export default useCounter;
