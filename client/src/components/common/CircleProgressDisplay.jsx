import './circleProgress.css';

const CircleProgressDisplay = ({ ring, percentage }) => {
  return (
    <div className="relative flex justify-center items-center w-20 h-20">
      <svg
        className="circle-progress"
        width="120"
        height="120"
        viewBox="0 0 120 120"
      >
        <circle
          className="fill-none stroke-[#e6e6e6] stroke-[10] "
          cx="60"
          cy="60"
          r="50"
        ></circle>
        <circle
          className="circle-progress-bar"
          cx="60"
          cy="60"
          r="50"
          strokeDashoffset={ring}
        ></circle>
      </svg>
      <p className="font-bold absolute top-[calc(50% -.75rem)] text-jet">{`${percentage}%`}</p>
    </div>
  );
};

export default CircleProgressDisplay;
