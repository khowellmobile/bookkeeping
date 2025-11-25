import { useEffect, useState } from "react";

import classes from "./MonthlyRentStat.module.css";

const DATA_PERCENTAGES = [30, 50, 15, 5];
const COLORS = ["rgb(82, 99, 255)", "rgb(96, 224, 124)", "rgb(255, 137, 69)", "rgb(255, 82, 82)"];
const STATUS_TYPES = ["Scheduled", "Paid", "Due", "Overdue"];

const MonthlyRentStat = () => {
    const [pieSlices, setPieSlices] = useState([]);
    const [activeSlice, setActiveSlice] = useState(null);

    useEffect(() => {
        const slices = calulateSlicePathData(DATA_PERCENTAGES, COLORS);
        setPieSlices(slices);
    }, []);

    const setSlice = (index) => {
        setActiveSlice({
            type: STATUS_TYPES[index],
            percentage: DATA_PERCENTAGES[index],
            amount: ((DATA_PERCENTAGES[index] / 100) * 5000).toFixed(2), // 5000 is example total rent
        });
    };

    const resetSlice = () => {
        setActiveSlice(null);
    };

    const calculateDegreesByPercentage = (percentage) => {
        return (percentage / 100) * 360;
    };

    const getSVGCoordinates = (angle) => {
        const radians = (angle - 90) * (Math.PI / 180);
        const R = 50;
        const CX = 50;
        const CY = 50;

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
        let currentDegree = 0;

        percentages.forEach((percentage, index) => {
            const color = colors[index];
            const degreeLength = calculateDegreesByPercentage(percentage);

            if (degreeLength === 0) return;

            const endDegree = currentDegree + degreeLength;

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
            <div className={classes.header}>
                <h2>Rent</h2>
            </div>
            <div className={classes.infoBar}>
                {STATUS_TYPES.map((status, index) => {
                    return (
                        <div className={classes.dataItem}>
                            <div className={classes.dataDot} style={{ backgroundColor: COLORS[index] }} />
                            <p>{status}</p>
                        </div>
                    );
                })}
            </div>
            <div className={classes.content}>
                <div className={classes.chartDiv}>
                    <svg className={classes.pieChart} viewBox="-10 -10 120 120">
                        {pieSlices.map((slice, index) => (
                            <path
                                key={index}
                                d={slice.pathData}
                                fill={slice.color}
                                className={classes.slice}
                                onMouseEnter={() => setSlice(index)}
                                onMouseLeave={resetSlice}
                            />
                        ))}
                    </svg>
                    <div className={classes.center}>
                        {activeSlice && (
                            <>
                                <p>{activeSlice.type}</p>
                                <span>
                                    <p>
                                        {activeSlice.percentage}% - ${activeSlice.amount}
                                    </p>
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <div className={classes.dataDiv}>
                    <p>01/01/2025 - 01/31/2025</p>
                    <h3>Total Projected Rent: <strong>$5000</strong></h3>
                </div>
            </div>
        </div>
    );
};

export default MonthlyRentStat;
