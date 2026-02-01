import { Accordion, AccordionDetails, AccordionSummary, Alert, alertClasses, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useMemo, useState, type ReactNode, lazy, Suspense } from "react";
import { ModeSwitcher } from "~/components/ModeSwitcher";
import { AuthGuardUserContext } from "~/context/AuthGuardUserContext";
import { APIManager, type PickupObject, type PickupRequestObject } from "~/managers/APIManager";
import type { MarkerData } from "~/components/MapComponent";

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = lazy(() => import("~/components/MapComponent").then(module => ({ default: module.MapComponent })));


export const VolunteerDashboard = (): ReactNode => {
    const [alerts, setAlerts] = useState<PickupRequestObject[]>();
    const [pickupMap, setPickupMap] = useState<{ [K: string]: PickupObject | undefined; }>({});
    const [fullyLoaded, setFullyLoaded] = useState(false);
    const [responses, setResponses] = useState(false);
    const [reloadThingsToggle, setReloadThingsToggle] = useState(false);
    const ctx = useContext(AuthGuardUserContext);

    const me = ctx?.me;

    useEffect(() => {
        APIManager.PickupRequest.getActive().then(x => {
            setAlerts(x);
            console.log("here");
            console.log(x);
        });
    }, [reloadThingsToggle]);

    useEffect(() => {
        let newMap = pickupMap;
        setFullyLoaded(false);
        alerts?.forEach(async (x, i, a) => {
            newMap[x.pickupPointID] = await APIManager.Pickup.get(x.pickupPointID);
            setPickupMap(newMap);
            if (i == a.length - 1) setFullyLoaded(true);
        });
    }, [alerts]);

    useEffect(() => {

    });

    const reload = () => {
        setReloadThingsToggle(!reloadThingsToggle);
    };

    // Parse location strings and create markers for the map
    const markers = useMemo(() => {
        if (!fullyLoaded || !alerts) return [];

        return alerts
            .map(alert => {
                const pickup = pickupMap[alert.pickupPointID];
                if (!pickup?.location) return null;

                // Parse location string - expecting "lat,lng" format
                const [lat, lng] = pickup.location.split(",").map(coord => parseFloat(coord.trim()));

                if (isNaN(lat) || isNaN(lng)) return null;

                return {
                    lat,
                    lng,
                    label: pickup.name,
                    id: pickup.id
                } as MarkerData;
            })
            .filter((marker): marker is MarkerData => marker !== null);
    }, [alerts, pickupMap, fullyLoaded]);

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

                {
                    !fullyLoaded || !alerts ?
                        <Typography>
                            loading...
                        </Typography>
                        :
                        alerts.length == 0 ?
                            <Typography>
                                none
                            </Typography>
                            :
                            alerts.map(x => (
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
