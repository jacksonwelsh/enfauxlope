import React from "react";

const CardDetails = () => {
  const [cardDetails, setCardDetails] = React.useState(undefined);

  React.useState(() => {
    fetch(`${process.env.REACT_APP_API_ROOT}/cards/details`)
      .then((r) => r.json())
      .then((t) => setCardDetails(t));
  }, []);

  return (
    <div className="container mx-auto my-4 px-2">
      <h1 className="text-6xl font-black my-4">About your card</h1>
      <p className="text-lg">
        Your Enfauxlope card can be used at any retailer that accepts Visa. You
        can configure limits at each category of merchant - think of it like the
        "envelope" method of budgeting.
      </p>
      <h2 className="text-5xl font-bold my-4">Card Details</h2>
      {cardDetails && (
        <div className="grid grid-cols-5 font-mono gap-x-4 gap-y-2">
          <div className="font-bold text-right">Card Number</div>
          <div className="col-span-4 select-all">
            {[0, 1, 2, 3].map((i) => (
              <span className="mr-2">
                {cardDetails.number.slice(i * 4, (i + 1) * 4)}
              </span>
            ))}
          </div>
          <div className="font-bold text-right">CVC/CVV</div>
          <div className="col-span-4">{cardDetails.cvc}</div>
          <div className="font-bold text-right">Expiration</div>
          <div className="col-span-4">
            {cardDetails.expMonth.toString().padStart(2, "0")}/
            {cardDetails.expYear}
          </div>
          <div className="font-bold text-right">Billing Address</div>
          <div className="col-span-4">
            {cardDetails.billingAddress.line1}
            <br />
            {cardDetails.billingAddress.line2}
            <br />
            {cardDetails.billingAddress.city},{" "}
            {cardDetails.billingAddress.state},{" "}
            {cardDetails.billingAddress.postal_code}
          </div>
          <div className="font-bold text-right">Cardholder</div>
          <div className="col-span-4">{cardDetails.cardholder}</div>
        </div>
      )}
    </div>
  );
};

export default CardDetails;
