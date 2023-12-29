import { getDocs, orderBy, query } from 'firebase/firestore';
const fetchData = async (args: any, orderField: string) => {
  let loading = true;
  let size;
  const data: any = [];
  try {
    const q = query(args, orderBy(orderField));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // Here, you can access the document data
      data.push(doc.data());
    });
    loading = false;
    size = querySnapshot.size;

    // mappingBtsData(data);
    // mappingBtsCalc(data);

    // console.log('array', btsData.value);
  } catch (error) {
    console.error('Error getting data:', error);
  }
  return { data, loading, size };
};

export default fetchData;
