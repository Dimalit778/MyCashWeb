import { THEME } from "constants/Theme";

const { default: CountUp } = require("react-countup");

const StatsCard = ({ title, amount, isBalance = false, isPositive = false }) => {
  return (
    <div
      className="rounded-3 shadow-md text-center p-2"
      style={{
        background: THEME.card,

        transition: "all 0.3s ease",
      }}
    >
      <div className="d-flex flex-column">
        <h3 className="text-uppercase text-dark">{title}</h3>
        <h5
          className="mb-0"
          style={{
            color: isBalance ? (isPositive ? "#28a745" : "#dc3545") : THEME.secondary,
          }}
        >
          <CountUp start={0} end={amount} separator="," decimals={2} prefix="$" duration={2.5} />
        </h5>
      </div>
    </div>
  );
};

export default StatsCard;
