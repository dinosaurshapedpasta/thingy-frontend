import { ArrowForwardRounded } from "@mui/icons-material";
import { Alert, Box, Button, FormControl, FormLabel, Stack, TextField, Typography } from "@mui/material";
import type { FormEvent, ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { APIManager } from "~/managers/APIManager";

interface FormElements extends HTMLFormControlsCollection {
    key: HTMLInputElement;
}

interface Thing extends HTMLFormElement {
    readonly elements: FormElements;
}

export const AuthPage = (): ReactNode => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    return (
        <Stack
            p={2}
            height="100vh"
            justifyContent="center"
            alignItems="center"
        >
            <Box>
                <Typography
                    variant="h1"
                    sx={{
                        mb: 2
                    }}
                >
                    auth&trade;
                </Typography>
                <Stack
                    direction="column"
                    gap={2}
                    component="form"
                    // @ts-ignore
                    onSubmit={(e: FormEvent<Thing>) => {
                        e.preventDefault();
                        const formElements = e.currentTarget.elements;

                        let apiKey = formElements.key.value;
                        APIManager.setKey(apiKey);
                        navigate("/dashboard");
                    }}
                >
                    <FormControl>
                        <FormLabel>API Key</FormLabel>
                        <TextField placeholder="put here pls" name="key" />
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={
                            <ArrowForwardRounded />
                        }
                    >
                        GOOOOOOOOO
                    </Button>
                    {
                        searchParams.get("error") ?
                            <Alert
                                severity="error"
                                variant="filled"
                            >
                                {searchParams.get("error")}
                            </Alert>
                            : null
                    }
                </Stack>
            </Box>
        </Stack>
    );
};
