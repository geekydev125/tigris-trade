import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function CustomCol1({ children }: Props) {
  return (
    <div className="custom_col_1">
        {children}
    </div>
  )
}