import type { Facility } from "@/features/facilities/types/facilities";
export function getFacilityName(facilityId: string | undefined, allFacilities: Facility[]){
    try{
        const facility = allFacilities.find(f => f.id === facilityId)
        if(facility?.name == undefined){
            return facilityId
        }
        else{
            return facility.name
        } 
    }
    catch{
        return facilityId
    }
}