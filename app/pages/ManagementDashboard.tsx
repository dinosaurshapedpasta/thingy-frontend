import { Alert, alertClasses, Box, Button, FormControl, FormLabel, Paper, Stack, TextField, Typography } from "@mui/material";
import { lazy, Suspense, useContext, useEffect, useState, type ReactNode } from "react";
import { Logout } from "~/components/Logout";
import { ModeSwitcher } from "~/components/ModeSwitcher";
import { AuthGuardUserContext } from "~/context/AuthGuardUserContext";
import { APIManager, type PickupObject, type PickupRequestObject, type PickupRequestResponseObject } from "~/managers/APIManager";

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = lazy(() => import("~/components/Map").then(module => ({ default: module.MapComponent })));

export const ManagementDashboard = (): ReactNode => {
    const [alerts, setAlerts] = useState<PickupRequestObject[]>();
    const [submissionID, setSubmissionID] = useState("");
    const [submissionError, setSubmissionError] = useState("");
    const [pickupMap, setPickupMap] = useState<{ [K: string]: PickupObject | undefined; }>({});
    const [fullyLoaded1, setFullyLoaded1] = useState(false);
    const [fullyLoaded2, setFullyLoaded2] = useState(false);
    const [responses, setResponses] = useState<{ [K: string]: PickupRequestResponseObject[] | undefined; }>({});
    const [reloadThingsToggle, setReloadThingsToggle] = useState(false);
    const ctx = useContext(AuthGuardUserContext);

    useEffect(() => {
        APIManager.PickupRequest.getActive().then(x => {
            setAlerts(x);
        });
    }, [reloadThingsToggle]);

    const me = ctx?.me;

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
                            // markers={markers}
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
                    , you're a manager!
                </Typography>
                <Typography
                    sx={{
                        opacity: 0.6
                    }}
                >
                    id: {me?.id}
                </Typography>

                <Stack
                    gap={2}
                >
                    {
                        alerts?.length ?
                            <>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        mt: 3,
                                        mb: 1
                                    }}
                                >
                                    active requests
                                </Typography>

                                {alerts.map(x => (
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
                                            active pickup request for {pickupMap[x.pickupPointID]?.name || x.pickupPointID}
                                        </Typography>
                                        <Typography>
                                            acceptances: {responses[x.id]?.length || 0}
                                        </Typography>

                                        <Stack
                                            justifyContent="end"
                                            width={1}
                                            gap={2}
                                            direction="row"
                                            alignItems="center"
                                        >
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                onClick={async () => {
                                                    let res = await APIManager.request({
                                                        method: "post",
                                                        url: `/pickuprequests/${x.id}/execute-routing`
                                                    });

                                                    console.log("\n\n\nHERE::\n");
                                                    console.log(res);
                                                }}
                                            >
                                                process
                                            </Button>
                                        </Stack>
                                    </Alert>
                                ))}
                            </>
                            : null
                    }
                </Stack>

                <Stack
                    gap={2}
                    sx={{
                        mb: 2
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            mt: 3,
                            mb: 1
                        }}
                    >
                        job requests
                    </Typography>

                    <FormControl>
                        <FormLabel>pickup point ID</FormLabel>
                        <TextField
                            value={submissionID}
                            onChange={e => setSubmissionID(e.target.value)}
                        />
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={async () => {
                            setSubmissionError("");
                            let pickup = await APIManager.Pickup.get(submissionID);
                            if (!pickup) {
                                setSubmissionError("not a real pickup point id");
                                return;
                            }

                            await APIManager.PickupRequest.create({
                                id: "",
                                pickupPointID: submissionID
                            });
                            reload();
                        }}
                    >
                        create pickup request
                    </Button>
                    {
                        submissionError ?
                            <Alert
                                severity="error"
                                variant="filled"
                            >
                                {submissionError}
                            </Alert>
                            : null
                    }
                </Stack>
                <Logout />
            </Box>
        </Stack>
    );
};
