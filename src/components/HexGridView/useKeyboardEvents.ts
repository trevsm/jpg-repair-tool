import { useEffect, useState } from "react";

interface UseHexGridKeyboardProps {
  hexData: string[];
  setHexData: (hexData: string[]) => void;
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
}

export function useKeyboardEvents({
  hexData,
  setHexData,
  selectedIndex,
  setSelectedIndex,
}: UseHexGridKeyboardProps) {
  const [hexDataHistory, setHexDataHistory] = useState<
    { hexData: string[]; index: number | null }[]
  >([]);
  const [tempChar, setTempChar] = useState("");

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedIndex === null) return;
    const newHexData = [...hexData];

    if (e.ctrlKey && e.key === "z") {
      const lastHistory = hexDataHistory.pop();
      if (lastHistory) {
        setHexData(lastHistory.hexData);
        if (lastHistory.index !== null) {
          setSelectedIndex(lastHistory.index);
        }
      }
      return;
    }

    if (e.key === "Backspace") {
      newHexData.splice(selectedIndex - 1, 1);
      setHexDataHistory([
        ...hexDataHistory,
        { hexData: [...hexData], index: selectedIndex },
      ]);
      setHexData(newHexData);
      setSelectedIndex(Math.max(0, selectedIndex - 1));
      setTempChar("");
    }

    if (e.key === "Delete") {
      newHexData.splice(selectedIndex, 1);
      setHexDataHistory([
        ...hexDataHistory,
        { hexData: [...hexData], index: selectedIndex },
      ]);
      setHexData(newHexData);
      setSelectedIndex(Math.max(0, selectedIndex));
      setTempChar("");
    }

    if (/^[0-9a-fA-F]$/.test(e.key)) {
      if (tempChar === "") {
        setTempChar(e.key);
      } else {
        newHexData.splice(selectedIndex, 0, tempChar + e.key);
        setHexDataHistory([
          ...hexDataHistory,
          { hexData: [...hexData], index: selectedIndex },
        ]);
        setHexData(newHexData);
        setSelectedIndex(selectedIndex + 1);
        setTempChar("");
      }
    }

    if (e.key === "ArrowLeft") {
      setSelectedIndex(Math.max(0, selectedIndex - 1));
    }

    if (e.key === "ArrowRight") {
      setSelectedIndex(Math.min(hexData.length - 1, selectedIndex + 1));
    }

    if (e.key === "ArrowUp") {
      setSelectedIndex(Math.max(0, selectedIndex - 16));
    }

    if (e.key === "ArrowDown") {
      setSelectedIndex(Math.min(hexData.length - 1, selectedIndex + 16));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hexData, hexDataHistory, selectedIndex, tempChar]);
}
