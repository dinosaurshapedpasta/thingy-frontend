import { LogoutRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { APIManager } from "~/managers/APIManager";

export const Logout = (): ReactNode => {
    const navigate = useNavigate();

    return (
        <Button
            startIcon={
                <LogoutRounded />
            }
            color="error"
            variant="contained"
            sx={{
                maxWidth: "170px"
            }}
            onClick={() => {
                APIManager.setKey("");
                navigate("/auth");
            }}
        >
            let me out
        </Button>
    );
};
