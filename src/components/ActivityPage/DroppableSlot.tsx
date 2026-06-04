import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

interface Props {
  id: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  role?: string;
  tabIndex?: number;
}

const DroppableSlot: React.FC<Props> = ({
  id,
  children,
  className = "",
  onClick,
  onKeyDown,
  role,
  tabIndex,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`${className} ${
        isOver ? "ring-2 ring-indigo-500 border-indigo-400 bg-indigo-500/10" : ""
      }`}
    >
      {children}
    </div>
  );
};

export default DroppableSlot;
