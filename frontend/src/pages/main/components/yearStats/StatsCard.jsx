const { default: CountUp } = require("react-countup");

const StatsCard = ({ title, amount, isBalance = false, isPositive = false }) => {
  const backgroundGradients = {
    Expenses: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    Incomes: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    Balance: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  };

  return (
    <div
      className="rounded-3 shadow-md text-center p-2"
      style={{
        background: backgroundGradients[title] || backgroundGradients.Balance,
        transition: "all 0.3s ease",
      }}
    >
      <div className="d-flex flex-column">
        <h3 className="text-uppercase  ">{title}</h3>
        <h4
          className="mb-0"
          style={{
            color: isBalance ? (isPositive ? "#28a745" : "#dc3545") : "#333",
          }}
        >
          <CountUp start={0} end={amount} separator="," decimals={2} prefix="$" duration={2.5} />
        </h4>
      </div>
    </div>
  );
};

export default StatsCard;
