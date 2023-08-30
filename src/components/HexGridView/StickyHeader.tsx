export const StickyHeader = () => (
  <>
    <div className="sticky sticky-top">Offset</div>
    <div className="sticky sticky-top"></div>
    {Array.from({ length: 16 }).map((_, colIndex) => (
      <div key={`header-${colIndex}`} className="sticky sticky-top">
        {colIndex.toString(16).padStart(2, "0").toUpperCase()}
      </div>
    ))}
    <div className="sticky sticky-top"></div>
    <div className="sticky sticky-top">ASCII</div>
  </>
);
