export default function cartesianProduct <T> (A : T[], B : T[]) : T[][] {
    
    const result : T[][] = [];

    for (let i = 0 ; i < A.length; i++) {
        for (let j = 0; j < B.length ; j ++) {
            result.push([A[i], B[j]]);
        }
    }

    return result;
}

