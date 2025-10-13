import { useEffect, useState } from "react";

import classes from "./PwdPopup.module.css";

const PwdPopup = ({ topOffset, leftOffset, pwd, isShown }) => {
    const [reqObj, setReqObj] = useState({
        chars: false,
        num: false,
        specChar: false,
    });

    const offsetStyle = {
        top: topOffset,
        left: leftOffset,
    };

    useEffect(() => {
        setReqObj({
            chars: pwd.length >= 8,
            num: /\d/.test(pwd),
            specChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd),
        });
    }, [pwd]);

    if (isShown) {
        return (
            <div className={classes.anchor}>
                <div className={classes.mainContainer} style={offsetStyle}>
                    <span>
                        <div className={`${reqObj.chars ? classes.true : classes.false}`}>
                            {reqObj.chars ? "✔" : "x"}
                        </div>
                        <p>8 or More Characters</p>
                    </span>
                    <span>
                        <div className={`${reqObj.num ? classes.true : classes.false}`}>{reqObj.num ? "✔" : "x"}</div>
                        <p>Number</p>
                    </span>
                    <span>
                        <div className={`${reqObj.specChar ? classes.true : classes.false}`}>
                            {reqObj.specChar ? "✔" : "x"}
                        </div>
                        <p>Special Character</p>
                    </span>
                </div>
            </div>
        );
    }
};

export default PwdPopup;
