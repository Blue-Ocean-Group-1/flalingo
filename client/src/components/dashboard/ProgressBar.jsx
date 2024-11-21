const ProgressBar = ({ percentage }) => {
  return (
    <div className="progress-bar rounded">
      {!!percentage > 0 && (
        <div
          className={`h-6 ${percentage < 100 ? 'bg-pistachio' : 'bg-pistachio'} rounded-l absolute top-0 left-0 p-2`}
          style={{ width: `${percentage}%` }}
        ></div>
      )}
      {percentage < 100 ? (
        <div className="text-jet">Progress To Next Proficiency Level</div>
      ) : (
        <button className="progressText" type="button">
          Advance To Next Proficiency Level
        </button>
      )}
    </div>
  );
};

export default ProgressBar;
