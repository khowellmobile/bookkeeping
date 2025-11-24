import { useEffect, useState } from "react";

import classes from "./MonthlyRentStat.module.css";

const DATA_PERCENTAGES = [25, 35, 30, 10];
const COLORS = ["rgb(82, 99, 255)", "rgb(96, 224, 124)", "rgb(255, 137, 69)", "rgb(255, 82, 82)"];

const MonthlyRentStat = () => {
    const [pieSlices, setPieSlices] = useState([]);

    useEffect(() => {
        // Calculate the SVG path data when the component mounts
        const slices = calulateSlicePathData(DATA_PERCENTAGES, COLORS);
        setPieSlices(slices);
    }, []);

    const calculateDegreesByPercentage = (percentage) => {
        return (percentage / 100) * 360;
    };

    const getSVGCoordinates = (angle) => {
        const radians = (angle - 90) * (Math.PI / 180);
        const R = 50; // Radius
        const CX = 50; // Center X
        const CY = 50; // Center Y

        // Calculate position on circumference relative to center (50, 50)
        const x = CX + R * Math.cos(radians);
        const y = CY + R * Math.sin(radians);

        return `${x.toFixed(3)} ${y.toFixed(3)}`;
    };

    const calulateSlicePathData = (percentages, colors) => {
        if (percentages.length !== colors.length) {
            console.error("Percentages and colors arrays must have the same length.");
            return [];
        }

        const slices = [];
        let currentDegree = 0; // Tracks the start angle of the current slice (starting at 12 o'clock)

        percentages.forEach((percentage, index) => {
            const color = colors[index];
            const degreeLength = calculateDegreesByPercentage(percentage);

            if (degreeLength === 0) return;

            const endDegree = currentDegree + degreeLength;

            // 1. Calculate coordinates for the start and end of the arc
            const startCoord = getSVGCoordinates(currentDegree);
            const endCoord = getSVGCoordinates(endDegree);
            const largeArcFlag = degreeLength > 180 ? 1 : 0;
            const pathData = `M 50 50 L ${startCoord} A 50 50 0 ${largeArcFlag} 1 ${endCoord} Z`;

            slices.push({
                pathData: pathData,
                color: color,
            });

            currentDegree = endDegree;
        });

        return slices;
    };

    return (
        <div className={classes.mainContainer}>
            <svg className={classes.pieChart} viewBox="-10 -10 120 120">
                {pieSlices.map((slice, index) => (
                    <path key={index} d={slice.pathData} fill={slice.color} className={classes.slice} />
                ))}
            </svg>
            <div className={classes.center}></div>
        </div>
    );
};

export default MonthlyRentStat;
