import { useState, useContext, useEffect } from "react";

import classes from "./RentsPage.module.css";

import RentPaymentsCtx from "../components/contexts/RentPaymentsCtx";
import chevUpIcon from "../assets/chevron-up-icon.svg";
import chevDownIcon from "../assets/chevron-down-icon.svg";
import plusIcon from "../assets/plus-icon.svg";

import RentItem from "../components/elements/items/RentItem";

const RentsPage = () => {
    const { ctxMonthPaymentList, setCtxMonthPaymentList, ctxAddPayment, ctxActiveDate, setCtxActiveDate } =
        useContext(RentPaymentsCtx);

    const [tempItem, setTempItem] = useState(null);
    const [tempDate, setTempDate] = useState(new Date());
    const [isExpanded, setIsExpanded] = useState(false);
    const [daysOverflow, setDaysOverflow] = useState(false);

    const currentMonth = ctxActiveDate.getMonth();
    const currentYear = ctxActiveDate.getFullYear();
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const displayedMonthName = monthNames[currentMonth];
    const daysStyle = {
        gridTemplateRows: daysOverflow ? "repeat(6, 1fr)" : "repeat(5, 1fr)",
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Calendar is formatted paymentList
    const [calendar, setCalendar] = useState(() => {
        const initialDays = [];
        const numDaysInMonth = getDaysInMonth(currentYear, currentMonth);

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        if (firstDayOfMonth + numDaysInMonth > 35) {
            setDaysOverflow(true);
        } else {
            setDaysOverflow(false);
        }

        // Days before start of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            initialDays.push({ id: `empty-${i}`, isEmpty: true });
        }

        for (let i = 0; i < numDaysInMonth; i++) {
            initialDays.push({
                id: i,
                hasEvent: ctxMonthPaymentList[i]?.length > 0,
                items: ctxMonthPaymentList[i] || [],
                dayOfMonth: i,
            });
        }

        // Days after end of month
        const totalDays = daysOverflow ? 42 : 35;
        while (initialDays.length < totalDays) {
            initialDays.push({ id: `empty-${initialDays.length}`, isEmpty: true });
        }

        return initialDays;
    });

    // Update calendar to reflect change in month, year, and payments
    useEffect(() => {
        const newDays = [];
        const numDaysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        if (firstDayOfMonth + numDaysInMonth > 35) {
            setDaysOverflow(true);
        } else {
            setDaysOverflow(false);
        }

        for (let i = 0; i < firstDayOfMonth; i++) {
            newDays.push({ id: `empty-${i}`, isEmpty: true });
        }

        for (let i = 0; i < numDaysInMonth; i++) {
            newDays.push({
                id: i,
                hasEvent: ctxMonthPaymentList[i]?.length > 0,
                items: ctxMonthPaymentList[i] || [],
                dayOfMonth: i,
            });
        }

        const totalDays = daysOverflow ? 42 : 35;
        while (newDays.length < totalDays) {
            newDays.push({ id: `empty-${newDays.length}`, isEmpty: true });
        }

        setCalendar(newDays);
    }, [currentMonth, currentYear, ctxMonthPaymentList]);

    useEffect(() => {
        if (!isExpanded) {
            setCtxActiveDate(tempDate);
        }
    }, [isExpanded]);

    const updateFields = (dayIndex, paymentId, newValues) => {
        setCtxMonthPaymentList((prev) => {
            const newPymtList = [...prev];

            const dayToUpdate = [...newPymtList[dayIndex]];

            const updatedDayPayments = dayToUpdate.map((payment) => {
                if (payment.id === paymentId) {
                    return { ...payment, ...newValues };
                }
                return payment;
            });

            newPymtList[dayIndex] = updatedDayPayments;

            return newPymtList;
        });
    };

    const handleMonthClick = (monthIndex) => {
        setTempDate((prev) => new Date(prev.getFullYear(), monthIndex));
        setIsExpanded(false);
    };

    const handleYearClick = (year) => {
        setTempDate((prev) => new Date(year, prev.getMonth()));
    };

    const addRentItem = (dayIndex, dayId) => {
        const newRentItem = {
            id: `temp-${dayId}`,
            status: "",
            amount: "",
            entity: "",
            date: `${currentYear}-${currentMonth + 1}-${dayId + 1}`,
        };
        setTempItem(newRentItem);
    };

    const removePayment = (dayIndex, paymentId) => {
        setCtxMonthPaymentList((prev) => {
            const oldPymtItems = [...prev];
            const dayItems = prev[dayIndex];

            const newDayItems = dayItems.filter((item) => item.id !== paymentId);

            oldPymtItems[dayIndex] = newDayItems;

            return oldPymtItems;
        });
    };

    const handleSaveRentPayment = async (dayIndex, payment) => {
        const newPayment = await ctxAddPayment(payment);
        setCtxMonthPaymentList((prev) => {
            const pymtItemsCopy = [...prev];
            const dayItems = pymtItemsCopy[dayIndex];

            const newDayItems = [...dayItems, newPayment];

            pymtItemsCopy[dayIndex] = newDayItems;

            return pymtItemsCopy;
        });
    };

    return (
        <>
            <div className={classes.mainContainer}>
                <section className={classes.header}>
                    <div className={classes.headerInfo}>
                        <div className={classes.dateDisplay}>
                            <h2>
                                {displayedMonthName} {ctxActiveDate.getFullYear()} Rents
                            </h2>
                            <img
                                className={classes.icon}
                                src={isExpanded ? chevUpIcon : chevDownIcon}
                                onClick={() => setIsExpanded((prev) => !prev)}
                                alt="Icon"
                            />
                        </div>
                        {isExpanded && (
                            <div className={classes.anchor}>
                                <div className={classes.dropDownContent}>
                                    <span>
                                        <img
                                            className={classes.icon}
                                            src={chevDownIcon}
                                            onClick={() => handleYearClick(tempDate.getFullYear() - 1)}
                                            alt="Icon"
                                        />
                                        <p>{tempDate.getFullYear()}</p>
                                        <img
                                            className={classes.icon}
                                            src={chevDownIcon}
                                            onClick={() => handleYearClick(tempDate.getFullYear() + 1)}
                                            alt="Icon"
                                        />
                                    </span>
                                    <div className={classes.months}>
                                        {monthNames.map((val, index) => {
                                            return (
                                                <p
                                                    className={`${tempDate.getMonth() == index && classes.active}`}
                                                    onClick={() => handleMonthClick(index)}
                                                    key={index}
                                                >
                                                    {val.slice(0, 3)}
                                                </p>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
                <section className={classes.calendar}>
                    <div className={classes.columnNames}>
                        {weekdayNames.map((val, index) => {
                            return (
                                <div key={index}>
                                    <p>{val}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className={classes.days} style={daysStyle}>
                        {calendar.map((day, dayIndex) => (
                            <div
                                className={`${classes.dayBox} ${
                                    String(day.id).startsWith("empty") && classes.emptyBox
                                }`}
                                key={day.id}
                            >
                                {!String(day.id).startsWith("empty") && (
                                    <div className={classes.header}>
                                        <div onClick={() => addRentItem(dayIndex, day.id)}>
                                            <img className={classes.icon} src={plusIcon} alt="Icon" />
                                        </div>
                                        <p>{day.id + 1}</p>
                                    </div>
                                )}
                                {day.hasEvent &&
                                    day.items.length > 0 &&
                                    day.items.map((item, itemIndex) => {
                                        return (
                                            <RentItem
                                                item={item}
                                                dayIndex={day.id}
                                                updateFields={updateFields}
                                                removePayment={removePayment}
                                                handleSaveRentPayment={handleSaveRentPayment}
                                                key={item.id}
                                                pushLeft={dayIndex % 7 == 6}
                                                pushUp={dayIndex >= calendar.length - 7}
                                            />
                                        );
                                    })}
                                {tempItem && tempItem.id === `temp-${day.id}` && (
                                    <RentItem
                                        item={tempItem}
                                        dayIndex={day.id}
                                        updateFields={updateFields}
                                        removePayment={() => setTempItem(null)}
                                        handleSaveRentPayment={handleSaveRentPayment}
                                        key={tempItem.id}
                                        pushLeft={dayIndex % 7 == 6}
                                        pushUp={dayIndex >= calendar.length - 7}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};

export default RentsPage;
