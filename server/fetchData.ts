import { getDocs } from 'firebase/firestore';
const fetchData = async (args: any) => {
  let loading = true;
  let size;
  const data: any = [];
  try {
    const querySnapshot = await getDocs(args);

    querySnapshot.forEach((doc) => {
      // Here, you can access the document data
      data.push(doc.data());
    });
    loading = false;
    size = querySnapshot.size;
    // console.table(data);
    // mappingBtsData(data);
    // mappingBtsCalc(data);

    // console.log('array', btsData.value);
  } catch (error) {
    console.error('Error getting data:', error);
  }
  return { data, loading, size };
};

export default fetchData;
