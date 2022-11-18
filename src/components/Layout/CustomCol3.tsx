import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function CustomCol3({ children }: Props) {
  return (
    <div className="custom_col_3">
        {children}
    </div>
  )
}