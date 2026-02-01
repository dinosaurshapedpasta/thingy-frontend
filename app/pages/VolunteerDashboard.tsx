import { Accordion, AccordionDetails, AccordionSummary, Alert, alertClasses, Box, Button, Paper, Stack, Typography } from "@mui/material";
import DmsCoordinates, { parseDms } from "dms-conversion";
import { lazy, Suspense, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MarkerData } from "~/components/Map";
import { ModeSwitcher } from "~/components/ModeSwitcher";
import { AuthGuardUserContext } from "~/context/AuthGuardUserContext";
import { APIManager, type PickupObject, type PickupRequestObject, type PickupRequestResponseObject } from "~/managers/APIManager";

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = lazy(() => import("~/components/Map").then(module => ({ default: module.MapComponent })));

export const VolunteerDashboard = (): ReactNode => {
    const [alerts, setAlerts] = useState<PickupRequestObject[]>();
    const [pickupMap, setPickupMap] = useState<{ [K: string]: PickupObject | undefined; }>({});
    const [fullyLoaded1, setFullyLoaded1] = useState(false);
    const [fullyLoaded2, setFullyLoaded2] = useState(false);
    const [responses, setResponses] = useState<{ [K: string]: PickupRequestResponseObject[] | undefined; }>({});
    const [reloadThingsToggle, setReloadThingsToggle] = useState(false);
    const ctx = useContext(AuthGuardUserContext);

    const me = ctx?.me;

    useEffect(() => {
        APIManager.PickupRequest.getActive().then(x => {
            setAlerts(x);
        });
    }, [reloadThingsToggle]);

    useEffect(() => {
        let newMap = pickupMap;
        setFullyLoaded1(false);
        alerts?.forEach(async (x, i, a) => {
            newMap[x.pickupPointID] = await APIManager.Pickup.get(x.pickupPointID);
            setPickupMap(newMap);
            if (i == a.length - 1) setFullyLoaded1(true);
        });
    }, [alerts]);

    useEffect(() => {
        let newResponses = responses;
        setFullyLoaded2(false);
        alerts?.forEach(async (x, i, a) => {
            newResponses[x.id] = await APIManager.PickupRequest.getResponses(x.id);
            setResponses(newResponses);
            if (i == a.length - 1) setFullyLoaded2(true);
        });
    }, [alerts]);

    const reload = () => {
        setReloadThingsToggle(!reloadThingsToggle);
    };

    const fullyLoaded = fullyLoaded1 && fullyLoaded2;

    const filteredAlerts = alerts?.filter(x => !responses[x.id]?.map(y => y.userID).includes(me?.id || ""));

    const markers = useMemo(() => {
        const pickupMarkers = !fullyLoaded || !alerts ? [] : alerts.map(alert => {
            const pickup = pickupMap[alert.pickupPointID];
            if (!pickup?.location) return undefined;

            // Parse location string - expecting "lat,lng" format
            const [lat, lng] = pickup.location.split(" ").map(parseDms);

            if (isNaN(lat) || isNaN(lng)) return null;

            return {
                lat,
                lng,
                label: pickup.name,
                id: pickup.id,
                color: 'red'
            } as MarkerData;
        })
            .filter((marker): marker is MarkerData => marker !== null);

        // Add Houses of Parliament marker
        const parliamentMarker: MarkerData = {
            lat: 51.4995,
            lng: -0.1248,
            label: "Houses of Parliament",
            id: "parliament"
        };

        return [...pickupMarkers, parliamentMarker];
    }, [fullyLoaded, alerts, pickupMap]);

    return (
        <Stack
            sx={theme => ({
                flexDirection: "column",
                [theme.breakpoints.up("md")]: {
                    flexDirection: "row"
                },
                p: 2
            })}
            gap={2}
        >
            <Box>
                <Paper
                    variant="outlined"
                    sx={theme => ({
                        p: 2,
                        [theme.breakpoints.up("md")]: {
                            width: "40vw"
                        },
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        height: "80vh"
                    })}
                >
                    <Suspense fallback={
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%"
                            }}
                        >
                            <Typography>Loading map...</Typography>
                        </Box>
                    }>
                        <MapComponent
                            markers={markers}
                            height="100%"
                            zoom={13}
                            routeStart={markers.length > 0 ? [markers[0].lat, markers[0].lng] : undefined}
                            routeEnd={[51.4995, -0.1248]}
                        />
                    </Suspense>
                    <ModeSwitcher />
                </Paper>
            </Box>
            <Box>
                <Typography
                    variant="h2"
                >
                    hi{" "}
                    <span
                        style={{
                            color: "#69c3ff"
                        }}
                    >
                        {me?.name}
                    </span>
                    , you're a volunteer!
                </Typography>
                <Typography
                    sx={{
                        opacity: 0.6
                    }}
                >
                    id: {me?.id}
                </Typography>

                <Typography
                    variant="h3"
                    sx={{
                        mt: 3,
                        mb: 1
                    }}
                >
                    job alerts
                </Typography>

                <Stack
                    gap={2}
                >
                    {
                        !fullyLoaded || !alerts ?
                            <Typography>
                                loading...
                            </Typography>
                            :
                            filteredAlerts?.length == 0 ?
                                <Typography>
                                    none
                                </Typography>
                                :
                                filteredAlerts?.map(x => (
                                    <Alert
                                        severity="info"
                                        variant="filled"
                                        sx={{
                                            [`& .${alertClasses.message}`]: {
                                                flexGrow: 1
                                            }
                                        }}
                                    >
                                        <Typography>
                                            New pickup request at {pickupMap[x.pickupPointID]?.name || x.pickupPointID}!!
                                        </Typography>
                                        <Stack
                                            justifyContent="end"
                                            width={1}
                                            gap={2}
                                            direction="row"
                                            alignItems="center"
                                        >
                                            <Button
                                                color="error"
                                                variant="contained"
                                                onClick={async () => {
                                                    await APIManager.PickupRequest.deny(x.id);
                                                    reload();
                                                }}
                                            >
                                                deny
                                            </Button>
                                            <Button
                                                color="success"
                                                variant="contained"
                                                onClick={async () => {
                                                    await APIManager.PickupRequest.accept(x.id);
                                                    reload();
                                                }}
                                            >
                                                accept
                                            </Button>
                                        </Stack>
                                    </Alert>
                                ))
                    }
                </Stack>

                <Typography
                    variant="h3"
                    sx={{
                        mt: 3,
                        mb: 1
                    }}
                >
                    upcoming jobs
                </Typography>

                {
                    [
                        "14:00 job 1",
                        "15:00 job 2",
                        "16:00 job 3"
                    ].map(x => (
                        <Accordion
                            variant="outlined"
                            key={x}
                        >
                            <AccordionSummary>
                                <Typography>
                                    {x}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                job from x to y, taking n minutes
                            </AccordionDetails>
                        </Accordion>
                    ))
                }

            </Box>
        </Stack>
    );
};
