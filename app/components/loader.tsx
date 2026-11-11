const boxes = ["box0", "box1", "box2", "box3", "box4", "box5", "box6", "box7"];

export default function Loader() {
  return (
    <div className="loader" role="status" aria-label="Loading Tuffskin Houston">
      {boxes.map((boxClass, index) => (
        <div className={`box ${boxClass}`} key={boxClass}>
          <div />
        </div>
      ))}
      <div className="ground">
        <div />
      </div>
    </div>
  );
}
