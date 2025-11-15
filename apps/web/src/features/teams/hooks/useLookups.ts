import { useEffect, useState } from "react";
import { apiGetSports, apiGetLeagues } from "../api/teams";
import type { SportLookup, League } from "../types/teams";

export function useLookups() {
    const [sports, setSports] = useState<SportLookup[]>([]);
    const [leagues, setLeagues] = useState<League[]>([]);

    useEffect(() => {
        apiGetSports().then((data) => setSports(Array.isArray(data) ? data : []));
        apiGetLeagues().then((data) => setLeagues(Array.isArray(data) ? data : []));
    }, []);

    return { sports, leagues };
}
