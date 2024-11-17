const BadgeFlag = ({ badge, flag }) => {
  return (
    <div className="max-h-20 max-w-20 relative">
      <img src={badge} alt="badge" />
      <img
        src={flag}
        alt="flag"
        className="absolute bottom-3 right-3 max-w-6 border border-black"
      />
    </div>
  );
};

export default BadgeFlag;
