import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function Container({ children }: Props) {
  return (
    <section className="trade_area">
        <div className="custom_container">
            <div className="custom_row">
                {children}
            </div>
        </div>
    </section>
  )
}