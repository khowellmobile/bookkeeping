import { useState, useContext, useEffect } from "react";

import classes from "./RentsPage.module.css";

import RentPaymentsCtx from "../components/contexts/RentPaymentsCtx";
import chevUpIcon from "../assets/chevron-up-icon.svg";
import chevDownIcon from "../assets/chevron-down-icon.svg";

import AddRentModal from "../components/elements/modals/AddRentModal";
import RentItem from "../components/elements/items/RentItem";

const RentsPage = () => {
    const { ctxPaymentList, getCtxPaymentsByMonth } = useContext(RentPaymentsCtx);

    const [activeDate, setActiveDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tPymtList, setTPymtList] = useState([]);

    const currentMonth = activeDate.getMonth();
    const currentYear = activeDate.getFullYear();
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
    const displayedMonthName = monthNames[currentMonth];

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const payments = await getCtxPaymentsByMonth(currentMonth + 1, currentYear);
                setTPymtList(payments);
            } catch (error) {
                console.error("Failed to fetch payments:", error);
            }
        };

        fetchPayments();
    }, [currentMonth, currentYear, getCtxPaymentsByMonth]);

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Calendar is formatted paymentList
    const [calendar, setCalendar] = useState(() => {
        const initialDays = [];
        const numDaysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        // Days before start of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            initialDays.push({ id: `empty-${i}`, isEmpty: true });
        }

        for (let i = 1; i <= numDaysInCurrentMonth; i++) {
            initialDays.push({
                id: i,
                hasEvent: tPymtList[i - 1]?.length > 0,
                items: tPymtList[i - 1] || [],
                dayOfMonth: i,
            });
        }

        // Days after end of month
        while (initialDays.length < 35) {
            initialDays.push({ id: `empty-${initialDays.length}`, isEmpty: true });
        }

        return initialDays;
    });

    // Update calendar to reflect change in month, year, and payments
    useEffect(() => {
        const newDays = [];
        const numDaysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        for (let i = 0; i < firstDayOfMonth; i++) {
            newDays.push({ id: `empty-${i}`, isEmpty: true });
        }

        for (let i = 0; i < numDaysInMonth; i++) {
            newDays.push({
                id: i,
                hasEvent: tPymtList[i]?.length > 0,
                items: tPymtList[i] || [],
                dayOfMonth: i,
            });
        }

        while (newDays.length < 35) {
            newDays.push({ id: `empty-${newDays.length}`, isEmpty: true });
        }

        setCalendar(newDays);
    }, [currentMonth, currentYear, tPymtList]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const changeStatus = (dayIndex, paymentId, newStatus) => {
        setTPymtList((prev) => {
            const newTPymtList = [...prev];

            const dayToUpdate = [...newTPymtList[dayIndex]];

            const updatedDayPayments = dayToUpdate.map((payment) => {
                if (payment.id === paymentId) {
                    return { ...payment, status: newStatus };
                }
                return payment;
            });

            newTPymtList[dayIndex] = updatedDayPayments;

            return newTPymtList;
        });
    };

    const changeAmount = (dayIndex, paymentId, newAmount) => {
        setTPymtList((prev) => {
            const newTPymtList = [...prev];

            const dayToUpdate = [...newTPymtList[dayIndex]];

            const updatedDayPayments = dayToUpdate.map((payment) => {
                if (payment.id === paymentId) {
                    return { ...payment, amount: newAmount };
                }
                return payment;
            });

            newTPymtList[dayIndex] = updatedDayPayments;

            return newTPymtList;
        });
    };

    const changeEntity = (dayIndex, paymentId, newEntity) => {
        setTPymtList((prev) => {
            const newTPymtList = [...prev];

            const dayToUpdate = [...newTPymtList[dayIndex]];

            const updatedDayPayments = dayToUpdate.map((payment) => {
                if (payment.id === paymentId) {
                    return { ...payment, entity: newEntity };
                }
                return payment;
            });

            newTPymtList[dayIndex] = updatedDayPayments;

            return newTPymtList;
        });
    };

    const updateFields = (dayIndex, paymentId, newValues) => {
        setTPymtList((prev) => {
            const newTPymtList = [...prev];

            const dayToUpdate = [...newTPymtList[dayIndex]];

            const updatedDayPayments = dayToUpdate.map((payment) => {
                if (payment.id === paymentId) {
                    return { ...payment, ...newValues };
                }
                return payment;
            });

            newTPymtList[dayIndex] = updatedDayPayments;

            return newTPymtList;
        });
    };

    useEffect(() => {
        console.log(tPymtList);
    }, [tPymtList]);

    /* useEffect(() => {
        console.log(calendar);
    }, [calendar]); */

    return (
        <>
            {isModalOpen && <AddRentModal handleCloseModal={handleCloseModal} />}

            <div className={classes.mainContainer}>
                <div className={classes.calendarContainer}>
                    <span>
                        <h2>
                            {displayedMonthName} {activeDate.getFullYear()} Rents
                        </h2>
                        <img className={classes.icon} src={chevDownIcon} alt="Icon" />
                    </span>
                    <section className={classes.calendar}>
                        <div className={classes.columnNames}>
                            <div>
                                <p>Sunday</p>
                            </div>
                            <div>
                                <p>Monday</p>
                            </div>
                            <div>
                                <p>Tuesday</p>
                            </div>
                            <div>
                                <p>Wednesday</p>
                            </div>
                            <div>
                                <p>Thursday</p>
                            </div>
                            <div>
                                <p>Friday</p>
                            </div>
                            <div>
                                <p>Saturday</p>
                            </div>
                        </div>
                        <div className={classes.days}>
                            {calendar.map((day, dayIndex) => (
                                <div className={classes.dayBox} key={day.id}>
                                    <p>{day.id + 1}</p>
                                    {day.hasEvent &&
                                        day.items.length > 0 &&
                                        day.items.map((item, itemIndex) => {
                                            return (
                                                <RentItem
                                                    item={item}
                                                    dayIndex={day.id}
                                                    updateFields={updateFields}
                                                    key={item.id}
                                                />
                                            );
                                        })}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default RentsPage;
