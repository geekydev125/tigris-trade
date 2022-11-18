import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function CustomCol2({ children }: Props) {
  return (
    <div className="custom_col_2">
        {children}
    </div>
  )
}