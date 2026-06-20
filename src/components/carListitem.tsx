import React from "react";

interface CarProps {
  engineId: string;
  plateNo: string;
  color: string;
  status: string;
}

interface Props {
  car: CarProps;
}

export default function CarListItem({ car }: Props) {
  return (
    <tr style={{ boxShadow: "0 0 0 1px #dee2e6", borderRadius: "20px" }}>

      <td className="border-0 rounded-start py-3">
        {car.engineId}
      </td>

      <td className="border-0 py-3">
        {car.plateNo}
      </td>

      <td className="border-0 py-3">
        {car.color}
      </td>

      <td className="border-0 py-3">
        {car.status}
      </td>

      <td className="border-0 rounded-end py-3">
        <button className="btn btn-sm">
          <i className="bi bi-chevron-right"></i>
        </button>
      </td>

    </tr>
  );
}