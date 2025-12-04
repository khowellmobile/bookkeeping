import { useEffect, useState, useContext } from "react";

import classes from "./MonthlyRentStat.module.css";

import RentPaymentsCtx from "../../contexts/RentPaymentsCtx";
import PropertiesCtx from "../../contexts/PropertiesCtx";
import NoResultsDisplay from "../utilities/NoResultsDisplay";

const COLORS = {
    scheduled: "rgb(82, 99, 255)",
    paid: "rgb(96, 224, 124)",
    due: "rgb(255, 137, 69)",
    overdue: "rgb(255, 82, 82)",
};
const STATUS_TYPES = ["scheduled", "paid", "due", "overdue"];
const currentDate = new Date();

const MonthlyRentStat = () => {
    const { ctxGetMonthlySummary } = useContext(RentPaymentsCtx);
    const { ctxActiveProperty } = useContext(PropertiesCtx);

    const [monthlySummary, setMonthlySummary] = useState();
    const [statusPercents, setStatusPercents] = useState();
    const [pieSlices, setPieSlices] = useState([]);
    const [activeSlice, setActiveSlice] = useState(null);

    // Must use useEffect to ensure activeProperty when call is made
    useEffect(() => {
        const fetchMonthlySummary = async () => {
            return await ctxGetMonthlySummary(currentDate.getMonth() + 1, currentDate.getFullYear());
        };

        const loadSummary = async () => {
            if (ctxActiveProperty) {
                try {
                    const monthSum = await fetchMonthlySummary();
                    setMonthlySummary(monthSum);
                } catch (error) {
                    console.error("Failed to fetch monthly summary:", error);
                }
            }
        };

        loadSummary();
    }, [ctxActiveProperty]);

    useEffect(() => {
        if (monthlySummary && monthlySummary.payment_summary) {
            const dataPercentages = monthlySummary.payment_summary.map((value) => {
                const percentage = (value.amount / monthlySummary.total_rent_payments) * 100;
                return { [value.status]: percentage };
            });
            const statusMap = dataPercentages.reduce((acc, current) => {
                const key = Object.keys(current)[0];
                acc[key] = current[key];
                return acc;
            }, {});
            setStatusPercents(statusMap);
            const slices = calulateSlicePathData(dataPercentages, COLORS);
            setPieSlices(slices);
        }
    }, [monthlySummary]);

    const setSlice = (status) => {
        setActiveSlice({
            type: status,
            percentage: statusPercents[status].toFixed(2),
            amount: (statusPercents[status] / 100) * monthlySummary.total_rent_payments.toFixed(2),
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
        const slices = [];
        let currentDegree = 0;

        percentages.forEach((item) => {
            const statusKey = Object.keys(item)[0];
            const percentage = item[statusKey];
            const color = colors[statusKey];

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
                status: statusKey,
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
                        <div className={classes.dataItem} key={index}>
                            <div className={classes.dataDot} style={{ backgroundColor: COLORS[status] }} />
                            <p>{status}</p>
                        </div>
                    );
                })}
            </div>
            <div className={classes.content}>
                {monthlySummary ? (
                    <>
                        <div className={classes.chartDiv}>
                            <svg className={classes.pieChart} viewBox="-10 -10 120 120">
                                {pieSlices.map((slice, index) => (
                                    <path
                                        key={index}
                                        d={slice.pathData}
                                        fill={slice.color}
                                        className={classes.slice}
                                        onMouseEnter={() => setSlice(slice.status)}
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
                            <p>
                                {currentDate.toLocaleDateString("en-US", { month: "long" })} -{" "}
                                {currentDate.getFullYear()}
                            </p>
                            <h3>
                                Total Projected Rent:{" "}
                                <strong>{monthlySummary ? `$${monthlySummary.total_rent_payments}` : "loading"}</strong>
                            </h3>
                        </div>
                    </>
                ) : (
                    <NoResultsDisplay mainText={"Nothing to see here"} guideText={"Have you chosen a Property?"} />
                )}
            </div>
        </div>
    );
};

export default MonthlyRentStat;
