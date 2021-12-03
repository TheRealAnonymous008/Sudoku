import { Cell, getRegionDifference, getRegionIntersection, regionEliminateCandidate, getElementsWithCandidate, regionHasValue } from "../../logic/Cell";
import { Deduction, isValid } from "../../logic/Deduction";
import { TableState } from "../../logic/rulesets/TableState";

export default function intersectionRemoval (table : TableState, n : number) : Deduction{

    // STRATEGY:        We consider the subregions (regions of more than one element)  that are formed from the intersection of regions 
    //                  R, S := the two regions as input
    //                  A := the intersection of these regions.
    //                  We assume that R and S do not already contain n.
    //                  If a series of candidates appears in exactly one of (R - A) and (S - A), say T. Then eliminate
    //                  All instances of that candidate in subregion T.
    
    //                  This stems from the fact that if it appears in subregion T, the other region will have no place to put the candidate.

    let c : Deduction = {
        cause : [],
        effect : []
    };

    for (let r = 0; r < table.regions.length; r++) {
        for (let s = r + 1; s < table.regions.length; s++) {
            const R = table.regions[r];
            const S = table.regions[s];
            
            c =  regionElimination(R, S, n);
            if (isValid(c)) 
                return c;
        }
    }
    return c;
}

export function regionElimination(R : Cell[], S : Cell[], n : number)  : Deduction{
    const A = getRegionIntersection(R, S);
    let deduction : Deduction = {
        cause : [],
        effect : []
    };
    
    if (A.length <= 1 || regionHasValue(R, n) || regionHasValue(S, n)) {
        return deduction;
    }

    let Rprime = getRegionDifference(R, A);
    let Sprime = getRegionDifference(S, A);

    let isInR : boolean = (getElementsWithCandidate(Rprime, n).length !== 0);
    let isInS : boolean = (getElementsWithCandidate(Sprime, n).length !== 0);

    if ((isInR && !isInS) || (!isInR && isInS)) {
        let result : boolean;
        // Eliminate all instances of the candidate from T.
        if (isInR) {
            result  = regionEliminateCandidate(Rprime, n);
            deduction.effect = deduction.effect.concat(Rprime);
        }
        else {
            result =  regionEliminateCandidate(Sprime, n);
            deduction.effect = deduction.effect.concat(Sprime);
        }
        
       deduction.cause = deduction.cause.concat(A);
       return deduction;
    }

    return deduction;
}