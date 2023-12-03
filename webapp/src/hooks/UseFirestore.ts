import { Dayjs } from "dayjs";
import { collection, query, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

export const useTrafficsByDate = (date: Dayjs) => {
  const startDate = date.startOf("date");
  const endDate = startDate.add(1, "day");

  const col = collection(useFirestore(), "traffics");
  const colQuery = query(
    col, 
    where("datetime", ">=", startDate.toDate()),
    where("datetime", "<", endDate.toDate())
    );
  try {
    return useFirestoreCollectionData(colQuery);
  } catch (error) {
    throw error;
  }
}
