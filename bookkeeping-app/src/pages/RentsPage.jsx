import { useState, useContext, useEffect } from "react";

import classes from "./RentsPage.module.css";

import RentPaymentsCtx from "../components/contexts/RentPaymentsCtx";
import chevUpIcon from "../assets/chevron-up-icon.svg";
import chevDownIcon from "../assets/chevron-down-icon.svg";

import AddRentModal from "../components/elements/modals/AddRentModal";

const RentsPage = () => {
    const { ctxPaymentList } = useContext(RentPaymentsCtx);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [days, setDays] = useState(() => {
        const initialDays = [];
        for (let i = 1; i <= 35; i++) {
            initialDays.push({ id: i });
        }
        return initialDays;
    });

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {isModalOpen && <AddRentModal handleCloseModal={handleCloseModal} />}

            <div className={classes.mainContainer}>
                <span>
                    <h2>June 2025 Rents</h2>
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
                        {days.map((val, index) => {
                            return (
                                <div className={classes.dayBox} key={index}>
                                    {index}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </>
    );
};

export default RentsPage;
