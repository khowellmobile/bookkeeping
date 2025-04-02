import PropertyListItem from "../items/PropertyListItem.jsx";
import classes from "./PropertyListing.module.css";

const PropertyListing = () => {
    return (
        <div className={classes.mainContainer}>
            <section className={classes.header}>
                <h2>Properties</h2>
            </section>
            <section className={classes.columnNames}>
                <div>
                    <p>Address</p>
                </div>
                <div>
                    <p>Rent</p>
                </div>
                <div>
                    <p>Rent Due</p>
                </div>
            </section>
            <section className={classes.items}>
                <PropertyListItem address="456 Oak St" rent="$1,200" rentDue="4/5/25" />
                <PropertyListItem address="789 Pine St" rent="$1,800" rentDue="4/10/25" />
                <PropertyListItem address="101 Maple Ave" rent="$1,350" rentDue="4/15/25" />
                <PropertyListItem address="202 Birch Rd" rent="$2,000" rentDue="4/20/25" />
                <PropertyListItem address="303 Cedar Blvd" rent="$1,450" rentDue="4/25/25" />
                <PropertyListItem address="404 Elm St" rent="$1,600" rentDue="5/1/25" />
                <PropertyListItem address="505 Oakwood Dr" rent="$1,750" rentDue="5/5/25" />
                <PropertyListItem address="606 Willow Ln" rent="$1,400" rentDue="5/10/25" />
                <PropertyListItem address="707 Maplewood Dr" rent="$2,100" rentDue="5/15/25" />
                <PropertyListItem address="808 Pinehill Rd" rent="$1,900" rentDue="5/20/25" />
                <PropertyListItem address="909 Spruce St" rent="$1,600" rentDue="5/25/25" />
                <PropertyListItem address="1010 Redwood Ave" rent="$2,200" rentDue="6/1/25" />
                <PropertyListItem address="1111 Chestnut St" rent="$2,500" rentDue="6/5/25" />
            </section>
        </div>
    );
};

export default PropertyListing;
