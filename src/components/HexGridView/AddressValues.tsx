import { rowCount } from ".";

export const AddressValues = ({ offset }: { offset: number }) =>
  Array.from({ length: rowCount }).map((_, rowIndex) => (
    <div
      key={`line-${rowIndex}`}
      style={{
        color: "#000",
        gridColumnStart: 1,
        gridRowStart: rowIndex + 2,
      }}
    >
      {(Math.floor(offset / 16) + rowIndex)
        .toString(16)
        .padStart(8, "0")
        .toUpperCase()}
    </div>
  ));
