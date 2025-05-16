import { Review } from "@/utils/types/review";
import React from "react";
import { DataTable } from "./dataTable";
import { columns } from "./cityNoteColums";

function Review({ date, positif, negatif, note }: Review) {
  return (
    <div className="bg-slate-50 p-2 rounded">
        {<DataTable columns={columns} data={[note]} />}
        <p>{positif}</p>
        <p>{negatif}</p>
    </div>
  );
}

export default Review;
