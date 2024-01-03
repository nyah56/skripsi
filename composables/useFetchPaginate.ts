import { getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
const fetchData = async (args: any, orderField: any) => {
  let loading = true;
  let size;
  let snapshot;
  let nextSnapshot;
  const data: any = [];
  try {
    const snapShots = await getDocs(args);
    const q = query(args, orderBy(orderField), limit(10));
    const querySnapshot = await getDocs(q);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    // console.log(lastVisible);
    const next = query(
      args,
      orderBy(orderField),
      startAfter(lastVisible),
      limit(10)
    );
    nextSnapshot = await getDocs(next);
    // console.log(nextSnapshot);
    snapshot = querySnapshot;
    loading = false;
    size = snapShots.size;

    // mappingBtsData(data);
    // mappingBtsCalc(data);

    // console.log('array', btsData.value);
  } catch (error) {
    console.error('Error getting data:', error);
  }
  return { data, loading, size, snapshot, nextSnapshot };
};

export default fetchData;
