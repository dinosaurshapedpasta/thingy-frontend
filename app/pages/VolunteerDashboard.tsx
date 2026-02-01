import { Accordion, AccordionDetails, AccordionSummary, Alert, alertClasses, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState, type ReactNode } from "react";
import { ModeSwitcher } from "~/components/ModeSwitcher";
import { AuthGuardUserContext } from "~/context/AuthGuardUserContext";
import { APIManager, type PickupObject, type PickupRequestObject } from "~/managers/APIManager";

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
                        }
                    })}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            textAlign: "center",
                            py: 30
                        }}
                    >
                        MAP
                    </Typography>
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
