import { THEME } from "constants/Theme";

import CountUp from "react-countup";

const StatsCard = ({ dataCy, title, amount, isBalance = false, isPositive = false }) => {
  const textColor = isBalance
    ? isPositive
      ? "rgb(40, 167, 69)" // Green for positive
      : "rgb(220, 53, 69)" // Red for negative
    : THEME.secondary;

  return (
    <div
      className="rounded-3 shadow-md text-center p-2"
      style={{
        background: THEME.card,

        transition: "all 0.3s ease",
      }}
    >
      <div data-cy={`${dataCy}`} className="d-flex flex-column">
        <h3 className="text-uppercase text-dark">{title}</h3>
        <h5
          data-amount={amount}
          className="mb-0"
          style={{
            color: textColor,
          }}
        >
          <CountUp start={0} end={amount} separator="," decimals={2} prefix="$" duration={2.5} />
        </h5>
      </div>
    </div>
  );
};

export default StatsCard;
