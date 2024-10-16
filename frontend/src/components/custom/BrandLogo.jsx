import appLogo from "assets/SiteIcon.png";
const BrandLogo = () => {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <img width="35" height="35" src={appLogo} alt="money-bag" className="me-2" />
      <span
        className="title"
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#ffffff",
        }}
      >
        My
        <span
          className="cLetter"
          style={{
            color: "#ffd700",
          }}
        >
          C
        </span>
        ash
      </span>
    </div>
  );
};
export default BrandLogo;
